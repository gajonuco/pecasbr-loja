import { Cliente } from './../model/Cliente';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Endereco } from '../model/Endereco';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient){}

  // TODO(#12): remover — o endpoint que essas duas chamam não existe
  // mais desde a sub-issue 3. Mantidas só pra não quebrar a compilação
  // de efetivarpedido.ts até a #12 reescrever esse fluxo.
  public buscarClientePeloCPF(cpf: string): Observable<Cliente> {
    return this.http.get<Cliente>(environment.apiURL + '/cliente/' + cpf);
  }

  public buscarClientePeloTelefone(telefone: string): Observable<Cliente> {
    return this.http.get<Cliente>(environment.apiURL + '/cliente/' + telefone);
  }

  public atualizarMeusDados(dados: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(environment.apiURL + '/cliente/me', dados);
  }

  public listarEnderecos(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(environment.apiURL + '/cliente/me/enderecos');
  }

  public criarEndereco(dados: Partial<Endereco>): Observable<Endereco> {
    return this.http.post<Endereco>(environment.apiURL + '/cliente/me/enderecos', dados);
  }

  public atualizarEndereco(id: number, dados: Partial<Endereco>): Observable<Endereco> {
    return this.http.put<Endereco>(environment.apiURL + '/cliente/me/enderecos/' + id, dados);
  }

  public removerEndereco(id: number): Observable<void> {
    return this.http.delete<void>(environment.apiURL + '/cliente/me/enderecos/' + id);
  }

  public marcarComoPrincipal(id: number): Observable<Endereco> {
    return this.http.patch<Endereco>(environment.apiURL + '/cliente/me/enderecos/' + id + '/principal', {});
  }
}
