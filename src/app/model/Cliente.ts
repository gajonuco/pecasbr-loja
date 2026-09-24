import { Endereco}  from './Endereco';

export class Cliente {
  public id!: number;
  public nome!: string;
  public email!: string;
  public telefone!: string;
  public dataNasc!: string;
  public cpf!: string;
  public endereco!: Endereco[];

// TODO(#12): campos legados de endereço solto, usados hoje só pelo
// checkout de guest em efetivarpedido.ts. Remover quando a #12
// migrar esse formulário para o modelo de Endereco.
  public cep!: string;
  public logradouro!: string;
  public numero!: string;
  public complemento!: string;
  public bairro!: string;
  public cidade!: string;
  public estado!: string;

  public resetEndereco(): void {
    this.cep = '';
    this.logradouro = '';
    this.numero = '';
    this.complemento = '';
    this.bairro = '';
    this.cidade = '';
    this.estado = '';
  }

  public reset(): void {
    this.nome = '';
    this.email = '';
    this.telefone = '';
    this.dataNasc = '';
    this.cpf = '';
    this.endereco = [];
    this.resetEndereco();
  }

}
