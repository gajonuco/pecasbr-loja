import { Component } from '@angular/core';
import { Peca } from '../../model/Peca';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PecaService } from '../../servicos/peca-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscacategoria',
  imports: [CommonModule,RouterModule],
  templateUrl: './buscacategoria.html',
  styleUrl: './buscacategoria.css'
})
export class Buscacategoria {

  public lista: Peca[] =[];
  public idCategoria: number;

  constructor(private route: ActivatedRoute, public service: PecaService){
    this.idCategoria = 0
    this.route.params.subscribe((paramater) =>{
        this.idCategoria = paramater['id']
        this.buscarPorCategoria();
    });


  }

  public buscarPorCategoria(){
    this.service.getPecaPelaCategoria(this.idCategoria)
      .subscribe({
        next: (res: Peca[]) => {
          this.lista = res
        }, error: (err) => {

        }})
  }



}
