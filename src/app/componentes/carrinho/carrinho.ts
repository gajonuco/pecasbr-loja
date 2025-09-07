import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../model/Pedido';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../servicos/carrinho-service';

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho implements OnInit{

  public pedido!: Pedido;
  public vazio!: boolean;

  constructor(private router: Router,
              private carService: CarrinhoService
  ){}


  public continuar(){
    this.router.navigate([''])
  }

  ngOnInit(): void {
      const carrinhoString = localStorage.getItem("AdicionarCarrinho");
      if(carrinhoString){
        this.pedido = JSON.parse(carrinhoString);
        this.vazio = false
      } else {
        this.vazio = true 
      }
      
  }
    public removerItem(idProduto: number){
    let i:number;
    for (i=0 ; i< this.pedido.itensPedido.length; i++){
      if (this.pedido.itensPedido[i].peca.id == idProduto){
        alert("removi produto = "+this.pedido.itensPedido[i].peca.nome);
        this.pedido.valorTotal -= this.pedido.itensPedido[i].precoTotal
        this.pedido.itensPedido.splice(i,1);
      }
    }

    localStorage.setItem("AdicionarCarrinho", JSON.stringify(this.pedido));
    this.carService.getNumberOfItens().next(this.pedido.itensPedido.length)
  }
  public efetivar(){
    if(this.pedido.itensPedido.length > 0){
        this.router.navigate(['efetivarpedido']);
    }else{
        this.router.navigate(['']);
    }

  }
}
