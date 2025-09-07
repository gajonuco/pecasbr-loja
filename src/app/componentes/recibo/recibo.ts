import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../model/Pedido';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recibo',
  imports: [],
  templateUrl: './recibo.html',
  styleUrl: './recibo.css'
})
export class Recibo implements OnInit{
  public idPedido: number;

  constructor(private router: ActivatedRoute
  ){this.idPedido = 0;}


  ngOnInit(): void {
    this.idPedido = this.router.snapshot.params["id"];
  }

}
