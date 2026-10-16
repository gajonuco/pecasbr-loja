import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { isDevMode }            from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { LOCALE_ID }            from '@angular/core';
import { registerLocaleData }   from '@angular/common';
import localePt                 from '@angular/common/locales/pt';
import { appConfig }            from './app/app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth-interceptor';

registerLocaleData(localePt);

bootstrapApplication(App, {
  providers: [
    ...appConfig.providers,              // ← expande todos os providers do appConfig
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
});

document.addEventListener('touchstart', () => {}, { passive: true });
