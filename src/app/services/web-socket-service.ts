// websocket.service.ts
import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client!: Client;
  public pagamentoConfirmado$ = new Subject<any>();

  connect() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
onConnect: () => {
  console.log('✅ WebSocket conectado!');
  this.client.subscribe('/topic/payment', (message) => {
    console.log('📨 Mensagem WebSocket recebida!', message.body);
    const payload = JSON.parse(message.body);
    this.pagamentoConfirmado$.next(payload);
  });
},
onDisconnect: () => console.log('❌ WebSocket desconectado'),
onStompError: (frame) => console.error('🔴 Erro STOMP:', frame)
    });
    this.client.activate();
  }

  disconnect() {
    this.client?.deactivate();
  }
}
