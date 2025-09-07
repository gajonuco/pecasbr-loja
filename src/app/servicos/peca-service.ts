import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Peca } from '../model/Peca';

@Injectable({
  providedIn: 'root'
})
export class PecaService {

  constructor(private http: HttpClient){}
  
  public getAllPecas(): Observable<Peca[]>{
    return this.http.get<Peca[]>("http://localhost:8080/peca");
  }

  public getPecaPeloId(id : number): Observable<Peca>{
    return this.http.get<Peca>("http://localhost:8080/peca/"+id);
  }

  public getPecaPelaCategoria(idCategoria: number): Observable<Peca[]>{
    return this.http.get<Peca[]>("http://localhost:8080/peca/categoria/" + idCategoria)
  }

  public getProdutoPelaCategoriaChave(keyword: string): Observable<Peca[]>{
    return this.http.get<Peca[]>("http://localhost:8080/peca/busca?key=" + keyword)
  }
}



