# Don’Ana Pizzaria

Site da Don’Ana Pizzaria, em Maricá (RJ). É um site estático: basta abrir o `index.html` no navegador ou publicar a pasta em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel).

Os pedidos são feitos pelo [Anota AI](https://pedido.anota.ai/loja/don-ana-pizzas-delivery) e pelo [iFood](https://www.ifood.com.br/delivery/marica-rj/donana-pizzaria-delivery-centro/9b472c94-abbf-4922-971d-7c604047b8a2). Cada botão do cardápio abre o produto certo no Anota AI.

## Como atualizar o cardápio

Preços, sabores e ingredientes ficam em `js/data.js`. Para mudar um preço, edite o número do sabor e do tamanho:

```js
f('calabresa', 'Calabresa', 'Molho de tomate, …', 'calabresa', [47.5, 62.9, 73.4, 83.9]),
//                                                             pequena média família grande
```

Os códigos longos (como `67ad24eb161b45a30ff5ec91`) são os produtos no Anota AI. Só mude se o produto for recriado lá.

## Estrutura

- `index.html`: a página
- `css/style.css`: visual (cores da Itália, tipografia, layout)
- `js/data.js`: cardápio e links de pedido
- `js/main.js`: animação da pizza (só no computador), abas, tamanhos, busca e meio a meio
- `img/`: fotos do cardápio (Anota AI da Don’Ana) e do topo/promoção ([Unsplash](https://unsplash.com/photos/UpyfnDr6SPk) e [Pexels](https://www.pexels.com/photo/chocolate-and-savory-pizzas-side-by-side-31094808/), licenças livres para uso comercial)
