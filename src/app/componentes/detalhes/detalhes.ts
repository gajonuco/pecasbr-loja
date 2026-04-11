import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PecaService } from '../../services/peca-service';
import { PecaVariacaoServico } from '../../services/peca-variacao-servico';
import { Peca } from '../../model/Peca';
import { PecaVariacao } from '../../model/PecaVariacao';
import { PecaImagem } from '../../model/PecaImagen';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../model/Pedido';
import { ItemPedido } from '../../model/ItemPedido';
import { CarrinhoService } from '../../services/carrinho-service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-detalhes',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './detalhes.html',
  styleUrl: './detalhes.scss'
})
export class Detalhes implements OnInit {

  public pecaDetalhe!: Peca;
  public quantidade: number = 1;
  public quantidadeInvalida: boolean = false;
  public mensagemEstoque: string = '';

  // ── Variações ─────────────────────────────────────────────────────────────
  public corSelecionada: string = '';
  public tamanhoSelecionado: string = '';
  public variacaoSelecionada: PecaVariacao | null = null;
  public coresDisponiveis: { nome: string; hex: string }[] = [];
  public tamanhosDisponiveis: string[] = [];
  public erroSelecao: string = '';

  // ── Galeria ───────────────────────────────────────────────────────────────
  public imagemAtiva: string = '';
  public indexAtivo: number = 0;
  public zoomAtivo: boolean = false;
  public zoomX: number = 50;
  public zoomY: number = 50;

  constructor(
    private route: ActivatedRoute,
    private service: PecaService,
    private variacaoService: PecaVariacaoServico, // ← injetado
    private nav: Router,
    private carService: CarrinhoService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.recuperarPeca(params['id']);
    });
  }

  // ── Carregamento ──────────────────────────────────────────────────────────

  public recuperarPeca(id: number): void {
    this.service.getPecaPeloId(id).subscribe((peca: Peca) => {
      console.log('Peca recuperada:', peca);
      this.pecaDetalhe           = Object.assign(new Peca(), peca);
      this.pecaDetalhe.imagens   = peca.imagens ?? [];
      this.pecaDetalhe.corUnica     = peca.corUnica     ?? false;
      this.pecaDetalhe.tamanhoUnico = peca.tamanhoUnico ?? false;
      this.imagemAtiva           = this.pecaDetalhe.imagemPrincipal;
      this.indexAtivo            = 0;

      // Reseta seleção ao trocar de produto
      this.corSelecionada        = '';
      this.tamanhoSelecionado    = '';
      this.variacaoSelecionada   = null;
      this.coresDisponiveis      = [];
      this.tamanhosDisponiveis   = [];

      // Carrega variações separado — mesmo padrão do editor-produto
      this.variacaoService.listar(id).subscribe({
        next: (variacoes: PecaVariacao[]) => {
          this.pecaDetalhe.variacoes = variacoes;
          console.log('Variações recuperadas:', variacoes);
          this.extrairCoresETamanhos(variacoes);
          this.validarQuantidade();
        }
      });

      this.validarQuantidade();
    });
  }

  private extrairCoresETamanhos(variacoes: PecaVariacao[]): void {
    const coresMap = new Map<string, string>();
    const tamSet   = new Set<string>();

    variacoes.forEach(v => {
      coresMap.set(v.cor, v.hexCode ?? '#000000');
      tamSet.add(v.tamanho);
    });

    this.coresDisponiveis    = Array.from(coresMap.entries()).map(([nome, hex]) => ({ nome, hex }));
    this.tamanhosDisponiveis = Array.from(tamSet);
  }

  // ── Seleção de variação ───────────────────────────────────────────────────

  public onCorOuTamanhoChange(): void {
    this.erroSelecao = '';

    if (!this.corSelecionada || !this.tamanhoSelecionado) {
      this.variacaoSelecionada = null;
      this.validarQuantidade();
      return;
    }

    this.variacaoSelecionada = this.pecaDetalhe.variacoes?.find(
      v => v.cor === this.corSelecionada && v.tamanho === this.tamanhoSelecionado
    ) ?? null;

    // Ajusta quantidade ao estoque da variação
    if (this.variacaoSelecionada && this.quantidade > this.variacaoSelecionada.quantidadeEstoque) {
      this.quantidade = Math.max(this.variacaoSelecionada.quantidadeEstoque, 1);
    }

    this.validarQuantidade();
  }

  public tamanhoDisponivelParaCor(tamanho: string): boolean {
    if (!this.corSelecionada) return true;
    return this.pecaDetalhe.variacoes?.some(
      v => v.cor === this.corSelecionada &&
           v.tamanho === tamanho &&
           v.quantidadeEstoque > 0
    ) ?? false;
  }

  // ── Galeria ───────────────────────────────────────────────────────────────

  public selecionarImagem(img: PecaImagem, index: number): void {
    this.imagemAtiva = img.linkImagem;
    this.indexAtivo  = index;
  }

  public imagemAnterior(): void {
    const imagens = this.pecaDetalhe.imagens;
    if (!imagens?.length) return;
    this.indexAtivo  = (this.indexAtivo - 1 + imagens.length) % imagens.length;
    this.imagemAtiva = imagens[this.indexAtivo].linkImagem;
  }

  public proximaImagem(): void {
    const imagens = this.pecaDetalhe.imagens;
    if (!imagens?.length) return;
    this.indexAtivo  = (this.indexAtivo + 1) % imagens.length;
    this.imagemAtiva = imagens[this.indexAtivo].linkImagem;
  }

  public onMouseMove(event: MouseEvent): void {
    const el   = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    this.zoomX = ((event.clientX - rect.left) / rect.width)  * 100;
    this.zoomY = ((event.clientY - rect.top)  / rect.height) * 100;
  }

  public get totalImagens(): number {
    return this.pecaDetalhe?.imagens?.length ?? 0;
  }

  // ── Estoque ───────────────────────────────────────────────────────────────

  public validarQuantidade(): void {
    if (!this.pecaDetalhe) return;
    if (this.quantidade < 1) this.quantidade = 1;

    const estoqueReferencia = this.variacaoSelecionada
      ? this.variacaoSelecionada.quantidadeEstoque
      : this.pecaDetalhe.quantidadeEstoque;

    if (this.quantidade > estoqueReferencia) {
      this.quantidadeInvalida = true;
      this.mensagemEstoque    = `Apenas ${estoqueReferencia} unidade(s) disponível(is)`;
    } else {
      this.quantidadeInvalida = false;
      this.mensagemEstoque    = '';
    }
  }

  public get statusEstoque(): 'disponivel' | 'baixo' | 'esgotado' {
    const qtd = this.pecaDetalhe?.quantidadeEstoque ?? 0;
    if (!qtd)                                                   return 'esgotado';
    if (qtd <= (this.pecaDetalhe.estoqueCritico ?? 3))          return 'baixo';
    return 'disponivel';
  }

  // ── Carrinho ──────────────────────────────────────────────────────────────

  public adicionarCarrinho(): void {
    const temVariacoes = this.coresDisponiveis.length > 0 || this.tamanhosDisponiveis.length > 0;

    // Valida seleção obrigatória quando produto tem variações
    if (temVariacoes) {
      if (!this.pecaDetalhe.corUnica && !this.corSelecionada) {
        this.erroSelecao = 'Selecione uma cor antes de continuar.';
        return;
      }
      if (!this.pecaDetalhe.tamanhoUnico && !this.tamanhoSelecionado) {
        this.erroSelecao = 'Selecione um tamanho antes de continuar.';
        return;
      }
    }

    if (this.quantidadeInvalida || this.quantidade < 1) return;

    const carrinhoString = localStorage.getItem('AdicionarCarrinho');
    let pedido: Pedido   = carrinhoString
      ? JSON.parse(carrinhoString)
      : Object.assign(new Pedido(), { itensPedido: [], valorTotal: 0 });

    const item            = new ItemPedido();
    item.qtdtItem         = this.quantidade;
    item.precoUnitario    = this.pecaDetalhe.precoPromo > 0
      ? this.pecaDetalhe.precoPromo
      : this.pecaDetalhe.preco;
    item.precoTotal       = item.precoUnitario * item.qtdtItem;
    item.peca             = this.pecaDetalhe;
    item.hexCodeEscolhido = this.variacaoSelecionada?.hexCode ?? '';

    item.variacao         = this.variacaoSelecionada ?? undefined;
    item.corEscolhida     = this.corSelecionada     || undefined;
    item.tamanhoEscolhido = this.tamanhoSelecionado || undefined;

    pedido.itensPedido.push(item);
    pedido.valorTotal += item.precoTotal;

    localStorage.setItem('AdicionarCarrinho', JSON.stringify(pedido));
    this.carService.atualizarQuantidade(pedido.itensPedido.length);
    this.nav.navigate(['carrinho']);
  }
}
