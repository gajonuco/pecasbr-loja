import { Routes } from '@angular/router';
import { Destaques } from './componentes/destaques/destaques';
import { Detalhes } from './componentes/detalhes/detalhes';
import { Carrinho } from './componentes/carrinho/carrinho';
import { Efetivarpedido } from './componentes/efetivarpedido/efetivarpedido';
import { Recibo } from './componentes/recibo/recibo';
import { Buscacategoria } from './componentes/buscacategoria/buscacategoria';
import { BuscaPalavraChave } from './componentes/busca-palavra-chave/busca-palavra-chave';
import { Cadastro } from './componentes/cadastro/cadastro/cadastro';
import { Login } from './componentes/login/login/login';
import { MinhaConta } from './componentes/minha-conta/minha-conta/minha-conta';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path :'', component: Destaques },
    {path : 'detalhe/:id', component: Detalhes},
    {path : 'carrinho', component: Carrinho},
    {path : 'efetivarpedido', component: Efetivarpedido},
    {path : 'recibo/:id', component: Recibo},
    {path :  'buscacategoria/:id', component: Buscacategoria},
    {path : 'busca', component: BuscaPalavraChave},
    {path: 'cadastro', component: Cadastro},
    {path: 'login', component:Login},
    {path: 'minha-conta',component: MinhaConta, canActivate: [authGuard]}
];
