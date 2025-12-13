import { Component, OnInit } from '@angular/core';
import { PecaService } from '../../servicos/peca-service';
import { Peca } from '../../model/Peca';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Carousel } from "../carousel/carousel";
import { PaginaProduto } from '../../model/PaginaProduto';

@Component({
  selector: 'app-destaques',
  imports: [CommonModule, RouterModule, Carousel],
  templateUrl: './destaques.html',
  styleUrls: ['./destaques.css'] 
})
export class Destaques  implements OnInit {
  public lista: Peca[] = [];
  public pageNumber: number = 1;
  public previousPage: number = 0;
  public nextPage: number = 2;


  // preciso injetar o servico que busca o produto
  constructor(private service: PecaService, private activatedRoute: ActivatedRoute) {


  }

  ngOnInit(): void {

    let currentPage: number = this.activatedRoute.snapshot.queryParams['page'];
    console.log("Pagina atual = " + currentPage);
    this.recuperarProdutos(this.pageNumber);
  }


  public recuperarProdutos(page: number) {

    this.service.getAllPecas(page - 1)
      .subscribe({ next : (res: PaginaProduto) => {
        this.lista = res.content;
        console.log(this.lista)
        this.pageNumber = res.number + 1;
        this.previousPage = this.pageNumber - 1;
        if (res.number == res.totalPages - 1){
          this.nextPage = 0;
        }
        else{
          this.nextPage = this.pageNumber + 1;
        }
      },
        error: err => console.log(err) });
  }
}

