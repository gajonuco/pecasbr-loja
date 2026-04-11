import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CategoriaPecaService } from '../../services/categoria-peca';
import { CategoriaPeca } from '../../model/CategoriaPeca';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { Pedido } from '../../model/Pedido';
import { CarrinhoService } from '../../services/carrinho-service';
import { FormsModule } from '@angular/forms';
import { Buscacategoria } from '../buscacategoria/buscacategoria';
import { BuscaPalavraChave } from '../busca-palavra-chave/busca-palavra-chave';
import { BuscarProdutoByKey } from '../../services/buscar-produto-by-key';
import { IdiomaService } from '../../services/idioma-service';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterModule, TranslateModule, Buscacategoria, BuscaPalavraChave],
  providers: [IdiomaService],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.buscaAberta && !this.el.nativeElement.contains(event.target)) {
      this.buscaAberta = false;
    }
  }

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouch(event: TouchEvent): void {
    if (this.buscaAberta && !this.el.nativeElement.contains(event.target as Node)) {
      this.buscaAberta = false;
    }
  }

  public lista: CategoriaPeca[] = [];
  public numItens!: number;
  private pedido!: Pedido;
  public keyword!: string;
  constructor(private service: CategoriaPecaService,
    private carService: CarrinhoService,
    private router: Router,
    private busca: BuscarProdutoByKey,
    public idiomaService: IdiomaService,
    private el: ElementRef

  ) { this.numItens = 0; }


  ngOnInit(): void {




    const carrinhoString = localStorage.getItem("AdicionarCarrinho")

    if (carrinhoString) {
      this.pedido = JSON.parse(carrinhoString)
      this.numItens = this.pedido.itensPedido.length;
      console.log("numero de itens " + this.numItens)
    }



    this.service.getAllCategoriasPecas().subscribe({
      next: (res: CategoriaPeca[]) => this.lista = res
    });

    this.carService.getNumberOfItens().subscribe({
      next: (res) => {
        this.numItens = res;
      }
    });

  }

  menuAberto = false;
  dropdownAberto = false;
  buscaAberta = false;

  toggleBusca() {
    this.buscaAberta = !this.buscaAberta;
  }

  fecharDropdown() {
    setTimeout(() => this.dropdownAberto = false, 150);
  }
  // navbar.component.ts
  fecharMenu(): void {
    this.menuAberto = false;
    this.dropdownAberto = false;
  }


  public buscar() {
    if (this.keyword) {
      this.busca.getKeyWord().next(this.keyword)
      this.router.navigate(['busca']);
    }
  }

}
