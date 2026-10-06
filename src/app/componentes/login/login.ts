import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public email = '';
  public senha = '';
  public erro = '';
  public carregando = false;
  public tentouEnviar = false;

  constructor(private auth: AuthService, private router: Router){}

  public entrar(): void {
    this.tentouEnviar = true;
    this.erro = '';

    if(!this.email.trim() || !this.senha.trim()){
      return;
    }

    this.carregando = true;
    this.auth.login({ email: this.email, senha: this.senha}).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/minha-conta']);
      },
      error :() => {
        this.carregando = false;
        this.erro = 'E-mail ou senha inválidos.';
      }
    })
  }


}
