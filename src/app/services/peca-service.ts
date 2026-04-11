import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Peca } from '../model/Peca';
import { environment } from '../../environments/environment';
import { PaginaProduto } from '../model/PaginaProduto';

@Injectable({
  providedIn: 'root'
})
export class PecaService {

  constructor(private http: HttpClient){}
  
  public getAllPecas(pageNumber: number){
    return this.http.get<PaginaProduto>(environment.apiURL+"/peca?pageNumber="+pageNumber);  
  }

  public getPecaPeloId(id : number): Observable<Peca>{
    return this.http.get<Peca>(environment.apiURL+"/peca/"+id);
  }

  public getPecaPelaCategoria(idCategoria: number): Observable<Peca[]>{
    return this.http.get<Peca[]>(environment.apiURL+"/peca/categoria/" + idCategoria)
  }

  public getProdutosPelaPalavraChave(keyword: string, pageNumber:number) :Observable<any>{
    return this.http.get(environment.apiURL+"/peca/busca?key="+keyword+"&pageNumber="+pageNumber);
  }
}



