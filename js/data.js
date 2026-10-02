// Cardápio extraído do Anota AI da Don'Ana (pedido.anota.ai/loja/don-ana-pizzas-delivery).
// Para atualizar um preço, edite o número aqui. Os ids são os produtos no Anota AI.
window.DONANA = (function () {
  const STORE = 'don-ana-pizzas-delivery';
  const ANOTA = `https://pedido.anota.ai/loja/${STORE}`;
  const IFOOD = 'https://www.ifood.com.br/delivery/marica-rj/donana-pizzaria-delivery-centro/9b472c94-abbf-4922-971d-7c604047b8a2';
  const product = (id, type = 'simple_item') =>
    `https://pedido.anota.ai/product/${id}/0/${STORE}?categoryType=${type}`;

  const sizes = [
    { key: 'p', name: 'Pequena', slices: 4 },
    { key: 'm', name: 'Média', slices: 6 },
    { key: 'f', name: 'Família', slices: 8 },
    { key: 'g', name: 'Grande', slices: 10 },
  ];

  const f = (id, name, desc, img, [p, m, fa, g]) => ({ id, name, desc, img, prices: { p, m, f: fa, g } });

  const pizzas = {
    salgadas: {
      label: 'Pizzas salgadas',
      ids: { p: '67ad24eb161b45a30ff5ec6f', m: '67ad24eb161b45a30ff5ec80', f: '67ad24eb161b45a30ff5ec91', g: '67ad24eb161b45a30ff5eca2' },
      maxFlavors: { p: 1, m: 2, f: 2, g: 2 },
      flavors: [
        f('calabresa', 'Calabresa', 'Molho de tomate, mussarela, calabresa, cebola, azeitona e orégano.', 'calabresa', [47.5, 62.9, 73.4, 83.9]),
        f('marguerita', 'Marguerita', 'Molho de tomate, mussarela, orégano e manjericão.', 'marguerita', [43.89, 57.9, 68.4, 78.9]),
        f('portuguesa', 'Portuguesa', 'Molho de tomate, mussarela, presunto, milho, ervilha, ovos, cebola, pimentão, palmito e orégano.', 'portuguesa', [48.4, 62.9, 71.4, 81.9]),
        f('calabresa-catupiry', 'Calabresa com catupiry', 'Molho de tomate, calabresa, cebola, azeitona, orégano e catupiry.', 'calabresa-catupiry', [47.5, 62.9, 73.4, 83.9]),
        f('quatro-queijos', 'Quatro queijos', 'Molho de tomate, provolone, parmesão, mussarela, catupiry, orégano, azeitona e tomate.', 'quatro-queijos', [44.4, 58.9, 69.4, 79.9]),
        f('rainha', 'Rainha', 'Molho, mussarela, calabresa, lombo canadense, bacon fatiado, azeitona preta e orégano.', 'rainha', [49.4, 65.9, 74.4, 85.9]),
        f('frango', 'Frango', 'Molho de tomate, mussarela, frango desfiado, cebola, tomate, azeitona, orégano e catupiry.', 'frango', [44.4, 62.9, 71.4, 81.9]),
        f('brocolis-alho', 'Brócolis com alho frito', 'Molho, brócolis, alho, azeitona e orégano.', 'brocolis-alho', [45.4, 61.9, 72.4, 82.9]),
        f('mussarela', 'Mussarela', 'Molho de tomate, mussarela, orégano, azeitona e tomate.', 'mussarela', [44.4, 59.9, 71.4, 81.9]),
        f('presunto-queijo', 'Presunto e queijo', 'Molho de tomate, mussarela, presunto, orégano, tomate e cebola.', 'presunto-queijo', [44.4, 57.9, 68.4, 78.9]),
        f('peito-de-peru', 'Peito de peru', 'Molho de tomate, mussarela, peito de peru, orégano e tomate.', 'peito-de-peru', [48.5, 61.9, 72.4, 82.9]),
        f('brocolis-bacon', 'Brócolis com bacon', 'Molho, mussarela, brócolis, azeitona e orégano.', 'brocolis-bacon', [45.4, 61.9, 72.4, 82.9]),
        f('alho', 'Alho', 'Molho de tomate, mussarela, azeitona, orégano, alho torrado e tomate.', 'alho', [43.89, 57.9, 68.4, 78.9]),
        f('lombo', 'Lombo apresuntado', 'Molho, mussarela, presunto, lombo canadense, queijo prato, cheddar, cebola, azeitona verde e orégano.', 'lombo', [49.4, 65.9, 74.4, 84.9]),
      ],
    },
    doces: {
      label: 'Pizzas doces',
      ids: { p: '67ad24eb161b45a30ff5ecab', m: '67ad24eb161b45a30ff5ecb4', f: '67ad24eb161b45a30ff5ecbd', g: '67ad24eb161b45a30ff5ecc6' },
      maxFlavors: { p: 1, m: 2, f: 3, g: 4 },
      flavors: [
        f('chocolate-morango', 'Chocolate com morango', 'Chocolate, morangos e granulado.', 'chocolate-morango', [51.4, 61.9, 72.4, 82.9]),
        f('brigadeiro', 'Brigadeiro', 'Chocolate e granulado.', 'brigadeiro', [47.5, 55.9, 73.4, 78.9]),
        f('nutella', 'Nutella', 'Creme de leite e Nutella.', 'nutella', [47.5, 55.9, 73.4, 78.9]),
        f('confete', 'Confete', 'Creme de leite, chocolate e confetes.', 'confete', [47.5, 55.9, 73.4, 78.9]),
        f('banana-canela', 'Banana com canela', 'Creme de leite, banana, doce de leite e canela.', 'banana-canela', [47.5, 55.9, 73.4, 78.9]),
        f('banana-nevada', 'Banana nevada', 'Creme de leite, banana e chocolate branco.', 'banana-nevada', [51.4, 61.9, 72.4, 82.9]),
      ],
    },
  };

  const bordas = {
    flavors: ['catupiry', 'cheddar', 'requeijão', 'chocolate', 'doce de leite'],
    prices: { p: 15, m: 18, f: 20, g: 25 },
    ids: { p: '67ad24eb161b45a30ff5ecd0', m: '67ad24eb161b45a30ff5ecd9', f: '67ad24eb161b45a30ff5ece2', g: '67ad24eb161b45a30ff5eceb' },
  };

  // Pizzas de dois sabores já montadas, vendidas por centímetro.
  const c = (name, desc, img, sizes) => ({ name, desc, img, sizes: sizes.map(([cm, price, id]) => ({ cm, price, url: product(id) })) });
  const combos = [
    c('Quatro queijos e marguerita', 'Mussarela, gorgonzola, queijo prato, provolone, tomate e manjericão.', 'quatro-queijos-marguerita',
      [[30, 58.9, '69643c787d1fc1f31f955f45'], [35, 69.4, '695c1e7661bb0d6bfc333a09'], [40, 79.9, '695c1e98cb28d17071836494']]),
    c('Calabresa e portuguesa', 'Molho, mussarela, calabresa, cebola, presunto, tomate, pimentões, palmito e ovos.', 'calabresa-portuguesa',
      [[30, 62.9, '69a4ba8f669a47fd0e762df4'], [35, 71.4, '69a4bad94d5172cc7ba3bb92'], [40, 81.9, '69a4bb4d7993c6fe88b22023']]),
    c('Marguerita e calabresa', 'Molho, mussarela, tomate, manjericão, calabresa, cebola e orégano.', 'marguerita-calabresa',
      [[30, 62.9, '6975601ca96eeb581f413942'], [35, 73.4, '695c1b76bc85a5810b752433'], [40, 83.9, '695c1bf92fc8fd0ef3e864e9']]),
    c('Chocolate com morango e banana com doce de leite', 'Creme de leite, Nutella, morango, banana, canela e doce de leite.', 'chocolate-banana',
      [[35, 72.4, '695ed23b1e83ac8ba00bc7da'], [40, 82.9, '695ed295fda2b03b323496a1']]),
    c('Calabresa e quatro queijos', 'Molho, calabresa, cebola, mussarela, queijo prato, gorgonzola, provolone e tomate-cereja.', 'calabresa-quatro-queijos',
      [[35, 71.4, '695ed13bb9168dfe8955fc04'], [40, 83.9, '695ed1b21e83ac8ba00ba53f']]),
    c('Quatro queijos e frango com catupiry', 'Mussarela, queijo prato, gorgonzola, provolone, frango e catupiry.', 'quatro-queijos-frango',
      [[30, 62.9, '69643df12d9785b7ed387ae6'], [35, 71.4, '696442120e9e3b9b0b22b305'], [40, 81.9, '69644477b5d6e26ceba5f36b']]),
    c('Calabresa e frango com catupiry', 'Molho, mussarela, calabresa, cebola, frango e catupiry.', 'calabresa-frango',
      [[30, 62.9, '69ae0e23122e3ea08be118ac'], [35, 73.4, '695ed32d1e83ac8ba00c0f24'], [40, 81.9, '695ed378b9168dfe895680f6']]),
    c('Frango com catupiry e mussarela', 'Molho, frango, catupiry, mussarela, tomate-cereja, azeitona e orégano.', 'frango-mussarela',
      [[30, 62.9, '69644955efa53ddeb01b994d'], [35, 71.4, '69644aa32d9785b7ed3a7a3f'], [40, 81.9, '69644b3b2d9785b7ed3a932d']]),
    c('Mussarela e portuguesa', 'Mussarela, milho, ervilha, tomate-cereja, cebola, pimentões, palmito, azeitona e ovo.', 'mussarela-portuguesa',
      [[30, 62.9, '696af14186bc90703e4f74b6'], [35, 71.4, '696af19838cea36f2c905e6a'], [40, 81.9, '696af1d69837286260198dfc']]),
    c('Portuguesa e quatro queijos', 'Molho, mussarela, presunto, ovo, ervilha, milho, pimentões e queijos.', 'portuguesa-quatro-queijos',
      [[35, 71.4, '698904e34b2f8266edcc88d5'], [40, 81.9, '69d183b4a7d6a4f9e03d473f']]),
    c('Marguerita e alho torrado', 'Molho, mussarela, alho torrado, tomate-cereja e manjericão.', 'marguerita-alho',
      [[null, 68.4, '6a1387d8226abcc8e7f57fed']]),
  ];

  const i = (name, desc, price, id, img) => ({ name, desc, price, url: product(id), img });

  const massas = {
    note: 'Massa à escolha: penne, parafuso, caracol, gravatinha ou fettuccine, com molho vermelho ou branco.',
    items: [
      i('Bolonhesa', 'Carne moída, azeitona verde, requeijão, tomate-cereja, bacon, orégano, mussarela, salsinha e cheiro-verde.', 25.9, '68f1308800e572b251ff63aa'),
      i('Três queijos', 'Mussarela, queijo prato, provolone, catupiry, orégano, alho torrado, tomate-cereja, salsinha e cheiro-verde.', 26.9, '68f13223048649f79cd96698'),
      i('Frango com bacon', 'Frango, azeitona preta, requeijão, tomate-cereja, orégano, alho torrado, mussarela, salsinha e cheiro-verde.', 24.9, '68f133bc66ae77285654cb05'),
      i('Calabresa', 'Calabresa, bacon, mussarela, azeitona, requeijão, alho torrado, ovo de codorna, salsinha e cheiro-verde.', 22.9, '68f1378a048649f79cda3a34'),
      i('Brócolis', 'Brócolis, bacon, calabresa, mussarela, azeitona preta, tomate-cereja, alho torrado, pimenta biquinho, cheiro-verde, coentro e requeijão.', 28.9, '68f13a7acf2444b1a49235d5'),
      i('Camarão', 'Camarão, catupiry, parmesão, tomate-cereja, cebola em conserva, pimenta biquinho, mussarela, salsinha e cheiro-verde. Molho vermelho.', 29.9, '68f135ef84fb297bad6e3acf'),
      i('Camarão com brócolis', 'Camarão, azeitona verde, requeijão, tomate-cereja, bacon, orégano, mussarela, pimenta biquinho, manjericão e alho torrado.', 30.9, '69050efc61bc2eb3d334934b'),
      i('Vegano', 'Brócolis, cenoura ralada, vagem, cebolinha em conserva, pimenta biquinho, tomate-cereja, alho torrado, alcaparras, palmito, manjericão e queijo minas.', 32.9, '68f148ec84fb297bad709262'),
    ],
  };

  const petiscos = [
    i('Combo de petisco', 'Linguiça calabresa acebolada, anéis de cebola e batata frita com cheddar e alho frito.', 75, '693888519be08cdd955d711a', 'combo'),
    i('Iscas de frango', 'Tiras de frango empanadas com molho especial, pimenta biquinho e cebola.', 48, '6934caa5424f6d732ff75edb', 'iscas-frango'),
    i('Batata com bacon e cheddar', 'Batata frita com bacon e cheddar.', 45, '69388cbd9f9e57cb924071c1', 'batata'),
    i('Gurjão de peixe', 'Filé de tilápia empanado na farinha panko, com pimenta biquinho e cebolinha.', 55, '690ea95a40d9961b5efc1797', 'gurjao'),
    i('Linguiça acebolada', 'Linguiça, cebola e molho especial.', 38, '690ea9b171e2a5620e637a7f', 'linguica'),
    i('Frango a passarinho', 'Frango frito com alho torrado.', 60, '6934cc392f7c1d59f888f157'),
  ];

  const b = (name, price, id) => ({ name, price, url: product(id) });
  const bebidas = [
    {
      title: 'Refrigerantes e águas',
      items: [
        b('Coca-Cola 2 L', 16, '67ad24ea161b45a30ff5ec4f'),
        b('Coca-Cola Zero 2 L', 16, '67ad24ea161b45a30ff5ec55'),
        b('Coca-Cola 1,5 L', 13.9, '67ad24ea161b45a30ff5ec50'),
        b('Coca-Cola 600 ml', 8.5, '6a7604a8324d6fd694cb5d0f'),
        b('Coca-Cola lata', 8, '67ad24ea161b45a30ff5ec51'),
        b('Guaraná Antarctica 2 L', 14, '67ad24ea161b45a30ff5ec57'),
        b('Guaraná Antarctica 1,5 L', 12, '67ad24ea161b45a30ff5ec56'),
        b('Fanta Laranja 2 L', 14, '67ad24ea161b45a30ff5ec53'),
        b('Fanta Uva 2 L', 14, '67ad24ea161b45a30ff5ec54'),
        b('Fanta Laranja lata', 8, '67ad24ea161b45a30ff5ec52'),
        b('Fanta Uva lata', 8, '67ad24ea161b45a30ff5ec4d'),
        b('Guaravita 290 ml', 3.5, '67ad24eb161b45a30ff5ec59'),
        b('Água saborizada de maracujá', 6.4, '685ac7af7c012f0d4442a431'),
        b('Água mineral com gás', 6, '67ad24ea161b45a30ff5ec4e'),
        b('Água Crystal sem gás 500 ml', 5, '67ad24eb161b45a30ff5ec58'),
        b('Água Crystal sem gás 2 L', 9, '67ad24eb161b45a30ff5ec5a'),
      ],
    },
    {
      title: 'Cervejas e energéticos',
      note: 'Bebidas alcoólicas só para maiores de 18 anos.',
      items: [
        b('Heineken lata 473 ml', 15, '67ad24eb161b45a30ff5ec5e'),
        b('Heineken long neck 330 ml', 12, '67ad24eb161b45a30ff5ec5f'),
        b('Heineken 250 ml', 10, '6882900e0b2e7b860d0a981a'),
        b('Spaten lata 473 ml', 9, '67ad24eb161b45a30ff5ec5b'),
        b('Brahma lata 473 ml', 9, '67ad24eb161b45a30ff5ec60'),
        b('Budweiser lata 473 ml', 9, '68828ccae8fb8a0e9f9ef674'),
        b('Antarctica lata 473 ml', 9, '67ad24eb161b45a30ff5ec5d'),
        b('Antarctica lata 350 ml', 7, '67ad24eb161b45a30ff5ec5c'),
        b('Império Gold 473 ml', 9, '68828835019cb6ead5b335d6'),
        b('Império Lager garrafa', 8, '68828ea6de1d7f9876ac2f38'),
        b('Shol 550 ml', 11, '68828e040b2e7b860d0a55a5'),
        b('Smirnoff Ice', 10, '69e43858c510b1880ebb6f6b'),
        b('Red Bull', 15, '6883d118c23eac113b2b6f3d'),
        b('Monster', 12, '6883ce4e8edeb3247c3d6130'),
      ],
    },
  ];

  const combo = {
    price: 100,
    url: product('697526701309f567f21b9caf'),
  };

  return { ANOTA, IFOOD, product, sizes, pizzas, bordas, combos, massas, petiscos, bebidas, combo };
})();
