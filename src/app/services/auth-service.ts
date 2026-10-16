import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cliente } from '../model/Cliente';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface JWTToken{
  token: string;
}

interface CadastroClienteDTO{
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  dataNasc: string;
  cpf: string;
}

interface LoginClienteDTO{
  email: string;
  senha: string;
}

@Injectable({providedIn: 'root',})
export class AuthService {
  private clienteAtual$ = new BehaviorSubject<Cliente | null>(null);

  constructor(private http: HttpClient) {
    if(this.getToken()){
      this.carregarClienteAtual().subscribe();
    }
  }

  public get cliente$(): Observable<Cliente | null > {
    return this.clienteAtual$.asObservable();
  }

  public get clienteAtual(): Cliente | null{
    return this.clienteAtual$.value;
  }

  public estaLogado(): boolean {
    return !!this.getToken();
  }

  public getToken(): string | null {
    return localStorage.getItem('clienteToken');
  }

  public cadastrar(dados: CadastroClienteDTO): Observable<JWTToken>{
    return this.http.post<JWTToken>(environment.apiURL + '/cliente/cadastro',dados)
    .pipe(tap((res) => this.salvarSessao(res.token)));
  }

  public login(dados: LoginClienteDTO): Observable<JWTToken>{
    return this.http.post<JWTToken>(environment.apiURL + '/cliente/login',dados)
    .pipe(tap((res) => this.salvarSessao(res.token)));
  }

  public logout(): void {
    localStorage.removeItem('clienteToken');
    this.clienteAtual$.next(null);
  }


  public carregarClienteAtual(): Observable<Cliente> {
    return this.http.get<Cliente>(environment.apiURL + '/cliente/me')
    .pipe(tap((cliente) => this.clienteAtual$.next(cliente)));
  }

  private salvarSessao(token: string): void {
    localStorage.setItem('clienteToken', token);
    this.carregarClienteAtual().subscribe();
  }

}
