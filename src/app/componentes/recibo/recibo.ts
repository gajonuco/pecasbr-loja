import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../model/Pedido';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../../servicos/pedido-service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-recibo',
  imports: [DecimalPipe],
  templateUrl: './recibo.html',
  styleUrl: './recibo.css'
})
export class Recibo implements OnInit{
  public idPedido: number;
  public detalhePedido!: Pedido;

  constructor(private router: ActivatedRoute, private service: PedidoService){this.idPedido = 0;}


  ngOnInit(): void {
    this.idPedido = this.router.snapshot.params["id"];
    this.service.recuperarPedidoPeloId(this.idPedido)
      .subscribe({
        next: (res: Pedido) => {this.detalhePedido = res} })
  }
}
