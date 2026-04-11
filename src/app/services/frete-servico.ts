import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Frete } from '../model/Frete';

@Injectable({
  providedIn: 'root'
})
export class FreteService {
  

  constructor(private http: HttpClient) { }

  public recuperarPorPrefixo(prefixo: string){
    return this.http.get<Frete>(environment.apiURL+"/fretes/prefixo/"+prefixo);
  }
}
