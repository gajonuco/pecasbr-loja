import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../model/Cliente';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  constructor(private http: HttpClient){}

    public buscarClientePeloCPF(cpf : string): Observable<Cliente>{
      return this.http.get<Cliente>(environment.apiURL+"/cliente/" + cpf);
    }
}
