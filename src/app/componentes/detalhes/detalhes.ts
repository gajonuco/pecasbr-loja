import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PecaService } from '../../servicos/peca-service';
import { Peca } from '../../model/Peca';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../model/Pedido';
import { ItemPedido } from '../../model/ItemPedido';
import { CarrinhoService } from '../../servicos/carrinho-service';

@Component({
  selector: 'app-detalhes',
  imports: [CommonModule, FormsModule],
  templateUrl: './detalhes.html',
  styleUrl: './detalhes.css'
})
export class Detalhes implements OnInit {

  public pecaDetalhe!: Peca;
  public quantidade!: number;
  public quantidadeInvalida: boolean = false;
  public mensagemEstoque: string = '';

  constructor(private route: ActivatedRoute,
    private service: PecaService,
    private nav: Router,
    private carService: CarrinhoService) {
    this.quantidade = 1;
  }

  ngOnInit(): void {
    this.route.params.subscribe(paramater => {
      this.recuperarPeca(paramater["id"]);
    })
  }

  public recuperarPeca(id: number) {
    this.service.getPecaPeloId(id).subscribe(
      (peca: Peca) => { 
        this.pecaDetalhe = peca;
        this.validarQuantidade(); // Valida após carregar a peça
      }
    )
  }

  public validarQuantidade(): void {
    if (!this.pecaDetalhe) return;

    // Garante que a quantidade seja no mínimo 1
    if (this.quantidade < 1) {
      this.quantidade = 1;
    }

    // Verifica se excede o estoque
    if (this.quantidade > this.pecaDetalhe.quantidadeEstoque) {
      this.quantidadeInvalida = true;
      this.mensagemEstoque = `Quantidade solicitada excede o estoque disponível (${this.pecaDetalhe.quantidadeEstoque} unidades)`;
    } else {
      this.quantidadeInvalida = false;
      this.mensagemEstoque = '';
    }
  }

  public adicionarCarrinho() {
    // Valida antes de adicionar
    if (this.quantidadeInvalida || this.quantidade > this.pecaDetalhe.quantidadeEstoque) {
      alert('Quantidade informada não disponível em estoque!');
      return;
    }

    const carrinhoString = localStorage.getItem("AdicionarCarrinho");
    let pedido: Pedido;

    if (carrinhoString) {
      pedido = JSON.parse(carrinhoString)
    } else {
      pedido = new Pedido()
      pedido.itensPedido = [],
      pedido.valorTotal = 0
    }

    let item = new ItemPedido();
    item.qtdtItem = this.quantidade;
    
    if (this.pecaDetalhe.precoPromo === 0) {
      item.precoUnitario = this.pecaDetalhe.preco;
      item.precoTotal = item.precoUnitario * item.qtdtItem;
    } else {
      item.precoUnitario = this.pecaDetalhe.precoPromo;
      item.precoTotal = item.precoUnitario * item.qtdtItem;
    }
    
    item.peca = this.pecaDetalhe;

    pedido.itensPedido.push(item);
    pedido.valorTotal = pedido.valorTotal + item.precoTotal;

    localStorage.setItem("AdicionarCarrinho", JSON.stringify(pedido));
    this.carService.atualizarQuantidade(pedido.itensPedido.length);

    this.nav.navigate(['carrinho']);
  }
}