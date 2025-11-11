// script.js
// Carrossel em "pilha/roleta" — posição definida por um array de transforms
document.addEventListener('DOMContentLoaded', () => {
    const stack = document.getElementById('stack');
    const cards = Array.from(stack.querySelectorAll('.card'));
  
    // configurações: posições para cada "slot" da roleta
    // cada item: {x, y, scale, rotate, z, opacity}
    // organizamos 5 slots (esquerda mais afastada -> centro -> direita)
    const slots = [
      { x: -260, y: 20, scale: 0.82, rotate: -18, z: 10, opacity: 0.6 },
      { x: -120, y: 8,  scale: 0.92, rotate: -8,  z: 20, opacity: 0.8 },
      { x: 0,    y: 0,  scale: 1.18, rotate: 0,   z: 60, opacity: 1.0 }, // centro
      { x: 120,  y: 8,  scale: 0.92, rotate: 8,   z: 20, opacity: 0.8 },
      { x: 260,  y: 20, scale: 0.82, rotate: 18,  z: 10, opacity: 0.6 }
    ];
  
    // se tiver mais de 5 imagens, replicar o efeito em torno
    // mapa de indexes: para n cards, o centroIndex determina quem está central
    let centerIndex = 0;
  
    // aplica transform para cada card baseado no centro atual
    function render() {
      const n = cards.length;
      for (let i = 0; i < n; i++) {
        const card = cards[i];
  
        // calcular posição relativa do card em relação ao centro
        // queremos mapear offsets ...,-2,-1,0,1,2,... para slots array (limitar)
        const rel = ((i - centerIndex) % n + n) % n; // 0..n-1
        // convert to signed distance shortest path:
        let distance = rel;
        if (rel > Math.floor(n / 2)) distance = rel - n; // negative side
  
        // clamp distance to [-2,2] for slot mapping
        const clamped = Math.max(-2, Math.min(2, distance));
        const slotIndex = 2 + clamped; // -2 -> 0, 0 -> 2, +2 -> 4
  
        const s = slots[slotIndex];
  
        // build transform
        card.style.transform = `
          translate3d(${s.x}px, ${s.y}px, 0px)
          scale(${s.scale})
          rotate(${s.rotate}deg)
          translate(-50%, -50%)
        `;
        card.style.zIndex = s.z;
        card.style.opacity = s.opacity;
        // center class toggle
        if (slotIndex === 2) {
          card.classList.add('center');
        } else {
          card.classList.remove('center');
        }
      }
    }
  
    // inicializa
    render();
  
    // navegação: next / prev
    function next() {
      centerIndex = (centerIndex + 1) % cards.length;
      render();
    }
    function prev() {
      centerIndex = (centerIndex - 1 + cards.length) % cards.length;
      render();
    }
  
    // drag handling (desktop)
    let startX = 0;
    let isDown = false;
    stack.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.clientX;
      stack.classList.add('dragging');
    });
    window.addEventListener('mouseup', (e) => {
      if (!isDown) return;
      isDown = false;
      stack.classList.remove('dragging');
      const diff = e.clientX - startX;
      if (diff < -50) next();
      else if (diff > 50) prev();
    });
    window.addEventListener('mousemove', (e) => {
      // optional: you can preview dragged movement here
    });
  
    // touch handling (mobile)
    stack.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    stack.addEventListener('touchend', (e) => {
      const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
      const diff = endX - startX;
      if (diff < -40) next();
      else if (diff > 40) prev();
    });
  
    // também permite clicar na direita/esquerda para avançar
    stack.addEventListener('click', (e) => {
      // se clicar em área direita -> next, esquerda -> prev
      const rect = stack.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x > rect.width * 0.6) next();
      else if (x < rect.width * 0.4) prev();
    });
  
    // opcional: auto-play (desativado por padrão)
    // let autoplay = setInterval(next, 5000);
    // stack.addEventListener('mouseenter', () => clearInterval(autoplay));
    // stack.addEventListener('mouseleave', () => { autoplay = setInterval(next, 5000); });
  });
  



  //SEÇÃO SERVIÇOS

// ===== Stack Carousel (roleta) — versão resiliente para mobile 320px =====
document.addEventListener('DOMContentLoaded', () => {
  const stack = document.getElementById('stackCarousel');
  if (!stack) return;

  const items = Array.from(stack.querySelectorAll('.stack-item'));
  if (!items.length) return;

  // preferimos centralizar num índice seguro (se houver 3+ cards, index 2 é bom)
  let centerIndex = Math.min(2, items.length - 1);

  // calcula slots responsivos (adapta para telas muito estreitas)
  function computeSlots() {
    const w = Math.max(280, Math.min(stack.clientWidth || window.innerWidth, window.innerWidth));

    
    if (window.innerWidth <= 380) {
      const spacing = Math.max(18, w * 0.20); // compacto para iPhone 5/320
      return [
        { x: -2 * spacing, y: 10, scale: 0.78, rotate: -10, z: 6, opacity: 0.6 },
        { x: -spacing,     y: 5, scale: 0.9,  rotate: -5,  z: 20, opacity: 0.85 },
        { x: 0,            y: 0, scale: 1.05, rotate: 0,   z: 70, opacity: 1.0 },
        { x: spacing,      y: 5, scale: 0.9,  rotate: 5,   z: 20, opacity: 0.85 },
        { x: 2 * spacing,  y: 10, scale: 0.78, rotate: 10,  z: 6,  opacity: 0.6 }
      ];
    } else {
      const spacing = Math.min(320, Math.max(120, w * 0.22));
      return [
        { x: -2 * spacing, y: 18, scale: 0.78, rotate: -14, z: 10, opacity: 0.5 },
        { x: -spacing,     y: 8,  scale: 0.92, rotate: -6,  z: 25, opacity: 0.8 },
        { x: 0,            y: 0,  scale: 1.12, rotate: 0,   z: 70, opacity: 1.0 },
        { x: spacing,      y: 8,  scale: 0.92, rotate: 6,   z: 25, opacity: 0.8 },
        { x: 2 * spacing,  y: 18, scale: 0.78, rotate: 14,  z: 10, opacity: 0.5 }
      ];
    }
  }

  // renderiza todos os itens com base no centerIndex
  function render() {
    const slots = computeSlots();
    const n = items.length;

    for (let i = 0; i < n; i++) {
      const el = items[i];

      // distância relativa circular (menor caminho)
      const rel = ((i - centerIndex) % n + n) % n;
      let distance = rel;
      if (rel > Math.floor(n / 2)) distance = rel - n;
      const clamped = Math.max(-2, Math.min(2, distance));
      const slotIndex = 2 + clamped;
      const s = slots[slotIndex];

      // garante posição absoluta (importante se css foi alterado)
      el.style.position = 'absolute';
      el.style.left = '50%';
      el.style.top = '50%';

      // aplica transform
      el.style.transform = `
        translate3d(${s.x}px, ${s.y}px, 0)
        scale(${s.scale})
        rotate(${s.rotate}deg)
        translate(-50%, -50%)
      `;
      el.style.zIndex = s.z;
      el.style.opacity = s.opacity;

      // class center para estilos destacados
      if (slotIndex === 2) el.classList.add('center');
      else el.classList.remove('center');
    }
  }

  // next / prev
  function next() {
    centerIndex = (centerIndex + 1) % items.length;
    render();
  }
  function prev() {
    centerIndex = (centerIndex - 1 + items.length) % items.length;
    render();
  }

  // clique nas laterais do stack (funciona em todas as larguras)
  stack.addEventListener('click', (e) => {
    const rect = stack.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.6) next();
    else if (x < rect.width * 0.4) prev();
  });

  // clique direto no item: traz o item clicado para o centro (rotação mínima)
  items.forEach((it, idx) => {
    it.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (idx === centerIndex) return;
      const n = items.length;
      let steps = ((idx - centerIndex) % n + n) % n;
      if (steps > n / 2) steps = steps - n;
      centerIndex = (centerIndex + steps + n) % n;
      render();
    });
  });

  // drag / swipe — thresholds menores para mobile
  let startX = 0;
  let isDragging = false;
  const threshold = 30;

  stack.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    stack.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    stack.style.cursor = 'default';
    const diff = e.clientX - startX;
    if (diff < -threshold) next();
    else if (diff > threshold) prev();
  });

  stack.addEventListener('touchstart', (ev) => {
    isDragging = true;
    startX = ev.touches[0].clientX;
  }, { passive: true });

  stack.addEventListener('touchmove', (ev) => {
    if (!isDragging) return;
    const currentX = ev.touches[0].clientX;
    const diff = currentX - startX;
    // opcional: podemos mover cards levemente enquanto arrasta
  }, { passive: true });

  stack.addEventListener('touchend', (ev) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = (ev.changedTouches && ev.changedTouches[0]) ? ev.changedTouches[0].clientX : startX;
    const diff = endX - startX;
    if (diff < -threshold) next();
    else if (diff > threshold) prev();
  });

  window.addEventListener('resize', render);
  window.addEventListener('load', () => setTimeout(render, 80));

  render();
});





