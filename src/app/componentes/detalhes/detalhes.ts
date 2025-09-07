import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PecaService } from '../../servicos/peca-service';
import { Peca } from '../../model/Peca';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../model/Pedido';
import { ItemPedido } from '../../model/ItemPedido';
import { ConstantPool } from '@angular/compiler';
import { CarrinhoService } from '../../servicos/carrinho-service';

@Component({
  selector: 'app-detalhes',
  imports: [CommonModule, FormsModule],
  templateUrl: './detalhes.html',
  styleUrl: './detalhes.css'
})
export class Detalhes implements OnInit{

    public pecaDetalhe!: Peca;
    public quantidade!: number;

    constructor(private route   : ActivatedRoute,
                private service : PecaService,
                private nav     : Router,
                private carService: CarrinhoService){
          this.quantidade = 1;

    }


    ngOnInit(): void {
        this.route.params.subscribe(paramater =>{
          this.recuperarPeca(paramater["id"]);
        })
    }

    public recuperarPeca(id: number){
      this.service.getPecaPeloId(id).subscribe(
        (peca : Peca) => {this.pecaDetalhe = peca;}
      )
    }
    public adicionarCarrinho(){


      const carrinhoString = localStorage.getItem("AdicionarCarrinho");

      let pedido : Pedido;

      if(carrinhoString){
        pedido = JSON.parse(carrinhoString)
      } else{
        pedido = new Pedido()
        pedido.itensPedido = [],
        pedido.valorTotal = 0
      }
      
      let item = new ItemPedido();
      item.qtdtItem = this.quantidade;
      item.precoUnitario = this.pecaDetalhe.preco;
      item.precoTotal =  this.pecaDetalhe.preco * item.qtdtItem;
      item.peca = this.pecaDetalhe;
   
      pedido.itensPedido.push(item);
         pedido.valorTotal = pedido.valorTotal + item.precoTotal;
      
      localStorage.setItem("AdicionarCarrinho", JSON.stringify(pedido));
      this.carService.getNumberOfItens().next(pedido.itensPedido.length)

      this.nav.navigate(['carrinho']);
    }
}
