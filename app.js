/* Bioferia · La medida justa. Prototipo local de la propuesta de tesis. */
(() => {
  'use strict';
  const KEY = 'bioferia-medida-justa-v2';
  const META = 120; // Valor de demostración; el PDF no define gramos por pieza.
  const BP_POR_GRAMO = 5; // Equivalencia de demostración; no es una regla real.
  const MATERIALES = [
    { id: 'tapitas', nombre: 'Tapitas', icono: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="7"/><path d="M16 4v5M16 23v5M4 16h5M23 16h5"/></svg>' },
    { id: 'botellas', nombre: 'Botellas', icono: '<svg viewBox="0 0 32 32"><path d="M13 4h6v5l3 4v14a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V13l3-4zM12 15h8M12 23h8"/></svg>' },
    { id: 'envases', nombre: 'Envases', icono: '<svg viewBox="0 0 32 32"><path d="M8 8h16v20H8zM8 8l4-4h8l4 4M12 15h8M12 20h8"/></svg>' }
  ];
  const COLORES = [
    { id: 'azul', nombre: 'Azul', color: '#003b94' },
    { id: 'rosa', nombre: 'Rosa', color: '#d81987' },
    { id: 'naranja', nombre: 'Naranja', color: '#e9a900' },
    { id: 'varios', nombre: 'Varios', color: 'linear-gradient(135deg,#003b94 0 33%,#d81987 33% 66%,#e9a900 66%)' }
  ];
  const PERSONAJES = [
    { id: 'tapita', nombre: 'Tapita', concepto: 'Lo oculto' },
    { id: 'tironcito', nombre: 'Tironcito', concepto: 'La tensión' },
    { id: 'vueltita', nombre: 'Vueltita', concepto: 'El giro' },
    { id: 'pistin', nombre: 'Pistín', concepto: 'La pista' },
    { id: 'lucecita', nombre: 'Lucecita', concepto: 'La revelación' },
    { id: 'justito', nombre: 'Justito', concepto: 'El equilibrio' }
  ];
  const PASOS = [
    { id: 'traer', nombre: 'Traer' }, { id: 'medir', nombre: 'Medir' },
    { id: 'intercambiar', nombre: 'Intercambiar' }, { id: 'transformar', nombre: 'Transformar' }
  ];
  const fresh = () => ({
    etapa: 'traer', cantidades: { tapitas: 0, botellas: 0, envases: 0 }, color: 'varios',
    gramos: '', fondo: 600, puntos: 0, movimientos: [], elegido: 'tapita',
    confirmado: false, ultimaPieza: null
  });
  let data = fresh();
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (stored && typeof stored === 'object') {
      data = { ...data, ...stored, cantidades: { ...data.cantidades, ...stored.cantidades } };
    }
  } catch { /* Una sesión nueva sigue funcionando sin almacenamiento. */ }
  if (!['traer', 'medir', 'intercambiar', 'transformar', 'completo'].includes(data.etapa)) data.etapa = 'traer';
  data.fondo = Number(data.fondo);
  if (!Number.isFinite(data.fondo) || data.fondo < 0) data.fondo = 600;
  data.puntos = Number(data.puntos);
  if (!Number.isFinite(data.puntos) || data.puntos < 0) data.puntos = 0;
  if (!Array.isArray(data.movimientos)) data.movimientos = [];
  for (const m of MATERIALES) {
    const n = Number(data.cantidades[m.id]);
    data.cantidades[m.id] = Number.isInteger(n) ? Math.max(0, Math.min(99, n)) : 0;
  }
  if (!COLORES.some(c => c.id === data.color)) data.color = 'varios';
  if (!PERSONAJES.some(p => p.id === data.elegido)) data.elegido = 'tapita';
  if (!/^\d{0,4}$/.test(String(data.gramos))) data.gramos = '';
  let vista = 'inicio';
  let error = '';
  const $ = (selector) => document.querySelector(selector);
  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} };
  const fmt = n => Number(n).toLocaleString('es-AR');
  const totalObjetos = () => MATERIALES.reduce((n, m) => n + Number(data.cantidades[m.id] || 0), 0);
  const diferencia = () => Number(data.gramos) - META;
  const personaje = id => PERSONAJES.find(p => p.id === id) || PERSONAJES[0];
  const img = p => `<img src="hc/serie-${p.id}.png" alt="${p.nombre}: ${p.concepto}">`;
  const boton = (label, action, disabled = false) => `<button class="cta" type="button" data-action="${action}" ${disabled ? 'disabled' : ''}><span>${label}</span><b aria-hidden="true">↗</b></button>`;
  const nota = '<p class="demo-note">Prototipo de tesis: el reconocimiento, el peso, el fondo compartido, los puntos y la impresión son simulados.</p>';

  function inicio() {
    return `<section class="home-hero"><span class="small-tag">UNA EXPERIENCIA PARA HACER</span><h1>LO QUE SOBRA<br><em>CAMBIA DE MANOS.</em></h1><p>Tu plástico puede ser justo lo que otra persona necesita para crear algo nuevo.</p><div class="hero-stitch" aria-hidden="true">〰〰〰〰〰〰〰〰〰</div></section>
      <div class="screen-body home-body"><p class="overline">EN EL ESPACIO DE INTERCAMBIO</p>
      <button class="start-card" type="button" data-view="aporte"><span class="start-num">01<br>→<br>04</span><span><small>EMPEZÁ POR ACÁ</small><strong>TRAÉ LO QUE TE SOBRA</strong><span>Registrá tus plásticos y descubrí tu medida.</span></span><b aria-hidden="true">↗</b></button>
      <div class="pool-teaser"><div><small>FONDO COMÚN · DEMO</small><strong>${fmt(data.fondo)} <span>g</span></strong></div><p>Lo que una persona deja puede completar la pieza de otra.</p><button type="button" data-view="fondo">Ver cómo circula <span aria-hidden="true">↗</span></button></div>
      <h2 class="section-title">DE CASA A UNA NUEVA PIEZA</h2>
      <ol class="steps-list">${PASOS.map((p, i) => `<li><b>0${i + 1}</b><strong>${p.nombre}</strong><span>${['Tapitas, botellas o envases.', 'Buscamos la cantidad justa.', 'Compartís o recibís material.', 'Elegís uno de seis personajes.'][i]}</span></li>`).join('')}</ol>
      <p class="home-foot">BIOFERIA 2027 · UN SISTEMA QUE SE COMPLETA ENTRE PERSONAS</p></div>`;
  }

  function pasos() {
    const current = data.etapa === 'completo' ? 4 : PASOS.findIndex(p => p.id === data.etapa);
    return `<ol class="progress" aria-label="Etapas del recorrido">${PASOS.map((p, i) => `<li class="${i < current ? 'done' : i === current ? 'current' : ''}"><span>0${i + 1}</span><b>${p.nombre}</b></li>`).join('')}</ol>`;
  }
  function traer() {
    return `<p class="step-id">01 / TRAER</p><h2>¿QUÉ TE SOBRA?</h2><p class="step-intro">Empezá en casa: separá los plásticos que ya no necesitás.</p>
      <div class="material-list">${MATERIALES.map(m => `<div class="material-row"><span class="material-icon">${m.icono}</span><strong>${m.nombre}</strong><div class="counter"><button type="button" data-count="${m.id}" data-delta="-1" aria-label="Quitar una ${m.nombre.toLowerCase()}">−</button><output aria-label="Cantidad de ${m.nombre.toLowerCase()}">${Number(data.cantidades[m.id]) || 0}</output><button type="button" data-count="${m.id}" data-delta="1" aria-label="Agregar una ${m.nombre.toLowerCase()}">+</button></div></div>`).join('')}</div>
      <h3 class="field-title">¿DE QUÉ COLOR SON?</h3><div class="color-list">${COLORES.map(c => `<button type="button" data-color="${c.id}" aria-pressed="${data.color === c.id}" class="${data.color === c.id ? 'selected' : ''}"><i style="background:${c.color}"></i>${c.nombre}</button>`).join('')}</div>
      <p class="inline-hint">En esta demo vos registrás los objetos; la propuesta prevé una cámara que reconozca tipo, color y cantidad.</p>${error ? `<p class="error" role="alert">${error}</p>` : ''}${boton('SEGUIR A MEDIR', 'next-traer', !totalObjetos())}`;
  }
  function medir() {
    return `<p class="step-id">02 / MEDIR</p><h2>¿CUÁNTO TRAJISTE?</h2><p class="step-intro">Cada pieza necesita una cantidad precisa. Cargá el peso para comparar tu aporte.</p>
      <label class="scale"><span>TU PLÁSTICO EN LA BALANZA</span><span><input id="peso" type="number" min="1" max="2000" step="1" inputmode="numeric" value="${data.gramos}" aria-label="Peso en gramos" placeholder="0"><b>g</b></span></label>
      <div class="target"><span>MEDIDA DE PRUEBA<br>PARA UNA PIEZA</span><strong>${META} g</strong></div><div class="measure-line" aria-hidden="true"><i></i><b></b></div>
      <p class="inline-hint">${META} g es solo un ejemplo para mostrar cómo funciona el reparto. El peso real dependería de cada pieza.</p>${error ? `<p class="error" role="alert">${error}</p>` : ''}${boton('ENCONTRAR MI PUNTO JUSTO', 'next-medir')}<button class="back" type="button" data-action="back-traer">← Volver a lo que traje</button>`;
  }
  function intercambiar() {
    const d = diferencia();
    const titulo = d > 0 ? 'TE SOBRA.' : d < 0 ? 'TE FALTA.' : 'ES JUSTO.';
    const cantidad = Math.abs(d);
    const mensaje = d > 0 ? `Esos ${fmt(cantidad)} g pueden completar la pieza de alguien más.` : d < 0 ? `El fondo común puede aportar los ${fmt(cantidad)} g que faltan para tu pieza.` : 'Llegaste a la cantidad de prueba para crear una pieza.';
    return `<p class="step-id">03 / INTERCAMBIAR</p><h2>${titulo}</h2><p class="step-intro">${mensaje}</p>
      <div class="balance-visual ${d > 0 ? 'exceso' : d < 0 ? 'falta' : 'justo'}"><span>${d > 0 ? 'MUY MUY' : d < 0 ? 'TAN TAN' : 'PUNTO JUSTO'}</span><strong>${fmt(data.gramos)} <small>/ ${META} g</small></strong><div class="balance-bar"><i style="width:${Math.min(100, Number(data.gramos) / META * 100)}%"></i></div><p>${d > 0 ? `+${fmt(cantidad)} g para compartir` : d < 0 ? `${fmt(cantidad)} g para recibir` : 'La medida está completa'}</p></div>
      <div class="transfer"><div><small>TU APORTE</small><b>${fmt(data.gramos)} g</b></div><span aria-hidden="true">↔</span><div><small>FONDO COMÚN</small><b>${fmt(data.fondo)} g</b></div></div>
      <div class="exchange-note">${d > 0 ? `Si dejás ${fmt(cantidad)} g, sumarías <strong>+${fmt(cantidad * BP_POR_GRAMO)} BioPoints</strong> de prueba.` : d < 0 ? 'Lo que otros dejaron puede completar tu pieza. Nadie queda afuera por traer menos.' : 'Podés seguir directamente a la transformación.'}</div>
      ${d < 0 && data.fondo < cantidad ? `<p class="error" role="alert">El fondo de prueba aún no alcanza para completar esta pieza.</p>` : ''}
      ${boton(d > 0 ? `DEJAR ${fmt(cantidad)} G Y SEGUIR` : d < 0 ? `RECIBIR ${fmt(cantidad)} G Y SEGUIR` : 'SEGUIR A TRANSFORMAR', 'confirmar', d < 0 && data.fondo < cantidad)}<button class="back" type="button" data-action="back-medir">← Corregir el peso</button>`;
  }
  function transformar() {
    return `<p class="step-id">04 / TRANSFORMAR</p><h2>AHORA CAMBIA DE FORMA.</h2><p class="step-intro">En el predio se vería el proceso completo: lo que llegó como descarte sale como una pieza nueva.</p>
      <ol class="process"><li>CLASIFICAR</li><li>TRITURAR</li><li>EXTRUIR</li><li>IMPRIMIR EN 3D</li></ol>
      <h3 class="field-title">ELEGÍ TU PERSONAJE</h3><div class="character-grid">${PERSONAJES.map(p => `<button type="button" data-character="${p.id}" aria-pressed="${data.elegido === p.id}" class="${data.elegido === p.id ? 'selected' : ''}">${img(p)}<strong>${p.nombre}</strong><small>${p.concepto}</small></button>`).join('')}</div>
      <p class="inline-hint">El color final depende de los plásticos reunidos: ninguna pieza saldría igual a otra.</p>${boton(`VER A ${personaje(data.elegido).nombre.toUpperCase()}`, 'completar')}`;
  }
  function completo() {
    const p = personaje(data.elegido); const d = diferencia();
    return `<p class="step-id">RECORRIDO COMPLETO</p><h2>LO QUE SOBRÓ<br>ENCONTRÓ SU LUGAR.</h2><div class="piece-result">${img(p)}<div><small>${p.concepto.toUpperCase()}</small><strong>${p.nombre}</strong><span>Un personaje posible gracias al intercambio.</span></div></div>
      <div class="receipt"><div><span>TRAJISTE</span><strong>${fmt(data.gramos)} g</strong></div><div><span>${d > 0 ? 'COMPARTISTE' : d < 0 ? 'RECIBISTE' : 'MEDIDA JUSTA'}</span><strong>${fmt(Math.abs(d))} g</strong></div>${d > 0 ? `<div><span>SUMASTE · DEMO</span><strong>+${fmt(d * BP_POR_GRAMO)} BP</strong></div>` : ''}</div>
      <p class="inline-hint">La pieza y los puntos son una simulación. En la propuesta, el plástico circularía entre visitantes y se imprimiría en el lugar.</p>${boton('HACER OTRO INTERCAMBIO', 'reiniciar')}`;
  }
  const ETAPAS = { traer, medir, intercambiar, transformar, completo };
  function aporte() {
    return `<section class="flow-top"><span class="small-tag">TU RECORRIDO</span><h1>LA MEDIDA<br>JUSTA.</h1><p>Ni muy muy, ni tan tan: lo que sobra circula hasta que alcanza.</p></section><div class="screen-body flow-body">${pasos()}<section class="flow-card">${ETAPAS[data.etapa]()}</section>${nota}</div>`;
  }
  function fondo() {
    return `<section class="plain-head"><span class="small-tag">03 / INTERCAMBIAR</span><h1>NADIE TRAE<br>TODO SOLO.</h1><p>El material circula para que cada persona llegue a su punto justo.</p></section><div class="screen-body">
      <div class="pool-large"><small>DISPONIBLE EN EL FONDO · DEMO</small><strong>${fmt(data.fondo)} <span>g</span></strong><p>Un saldo compartido de prueba en este teléfono.</p></div>
      <div class="pair"><div><b>MUY MUY</b><strong>Si te sobra</strong><p>El excedente queda disponible y suma BioPoints.</p></div><div><b>TAN TAN</b><strong>Si te falta</strong><p>Recibís lo necesario para completar tu pieza.</p></div></div>
      <div class="points-strip"><span>TUS BIOPOINTS · DEMO</span><strong>${fmt(data.puntos)} BP</strong></div>
      <h2 class="section-title">MOVIMIENTOS EN ESTE CELULAR</h2>${data.movimientos.length ? `<ul class="movement-list">${data.movimientos.slice(0, 5).map(m => `<li><span>${m.tipo === 'dejo' ? '↗' : '↙'}</span><div><strong>${m.tipo === 'dejo' ? 'Compartiste plástico' : 'Completaste tu pieza'}</strong><small>${m.fecha}</small></div><b>${m.tipo === 'dejo' ? '+' : '−'}${fmt(m.gramos)} g</b></li>`).join('')}</ul>` : '<p class="empty-message">Todavía no hiciste un intercambio. Empezá con lo que tenés en casa.</p>'}
      ${boton('REGISTRAR UN APORTE', 'ir-aporte')}${nota}</div>`;
  }
  function pieza() {
    const p = data.ultimaPieza ? personaje(data.ultimaPieza.id) : null;
    return `<section class="plain-head purple"><span class="small-tag">04 / TRANSFORMAR</span><h1>LO QUE ERA<br>DESCARTE, VIVE.</h1><p>Seis personajes muestran lo que podemos crear cuando el material encuentra su lugar.</p></section><div class="screen-body">
      ${p ? `<div class="my-piece"><span>TU ÚLTIMA PIEZA · DEMO</span>${img(p)}<strong>${p.nombre}</strong><small>${p.concepto}</small></div>` : `<div class="empty-piece"><span>✳</span><strong>TU PIEZA TODAVÍA NO EXISTE.</strong><p>Completá el intercambio y elegí el personaje que podría salir de tus plásticos.</p><button type="button" data-view="aporte">Empezar mi recorrido ↗</button></div>`}
      <h2 class="section-title">LOS SEIS PERSONAJES</h2><div class="gallery">${PERSONAJES.map(x => `<div>${img(x)}<strong>${x.nombre}</strong><small>${x.concepto}</small></div>`).join('')}</div>
      <div class="tech-note"><b>DEL PLÁSTICO A UNA PIEZA</b><p>Cámara con IA para reconocer, app para equilibrar, triturado y extrusión para hacer filamento, e impresión 3D a la vista de todos.</p></div>${nota}</div>`;
  }

  const vistas = { inicio, aporte, fondo, pieza };
  function render(scroll = true) {
    $('#viewport').innerHTML = vistas[vista]();
    $('#viewport').dataset.view = vista;
    document.querySelectorAll('.bottom-nav button').forEach(b => {
      const active = b.dataset.view === vista;
      b.classList.toggle('active', active);
      if (active) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    if (scroll) $('#viewport').scrollTop = 0;
  }
  function navigate(next) { if (!(next in vistas)) return; vista = next; error = ''; render(); }
  document.addEventListener('click', e => {
    const viewButton = e.target.closest('button[data-view]');
    if (viewButton) { navigate(viewButton.dataset.view); return; }
    const countButton = e.target.closest('[data-count]');
    if (countButton) {
      const id = countButton.dataset.count;
      if (!(id in data.cantidades)) return;
      data.cantidades[id] = Math.max(0, Math.min(99, Number(data.cantidades[id]) + Number(countButton.dataset.delta)));
      guardar(); render(false); return;
    }
    const colorButton = e.target.closest('[data-color]');
    if (colorButton) { data.color = colorButton.dataset.color; guardar(); render(false); return; }
    const characterButton = e.target.closest('[data-character]');
    if (characterButton) { data.elegido = characterButton.dataset.character; guardar(); render(false); return; }
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    error = '';
    switch (action) {
      case 'ir-aporte': navigate('aporte'); return;
      case 'next-traer':
        if (!totalObjetos()) { error = 'Agregá al menos un objeto para seguir.'; break; }
        data.etapa = 'medir'; break;
      case 'next-medir': {
        const value = Number($('#peso')?.value);
        if (!Number.isInteger(value) || value < 1 || value > 2000) { error = 'Ingresá un peso entero entre 1 y 2.000 gramos.'; break; }
        data.gramos = value; data.etapa = 'intercambiar'; break;
      }
      case 'back-traer': data.etapa = 'traer'; break;
      case 'back-medir': data.etapa = 'medir'; break;
      case 'confirmar': {
        if (data.etapa !== 'intercambiar' || data.confirmado) return;
        const d = diferencia();
        if (d < 0 && data.fondo < -d) { error = 'El fondo de prueba aún no alcanza.'; break; }
        data.fondo += d;
        if (d !== 0) data.movimientos.unshift({ tipo: d > 0 ? 'dejo' : 'recibo', gramos: Math.abs(d), fecha: new Date().toLocaleDateString('es-AR') });
        if (d > 0) data.puntos += d * BP_POR_GRAMO;
        data.confirmado = true; data.etapa = 'transformar'; break;
      }
      case 'completar':
        if (data.etapa !== 'transformar') return;
        data.ultimaPieza = { id: data.elegido, gramos: Number(data.gramos) };
        data.etapa = 'completo'; break;
      case 'reiniciar': {
        const { fondo, puntos, movimientos, ultimaPieza } = data;
        data = { ...fresh(), fondo, puntos, movimientos, ultimaPieza };
        break;
      }
      default: return;
    }
    guardar(); render();
    if (error) $('#peso')?.focus();
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'peso') { data.gramos = e.target.value; guardar(); }
  });
  render();
})();
