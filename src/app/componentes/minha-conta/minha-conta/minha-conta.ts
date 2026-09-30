import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../model/Cliente';
import { Endereco } from '../../../model/Endereco';
import { Pedido } from '../../../model/Pedido';
import { AuthService } from '../../../services/auth-service';
import { ClienteService } from '../../../services/cliente-service';
import { PedidoService } from '../../../services/pedido-service';

@Component({
  selector: 'app-minha-conta',
  imports: [CommonModule, FormsModule],
  templateUrl: './minha-conta.html',
  styleUrl: './minha-conta.css',
})
export class MinhaConta implements OnInit {
  public aba: 'dados' | 'enderecos' | 'pedidos' = 'dados';
  public cliente: Cliente | null = null;
  public enderecos: Endereco[] = [];
  public pedidos: Pedido[] = [];
  public novoEndereco = new Endereco();
  public mostrarFormEndereco = false;

  constructor(
    private auth: AuthService,
    private clienteService: ClienteService,
    private pedidoService: PedidoService
  ) { }

  ngOnInit(): void {
    this.auth.cliente$.subscribe((c) => (this.cliente = c));
    this.carregarEnderecos();
  }

  public trocarAba(aba: 'dados' | 'enderecos' | 'pedidos'): void {
    this.aba = aba;
    if (aba === 'pedidos' && this.pedidos.length === 0) {
      this.pedidoService.meusPedidos().subscribe((res) => (this.pedidos = res));
    }
  }

  public salvarDados(): void {
    if (!this.cliente) return
    this.clienteService.atualizarMeusDados({
      nome: this.cliente.nome,
      telefone: this.cliente.telefone,
      dataNasc: this.cliente.dataNasc
    }).subscribe((res) => (this.cliente = res))
  }

  public carregarEnderecos(): void {
    this.clienteService.listarEnderecos().subscribe((res) => (this.enderecos = res));
  }

  public salvarNovoEndereco(): void {
    this.clienteService.criarEndereco(this.novoEndereco).subscribe(() => {
      this.novoEndereco = new Endereco();
      this.mostrarFormEndereco = false;
      this.carregarEnderecos();
    });
  }

  public tornarPrincipal(id: number): void {
    this.clienteService.marcarComoPrincipal(id).subscribe(() => this.carregarEnderecos());
  }

  public removerEndereco(id: number): void {
    this.clienteService.removerEndereco(id).subscribe(() => this.carregarEnderecos());
  }

    public sair(): void {
      this.auth.logout();
      window.location.href = '/';
    }


}
