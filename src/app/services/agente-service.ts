import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgenteMensagemRequest, AgenteMensagemResponse } from '../model/AgenteMensagem';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgenteService {

  constructor(private http: HttpClient){}

  public enviarMensagem(mensagem: string): Observable<AgenteMensagemResponse>{
    const request: AgenteMensagemRequest = {mensagem}
    return this.http.post<AgenteMensagemResponse>(environment.apiURL+ "/agente/mensagem", request);
  }

  
}
