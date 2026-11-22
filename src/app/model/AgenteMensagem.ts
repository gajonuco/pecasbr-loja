export interface AgenteMensagemRequest{
  sessionId: string;
  mensagem?: string;
  resultadoAcao?: ResultadoAcao;

}

export interface AgenteMensagemResponse {
  resposta: string;
  acaoSugerida?: AcaoSugerida;
}
export interface AcaoSugerida {
  tipo: 'ADICIONAR_CARRINHO';
  pecaId: number;
  quantidade: number;
  cor?: string;
  tamanho?: string;
}

export interface ResultadoAcao {
  tipo: 'ADICIONAR_CARRINHO';
  sucesso: boolean;
  detalhe: string;
}
