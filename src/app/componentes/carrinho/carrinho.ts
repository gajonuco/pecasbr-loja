import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../model/Pedido';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho-service';
import { PecaService } from '../../services/peca-service';
import { TranslateModule } from '@ngx-translate/core';

declare var bootstrap: any;

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule, TranslateModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss'
})
export class Carrinho implements OnInit {

  public pedido!: Pedido;
  public mensagemToast!: string;
  public toastType!: string;
  public vazio!: boolean;
  public toastVisivel: boolean = false;

  constructor(private router: Router,
    private carService: CarrinhoService,
    private pecaService: PecaService
  ) { }


  public continuar() {
    this.router.navigate([''])
  }

mostrarToast(mensagem: string, tipo: string) {
  this.mensagemToast = mensagem;
  this.toastType = tipo;
  this.toastVisivel = true;
  setTimeout(() => this.toastVisivel = false, 3500);
}

  ngOnInit(): void {
    const carrinhoString = localStorage.getItem("AdicionarCarrinho");
    if (carrinhoString) {
      this.pedido = JSON.parse(carrinhoString)
      this.vazio = false
      // for (let i = 0; i < this.pedido.itensPedido.length; i++) {
      //   if (this.pedido.itensPedido[i].peca.precoPromo > 0) {
      //     this.pedido.itensPedido[i].precoUnitario = this.pedido.itensPedido[i].peca.precoPromo

      //     console.log("Preco unitario = " + this.pedido.itensPedido[i].precoUnitario)
      //   }
      // }
    } else {
      this.vazio = true
    }



  }
  public removerItem(idProduto: number) {
    let i: number;
    for (i = 0; i < this.pedido.itensPedido.length; i++) {
      if (this.pedido.itensPedido[i].peca.id == idProduto) {
        this.mensagemToast = "Produto removido -> " + this.pedido.itensPedido[i].peca.nome
        this.toastType = 'warning'
        this.mostrarToast(this.mensagemToast, this.toastType);
        this.pedido.valorTotal -= this.pedido.itensPedido[i].precoTotal
        this.pedido.itensPedido.splice(i, 1);
      }
    }

    localStorage.setItem("AdicionarCarrinho", JSON.stringify(this.pedido));
    this.carService.atualizarQuantidade(this.pedido.itensPedido.length);

  }
  public efetivar() {
    if (this.pedido.itensPedido.length > 0) {
      this.router.navigate(['efetivarpedido']);
    } else {
      this.router.navigate(['']);
    }

  }
}
