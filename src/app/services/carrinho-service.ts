import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private numberOfItens: BehaviorSubject<number>;

  constructor() {

    const carrinhoString = localStorage.getItem("AdicionarCarrinho");
    let quantidade = 0;

    if (carrinhoString) {
      const pedido = JSON.parse(carrinhoString);
      quantidade = pedido.itensPedido.length;
    }

    this.numberOfItens = new BehaviorSubject<number>(quantidade);
  }

  public getNumberOfItens() {
    return this.numberOfItens.asObservable();
  }

  public atualizarQuantidade(qtd: number) {
    this.numberOfItens.next(qtd);
  }
}



