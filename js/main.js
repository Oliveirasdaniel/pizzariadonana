(function () {
  const D = window.DONANA;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const brl = (v) => money.format(v);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sizeOf = (key) => D.sizes.find((s) => s.key === key);

  const state = { size: 'f', tab: 'salgadas', query: { salgadas: '', doces: '' } };

  /* ---------- Aberto ou fechado (horário de Maricá) ---------- */

  function openStatus() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', hour12: false,
    }).formatToParts(new Date());
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.find((p) => p.type === 'weekday').value);
    const hour = Number(parts.find((p) => p.type === 'hour').value) % 24;
    const openDay = [4, 5, 6, 0].includes(day);
    if (openDay && hour >= 17) return { open: true, text: 'Aberto agora, até meia-noite' };
    if (openDay) return { open: false, text: 'Abrimos hoje às 17h' };
    return { open: false, text: `Fechado agora. Abrimos ${day === 3 ? 'amanhã' : 'na quinta'}, às 17h` };
  }
  function paintStatus() {
    const s = openStatus();
    $$('[data-status-text]').forEach((el) => { el.textContent = s.text; });
    $('[data-status]').classList.toggle('is-open', s.open);
  }
  paintStatus();
  setInterval(paintStatus, 60000);
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  $('[data-combo-link]').href = D.combo.url;

  /* ---------- Hero: a pizza conduzida pelo scroll, como um vídeo ---------- */

  const hero = $('.hero');
  const stage = $('.hero__stage');
  const pizza = $('.pizza');
  const body = $('.pizza__body');
  const whole = $('.pizza__whole');
  const copy = $('.hero__copy');
  const line = $('.hero__line');
  const cue = $('.hero__cue');

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  // Centro da massa dentro da imagem (a pizza fica um pouco acima do centro da tábua).
  const CX = 49.83, CY = 48.24;
  const N = 8;
  const SPIN = 240;
  const START = -12;
  const rotAt = (p) => START + SPIN * p;
  const desktop = window.matchMedia('(min-width: 721px)');
  const animated = () => desktop.matches && !reduceMotion.matches;

  // A tábua e as fatias só existem no computador; no celular a pizza é uma imagem parada.
  const slices = [];
  let lifted = -1;
  function buildLayers() {
    if (slices.length) return;
    const board = document.createElement('img');
    board.className = 'pizza__board';
    board.src = 'img/hero-tabua-1320.webp';
    board.alt = '';
    board.decoding = 'async';
    body.insertBefore(board, whole);

    const group = document.createElement('div');
    group.className = 'pizza__slices';
    body.appendChild(group);

    const pt = (a) => `${(CX + 75 * Math.cos(a)).toFixed(3)}% ${(CY + 75 * Math.sin(a)).toFixed(3)}%`;
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((i + 1) / N) * 2 * Math.PI - Math.PI / 2;
      const el = document.createElement('div');
      el.className = 'pizza__slice';
      const img = document.createElement('i');
      img.style.clipPath = `polygon(${CX}% ${CY}%, ${pt(a0)}, ${pt(a1)})`;
      el.appendChild(img);
      slices.push({ el, mid: (a0 + a1) / 2 });
    }

    // A fatia que fica de frente para quem olha é a que levanta da tábua.
    const target = (90 - rotAt(0.55)) * Math.PI / 180;
    let bestD = Infinity;
    slices.forEach((s, i) => {
      const d = Math.abs(Math.atan2(Math.sin(s.mid - target), Math.cos(s.mid - target)));
      if (d < bestD) { bestD = d; lifted = i; }
    });
    slices.forEach((s, i) => {
      if (i === lifted) { s.el.classList.add('is-lifted'); body.appendChild(s.el); }
      else group.appendChild(s.el);
    });
  }

  let W, H, DIA, P0, P1, P2;
  function measure() {
    W = stage.clientWidth;
    H = stage.clientHeight;
    const mobile = W < 720;
    DIA = mobile ? Math.min(W * 1.15, H * 0.6) : Math.min(H * 0.98, W * 0.6, 980);
    pizza.style.width = pizza.style.height = `${DIA}px`;
    if (mobile) {
      // Logo abaixo dos botões, cortada pela lateral direita.
      const copyBottom = copy.offsetTop + copy.offsetHeight;
      P0 = P1 = P2 = { x: W * 0.3 + DIA / 2, y: Math.max(copyBottom + 28 + DIA / 2, H - DIA * 0.5), s: 1 };
    } else {
      P0 = { x: W * 0.53 + DIA / 2, y: H * 0.54, s: 1 };
      P1 = { x: W * 0.71, y: H * 0.55, s: 0.84 };
      P2 = { x: W * 0.7, y: H * 0.52, s: 0.66 };
    }
  }

  function render(p) {
    const travel = ease(seg(p, 0, 0.42));
    const settle = ease(seg(p, 0.7, 0.96));
    const x = lerp(lerp(P0.x, P1.x, travel), P2.x, settle);
    const y = lerp(lerp(P0.y, P1.y, travel), P2.y, settle);
    const s = lerp(lerp(P0.s, P1.s, travel), P2.s, settle);
    const tilt = 56 * ease(seg(p, 0.06, 0.42)) * (1 - ease(seg(p, 0.68, 0.92)));
    const open = ease(seg(p, 0.4, 0.56)) * (1 - ease(seg(p, 0.7, 0.86)));
    const gap = open * DIA * 0.038;

    pizza.style.transform = `translate3d(${(x - DIA / 2).toFixed(2)}px, ${(y - DIA / 2).toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
    body.style.transform = `rotateX(${tilt.toFixed(2)}deg) rotateZ(${rotAt(p).toFixed(2)}deg)`;

    const split = slices.length > 0 && gap > 0.6;
    pizza.classList.toggle('is-split', split);
    if (split) {
      slices.forEach((sl, i) => {
        const g = i === lifted ? gap * 2.4 : gap;
        const z = i === lifted ? open * DIA * 0.2 : 0;
        sl.el.style.transform = `translate3d(${(Math.cos(sl.mid) * g).toFixed(2)}px, ${(Math.sin(sl.mid) * g).toFixed(2)}px, ${z.toFixed(2)}px)`;
      });
    }

    const out = seg(p, 0.02, 0.2);
    copy.style.opacity = cue.style.opacity = (1 - out).toFixed(3);
    copy.style.translate = `0 ${(-48 * out).toFixed(1)}px`;
    copy.style.visibility = cue.style.visibility = out >= 1 ? 'hidden' : 'visible';

    const lineIn = seg(p, 0.44, 0.54);
    line.style.opacity = (lineIn * (1 - seg(p, 0.84, 0.94))).toFixed(3);
    line.style.translate = `0 ${(28 * (1 - ease(lineIn))).toFixed(1)}px`;
  }

  const progress = () => clamp(-hero.getBoundingClientRect().top / (hero.offsetHeight - stage.offsetHeight || 1));
  let target = 0, current = 0, raf = 0;
  function tick() {
    current += (target - current) * 0.14;
    if (Math.abs(target - current) < 0.0004) current = target;
    render(current);
    raf = current !== target ? requestAnimationFrame(tick) : 0;
  }
  function onHeroScroll() {
    target = progress();
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function setupHero() {
    measure();
    if (!animated()) {
      window.removeEventListener('scroll', onHeroScroll);
      target = current = 0;
      render(0);
      return;
    }
    buildLayers();
    window.addEventListener('scroll', onHeroScroll, { passive: true });
    target = current = progress();
    render(current);
  }
  stage.classList.add('is-live');
  setupHero();
  // A altura do texto muda quando as fontes terminam de carregar.
  if (document.fonts) document.fonts.ready.then(() => { measure(); render(current); });
  reduceMotion.addEventListener('change', setupHero);
  desktop.addEventListener('change', setupHero);
  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { measure(); render(current); }, 80);
  });

  /* ---------- Navegação muda de cor junto com a seção ---------- */

  const nav = $('.nav');
  const menuSec = $('#cardapio');
  const finalSec = $('.final');
  function paintNav() {
    const y = nav.offsetHeight / 2;
    let tone = 'dark';
    if (finalSec.getBoundingClientRect().top <= y) tone = 'red';
    else if (menuSec.getBoundingClientRect().top <= y) tone = 'light';
    if (nav.dataset.tone !== tone) nav.dataset.tone = tone;

    // Aba ativa do celular: a última seção cujo topo já passou de 40% da tela.
    const mark = window.innerHeight * 0.4;
    let active = 'inicio';
    tabbarLinks.forEach((a) => {
      const sec = document.getElementById(a.dataset.tabbar);
      if (sec && sec.getBoundingClientRect().top <= mark) active = a.dataset.tabbar;
    });
    tabbarLinks.forEach((a) => {
      const on = a.dataset.tabbar === active;
      if ((a.getAttribute('aria-current') === 'true') !== on) a.setAttribute('aria-current', on ? 'true' : 'false');
    });
  }
  const tabbarLinks = $$('[data-tabbar]');
  window.addEventListener('scroll', paintNav, { passive: true });
  paintNav();

  /* ---------- Cardápio ---------- */

  const TABS = [
    { id: 'salgadas', label: 'Salgadas', count: D.pizzas.salgadas.flavors.length },
    { id: 'doces', label: 'Doces', count: D.pizzas.doces.flavors.length },
    { id: 'dois-sabores', label: 'Dois sabores', count: D.combos.length },
    { id: 'massas', label: 'Massas', count: D.massas.items.length },
    { id: 'petiscos', label: 'Petiscos', count: D.petiscos.length },
    { id: 'bebidas', label: 'Bebidas' },
  ];
  const tabsEl = $('[data-tabs]');
  const panelsEl = $('[data-panels]');

  tabsEl.innerHTML = TABS.map((t) => `
    <button class="tab" role="tab" id="tab-${t.id}" aria-controls="panel-${t.id}" aria-selected="${t.id === state.tab}" tabindex="${t.id === state.tab ? 0 : -1}" data-tab="${t.id}">
      ${t.label}${t.count ? `<span class="tab__count">${t.count}</span>` : ''}
    </button>`).join('');

  const sliceIcon = (n) => {
    const r = 18, c = 20;
    const cuts = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * 2 * Math.PI - Math.PI / 2;
      return `M${c} ${c}L${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`;
    }).join('');
    return `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="${c}" cy="${c}" r="${r}"/><path d="${cuts}"/></svg>`;
  };

  const searchIcon = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  function pizzaPanel(kind) {
    const k = D.pizzas[kind];
    return `
      <div class="toolbar">
        <fieldset class="sizepick">
          <legend>Tamanho</legend>
          <div class="sizepick__opts">
            ${D.sizes.map((s) => `
              <input class="sr-only" type="radio" name="size-${kind}" id="size-${kind}-${s.key}" value="${s.key}" ${s.key === state.size ? 'checked' : ''} data-size>
              <label class="size" for="size-${kind}-${s.key}">
                ${sliceIcon(s.slices)}
                <span class="size__name">${s.name}</span>
                <span class="size__slices">${s.slices} fatias</span>
              </label>`).join('')}
          </div>
        </fieldset>
        <div class="search">
          <label class="sr-only" for="q-${kind}">Buscar sabor ou ingrediente</label>
          ${searchIcon}
          <input type="search" id="q-${kind}" placeholder="Buscar sabor ou ingrediente" autocomplete="off" data-search="${kind}">
        </div>
      </div>
      <p class="toolbar__note" data-note="${kind}" aria-live="polite"></p>
      <ul class="grid" data-grid="${kind}">
        ${k.flavors.map((fl) => `
          <li data-flavor="${fl.id}" data-text="${esc(norm(fl.name + ' ' + fl.desc))}">
            <button class="flavor" type="button" aria-haspopup="dialog" data-open="${kind}:${fl.id}">
              <span class="flavor__img"><img src="img/sabores/${fl.img}.webp" alt="" width="480" height="480" loading="lazy" decoding="async"></span>
              <span class="flavor__name">${fl.name}</span>
              <span class="flavor__desc">${fl.desc}</span>
              <span class="flavor__price" data-price="${kind}:${fl.id}"></span>
            </button>
          </li>`).join('')}
      </ul>
      <p class="empty" data-empty="${kind}" hidden></p>`;
  }

  function combosPanel() {
    return `
      <p class="panel__intro">Pizzas de dois sabores já montadas, vendidas por tamanho em centímetros. Toque no tamanho para pedir direto no Anota AI.</p>
      <ul class="grid">
        ${D.combos.map((c) => `
          <li class="card">
            <span class="flavor__img"><img src="img/combos/${c.img}.webp" alt="" width="480" height="480" loading="lazy" decoding="async"></span>
            <h3 class="flavor__name">${c.name}</h3>
            <p class="flavor__desc">${c.desc}</p>
            <div class="chips">
              ${c.sizes.map((s) => `
                <a class="chip" href="${s.url}" target="_blank" rel="noopener" aria-label="Pedir ${esc(c.name)}${s.cm ? `, ${s.cm} centímetros` : ''}, ${brl(s.price)}">
                  <span>${s.cm ? `${s.cm} cm` : 'Pedir'}</span><b>${brl(s.price)}</b>
                </a>`).join('')}
            </div>
          </li>`).join('')}
      </ul>
      <p class="more"><a href="${D.ANOTA}" target="_blank" rel="noopener">Ver todas as combinações no Anota AI</a></p>`;
  }

  const row = (it, opts = {}) => `
    <li>
      <a class="row${opts.compact ? ' row--compact' : ''}${opts.thumb ? ' row--thumb' : ''}" href="${it.url}" target="_blank" rel="noopener">
        ${opts.thumb ? (it.img
          ? `<span class="row__thumb"><img src="img/petiscos/${it.img}.webp" alt="" width="480" height="480" loading="lazy" decoding="async"></span>`
          : '<span class="row__thumb row__thumb--empty" aria-hidden="true"></span>') : ''}
        <span class="row__name">${it.name}</span>
        <span class="row__lead" aria-hidden="true"></span>
        <span class="row__price">${brl(it.price)}</span>
        ${it.desc ? `<span class="row__desc">${it.desc}</span>` : ''}
      </a>
    </li>`;

  function massasPanel() {
    const half = Math.ceil(D.massas.items.length / 2);
    return `
      <p class="panel__intro">${D.massas.note}</p>
      <div class="cols">
        <ul class="list">${D.massas.items.slice(0, half).map((it) => row(it)).join('')}</ul>
        <ul class="list">${D.massas.items.slice(half).map((it) => row(it)).join('')}</ul>
      </div>`;
  }

  function petiscosPanel() {
    const half = Math.ceil(D.petiscos.length / 2);
    return `
      <p class="panel__intro">Porções para dividir na mesa. Toque em um petisco para pedir.</p>
      <div class="cols">
        <ul class="list">${D.petiscos.slice(0, half).map((it) => row(it, { thumb: true })).join('')}</ul>
        <ul class="list">${D.petiscos.slice(half).map((it) => row(it, { thumb: true })).join('')}</ul>
      </div>`;
  }

  function bebidasPanel() {
    return `
      <div class="cols">
        ${D.bebidas.map((g) => `
          <div>
            <h3 class="cols__title">${g.title}</h3>
            ${g.note ? `<p class="cols__note">${g.note}</p>` : ''}
            <ul class="list">${g.items.map((it) => row(it, { compact: true })).join('')}</ul>
          </div>`).join('')}
      </div>`;
  }

  const builders = {
    salgadas: () => pizzaPanel('salgadas'),
    doces: () => pizzaPanel('doces'),
    'dois-sabores': combosPanel,
    massas: massasPanel,
    petiscos: petiscosPanel,
    bebidas: bebidasPanel,
  };
  panelsEl.innerHTML = TABS.map((t) => `
    <div class="panel" role="tabpanel" id="panel-${t.id}" aria-labelledby="tab-${t.id}" tabindex="0" ${t.id === state.tab ? '' : 'hidden'}>
      ${builders[t.id]()}
    </div>`).join('');

  function selectTab(id, focus) {
    state.tab = id;
    $$('.tab', tabsEl).forEach((b) => {
      const on = b.dataset.tab === id;
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
      if (on) b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    $$('.panel', panelsEl).forEach((p) => { p.hidden = p.id !== `panel-${id}`; });
    // Se a barra já está grudada no topo, volta para o começo da categoria.
    const stuck = tabsEl.getBoundingClientRect().top <= nav.offsetHeight + 1;
    if (stuck) {
      const top = panelsEl.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - tabsEl.offsetHeight;
      window.scrollTo({ top, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  }
  tabsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (b) selectTab(b.dataset.tab);
  });
  tabsEl.addEventListener('keydown', (e) => {
    const i = TABS.findIndex((t) => t.id === state.tab);
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % TABS.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + TABS.length) % TABS.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = TABS.length - 1;
    if (n !== null) { e.preventDefault(); selectTab(TABS[n].id, true); }
  });

  function noteFor(kind) {
    const k = D.pizzas[kind];
    const s = sizeOf(state.size);
    const max = k.maxFlavors[state.size];
    const flavors = max > 1
      ? `Na ${s.name}, você pode pedir <strong>até ${max} sabores</strong>.`
      : `A ${s.name} é de <strong>um sabor só</strong>.`;
    const borda = kind === 'salgadas'
      ? ` Borda recheada de ${D.bordas.flavors.slice(0, -1).join(', ')} ou ${D.bordas.flavors.at(-1)} sai por mais ${brl(D.bordas.prices[state.size])}.`
      : '';
    return flavors + borda;
  }

  function paintPrices() {
    const s = sizeOf(state.size);
    ['salgadas', 'doces'].forEach((kind) => {
      D.pizzas[kind].flavors.forEach((fl) => {
        const el = $(`[data-price="${kind}:${fl.id}"]`);
        el.innerHTML = `<span class="sr-only">${s.name}: </span>${brl(fl.prices[state.size])}`;
      });
      $(`[data-note="${kind}"]`).innerHTML = noteFor(kind);
    });
    $$('[data-size]').forEach((r) => { r.checked = r.value === state.size; });
  }
  paintPrices();

  panelsEl.addEventListener('change', (e) => {
    if (e.target.matches('[data-size]')) { state.size = e.target.value; paintPrices(); }
  });

  panelsEl.addEventListener('input', (e) => {
    const kind = e.target.dataset.search;
    if (!kind) return;
    const raw = e.target.value.trim();
    const q = norm(raw);
    let shown = 0;
    $$(`[data-grid="${kind}"] > li`).forEach((li) => {
      const hit = !q || li.dataset.text.includes(q);
      li.hidden = !hit;
      if (hit) shown++;
    });
    const empty = $(`[data-empty="${kind}"]`);
    empty.hidden = shown > 0;
    if (!shown) empty.textContent = `Nenhum sabor com “${raw}”. Tente outro ingrediente, como catupiry, bacon ou chocolate.`;
  });

  /* ---------- Ficha da pizza, com meio a meio ---------- */

  const sheet = $('#sheet');
  const disc = $('[data-disc]');
  const discA = $('.disc__a', disc);
  const discB = $('.disc__b', disc);
  const sheetState = { kind: null, flavor: null, half: null };

  function paintSheet() {
    const { kind, flavor, half } = sheetState;
    const k = D.pizzas[kind];
    const size = sizeOf(state.size);
    const max = k.maxFlavors[state.size];
    if (max < 2) sheetState.half = null;
    const other = sheetState.half && k.flavors.find((f) => f.id === sheetState.half);

    $('#sheet-title').textContent = other ? `${flavor.name} e ${other.name.toLowerCase()}` : flavor.name;
    $('[data-sheet-desc]').innerHTML = other
      ? `<b>${flavor.name}:</b> ${flavor.desc}<br><b>${other.name}:</b> ${other.desc}`
      : flavor.desc;

    discA.src = `img/sabores/${flavor.img}.webp`;
    if (other) discB.src = `img/sabores/${other.img}.webp`;
    disc.classList.toggle('is-half', !!other);

    $$('.opt input', sheet).forEach((r) => { r.checked = r.value === state.size; });
    // No meio a meio o Anota AI calcula o valor final, que fica entre o preço dos dois sabores.
    $$('[data-opt-price]', sheet).forEach((el) => {
      const key = el.dataset.optPrice;
      const a = flavor.prices[key];
      const b = other ? other.prices[key] : a;
      el.textContent = a === b ? brl(a) : `${brl(Math.min(a, b))} a ${brl(Math.max(a, b))}`;
    });

    const halfBox = $('[data-half]');
    halfBox.hidden = max < 2;
    $$('.half__opt', halfBox).forEach((b) => {
      b.setAttribute('aria-pressed', String((b.dataset.half || null) === sheetState.half));
    });

    const names = other ? `${flavor.name} e ${other.name}` : flavor.name;
    $('[data-sheet-hint]').innerHTML =
      `No Anota AI, a pizza <strong>${size.name}</strong> abre direto. Marque <strong>${names}</strong> na lista de sabores${other ? ' e o app calcula o valor do meio a meio' : ''}.`;
    $('[data-sheet-order]').href = D.product(k.ids[state.size], 'pizza');
  }

  function openSheet(kind, id, trigger) {
    const k = D.pizzas[kind];
    const flavor = k.flavors.find((f) => f.id === id);
    Object.assign(sheetState, { kind, flavor, half: null, trigger });

    const sizesBox = $('[data-sheet-sizes]');
    sizesBox.innerHTML = '<legend>Tamanho</legend>' + D.sizes.map((s) => `
      <label class="opt">
        <input type="radio" name="sheet-size" value="${s.key}">
        <span class="opt__name">${s.name}<small>${s.slices} fatias</small></span>
        <span class="opt__price" data-opt-price="${s.key}"></span>
      </label>`).join('');

    $('[data-half-list]').innerHTML = [
      `<button type="button" class="half__opt" data-half=""><img src="img/sabores/${flavor.img}.webp" alt="" width="62" height="62">Inteira</button>`,
      ...k.flavors.filter((f) => f.id !== id).map((f) => `
        <button type="button" class="half__opt" data-half="${f.id}"><img src="img/sabores/${f.img}.webp" alt="" width="62" height="62" loading="lazy">${f.name}</button>`),
    ].join('');

    paintSheet();
    sheet.showModal();
    $('[data-half-list]').scrollLeft = 0;
  }

  panelsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (!b) return;
    const [kind, id] = b.dataset.open.split(':');
    openSheet(kind, id, b);
  });

  sheet.addEventListener('change', (e) => {
    if (e.target.name === 'sheet-size') {
      state.size = e.target.value;
      paintSheet();
      paintPrices();
    }
  });
  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) { sheet.close(); return; }
    const h = e.target.closest('.half__opt');
    if (h) {
      sheetState.half = h.dataset.half || null;
      paintSheet();
    }
  });
  sheet.addEventListener('close', () => {
    if (sheetState.trigger && document.contains(sheetState.trigger)) sheetState.trigger.focus({ preventScroll: true });
  });
})();
