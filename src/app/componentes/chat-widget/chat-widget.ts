import { Component, signal } from '@angular/core';
import { AgenteService } from '../../services/agente-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PecaService } from '../../services/peca-service';
import { PecaVariacaoServico } from '../../services/peca-variacao-servico';
import { CarrinhoService } from '../../services/carrinho-service';
import { AcaoSugerida, ResultadoAcao } from '../../model/AgenteMensagem';
import { PecaVariacao } from '../../model/PecaVariacao';
import { Peca } from '../../model/Peca';

interface MensagemChat{
  autor: 'cliente' | 'agente'
  texto: string;
}

@Component({
  selector: 'app-chat-widget',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.css',
})
export class ChatWidget {
  aberto = signal(false)
  carregando = signal(false)
  mensagemAtual = '';
  private readonly sessionId = crypto.randomUUID();
  mensagens = signal<MensagemChat[]>([
    {
      autor: 'agente',
      texto: 'Olá! Posso te ajudar a encontrar produtos na loja. O que você procura?'
    }
  ])

  constructor(
    private agenteService: AgenteService,
    private pecaService: PecaService,
    private variacaoServico: PecaVariacaoServico,
    private carrinhoService: CarrinhoService
  ) {}
  public alternarAberto(): void {
    this.aberto.update(valor => !valor);
  }

  public enviar(): void {
    const texto = this.mensagemAtual.trim();
    if(!texto || this.carregando()){
      return;
    }

    this.mensagens.update(msgs => [...msgs, {
      autor: 'cliente', texto
    }])
    this.mensagemAtual = '';
    this.carregando.set(true);

    this.agenteService.enviarMensagem(this.sessionId, texto).subscribe({
      next: (resposta) => {
        this.mensagens.update(msgs => [...msgs, {
          autor: 'agente',
          texto: resposta.resposta
        }])
        this.carregando.set(false);
        if (resposta.acaoSugerida) {
         this.executarAcaoSugerida(resposta.acaoSugerida);
       }
      },
      error: (erro) => {
        const mensagemErro = erro.status === 429
          ? 'Estou com muitas mensagens no momento. Tente novamente em instantes.'
          : 'Não consegui processar sua mensagem agora. Tente novamente.';
        this.mensagens.update(msgs => [...msgs, {
          autor: 'agente',
          texto: mensagemErro
        }])
        this.carregando.set(false);
        }
    })
  }

    private executarAcaoSugerida(acao: AcaoSugerida): void {
    if (acao.tipo !== 'ADICIONAR_CARRINHO') {
      return;
    }

    this.pecaService.getPecaPeloId(acao.pecaId).subscribe({
      next: (peca) => {
        if (acao.cor && acao.tamanho) {
          this.variacaoServico.listar(acao.pecaId).subscribe({
            next: (variacoes) => {
              const variacao = variacoes.find(
                v => v.cor === acao.cor && v.tamanho === acao.tamanho
              );
              this.finalizarAdicao(peca, acao, variacao);
            },
            error: () => this.reportarFalha(acao, 'Não foi possível confirmar a variação do produto.')
          });
        } else {
          this.finalizarAdicao(peca, acao, undefined);
        }
      },
      error: () => this.reportarFalha(acao, 'Não foi possível encontrar o produto.')
    });
  }

  private finalizarAdicao(peca: Peca, acao: AcaoSugerida, variacao: PecaVariacao | undefined): void {
    this.carrinhoService.adicionarItem(peca, acao.quantidade, variacao, acao.cor, acao.tamanho);

   const detalhesVariacao = [acao.cor, acao.tamanho].filter(Boolean).join(', ');
   const detalhe = detalhesVariacao
      ? `${peca.nome} (${detalhesVariacao}) adicionado ao carrinho`
     : `${peca.nome} adicionado ao carrinho`;

    this.enviarResultadoAcao({ tipo: 'ADICIONAR_CARRINHO', sucesso: true, detalhe });
 }

  private reportarFalha(acao: AcaoSugerida, motivo: string): void {
    this.enviarResultadoAcao({ tipo: acao.tipo, sucesso: false, detalhe: motivo });
  }

  private enviarResultadoAcao(resultadoAcao: ResultadoAcao): void {
    this.carregando.set(true);
    this.agenteService.enviarResultadoAcao(this.sessionId, resultadoAcao).subscribe({
      next: (resposta) => {
        this.mensagens.update(msgs => [...msgs, { autor: 'agente', texto: resposta.resposta }]);
        this.carregando.set(false);
      },
      error: () => {
        this.mensagens.update(msgs => [...msgs, { autor: 'agente', texto: 'Não consegui confirmar a operação agora.' }]);
        this.carregando.set(false);
      }
   });
  }
}
