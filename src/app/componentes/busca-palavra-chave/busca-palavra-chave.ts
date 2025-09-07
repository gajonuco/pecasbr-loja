import { Component } from '@angular/core';
import { BuscarProdutoByKey } from '../../servicos/buscar-produto-by-key';
import { Peca } from '../../model/Peca';
import { PecaService } from '../../servicos/peca-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-busca-palavra-chave',
  imports: [CommonModule, RouterModule],
  templateUrl: './busca-palavra-chave.html',
  styleUrl: './busca-palavra-chave.css'
})
export class BuscaPalavraChave {

  public keyword! : string
  public lista: Peca[] = []

  constructor(private busca:BuscarProdutoByKey,
              private service: PecaService
  ){
      busca.keyword.subscribe({
        next:(res: string) => {
          this.keyword = res;
          this.service.getProdutoPelaCategoriaChave(this.keyword).subscribe({
            next: (res: Peca[]) => {
              this.lista = res;
            }}
          )}
      })
  }



}
