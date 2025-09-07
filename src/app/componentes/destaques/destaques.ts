import { Component, OnInit } from '@angular/core';
import { PecaService } from '../../servicos/peca-service';
import { Peca } from '../../model/Peca';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-destaques',
  imports: [CommonModule, RouterModule],
  templateUrl: './destaques.html',
  styleUrls: ['./destaques.css'] 
})
export class Destaques implements OnInit{



  public lista: Peca[] = [];
  constructor( private service: PecaService){}


  ngOnInit(): void {
    this.service.getAllPecas()
      .subscribe({
        next: (res : Peca[]) => {
          this.lista = res;
        }, error: (err) => {
          console.error(err)
        }});
      }
  }

