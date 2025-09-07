import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./componentes/navbar/navbar";
import { Rodape } from './componentes/rodape/rodape';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Rodape],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('oficina_mecanica');
}
