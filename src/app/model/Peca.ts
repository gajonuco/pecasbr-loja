import { CategoriaPeca } from "./CategoriaPeca";

export class Peca {
    public id!: number;
    public nome!: string;
    public detalhe!: string;
    public linkFoto!: string;
    public preco!: number;
    public precoPromo!: number;
    public prontaEntrega!: number;
    public disponivel!: number;
    public quantidadeEstoque!: number;
    public estoqueMininmo!: number;
    public estoqueCritico!: number;
    public categoriaPeca!: CategoriaPeca;
}
