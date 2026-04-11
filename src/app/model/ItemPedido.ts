import { Peca } from "./Peca";
import { PecaVariacao } from "./PecaVariacao";

export class ItemPedido {
  public num_seq!: number;
  public qtdtItem!: number;
  public precoUnitario!: number;
  public precoTotal!: number;
  public peca!: Peca;
   public  hexCodeEscolhido!: string;

  // ── Variação escolhida pelo cliente ──────────────────────────────────────
  // Preenchidos no componente Detalhes e persistidos no backend via ItemPedido
  public variacao?: PecaVariacao;       // referência completa (usada internamente)
  public corEscolhida?: string;         // persiste no banco (tbl_itempedido.cor_escolhida)
  public tamanhoEscolhido?: string;     // persiste no banco (tbl_itempedido.tamanho_escolhido)

  // ── Helper: descrição da variação para exibição no carrinho ──────────────
  get descricaoVariacao(): string {
    const partes: string[] = [];
    if (this.corEscolhida)     partes.push(this.corEscolhida);
    if (this.tamanhoEscolhido) partes.push(this.tamanhoEscolhido);
    return partes.join(' · ');
  }
}
