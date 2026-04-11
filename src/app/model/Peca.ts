import { CategoriaPeca } from "./CategoriaPeca";
import { PecaImagem } from "./PecaImagen";
import { PecaVariacao } from "./PecaVariacao";

export class Peca {
  public id!: number;
  public nome!: string;
  public detalhe!: string;
  public linkFoto!: string;
  public imagens: PecaImagem[] = [];
  public variacoes: PecaVariacao[] = [];   // ← variações de cor/tamanho
  public corUnica: boolean = false;        // ← produto tem apenas uma cor
  public tamanhoUnico: boolean = false;    // ← produto tem apenas um tamanho
  public precoPromo!: number;
  public prontaEntrega!: number;
  public preco!: number;
  public disponivel!: number;
  public destaque!: number;
  public quantidadeEstoque!: number;
  public estoqueMinimo!: number;
  public estoqueCritico!: number;
  public categoriaPeca!: CategoriaPeca;

  // ── Getters booleanos para checkboxes ────────────────────────────────────

  get disponivelBool(): boolean        { return this.disponivel === 1; }
  set disponivelBool(value: boolean)   { this.disponivel = value ? 1 : 0; }

  get destaqueBool(): boolean          { return this.destaque === 1; }
  set destaqueBool(value: boolean)     { this.destaque = value ? 1 : 0; }

  get prontaEntregaBool(): boolean     { return this.prontaEntrega === 1; }
  set prontaEntregaBool(value: boolean){ this.prontaEntrega = value ? 1 : 0; }

  // ── Imagem principal (fallback para linkFoto) ─────────────────────────────

  get imagemPrincipal(): string {
    const principal = this.imagens?.find(i => i.principal === 1);
    return principal?.linkImagem ?? this.linkFoto ?? '';
  }

  // ── Helpers de estoque ────────────────────────────────────────────────────

  /** Retorna o estoque efetivo: soma das variações quando existirem, ou o campo direto */
  get estoqueEfetivo(): number {
    if (this.variacoes?.length) {
      return this.variacoes.reduce((acc, v) => acc + (v.quantidadeEstoque ?? 0), 0);
    }
    return this.quantidadeEstoque ?? 0;
  }

  /** true quando o produto possui variações cadastradas */
  get temVariacoes(): boolean {
    return this.variacoes?.length > 0;
  }
}
