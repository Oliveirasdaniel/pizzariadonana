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

## Mapa

O mapa do endereço é o do próprio Google Maps, incorporado com um `<iframe>` no `index.html`. Não precisa de chave, conta no Google Cloud nem cartão. No mapa, o cliente vê a ficha da loja e o botão **Como chegar**, que abre a rota no Google Maps.

Para trocar o mapa (por exemplo, se a loja mudar de endereço): abra a loja no [Google Maps](https://www.google.com/maps), clique em **Compartilhar > Incorporar um mapa**, copie o endereço que está em `src="..."` e troque o `src` do `<iframe>` dentro de `.visit__map` no `index.html`. Troque também os links **Como chegar** e **Abrir no Google Maps** logo acima, se a ficha da loja mudar.

## Chat (Smartsupp)

A chave do chat fica em `js/config.js`, que **não vai para o Git** (está no `.gitignore`). Para criar o seu, copie o modelo e preencha:

```sh
cp js/config.example.js js/config.js
```

Nunca coloque chaves no `js/config.example.js` nem em outro arquivo do projeto: só o `js/config.js` tem chaves. Como ele não está no repositório, quem publicar o site precisa criar o `js/config.js` no servidor (ou gerar o arquivo no deploy a partir dos segredos da hospedagem). Sem a chave, o chat não aparece e o resto do site funciona normalmente.

A chave está no painel da [Smartsupp](https://www.smartsupp.com), em *Settings > Live chat > Installation*: copie só o valor de `_smartsupp.key` e cole em `smartsuppKey`. O botão do chat usa o vermelho do site e, no celular, fica acima da barra de abas. Idioma, mensagens e horário de atendimento são configurados no painel da Smartsupp.

## Estrutura

- `index.html`: a página
- `css/style.css`: visual (cores da Itália, tipografia, layout)
- `js/config.example.js`: modelo da chave da Smartsupp (o `js/config.js` com a chave de verdade fica fora do Git)
- `js/data.js`: cardápio e links de pedido
- `js/main.js`: animação da pizza (só no computador), abas, tamanhos, busca, meio a meio e chat
- `img/`: fotos do cardápio (Anota AI da Don’Ana) e do topo/promoção ([Unsplash](https://unsplash.com/photos/UpyfnDr6SPk) e [Pexels](https://www.pexels.com/photo/chocolate-and-savory-pizzas-side-by-side-31094808/), licenças livres para uso comercial)
