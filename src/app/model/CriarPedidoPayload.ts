export interface ItemPedidoPayload {
  idPeca: number;
  quantidade: number;
  idVariacao?: number;
  corEscolhida?: string;
  tamanhoEscolhido?: string;
}

export interface DadosClientePayload {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNasc?: string;
}

export interface EnderecoPayload {
  apelido?: string;
  cep: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export interface CriarPedidoPayload {
  cliente?: DadosClientePayload;
  itens: ItemPedidoPayload[];
  observacoes?: string;
  retirar: boolean;
  idEndereco?: number;
  enderecoNovo?: EnderecoPayload;
}
