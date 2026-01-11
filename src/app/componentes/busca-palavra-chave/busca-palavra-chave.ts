import { Component } from '@angular/core';
import { BuscarProdutoByKey } from '../../servicos/buscar-produto-by-key';
import { Peca } from '../../model/Peca';
import { PecaService } from '../../servicos/peca-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginaProduto } from '../../model/PaginaProduto';

@Component({
  selector: 'app-busca-palavra-chave',
  imports: [CommonModule, RouterModule],
  templateUrl: './busca-palavra-chave.html',
  styleUrl: './busca-palavra-chave.css'
})
export class BuscaPalavraChave {


  public keyword!: string;
  public lista: Peca[] = [];
  public pageNumber: number;
  public previousPage!: number;
  public nextPage!: number;
  constructor(private busca: BuscarProdutoByKey,
    private service: PecaService) {

    this.pageNumber = 1;
    this.busca.getKeyWord().subscribe(
      (res: string) => {
        this.keyword = res;
        this.recuperarProdutos(this.pageNumber);
      }
    );
  }

  ngOnInit(): void {

  }

  public recuperarProdutos(page: number) {
    
this.service.getProdutosPelaPalavraChave(this.keyword, page - 1).subscribe({
  next: (res: PaginaProduto) => {
    this.lista = res.content;
    this.pageNumber = res.number + 1;
    this.previousPage = this.pageNumber - 1;
    
    if (res.number == res.totalPages - 1) {
      this.nextPage = 0;
    } else {
      this.nextPage = this.pageNumber + 1;
    }
  },
  error: (err) => {
    console.error('Erro ao buscar produtos:', err);
    this.lista = [];
  }
});

 }}

