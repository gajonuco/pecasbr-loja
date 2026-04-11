import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../model/Cliente';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente-service';
import { Pedido } from '../../model/Pedido';
import { PedidoService } from '../../services/pedido-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BuscarCepService } from '../../services/buscar-cep-service';
import { EntidadeCEP } from '../../model/EntidadeCEP';
import { CarrinhoService } from '../../services/carrinho-service';
import { Frete } from '../../model/Frete';
import { FreteService } from '../../services/frete-servico';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgxMaskService, provideNgxMask } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';


// ❌ REMOVIDO: import { DTOResponse } from '../../model/DTOResponse';
// ❌ REMOVIDO: import { IntegracaoAsaas } from './../../services/integracao-asaas';
// ❌ REMOVIDO: import { WebSocketService } from '../../services/web-socket-service';
// ❌ REMOVIDO: import { Subscription } from 'rxjs';
// O backend já cria o link de pagamento dentro de inserirPedido().
// O frontend apenas lê o linkPagamento que vem na resposta e redireciona para /recibo/{id}.

declare var bootstrap: any;

@Component({
  selector: 'app-efetivarpedido',
  imports: [FormsModule, CommonModule, NgxMaskPipe, NgxMaskDirective, TranslateModule],
  providers: [provideNgxMask()],
  templateUrl: './efetivarpedido.html',
  styleUrl: './efetivarpedido.scss'
})
export class Efetivarpedido implements OnInit {

  public cliente: Cliente;
  public achou: boolean;
  public visivel: boolean;
  public pedido: Pedido;
  public buscouCPF: boolean;
  public buscouTelefone: boolean;
  public entidadeCEP: EntidadeCEP;
  public mensagemErro: string;
  public msgEndereco: string;
  public exibirPerguntaEndereco: boolean;
  public exibirFormEndereco: boolean;
  public cpfValido: boolean;
  public emProcessamento!: boolean;
  public mensagemToast!: string;
  public toastType!: string;
  public frete!: Frete;
  public msgFrete!: string;
  public freteReal!: number;
  public retirar!: boolean;
  public dataNascInvalida!: boolean;
  public modalCpfVisivel: boolean = false;
   public toastVisivel: boolean = false;

  // ❌ REMOVIDO: private wsSub!: Subscription;
  // ❌ REMOVIDO: public emProcessamentoAsaas: boolean = false;

  constructor(
    private cliServico: ClienteService,
    private pedService: PedidoService,
    private router: Router,
    private carService: CarrinhoService,
    private cepService: BuscarCepService,
    private freteService: FreteService,
    private maskService: NgxMaskService
    // ❌ REMOVIDO: private wsService: WebSocketService
    // ❌ REMOVIDO: private IntegracaoAsaas: IntegracaoAsaas
  ) {
    this.cliente = new Cliente();
    this.pedido = new Pedido();
    this.entidadeCEP = new EntidadeCEP();
    this.frete = new Frete();
    this.achou = true;
    this.visivel = true;
    this.buscouCPF = false;
    this.buscouTelefone = false;
    this.mensagemErro = 'erro';
    this.msgEndereco = '';
    this.exibirPerguntaEndereco = true;
    this.exibirFormEndereco = false;
    this.cpfValido = false;
    this.emProcessamento = false;
    this.dataNascInvalida = false;
  }

  ngOnInit(): void { }

  // ─── Formatação de campos mascarados ───────────────────────────────────────

  formatarCamposMascarados(): void {
    if (this.cliente.telefone) {
      this.cliente.telefone = this.maskService.applyMask(
        this.cliente.telefone.replace(/\D/g, ''),
        '(00) 00000-0000'
      );
    }
    if (this.cliente.cpf) {
      this.cliente.cpf = this.maskService.applyMask(
        this.cliente.cpf.replace(/\D/g, ''),
        '000.000.000-00'
      );
    }
    if (this.cliente.cep) {
      this.cliente.cep = this.maskService.applyMask(
        this.cliente.cep.replace(/\D/g, ''),
        '00000-000'
      );
    }
    if (this.cliente.dataNasc) {
      this.cliente.dataNasc = this.isoParaBR(this.cliente.dataNasc);
    }
  }

  private isoParaBR(data: string): string {
    if (!data || !data.includes('-')) return data;
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  public brParaISO(data: string): string {
    if (!data || !data.includes('/')) return data;
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
  }

  // ─── Validações ────────────────────────────────────────────────────────────

  get cepInvalido(): boolean {
    const cep = this.cliente.cep ?? '';
    return cep.length > 0 && cep.replace('-', '').length < 8;
  }

  get formularioValido(): boolean {
    const partes = this.cliente.nome?.trim().split(/\s+/).filter(p => p.length >= 2) ?? [];
    const nomeValido = partes.length >= 2;
    const telefoneValido = this.isTelefoneValid();
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    const emailValido = emailRegex.test(this.cliente.email?.trim() ?? '');
    const freteDefinido = this.freteReal !== undefined && this.freteReal !== null;
    const cpfDigitos = (this.cliente.cpf ?? '').replace(/\D/g, '');
    const cpfValido = cpfDigitos.length === 11 && this.isCPFValid();

    console.log('Validação do formulário:', {
      nome: this.cliente.nome,
      nomeValido,
      telefone: this.cliente.telefone,
      telefoneValido,
      email: this.cliente.email,
      emailValido,
      freteReal: this.freteReal,
      freteDefinido,
      cpf: this.cliente.cpf,
      cpfValido
    });
    return nomeValido && telefoneValido && emailValido && freteDefinido && cpfValido;
  }

  // ❌ REMOVIDO: onCampoObrigatorioAlterado() — não chama mais o Asaas antecipadamente.
  // O link de pagamento é gerado pelo backend ao salvar o pedido.

  validarDataNasc(): void {
    const valor = this.cliente.dataNasc;
    if (!valor || valor.trim() === '') {
      this.dataNascInvalida = false;
      return;
    }
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = valor.match(regex);
    if (!match) {
      this.dataNascInvalida = true;
      return;
    }
    const [, dia, mes, ano] = match.map(Number);
    const data = new Date(ano, mes - 1, dia);
    this.dataNascInvalida =
      data.getFullYear() !== ano ||
      data.getMonth() !== mes - 1 ||
      data.getDate() !== dia ||
      ano < 1900 ||
      data > new Date();
  }

  public isTelefoneValid(): boolean {
    return this.cliente.telefone.replace(/\D/g, '').length >= 11;
  }

  public isCPFValid(): boolean {
    if (!this.cliente.cpf || this.cliente.cpf.length === 0) {
      this.cpfValido = false;
      return false;
    }
    const cpf = this.cliente.cpf.replace(/\D/g, '');
    if (cpf.length !== 11) { this.cpfValido = false; return false; }
    if (/^(\d)\1+$/.test(cpf)) { this.cpfValido = false; return false; }

    const digitos: number[] = cpf.split('').map(Number);
    let d1 = 11 - (digitos.slice(0, 9).reduce((s, v, i) => s + v * (10 - i), 0) % 11);
    if (d1 >= 10) d1 = 0;
    if (d1 !== digitos[9]) { this.cpfValido = false; return false; }

    let d2 = 11 - (digitos.slice(0, 10).reduce((s, v, i) => s + v * (11 - i), 0) % 11);
    if (d2 >= 10) d2 = 0;

    this.cpfValido = d2 === digitos[10];
    if (!this.cpfValido) {
      this.mensagemToast = 'CPF informado é inválido.';
      this.toastType = 'error';
      this.mostrarToast(this.mensagemToast, this.toastType);
    }
    return this.cpfValido;
  }

  // ─── Busca de CEP e frete ──────────────────────────────────────────────────

  public buscarCEP(): void {
    const cepLimpo = this.cliente.cep.trim().replace(/\D/g, '');
    this.cliente.cep = cepLimpo;

    this.cepService.buscarCEP(cepLimpo).subscribe({
      next: (res: EntidadeCEP) => {
        this.cliente.estado = res.uf;
        this.cliente.logradouro = res.logradouro;
        this.cliente.complemento = res.complemento;
        this.cliente.bairro = res.bairro;
        this.cliente.cidade = res.localidade;
      },
      error: (err) => {
        if (cepLimpo.length !== 8) {
          this.mensagemToast = 'Informe um CEP válido com 8 dígitos.';
          this.toastType = 'warning';
        } else if (err.status === 404) {
          this.mensagemToast = 'Não foi localizado o CEP informado.';
          this.toastType = 'error';
        }
        this.mostrarToast(this.mensagemToast, this.toastType);
      }
    });

    this.freteService.recuperarPorPrefixo(cepLimpo).subscribe({
      next: (res: Frete) => {
        this.frete = res;
        this.freteReal = this.frete.valor;
        this.msgFrete = `R$ ${this.freteReal} (${this.frete.descricao})`;
      },
      error: (err) => {
        if (err.status === 404) {
          this.frete.valor = 0;
          this.freteReal = 0;
          this.frete.descricao = 'Frete a partir de 4.99 - entraremos em contato para calcular o valor exato';
          this.msgFrete = this.frete.descricao;
        }
      }
    });
  }

  public calculaFreteReal(): void {
    if (!this.retirar) {
      this.pedido.retirar = 0;
      this.freteReal = this.frete.valor;
      this.msgFrete = `R$ ${this.freteReal} (${this.frete.descricao})`;
    } else {
      this.pedido.retirar = 1;
      this.freteReal = 0;
      this.msgFrete = 'R$ 0.00 - Cliente Retira';
    }
  }

  // ─── Endereço ──────────────────────────────────────────────────────────────

  public exibirForm(): void {
    this.exibirFormEndereco = true;
    this.exibirPerguntaEndereco = false;
    this.cliente.resetEndereco();
  }

  public ocultarForm(): void {
    this.exibirFormEndereco = false;
    this.exibirPerguntaEndereco = false;
    this.freteService.recuperarPorPrefixo(this.cliente.cep).subscribe({
      next: (res: Frete) => {
        this.frete = res;
        this.freteReal = this.frete.valor;
        this.msgFrete = `R$ ${this.frete.valor} (${this.frete.descricao})`;
      },
      error: () => {
        this.frete.valor = 0;
        this.freteReal = 0;
        this.frete.descricao = 'Frete a partir de 4.99 - entraremos em contato para calcular o valor exato';
        this.msgFrete = this.frete.descricao;
      }
    });
  }

  // ─── Busca de cliente ──────────────────────────────────────────────────────

  public buscarCPF(): void {
    this.buscouCPF = true;
    if (this.isCPFValid()) {
      this.cliServico.buscarClientePeloCPF(this.cliente.cpf).subscribe({
        next: (cli: Cliente) => {
          this.cliente = Object.assign(new Cliente(), cli);
          this.achou = true;
          this.exibirPerguntaEndereco = true;
          this.msgEndereco = this.cliente.logradouro.substring(0, 10) + '**************';
        },
        error: (err) => {
          if (err.status === 404) {
            this.achou = false;
            this.exibirPerguntaEndereco = false;
            this.exibirFormEndereco = true;
            this.cliente.reset();
          } else {
            this.mensagemToast = 'Erro inesperado ao buscar o cliente.';
            this.toastType = 'error';
            this.mostrarToast(this.mensagemToast, this.toastType);
          }
        }
      });
    } else {
      this.mensagemToast = 'CPF informado é inválido.';
      this.toastType = 'error';
      this.mostrarToast(this.mensagemToast, this.toastType);
    }
  }

  public buscarCliente(): void {
    if (!this.isTelefoneValid()) {
      this.mensagemToast = 'Verifique se informou o telefone com DDD';
      this.toastType = 'error';
      this.mostrarToast(this.mensagemToast, this.toastType);
      return;
    }
    this.cliente.telefone = this.cliente.telefone.replace(/\D/g, '');
    this.buscouTelefone = true;

    this.cliServico.buscarClientePeloTelefone(this.cliente.telefone).subscribe({
      next: (cli: Cliente) => {
        this.cliente = Object.assign(new Cliente(), cli);
        this.achou = true;
        this.exibirPerguntaEndereco = true;
        this.exibirFormEndereco = false;
        this.msgEndereco = this.cliente.logradouro.substring(0, 10) + '**************';
        this.formatarCamposMascarados();
      },
      error: (err) => {
        if (err.status === 404) {
          this.achou = false;
          this.exibirPerguntaEndereco = false;
          this.exibirFormEndereco = true;
          this.cliente.reset();
          this.formatarCamposMascarados();
        } else {
          this.mensagemToast = 'Erro inesperado ao buscar o cliente.';
          this.toastType = 'error';
          this.mostrarToast(this.mensagemToast, this.toastType);
        }
      }
    });
  }

  // ─── Eventos dos campos com máscara ───────────────────────────────────────

  onTelefoneChange(valor: string): void {
    if (valor.replace(/\D/g, '').length === 11) {
      this.buscarCliente();
    }
  }

  onCpfChange(valor: string): void {
    if (valor.replace(/\D/g, '').length === 11) {
      this.isCPFValid();
    }
  }

  onDataNascChange(valor: string): void {
    if (valor.replace(/\D/g, '').length === 8) {
      this.validarDataNasc();
    }
  }

  onCepChange(valor: string): void {
    if (valor.replace(/\D/g, '').length === 8) {
      this.buscarCEP();
    }
  }

  public onCampoObrigatorioAlterado(): void {
    // Apenas força reavaliação do getter formularioValido.
    // O link de pagamento agora é gerado pelo backend ao finalizar o pedido.
  }

  // ─── Finalizar pedido ──────────────────────────────────────────────────────

  public finalizarPedido(): void {
    if (this.cliente.nome.split(' ').length < 2) {
      this.mensagemToast = 'Por favor informe nome e sobrenome';
      this.toastType = 'warning';
      this.mostrarToast(this.mensagemToast, this.toastType);
      return;
    }

    const carrinhoString = localStorage.getItem('AdicionarCarrinho');
    if (!carrinhoString) {
      this.mensagemToast = 'Carrinho vazio.';
      this.toastType = 'warning';
      this.mostrarToast(this.mensagemToast, this.toastType);
      return;
    }

    const pedidoTmp: Pedido = JSON.parse(carrinhoString);

    // ✅ converte apenas uma vez, usando variável local — não toca no model
    const clienteParaEnviar = Object.assign(new Cliente(), this.cliente);
    clienteParaEnviar.dataNasc = this.brParaISO(this.cliente.dataNasc);

    this.pedido.cliente = clienteParaEnviar;
    this.pedido.itensPedido = pedidoTmp.itensPedido;
    this.pedido.valorFrete = this.freteReal;
    this.pedido.valorTotal = pedidoTmp.valorTotal + this.freteReal;
    this.pedido.status = 0;

    this.emProcessamento = true;

    this.pedService.inserirNovoPedido(this.pedido).subscribe({
      next: (res: Pedido) => {
        this.mensagemToast = `Pedido registrado! Nº ${res.id} — Aguardando pagamento.`;
        this.toastType = 'success';
        this.mostrarToast(this.mensagemToast, this.toastType);
        localStorage.removeItem('AdicionarCarrinho');
        this.carService.atualizarQuantidade(0);
        window.location.href = res.linkPagamento;
      },
      error: (err) => {
        console.error('Erro ao finalizar pedido:', err); // ← veja o console após testar
        this.mensagemToast = 'Não consegui efetivar seu pedido';
        this.toastType = 'error';
        this.mostrarToast(this.mensagemToast, this.toastType);
        this.emProcessamento = false;
      }
    });
  }

  // ─── Toast ─────────────────────────────────────────────────────────────────

mostrarToast(mensagem: string, tipo: string) {
  this.mensagemToast = mensagem;
  this.toastType = tipo;
  this.toastVisivel = true;
  setTimeout(() => this.toastVisivel = false, 3500);
}

  fecharModalCpf() {
  this.modalCpfVisivel = false;
}
}
