import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  public nome = '';
  public email = '';
  public senha = '';
  public cpf = '';
  public telefone = '';
  public dataNasc = '';
  public erro = '';
  public carregando = false;

  constructor(private auth: AuthService, private router: Router) {}

  public cadastrar(): void {
    this.erro = '';
    this.carregando = true;
    this.auth.cadastrar({
      nome: this.nome, email: this.email, senha: this.senha,
      cpf: this.cpf, telefone: this.telefone, dataNasc: this.dataNasc
    }).subscribe({
      next: () => {
        this.carregando = true;
        this.router.navigate(['/minha-conta']);
      },
      error: (err) => {
        this.carregando = false;
        this.erro = err.status === 409
          ? 'Já existe uma conta com esses dados'
          : 'Não foi possível concluir o cadastro.';
      }
    })
  }

}
