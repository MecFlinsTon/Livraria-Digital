# BibliON

Aplicação de e-commerce de livros construída com Angular 21 + SSR. O projeto apresenta um catálogo de livros, carrinho de compras reativo e componentes standalone usando `signals` do Angular.

## Funcionalidades principais

- Catálogo de livros com título, autor, preço, avaliação e descrição.
- Carrinho de compras com adição de produtos, remoção, atualização de quantidade e total de itens.
- Estrutura de componentes standalone (`ProductCardComponent`, `CartPanelComponent` e `App`).
- Serviço de produtos (`ProductService`) com dados estáticos de exemplo.
- Serviço de carrinho (`CartService`) usando `signals` para estado reativo.
- Suporte a Server-Side Rendering (SSR) com `@angular/ssr` e `express`.

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm start
```

3. Abra o navegador em:

```text
http://localhost:4200/
```

## Scripts úteis

- `npm start` - inicia o servidor de desenvolvimento Angular.
- `npm run build` - compila a aplicação para produção.
- `npm run watch` - compila em modo de desenvolvimento com watch.
- `npm run test` - executa testes de unidade com Vitest.
- `npm run serve:ssr:Livraria-Digital` - executa a aplicação SSR gerada.

## Estrutura do projeto

- `src/main.ts` - ponto de entrada do cliente Angular.
- `src/main.server.ts` - ponto de entrada do servidor Angular.
- `src/server.ts` - servidor Express para SSR.
- `src/app/app.ts` - componente raiz da aplicação.
- `src/app/services/product.service.ts` - serviço de produtos.
- `src/app/services/cart.service.ts` - serviço de carrinho de compras.
- `src/app/components/` - componentes de UI reutilizáveis.

## Tecnologias

- Angular 21
- TypeScript
- Express
- Vitest
- Prettier

## Observações

O catálogo de livros está definido no serviço `ProductService` e pode ser estendido ou substituído por uma fonte de dados real no futuro.
