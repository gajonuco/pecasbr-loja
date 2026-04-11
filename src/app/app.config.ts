import { ApplicationConfig,
         provideBrowserGlobalErrorListeners,
         provideZoneChangeDetection } from '@angular/core';
import { provideRouter }             from '@angular/router';
import { HttpClient,
         provideHttpClient }         from '@angular/common/http';
import { provideTranslateService,
         TranslateLoader }           from '@ngx-translate/core';
import { Observable }                from 'rxjs';
import { routes }                    from './app.routes';

class JsonLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}
  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({           // ← API correta para v17 standalone
      lang: 'pt',
      fallbackLang: 'pt',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new JsonLoader(http),
        deps: [HttpClient]
      }
    })
  ]
};
