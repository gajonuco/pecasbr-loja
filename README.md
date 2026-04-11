# Fashion Store

## Visão geral

`Fashion Store` é uma aplicação front-end construída com Angular 20 para um e-commerce de moda feminina. O projeto foi desenvolvido com foco em escalabilidade, experiência de compra responsiva e integração com serviços externos de backend, tradução e comunicação em tempo real.

A proposta da aplicação inclui:
- catálogo de produtos femininos com categorias, destaques e filtros
- pesquisa por palavra-chave com feedback imediato
- carrinho de compras com atualização dinâmica de itens e valores
- cálculo de frete via CEP e finalização de pedidos
- geração de recibo e histórico de pedidos
- suporte a múltiplos idiomas (`pt`, `es`)
- arquitetura modular para manutenção e testes

## Tecnologias principais

- Angular 20.3
- TypeScript 5.9
- RxJS 7
- `@ngx-translate/core` e `@ngx-translate/http-loader`
- `@angular/fire` e `firebase`
- `@stomp/stompjs` e `sockjs-client`
- `ngx-mask`
- `jwt-decode`
- Karma, Jasmine e Angular TestBed

## Estrutura do projeto

- `src/app/` — base da aplicação Angular
  - `componentes/` — componentes UI e páginas principais
  - `services/` — serviços de domínio e integração com APIs
  - `model/` — interfaces e contratos de dados
  - `environments/` — configuração de ambiente para desenvolvimento e produção
- `src/assets/i18n/` — traduções de interface (`pt`, `es`)
- `src/styles.scss` — estilos globais e variáveis compartilhadas
- `angular.json` — configuração de build, serve e budgets de produção
- `package.json` — dependências e scripts do projeto
- `src/manifest.webmanifest` — configuração PWA
- `ngsw-config.json` — configuração de service worker

## Design e arquitetura

A aplicação segue princípios de separação de responsabilidades:
- componentes cuidam da renderização e eventos de interface
- serviços centralizam chamadas HTTP e comunicação entre camadas
- modelos em TypeScript definem contratos de dados consistentes
- traduções e configuração ficam isoladas em assets e environments

## Integrações principais

- Firebase para persistência, autenticação e notificações de backend
- WebSocket/STOMP para comunicação em tempo real
- API de CEP para cálculo de frete e validação de endereço
- Internationalization via `@ngx-translate` com fallback para `pt`

## Funcionalidades implementadas

- listagem de produtos por categorias femininas
- busca de produtos por palavra-chave
- exibição de destaques e coleções promocionais
- carrinho de compras com ajuste de quantidade e remoção de itens
- cálculo de frete via consulta de CEP
- fluxo de checkout e emissão de recibo
- suporte a PWA em build de produção
- internacionalização com fallback para `pt`

## Qualidades do projeto

- modularidade para facilitar manutenção e evolução
- arquitetura baseada em componentes com rotas standalone
- uso de serviços para desacoplamento e convenções de domínio
- suporte a multi-idioma e experiência mobile-first
- configuração de produção com budgets e service worker

## Scripts disponíveis

- `npm start` — executa o servidor de desenvolvimento
- `npm run build` — compila o aplicativo para produção
- `npm run watch` — recompila em modo watch para desenvolvimento
- `npm test` — executa testes unitários com Karma

## Setup local

### Requisitos

- Node.js 18+ ou superior
- npm 10+ ou yarn

### Instalar dependências

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm start
```

Acesse `http://localhost:4200/`. O servidor recarrega automaticamente quando os arquivos mudam.

### Build de produção

```bash
npm run build
```

O resultado será gerado em `dist/oficina_mecanica/`.

## Testes

### Testes unitários

```bash
npm test
```

O projeto utiliza Karma e Jasmine para validação de componentes e serviços.

## Configuração de ambiente

Os arquivos de ambiente estão localizados em:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Adapte chaves de API, endpoints de backend e configurações de produção conforme necessário.

## Implantação

Para deploy, publique o conteúdo de `dist/oficina_mecanica/` em um servidor estático ou CDN.

Pontos de atenção:
- o service worker é ativado apenas no build de produção
- o manifesto PWA está em `src/manifest.webmanifest`
- assets estáticos são servidos a partir de `src/assets`

## Boas práticas para manutenção

- mantenha a separação entre lógica de apresentação e serviços de dados
- centralize chamadas HTTP em `src/app/services`
- utilize os modelos em `src/app/model` para consistência de dados
- mantenha traduções sincronizadas em `src/assets/i18n`
- monitore os budgets de build em `angular.json` para evitar assets muito grandes

## Próximos passos recomendados

- adicionar testes E2E para jornadas de compra completas
- separar configurações sensíveis em variáveis de ambiente
- implementar autenticação de usuário e gerenciamento de sessão
- aprimorar tratamentos de erro e feedback de carregamento
- documentar os contratos de API e os endpoints externos

---

Desenvolvido com foco em qualidade, modularidade e facilidade de manutenção para um e-commerce de moda feminina.
