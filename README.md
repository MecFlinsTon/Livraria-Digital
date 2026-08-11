# BibliON

Aplicação de e-commerce de livros construída com Angular 21 + SSR. O projeto apresenta um catálogo de livros completo, carrinho de compras persistente, página dedicada de produto e checkout com validações.

## Funcionalidades principais

- Catálogo com pelo menos 9 livros exibidos na página inicial.
- Produto com página dedicada em `/product/:id` mostrando mais detalhes.
- Destaque visual para livros com estoque baixo (5 ou menos unidades).
- Produtos sem estoque exibem botão alternativo: `Me avise quando tiver em estoque`.
- Carrinho de compras persistente em `localStorage`.
- Atualização de quantidade no carrinho com limite pelo estoque disponível.
- Remoção de produtos e limpeza do carrinho.
- Badge no cabeçalho indicando quantidade de itens no carrinho.
- Checkout com formulário de cadastro e validações obrigatórias:
  - Nome completo
  - CPF
  - E-mail
  - Endereço
  - Método de pagamento
- Cálculo automático de total, desconto e total com desconto.
- Componente de checkout sem backend, mas com fluxo simulado de emissão de compra.
- Suporte SSR com `@angular/ssr`.

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
- `npm run test` - executa testes de unidade com Vitest (se houver configuração de teste).
- `npm run serve:ssr:Livraria-Digital` - executa a aplicação SSR gerada.

## Estrutura do projeto

- `src/main.ts` - ponto de entrada do cliente Angular.
- `src/main.server.ts` - ponto de entrada do servidor Angular.
- `src/server.ts` - servidor Express para SSR.
- `src/app/app.ts` - componente raiz da aplicação.
- `src/app/app.routes.ts` - configuração de rotas do app.
- `src/app/services/product.service.ts` - serviço de produtos.
- `src/app/services/cart.service.ts` - serviço do carrinho de compras.
- `src/app/components/` - componentes de interface, incluindo home, card, detalhe, carrinho e checkout.

## Tecnologias

- Angular 21
- TypeScript
- Express
- `@angular/ssr`
- Vitest
- Prettier

## Observações

O catálogo de livros está definido no serviço `ProductService` e pode ser estendido ou substituído por uma fonte de dados real no futuro.
