import { Injectable } from '@angular/core';
import { DTOResponse } from '../model/DTOResponse';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../model/Cliente';

@Injectable({
  providedIn: 'root',
})
export class IntegracaoAsaas {


  constructor(private http: HttpClient) { }

  // integracao-asaas.ts
  public createPaymentLink(valor_total: number, cliente: Cliente, id_pedido: number): Observable<DTOResponse> {
    return this.http.post<DTOResponse>(
      environment.apiURL + "/createPayment",
      { valorTotal: valor_total, cliente: cliente, idPedido: id_pedido }
    );
  }

}
