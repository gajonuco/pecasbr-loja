import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../model/Cliente';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../servicos/cliente-service';
import { Pedido } from '../../model/Pedido';
import { PedidoService } from '../../servicos/pedido-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BuscarCepService } from '../../servicos/buscar-cep-service';
import { EntidadeCEP } from '../../model/EntidadeCEP';
import { CarrinhoService } from '../../servicos/carrinho-service';


@Component({
  selector: 'app-efetivarpedido',
  imports: [FormsModule, CommonModule],
  templateUrl: './efetivarpedido.html',
  styleUrl: './efetivarpedido.css'
})
export class Efetivarpedido implements OnInit{

  public cliente: Cliente;
  public achou: boolean;
  public visivel: boolean;
  public pedido: Pedido;
  public buscouCPF: boolean;
  public entidadeCEP: EntidadeCEP;
  public mensagemErro: string;
  public msgEndereco: string;
  public exibirPerguntaEndereco: boolean;
  public exibirFormEndereco: boolean;
  public cpfValido: boolean;

  constructor(private cliServico: ClienteService,
              private pedService: PedidoService,
              private router: Router,
              private carService: CarrinhoService,
              private cepService: BuscarCepService  ){
    this.cliente = new Cliente();
    this.pedido = new Pedido();
    this.entidadeCEP =new EntidadeCEP();
    this.achou = true;
    this.visivel = true;
    this.buscouCPF = false;
    this.mensagemErro = "erro"
    this.msgEndereco = '';
    this.exibirPerguntaEndereco = true;
    this.exibirFormEndereco = false;
    this.cpfValido = false
  }

  public isCPFValid(): boolean {
    if (!this.cliente.cpf || this.cliente.cpf.length == 0 ||  this.cliente.cpf === undefined) {
      this.cpfValido = false
      return   false;
    }
    let cpf =this.cliente.cpf?.replace(/\D/g, "");
    console.log(cpf);

    // atribuir o cpf desformatado para o cpf do cliente
    this.cliente.cpf = cpf;
    let digitos: number[] = cpf.split("").map(i => +i);

    //console.log(digitos);
    if (cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" ||
      cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999") {
      return false;
    }

    let digito1 = digitos[0] * 10 + digitos[1] * 9 + digitos[2] * 8 + digitos[3] * 7 + digitos[4] * 6 + digitos[5] * 5 + digitos[6] * 4 + digitos[7] * 3 + digitos[8] * 2;
    //console.log(digito1);
    let d1: number = 11 - digito1 % 11;
    //console.log(d1);
    if (d1 >= 10) {  // regra se o número for >= 10
      d1 = 0;
    }
    if (d1 != digitos[9]) {  // primeiro digito não confere
      return false;
    }
    let digito2 = digitos[0] * 11 + digitos[1] * 10 + digitos[2] * 9 + digitos[3] * 8 + digitos[4] * 7 + digitos[5] * 6 + digitos[6] * 5 + digitos[7] * 4 + digitos[8] * 3 + digitos[9] * 2;
    //console.log(digito2);

    let d2: number = 11 - digito2 % 11;

    if (d2 >= 10) {  // regra para se o digito 2 for >= 10
      d2 = 0;
    }

    if (d2 != digitos[10]) {
      this.cpfValido = false
      return false;
    }
    else {
      this.cpfValido = true
      return true;

    }
  } 

      public buscarCEP(){
      this.cepService.buscarCEP(this.cliente.cep)
        .subscribe({
          next:(res: EntidadeCEP) => {
                        this.cliente.estado = res.uf;
            this.cliente.logradouro =res.logradouro;
            this.cliente.complemento =res.complemento
            this.cliente.bairro = res.bairro;
            this.cliente.cidade = res.localidade;

            console.log(res)
          },error:(err) => {
              if (!/^\d+$/.test(this.cliente.cep)) {
              this.mensagemErro = "Informe um CEP correto, apenas números, sem pontos ou traços.";
              document.getElementById("btnModal")?.click();
            } 
              else if (this.cliente.cep.length !== 8) {
              this.mensagemErro = "Informe um CEP válido com 8 dígitos.";
              document.getElementById("btnModal")?.click();
            } else if(err.status == 404) {
                this.mensagemErro = "Não foi localizado o CEP informado.";
              document.getElementById("btnModal")?.click();
            }
          }
        })
    }


    public exibirForm(){
      this.exibirFormEndereco = true
      this.exibirPerguntaEndereco = false
      this.cliente.resetEndereco()
    }

    public ocultarForm(){
      this.exibirFormEndereco = false;
      this.exibirPerguntaEndereco =false;
    }


public buscarCPF(): void {
  this.buscouCPF = true;

  if (this.isCPFValid()) {
    this.cliServico.buscarClientePeloCPF(this.cliente.cpf)
      .subscribe({
        next: (cli: Cliente) => {
          this.cliente = Object.assign(new Cliente(), cli);
          this.achou = true;
          this.msgEndereco = this.cliente.logradouro.substring(0,10) + "************** ";
        },
        error: (err) => {
          if (err.status === 404) {
            this.achou = false;
            this.exibirPerguntaEndereco = false
            this.exibirFormEndereco = true
            this.cliente.reset();
          } else {
            this.mensagemErro = "Erro inesperado ao buscar o cliente.";
            document.getElementById("btnModal")?.click();
          }
        },
      });
  } else {
    this.mensagemErro = "CPF informado é inválido.";
    document.getElementById("btnModal")?.click();
  }
}




  public finalizarPedido(){
    let pedidoTmp: Pedido;
    const carrinhoString = localStorage.getItem("AdicionarCarrinho");
      if(carrinhoString){
        pedidoTmp = JSON.parse(carrinhoString);
        this.pedido.cliente = this.cliente
        this.pedido.itensPedido = pedidoTmp.itensPedido
        this.pedido.status = 0
        this.pedido.valorTotal = pedidoTmp.valorTotal
        
      }
      console.log(this.pedido)
      
      this.pedService.inserirNovoPedido(this.pedido)
        .subscribe({
          next:(res: Pedido) => {
            alert("Pedido efetivado = numero " + res.id)
        
             localStorage.removeItem("AdicionarCarrinho");
             this.carService.getNumberOfItens().next(0);
             this.router.navigate(["recibo", res.id])


            }, error: (err) => {
              console.log(err)
               alert("Não consegui efetivar seu pedido")
          }
      });
  }

  

  ngOnInit(): void {
      
   }
  }

