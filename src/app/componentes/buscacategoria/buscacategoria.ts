import { Component } from '@angular/core';
import { Peca } from '../../model/Peca';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PecaService } from '../../services/peca-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-buscacategoria',
  imports: [CommonModule,RouterModule, FormsModule, TranslateModule],
  templateUrl: './buscacategoria.html',
  styleUrl: './buscacategoria.scss'
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
