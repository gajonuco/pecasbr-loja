# PeçasBR Loja

## Visão geral

**PeçasBR Loja** é o front-end (Angular 20, *standalone components*) de um e-commerce de moda feminina. Internamente o projeto Angular ainda é identificado como `oficina_mecanica` (nome do projeto em `angular.json`/`package.json` e da pasta de build `dist/oficina_mecanica`), um resquício de uma versão anterior do produto — a marca e os textos da interface já são os de "Peças BR".

A aplicação cobre toda a jornada de compra de uma loja de roupas femininas:

- catálogo paginado de produtos ("peças"), com categorias, destaques e variações de cor/tamanho
- busca por categoria e por palavra-chave (ambas paginadas)
- página de detalhe com galeria de imagens (zoom e navegação) e seleção de cor/tamanho por estoque
- carrinho de compras 100% client-side (persistido em `localStorage`)
- checkout com busca automática de cliente (por telefone ou CPF), busca de CEP e cálculo de frete
- cadastro/login de cliente com JWT e área "Minha conta" (dados, endereços e histórico de pedidos)
- geração de link de pagamento (Asaas) e página de recibo do pedido
- internacionalização `pt`/`es`
- PWA com service worker e manifesto de instalação

> O repositório contém apenas o front-end. Ele espera uma API REST (e, para a confirmação de pagamento, um endpoint WebSocket/STOMP) rodando separadamente — veja [Configuração de ambiente](#configuração-de-ambiente).

## Tecnologias principais

- Angular 20.3 (componentes *standalone*, sem `NgModule`)
- TypeScript 5.9
- RxJS 7
- `@ngx-translate/core` e `@ngx-translate/http-loader` — internacionalização
- `@stomp/stompjs` e `sockjs-client` — cliente WebSocket (ver observação em [Integrações](#integrações-e-serviços-externos))
- `ngx-mask` — máscaras de telefone, CPF e CEP
- `jwt-decode` — suporte a token JWT no front
- `@angular/service-worker` — PWA
- Karma, Jasmine e Angular TestBed — testes unitários
- `@angular/fire` / `firebase` — dependências instaladas, mas **não há nenhum uso no código-fonte atual** (nenhum import de `firebase`/`@angular/fire` em `src/`)

## Estrutura do projeto

```
src/
├── app/
│   ├── componentes/          # componentes de página e UI
│   │   ├── navbar, rodape, carousel
│   │   ├── destaques/         # home com listagem paginada e carrossel
│   │   ├── detalhes/          # detalhe do produto, galeria e variações
│   │   ├── buscacategoria/    # listagem por categoria
│   │   ├── busca-palavra-chave/ # busca por palavra-chave
│   │   ├── carrinho/          # carrinho (localStorage)
│   │   ├── efetivarpedido/    # checkout (dados, endereço, frete, pagamento)
│   │   ├── recibo/            # confirmação/recibo do pedido
│   │   ├── login, cadastro/   # autenticação de cliente
│   │   └── minha-conta/       # dados, endereços e pedidos do cliente logado
│   ├── services/              # chamadas HTTP e regras de domínio
│   ├── model/                 # interfaces/classes de dados (Peca, Pedido, Cliente…)
│   ├── guards/                # authGuard (protege /minha-conta)
│   └── interceptors/          # authInterceptor (injeta Bearer token)
├── assets/
│   ├── i18n/                  # pt.json, es.json
│   ├── icons/                 # ícones do manifesto PWA
│   └── img/                   # imagens estáticas
├── environments/               # environment.ts (dev) / environment.prod.ts
├── main.ts                     # bootstrap, locale pt-BR, service worker, interceptor
└── manifest.webmanifest        # nome "PeçasBR Loja", tema e ícones do PWA

angular.json       # build/serve/test (projeto "oficina_mecanica")
ngsw-config.json   # cache do service worker
proxy.conf.json    # proxy do dev-server para a API local
```

## Rotas

| Caminho                 | Componente        | Observação                         |
|--------------------------|--------------------|-------------------------------------|
| `/`                       | `Destaques`         | listagem paginada / destaques       |
| `/detalhe/:id`            | `Detalhes`          | detalhe do produto                  |
| `/buscacategoria/:id`     | `Buscacategoria`    | produtos por categoria              |
| `/busca`                  | `BuscaPalavraChave` | resultado de busca por palavra-chave|
| `/carrinho`               | `Carrinho`          | carrinho de compras                 |
| `/efetivarpedido`         | `Efetivarpedido`    | checkout                            |
| `/recibo/:id`             | `Recibo`            | confirmação do pedido               |
| `/login`                  | `Login`             | autenticação                        |
| `/cadastro`               | `Cadastro`          | criação de conta                    |
| `/minha-conta`            | `MinhaConta`        | protegida por `authGuard`           |

## Funcionalidades implementadas

**Catálogo e busca**
- listagem paginada de produtos (`PecaService.getAllPecas`) e por categoria/palavra-chave
- carrossel de destaques e listagem de categorias na navbar
- detalhe do produto com galeria (zoom, navegação por miniaturas) e seleção de variação (cor/tamanho), validando estoque por variação

**Carrinho e checkout**
- carrinho mantido inteiramente em `localStorage` (chave `AdicionarCarrinho`), sem endpoint de carrinho no backend
- checkout com:
  - busca de cliente existente por CPF ou telefone, com preenchimento automático dos dados
  - validação de CPF (algoritmo de dígito verificador), e-mail, telefone e data de nascimento no front
  - busca de CEP via API pública [opencep.com](https://opencep.com) e cálculo de frete por prefixo de CEP (`FreteService`)
  - opção de retirada no local (frete zerado)
  - envio do pedido (`PedidoService.inserirNovoPedido`) e redirecionamento para o link de pagamento retornado pelo backend

**Conta do cliente**
- cadastro e login com JWT, token salvo em `localStorage` (`clienteToken`) e injetado em requisições pelo `authInterceptor`
- `authGuard` protegendo `/minha-conta`
- área "Minha conta" com abas de dados pessoais, endereços (CRUD + marcar como principal) e histórico de pedidos

**Outros**
- internacionalização `pt`/`es` com troca de idioma persistida em `localStorage` (`IdiomaService`)
- PWA: manifesto (`PeçasBR Loja`) e service worker ativo em build de produção, com checagem periódica de atualização

## Integrações e serviços externos

| Serviço | Uso | Observação |
|---|---|---|
| API REST própria (`environment.apiURL`) | produtos, categorias, frete, cliente, endereços, pedidos, pagamento | backend não incluído neste repositório |
| [opencep.com](https://opencep.com) | consulta de CEP no checkout | chamado diretamente do front, sem passar pela API própria |
| Asaas (`IntegracaoAsaas.createPaymentLink`) | geração de link de pagamento | chamada ao backend (`/createPayment`), que por sua vez integra com o Asaas |
| STOMP sobre SockJS (`WebSocketService`) | ouvir confirmação de pagamento no tópico `/topic/payment` | serviço implementado, mas **não é injetado/usado por nenhum componente no momento** — fica disponível para uso futuro |
| Firebase / `@angular/fire` | — | dependência presente no `package.json`, sem uso no código atual |

## Configuração de ambiente

Os arquivos de ambiente ficam em `src/environments/`:

- `environment.ts` (desenvolvimento) — `apiURL: "/api"`, redirecionado pelo `proxy.conf.json` do `ng serve` para `http://localhost:8080`. Ajuste o `target` nesse arquivo se a API local rodar em outra porta.
- `environment.prod.ts` (produção) — `apiURL` apontando para o host de produção da API.

O `fileReplacement` de produção é feito automaticamente pelo `angular.json` ao rodar `ng build` (configuração padrão é `production`).

## Scripts disponíveis

- `npm start` — `ng serve`, com proxy de `/api` para a API local (porta 8080)
- `npm run build` — build de produção em `dist/oficina_mecanica/`
- `npm run watch` — build em modo *watch*, configuração de desenvolvimento
- `npm test` — testes unitários via Karma/Jasmine (29 arquivos `*.spec.ts`, cobrindo componentes, serviços, guard e interceptor)

## Setup local

### Requisitos

- Node.js 18+ (compatível com Angular CLI 20)
- npm 10+
- uma instância da API backend acessível (local em `http://localhost:8080` por padrão, via proxy)

### Instalar dependências

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm start
```

Acesse `http://localhost:4200/`. Requisições para `/api/**` são repassadas pelo proxy para a API configurada em `proxy.conf.json`.

### Build de produção

```bash
npm run build
```

O resultado é gerado em `dist/oficina_mecanica/`.

## Testes

```bash
npm test
```

O projeto utiliza Karma e Jasmine (via `@angular/build:karma`) para testes de componentes, serviços, guard (`auth-guard`) e interceptor (`auth-interceptor`). Não há testes end-to-end configurados.

## Implantação

- publique o conteúdo de `dist/oficina_mecanica/` em um servidor estático ou CDN
- o service worker (`ngsw-config.json`) só é habilitado no build de produção (`!isDevMode()` em `main.ts`)
- o manifesto PWA está em `src/manifest.webmanifest`; os ícones ficam em `src/assets/icons`
- a API consumida pelo front deve estar acessível no endereço configurado em `environment.prod.ts`, incluindo o endpoint WebSocket (`/ws`) se a confirmação de pagamento em tempo real vier a ser conectada

## Débito técnico conhecido (presente no código)

Há comentários `TODO` no código que vale manter em mente ao evoluir o projeto:

- `Cliente.ts` mantém campos legados de endereço "solto" (`cep`, `logradouro`, etc., fora do array `endereco`), usados apenas pelo checkout de visitante em `efetivarpedido.ts`; previstos para remoção quando esse fluxo for migrado para o modelo `Endereco`.
- `ClienteService.buscarClientePeloCPF` e `buscarClientePeloTelefone` chamam um endpoint marcado como já removido do backend; estão mantidos só para não quebrar a compilação do checkout.
- Há uma pequena inconsistência de idioma padrão: `app.config.ts` e `app.ts` inicializam o `TranslateService` com fallback `pt`, enquanto `IdiomaService` usa fallback `es` quando não há idioma salvo em `localStorage`. Vale unificar antes de depender desse comportamento.
- `destaques.ts` ainda contém instrumentação de depuração (logs e auditoria de sobreposição de elementos) relacionada a um problema de toque em mobile no botão "Eu quero"; pode ser removida quando o problema for confirmado como resolvido.

## Próximos passos recomendados

- adicionar testes E2E para as jornadas de busca → carrinho → checkout → pagamento
- decidir entre manter ou remover as dependências não utilizadas de Firebase/`@angular/fire`
- conectar o `WebSocketService` à tela de recibo/checkout para confirmação de pagamento em tempo real, ou removê-lo caso não seja mais necessário
- resolver a inconsistência de idioma padrão (`pt` vs `es`) descrita acima
- documentar os contratos da API consumida (endpoints, payloads e o endpoint WebSocket `/topic/payment`)

---

Desenvolvido com foco em qualidade, modularidade e facilidade de manutenção para um e-commerce de moda feminina.
