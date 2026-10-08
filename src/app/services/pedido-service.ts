import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from '../model/Pedido';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CriarPedidoPayload } from '../model/CriarPedidoPayload';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient) { }

  public inserirNovoPedido(payload: CriarPedidoPayload): Observable<Pedido> {
    return this.http.post<Pedido>(environment.apiURL + "/pedido", payload);
  }

  public recuperarPedidoPeloId(idPedido: number): Observable<Pedido> {
    return this.http.get<Pedido>(environment.apiURL + "/pedido/search/" + idPedido);
  }
  public meusPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(environment.apiURL + '/pedido/meus');
  }

}
