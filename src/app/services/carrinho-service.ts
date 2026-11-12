import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Peca } from '../model/Peca';
import { PecaVariacao } from '../model/PecaVariacao';
import { ItemPedido } from '../model/ItemPedido';
import { Pedido } from '../model/Pedido';

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

    public adicionarItem(
    peca: Peca,
    quantidade: number,
    variacao?: PecaVariacao,
    cor?: string,
    tamanho?: string
  ): ItemPedido {
    const carrinhoString = localStorage.getItem("AdicionarCarrinho");
    const pedido: Pedido = carrinhoString
      ? JSON.parse(carrinhoString)
      : Object.assign(new Pedido(), { itensPedido: [], valorTotal: 0 });

    const item = new ItemPedido();
    item.qtdtItem = quantidade;
    item.precoUnitario = peca.precoPromo > 0 ? peca.precoPromo : peca.preco;
    item.precoTotal = item.precoUnitario * item.qtdtItem;
    item.peca = peca;
    item.variacao = variacao;
    item.hexCodeEscolhido = variacao?.hexCode ?? '';
    item.corEscolhida = cor;
    item.tamanhoEscolhido = tamanho;

    pedido.itensPedido.push(item);
    pedido.valorTotal = (pedido.valorTotal ?? 0) + item.precoTotal;

    localStorage.setItem("AdicionarCarrinho", JSON.stringify(pedido));
    this.atualizarQuantidade(pedido.itensPedido.length);

    return item;
  }
}



