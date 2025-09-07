import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private numberOfItens: BehaviorSubject<number>

  constructor(){
    this.numberOfItens = new BehaviorSubject(0);
  }

  public getNumberOfItens(){
    return this.numberOfItens
  }
}



