# Don’Ana Pizzaria

Site da Don’Ana Pizzaria, em Maricá (RJ). É um site estático, publicado na Vercel em https://pizzariadonana.vercel.app: cada push na branch `main` gera um deploy novo. Para ver no computador, abra o `index.html` no navegador.

Os pedidos são feitos pelo [Anota AI](https://pedido.anota.ai/loja/don-ana-pizzas-delivery) e pelo [iFood](https://www.ifood.com.br/delivery/marica-rj/donana-pizzaria-delivery-centro/9b472c94-abbf-4922-971d-7c604047b8a2). Cada botão do cardápio abre o produto certo no Anota AI. O WhatsApp da loja, (21) 97093-8709, aparece no endereço e no rodapé.

## Como atualizar o cardápio

Preços, sabores e ingredientes ficam em `js/data.js`. Para mudar um preço, edite o número do sabor e do tamanho:

```js
f('calabresa', 'Calabresa', 'Molho de tomate, …', 'calabresa', [47.5, 62.9, 73.4, 83.9]),
//                                                             pequena média família grande
```

Os códigos longos (como `67ad24eb161b45a30ff5ec91`) são os produtos no Anota AI. Só mude se o produto for recriado lá.

As quentinhas ficam em `quentinhas`, no mesmo arquivo, com as fotos em `img/quentinhas/` (480 × 480 px, WebP).

## Horário

O site segue o horário de pedidos do Anota AI. Ele aparece em dois lugares, e os dois precisam mudar juntos:

- `horario` em `js/data.js`, que liga o aviso de “Aberto agora” ou “Fechado”;
- a lista em `.hours` no `index.html` (e o `openingHoursSpecification` no topo do mesmo arquivo, que o Google lê).

## Mapa

O mapa do endereço é o do próprio Google Maps, incorporado com um `<iframe>` no `index.html`. Não precisa de chave, conta no Google Cloud nem cartão. No mapa, o cliente vê a ficha da loja e o botão **Como chegar**, que abre a rota no Google Maps.

Para trocar o mapa (por exemplo, se a loja mudar de endereço): abra a loja no [Google Maps](https://www.google.com/maps), clique em **Compartilhar > Incorporar um mapa**, copie o endereço que está em `src="..."` e troque o `src` do `<iframe>` dentro de `.visit__map` no `index.html`. Troque também os links **Como chegar** e **Abrir no Google Maps** logo acima, se a ficha da loja mudar.

## Chat (Smartsupp)

A chave do chat fica em `js/config.js`, que **não vai para o Git** (está no `.gitignore`). Para criar o seu, copie o modelo e preencha:

```sh
cp js/config.example.js js/config.js
```

Nunca coloque chaves no `js/config.example.js` nem em outro arquivo do projeto: só o `js/config.js` tem chaves. Sem a chave, o chat não aparece e o resto do site funciona normalmente.

### No site publicado (Vercel)

Como o `js/config.js` não está no repositório, a Vercel cria esse arquivo em cada deploy: o `vercel.json` manda rodar `scripts/gerar-config.js`, que copia o site para `public/` e cria ali o `js/config.js` com a chave das variáveis de ambiente do projeto. Só vai ao ar o que está na lista `ARQUIVOS` do script; se o site ganhar um arquivo ou pasta nova na raiz, acrescente-o lá. Para configurar a chave (uma vez só):

1. Na Vercel, abra o projeto e vá em *Settings > Environment Variables*.
2. Crie a variável `SMARTSUPP_KEY` com a chave da Smartsupp, marcando *Production* e *Preview*.
3. Em *Deployments*, abra o último deploy e clique em *Redeploy* (variável nova só vale a partir do próximo deploy).

Se a variável faltar, o deploy avisa no log (“SMARTSUPP_KEY não está definida”) e o site vai ao ar sem o chat.

A chave está no painel da [Smartsupp](https://www.smartsupp.com), em *Settings > Live chat > Installation*: copie só o valor de `_smartsupp.key` e cole em `smartsuppKey`. O botão do chat usa o vermelho do site e, no celular, fica acima da barra de abas. Idioma, mensagens e horário de atendimento são configurados no painel da Smartsupp.

O chat recebe nome, telefone e cookies dos visitantes, por isso o site tem uma política de privacidade (LGPD) em `privacidade.html`. O aviso de dados do formulário do chat já aponta para ela pelo código (`privacyNoticeUrl` em `js/main.js`), em qualquer domínio. Se um serviço novo passar a receber dados dos visitantes, acrescente-o nessa página e atualize a data no topo.

## Estrutura

- `index.html`: a página
- `privacidade.html`: política de privacidade (LGPD)
- `css/style.css`: visual (cores da Itália, tipografia, layout)
- `js/config.example.js`: modelo da chave da Smartsupp (o `js/config.js` com a chave de verdade fica fora do Git)
- `js/data.js`: cardápio, links de pedido e horário
- `vercel.json` e `scripts/gerar-config.js`: deploy na Vercel, que monta o site em `public/` e cria o `js/config.js` com a chave guardada na Vercel
- `js/main.js`: animação da pizza (só no computador), abas, tamanhos, busca, meio a meio e chat
- `img/`: fotos do cardápio (Anota AI da Don’Ana) e do topo ([Unsplash](https://unsplash.com/photos/UpyfnDr6SPk), licença livre para uso comercial)
