import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscarProdutoByKey {

  public keyword!: BehaviorSubject<string>;
  
  constructor(){
    this.keyword = new BehaviorSubject("")
  }

  public getKeyWord(){
    return this.keyword;
  }

}
