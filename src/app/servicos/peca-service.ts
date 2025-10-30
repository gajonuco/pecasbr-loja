import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Peca } from '../model/Peca';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PecaService {

  constructor(private http: HttpClient){}
  
  public getAllPecas(): Observable<Peca[]>{
    return this.http.get<Peca[]>(environment.apiURL+"/peca");
  }

  public getPecaPeloId(id : number): Observable<Peca>{
    return this.http.get<Peca>(environment.apiURL+"/peca/"+id);
  }

  public getPecaPelaCategoria(idCategoria: number): Observable<Peca[]>{
    return this.http.get<Peca[]>(environment.apiURL+"/peca/categoria/" + idCategoria)
  }

  public getProdutoPelaCategoriaChave(keyword: string): Observable<Peca[]>{
    return this.http.get<Peca[]>(environment.apiURL+"/peca/busca?key=" + keyword)
  }
}



