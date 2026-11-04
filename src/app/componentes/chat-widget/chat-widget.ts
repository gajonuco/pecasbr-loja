import { Component, signal } from '@angular/core';
import { AgenteService } from '../../services/agente-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  mensagens = signal<MensagemChat[]>([
    {
      autor: 'agente',
      texto: 'Olá! Posso te ajudar a encontrar produtos na loja. O que você procura?'
    }
  ])

  constructor(private agenteService: AgenteService){}

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

    this.agenteService.enviarMensagem(texto).subscribe({
      next: (resposta) => {
        this.mensagens.update(msgs => [...msgs, {
          autor: 'agente',
          texto: resposta.resposta
        }])
        this.carregando.set(false);
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
}
