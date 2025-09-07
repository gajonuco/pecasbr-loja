import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from '../model/Pedido';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  
  constructor(private http: HttpClient){}

  public inserirNovoPedido(novoPedido: Pedido): Observable<Pedido>{
    return this.http.post<Pedido>("http://localhost:8080/pedido", novoPedido);
  }
}
