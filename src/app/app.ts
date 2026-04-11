import { Component, OnInit, Renderer2, signal, inject } from '@angular/core';
import { RouterOutlet }          from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter }                from 'rxjs/operators';
import { Navbar }                from './componentes/navbar/navbar';
import { Rodape }                from './componentes/rodape/rodape';
import { TranslateModule,
         TranslateService }      from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Rodape, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('oficina_mecanica');
  private swUpdate = inject(SwUpdate);

  constructor(
    private renderer: Renderer2,
    private translate: TranslateService   // ← TranslateService, não TranslateModule
  ) {
    const idiomaSalvo = localStorage.getItem('idioma') ?? 'pt';
    this.translate.use(idiomaSalvo);
  }

  ngOnInit(): void {
    this.renderer.listen('document', 'touchstart', () => {});

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      ).subscribe(() => {
        document.location.reload();
      });

      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 6 * 60 * 60 * 1000);
    }
  }
}
