import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-rodape',
  imports: [TranslateModule],
  templateUrl: './rodape.html',
  styleUrl: './rodape.scss'
})
export class Rodape {

  anoAtual = new Date().getFullYear();
}
