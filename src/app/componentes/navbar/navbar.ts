import { Component, OnInit } from '@angular/core';
import { CategoriaPecaService } from '../../servicos/categoria-peca';
import { CategoriaPeca } from '../../model/CategoriaPeca';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Pedido } from '../../model/Pedido';
import { CarrinhoService } from '../../servicos/carrinho-service';
import { FormsModule } from '@angular/forms';
import { Buscacategoria } from '../buscacategoria/buscacategoria';
import { BuscaPalavraChave } from '../busca-palavra-chave/busca-palavra-chave';
import { BuscarProdutoByKey } from '../../servicos/buscar-produto-by-key';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  public lista: CategoriaPeca[] = [];
  public numItens!: number;
  private pedido!: Pedido;
  public keyword!: string;
  constructor(private service: CategoriaPecaService,
    private carService: CarrinhoService,
    private router: Router,
    private busca: BuscarProdutoByKey

  ) { this.numItens = 0; }


  ngOnInit(): void {

    const carrinhoString = localStorage.getItem("AdicionarCarrinho")

    if (carrinhoString) {
      this.pedido = JSON.parse(carrinhoString)
      this.numItens = this.pedido.itensPedido.length;
      console.log("numero de itens " + this.numItens)
    }



    this.service.getAllCategoriasPecas().subscribe({
      next: (res: CategoriaPeca[]) => this.lista = res
    });

    this.carService.getNumberOfItens().subscribe({
      next: (res) => {
        this.numItens = res;
      }
    });

  }

  public buscar() {
    if (this.keyword) {
      this.busca.getKeyWord().next(this.keyword)
      this.router.navigate(['busca']);
    }
  }

}
