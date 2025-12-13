import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../model/Cliente';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../servicos/cliente-service';
import { Pedido } from '../../model/Pedido';
import { PedidoService } from '../../servicos/pedido-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BuscarCepService } from '../../servicos/buscar-cep-service';
import { EntidadeCEP } from '../../model/EntidadeCEP';
import { CarrinhoService } from '../../servicos/carrinho-service';
import { Frete } from '../../model/Frete';
import { FreteService } from '../../servicos/frete-servico';

declare var bootstrap: any;

@Component({
  selector: 'app-efetivarpedido',
  imports: [FormsModule, CommonModule],
  templateUrl: './efetivarpedido.html',
  styleUrl: './efetivarpedido.css'
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


  constructor(private cliServico: ClienteService,
    private pedService: PedidoService,
    private router: Router,
    private carService: CarrinhoService,
    private cepService: BuscarCepService,
    private freteService: FreteService) {
    this.cliente = new Cliente();
    this.pedido = new Pedido();
    this.entidadeCEP = new EntidadeCEP();
    this.frete = new Frete()
    this.achou = true;
    this.visivel = true;
    this.buscouCPF = false;
    this.buscouTelefone = false
    this.mensagemErro = "erro"
    this.msgEndereco = '';
    this.exibirPerguntaEndereco = true;
    this.exibirFormEndereco = false;
    this.cpfValido = false
    this.emProcessamento = false;

  }

  public isCPFValid(): boolean {
    if (!this.cliente.cpf || this.cliente.cpf.length == 0 || this.cliente.cpf === undefined) {
      this.cpfValido = false
      return false;
    }
    let cpf = this.cliente.cpf?.replace(/\D/g, "");


    // atribuir o cpf desformatado para o cpf do cliente
    this.cliente.cpf = cpf;
    let digitos: number[] = cpf.split("").map(i => +i);

    //console.log(digitos);
    if (cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" ||
      cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999") {
      return false;
    }

    let digito1 = digitos[0] * 10 + digitos[1] * 9 + digitos[2] * 8 + digitos[3] * 7 + digitos[4] * 6 + digitos[5] * 5 + digitos[6] * 4 + digitos[7] * 3 + digitos[8] * 2;
    //console.log(digito1);
    let d1: number = 11 - digito1 % 11;
    //console.log(d1);
    if (d1 >= 10) {  // regra se o número for >= 10
      d1 = 0;
    }
    if (d1 != digitos[9]) {  // primeiro digito não confere
      return false;
    }
    let digito2 = digitos[0] * 11 + digitos[1] * 10 + digitos[2] * 9 + digitos[3] * 8 + digitos[4] * 7 + digitos[5] * 6 + digitos[6] * 5 + digitos[7] * 4 + digitos[8] * 3 + digitos[9] * 2;
    //console.log(digito2);

    let d2: number = 11 - digito2 % 11;

    if (d2 >= 10) {  // regra para se o digito 2 for >= 10
      d2 = 0;
    }

    if (d2 != digitos[10]) {
      this.cpfValido = false
      return false;
    }
    else {
      this.cpfValido = true
      return true;

    }
  }

  public mostrarToast() {
    const toastEl = document.querySelector('#liveToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }



public buscarCEP() {
  // Remove espaços, pontos, traços e qualquer caractere não numérico
  const cepLimpo = this.cliente.cep.trim().replace(/\D/g, '');
  
  // Atualiza o valor no modelo com o CEP limpo
  this.cliente.cep = cepLimpo;

  this.cepService.buscarCEP(cepLimpo)
    .subscribe({
      next: (res: EntidadeCEP) => {
        this.cliente.estado = res.uf;
        this.cliente.logradouro = res.logradouro;
        this.cliente.complemento = res.complemento
        this.cliente.bairro = res.bairro;
        this.cliente.cidade = res.localidade;

        console.log(res)
      }, error: (err) => {
        if (cepLimpo.length !== 8) {
          this.mensagemToast = "Informe um CEP válido com 8 dígitos.";
          this.toastType = 'warning'
        }
        else if (err.status == 404) {
          this.mensagemToast = "Não foi localizado o CEP informado.";
          this.toastType = 'error'
        }
        this.mostrarToast();
      }
    })

  this.freteService.recuperarPorPrefixo(cepLimpo).subscribe({
    next: (res: Frete) => {
      this.frete = res;
      this.freteReal = this.frete.valor;
      this.msgFrete = "R$ " + this.freteReal + " (" + this.frete.descricao + ")";
    },
      error: (err) => {
        if(err.status == 404){
          this.frete.valor = 0;
          this.freteReal = this.frete.valor;
          this.frete.descricao = "Frete a partir de 4.99 - entraremos em contato para calcular o valor exato"
          this.msgFrete = this.frete.descricao;
        }

      }
    });
  }


  public exibirForm() {
    this.exibirFormEndereco = true
    this.exibirPerguntaEndereco = false
    this.cliente.resetEndereco()
  }

  public ocultarForm() {
    this.exibirFormEndereco = false;
    this.exibirPerguntaEndereco = false;
    this.freteService.recuperarPorPrefixo(this.cliente.cep).subscribe({
      next: (res: Frete) => {

        this.frete = res;

        this.freteReal = this.frete.valor;
        this.msgFrete = "R$ " + this.frete.valor + " (" + this.frete.descricao + ")";
      },
      error: (err: any) => {
        this.frete.valor = 0;
        this.freteReal = this.frete.valor;
        this.frete.descricao = "Frete a partir de 4.99 - entraremos em contato para calcular o valor exato";
        this.msgFrete = this.frete.descricao;
      }
    });
  }


  public buscarCPF(): void {
    this.buscouCPF = true;

    if (this.isCPFValid()) {
      this.cliServico.buscarClientePeloCPF(this.cliente.cpf)
        .subscribe({
          next: (cli: Cliente) => {
            this.cliente = Object.assign(new Cliente(), cli);
            this.achou = true;
            this.exibirPerguntaEndereco = true
            this.msgEndereco = this.cliente.logradouro.substring(0, 10) + "************** ";
          },
          error: (err) => {
            if (err.status === 404) {
              this.achou = false;
              this.exibirPerguntaEndereco = false
              this.exibirFormEndereco = true
              this.cliente.reset();
            } else {
              this.mensagemToast = "Erro inesperado ao buscar o cliente.";
              this.toastType = 'error'
              this.mostrarToast()
            }
          },
        });
    } else {
      this.mensagemToast = "CPF informado é inválido.";
      this.toastType = 'error'
      this.mostrarToast()
    }
  }

  public finalizarPedido() {
    /* preciso antes verificar se o cliente não preencheu seu nome correto */
    if (this.cliente.nome.split(' ').length < 2){
      this.mensagemToast = "Por favor Informe nome e sobrenome";
      this.toastType = 'warning'
      this.mostrarToast()
      return;
    } 
    let pedidoTmp: Pedido;
    const carrinhoString = localStorage.getItem("AdicionarCarrinho");
    this.emProcessamento = true;
    if (carrinhoString) {
      pedidoTmp = JSON.parse(carrinhoString);
      console.log("Pedido do carrinho " , pedidoTmp)
      this.pedido.cliente = this.cliente
      this.pedido.itensPedido = pedidoTmp.itensPedido
      this.pedido.status = 0
      this.pedido.valorFrete = this.freteReal;
      this.pedido.valorTotal = pedidoTmp.valorTotal + this.freteReal;
      this.pedido.status = 0; // pedido inicial;

    }
   
     console.log("Pedido do carrinho depois " , this.pedido)
    this.pedService.inserirNovoPedido(this.pedido)
      .subscribe({
        next: (res: Pedido) => {
          console.log(res)
          this.mensagemToast = "Pedido efetivado com sucesso! = Nº " + res.id;
          this.toastType = 'success'
          this.mostrarToast();
          localStorage.removeItem("AdicionarCarrinho");
          this.carService.atualizarQuantidade(0)
          setTimeout(() => { this.router.navigate(["recibo", res.id]) }, 2500)


        }, error: (err) => {
          this.mensagemToast = "Não consegui efetivar seu pedido";
          this.toastType = 'error'
          this.mostrarToast();
        }
      });
  }



  ngOnInit(): void {

  }

  public calculaFreteReal() {
    /*
    Se o frete é 0 e o cliente pediu para entregar  ==> precisa calcular manual
    Se o frete é #0 e o cliente pediu para entregar ==> tem frete e já tá incluso no valor total
    se o frete é #0 e o cliente pediu para retirar  ==> frete = 0
    */

    if (!this.retirar) {
      this.pedido.retirar = 0;
      this.freteReal = this.frete.valor;
      this.msgFrete = "R$ " + this.freteReal + " (" + this.frete.descricao + ")";
    }
    else {
      this.pedido.retirar = 1;
      this.freteReal = 0;
      this.msgFrete = "R$ 0.00 - Cliente Retira";
    }


  }

  public isTelefoneValid(): boolean {
    return this.cliente.telefone.length >= 11;
  }


  public buscarCliente() {
    if (!this.isTelefoneValid()) {
      this.mensagemToast = "Verifique se informou o telefone com DDD";
      this.toastType = 'error'
      this.mostrarToast();
      return;
    }

    // tratando telefone para melhor experiencia
    this.cliente.telefone = this.cliente.telefone.replace("(", "").replace(")", "").replace(" ", "").replace("-", "");

    //
    this.buscouTelefone = true;
    this.cliServico.buscarClientePeloTelefone(this.cliente.telefone)
      .subscribe({
        next: (cli: Cliente) => {
          this.cliente = Object.assign(new Cliente(), cli);
          this.achou = true;
          this.exibirPerguntaEndereco = true
          this.exibirFormEndereco = false
          this.msgEndereco = this.cliente.logradouro.substring(0, 10) + "************** ";
        },
        error: (err) => {
          if (err.status === 404) {
            this.achou = false;
            this.exibirPerguntaEndereco = false
            this.exibirFormEndereco = true
            this.cliente.reset();
          } else {
            this.mensagemToast = "Erro inesperado ao buscar o cliente.";
            this.toastType = 'error'
            this.mostrarToast()
          }
        },
      });
  }




}

