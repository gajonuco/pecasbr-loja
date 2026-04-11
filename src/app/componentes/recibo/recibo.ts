import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../model/Pedido';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from '../../services/pedido-service';
import { CommonModule } from '@angular/common'; // ← CurrencyPipe + NgIf + NgFor
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-recibo',
  imports: [CommonModule, TranslateModule],          // ← substitui DecimalPipe isolado
  templateUrl: './recibo.html',
  styleUrl: './recibo.scss'         // ← .scss em vez de .css
})
export class Recibo implements OnInit {
  public idPedido: number;
  public detalhePedido!: Pedido;

  constructor(
    private route: ActivatedRoute,
    private service: PedidoService
  ) {
    this.idPedido = 0;
  }

  toNumber(valor: any): number {
  if (typeof valor === 'number') return valor;
  // troca vírgula por ponto e converte
  return parseFloat(String(valor).replace(',', '.'));
}

  ngOnInit(): void {
    this.idPedido = this.route.snapshot.params['id'];
    this.service.recuperarPedidoPeloId(this.idPedido).subscribe({
      next: (res: Pedido) => { this.detalhePedido = res;  console.log('Pedido recuperado:', res); }
    });
  }
}
