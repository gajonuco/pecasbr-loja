import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaPeca } from '../model/CategoriaPeca';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaPecaService {
  constructor(private http: HttpClient){

  }
    public getAllCategoriasPecas(): Observable<CategoriaPeca[]>{
      return this.http.get<CategoriaPeca[]>(environment.apiURL+"/categoria_peca");
    }
}
export { CategoriaPeca };

