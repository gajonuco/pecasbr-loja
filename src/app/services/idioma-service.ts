// src/app/services/idioma.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class IdiomaService {

  readonly idiomas = [
    { codigo: 'pt', label: 'Português', bandeira: '🇧🇷' },
    { codigo: 'es', label: 'Español',   bandeira: '🇪🇸' }
  ];

  constructor(private translate: TranslateService) {
    const salvo = localStorage.getItem('idioma') ?? 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(salvo);
  }

  get idiomaAtual(): string {
    return this.translate.currentLang;
  }

  trocar(codigo: string): void {
    this.translate.use(codigo);
    localStorage.setItem('idioma', codigo);
  }
}
