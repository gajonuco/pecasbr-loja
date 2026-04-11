import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { PecaService } from '../../services/peca-service';
import { Peca } from '../../model/Peca';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Carousel } from "../carousel/carousel";
import { PaginaProduto } from '../../model/PaginaProduto';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-destaques',
  imports: [CommonModule, RouterModule, Carousel, TranslateModule],
  templateUrl: './destaques.html',
  styleUrls: ['./destaques.scss']
})
export class Destaques implements OnInit {
  public lista: Peca[] = [];
  public pageNumber: number = 1;
  public previousPage: number = 0;
  public nextPage: number = 2;

  private readonly DEBUG = true; // Desative após resolver o problema
  private log(context: string, data?: any) {
    if (!this.DEBUG) return;
    const isMobile = window.innerWidth <= 768;
    console.group(`[Destaques | ${isMobile ? '📱 MOBILE' : '🖥️ DESKTOP'}] ${context}`);
    if (data !== undefined) console.log(data);
    console.groupEnd();
  }

  constructor(
    private service: PecaService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentPage = this.activatedRoute.snapshot.queryParams['page'];
    this.log('ngOnInit', { currentPage, windowWidth: window.innerWidth });
    this.recuperarProdutos(this.pageNumber);

    // LOG 1 — detecta se há elementos sobrepostos ao btn-quero após renderização
    setTimeout(() => this.auditarElementosSobrepostos(), 500);
  }

  public recuperarProdutos(page: number) {
    this.log('recuperarProdutos chamado', { page });

    this.service.getAllPecas(page - 1).subscribe({
      next: (res: PaginaProduto) => {
        this.lista = res.content;
        this.pageNumber = res.number + 1;
        this.previousPage = this.pageNumber - 1;
        this.nextPage = res.number === res.totalPages - 1 ? 0 : this.pageNumber + 1;
        this.log('Produtos carregados', {
          total: this.lista.length,
          pageNumber: this.pageNumber,
          previousPage: this.previousPage,
          nextPage: this.nextPage,
        });

        // Re-audita após cada carregamento de página
        setTimeout(() => this.auditarElementosSobrepostos(), 300);
      },
      error: err => this.log('Erro ao carregar produtos', err),
    });
  }

  // LOG 2 — chamado pelo template no touchstart do botão
  onBtnQueroTouchStart(event: TouchEvent, item: Peca) {
    this.log('onBtnQueroTouchStart', {
      itemId: item.id,
      itemNome: item.nome,
      touches: event.touches.length,
      targetTag: (event.target as HTMLElement).tagName,
      targetClass: (event.target as HTMLElement).className,
      isCancelled: event.defaultPrevented,
    });
  }

  // LOG 3 — chamado pelo template no touchend do botão
  onBtnQueroTouchEnd(event: TouchEvent, item: Peca) {
    this.log('onBtnQueroTouchEnd', {
      itemId: item.id,
      changedTouches: event.changedTouches.length,
      defaultPrevented: event.defaultPrevented,
    });
  }

  // LOG 4 — chamado pelo template no click do botão
  onBtnQueroClick(event: MouseEvent | PointerEvent, item: Peca) {
    this.log('onBtnQueroClick DISPARADO ✅', {
      itemId: item.id,
      itemNome: item.nome,
      eventType: event.type,
      pointerType: (event as PointerEvent).pointerType ?? 'n/a', // 'touch' | 'mouse' | 'pen'
      clientX: event.clientX,
      clientY: event.clientY,
      defaultPrevented: event.defaultPrevented,
      composedPath: event.composedPath().map((el: EventTarget) => {
        const e = el as HTMLElement;
        return e.tagName ? `${e.tagName}.${e.className}` : String(el);
      }),
    });
  }

  // LOG 5 — inspeciona se algum elemento está cobrindo os botões
  private auditarElementosSobrepostos() {
    const botoes = document.querySelectorAll<HTMLAnchorElement>('.btn-quero');
    this.log(`Auditoria de sobreposição — ${botoes.length} botões encontrados`);

    botoes.forEach((btn, i) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const elementoNoTopo = document.elementFromPoint(cx, cy);

      const coberto = elementoNoTopo !== btn && !btn.contains(elementoNoTopo);
      const areaToque = rect.width * rect.height;

      console.log(`[btn-quero #${i}]`, {
        visivel: rect.width > 0 && rect.height > 0,
        rect: { w: Math.round(rect.width), h: Math.round(rect.height) },
        areaToque_px2: Math.round(areaToque),
        areaToquePequena: areaToque < 2000, // < ~45x44px — abaixo do mínimo recomendado
        cobertoPorOutroElemento: coberto,
        elementoNoTopo: elementoNoTopo
          ? `${elementoNoTopo.tagName}.${elementoNoTopo.className}`
          : 'nenhum',
        zIndex: getComputedStyle(btn).zIndex,
        pointerEvents: getComputedStyle(btn).pointerEvents,
        overflow: getComputedStyle(btn.closest('.card-produto')!).overflow,
      });
    });
  }

  // LOG 6 — detecta scroll sendo interpretado como tap (problema comum no mobile)
  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.btn-quero')) {
      this.log('⚠️ touchmove detectado DENTRO do btn-quero — scroll pode estar cancelando o tap', {
        deltaY: event.touches[0]?.clientY,
      });
    }
  }
}
