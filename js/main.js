// =============================================
// GEOALBANES.COM — JavaScript Principal v3
// =============================================

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {

  // ── Custom Cursor ──
  const cursor = document.getElementById('cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });

    const hoverEls = document.querySelectorAll('a, button, .pillar, .art-main, .art-small, .card, input, [data-cursor-hover]');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('click'));
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
  }

  // ── Navbar scroll ──
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── Menú móvil ──
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu  = document.getElementById('closeMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (closeMenu && mobileMenu) {
    closeMenu.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Reveal con IntersectionObserver + stagger automático ──
  const fadeEls = document.querySelectorAll('.fade-in, .fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ── Stagger reveal en grupos (.pillars, .values-grid, .social-grid, .articles-list) ──
  const staggerGroups = document.querySelectorAll('.pillars, .values-grid, .social-grid, .articles-list');
  if ('IntersectionObserver' in window) {
    const groupObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.transitionDelay = (i * 0.09) + 's';
          child.classList.add('stagger-in');
        });
        groupObserver.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    staggerGroups.forEach(g => groupObserver.observe(g));
  }

  // ── Active nav link ──
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href) && href !== '/') {
      link.classList.add('active');
    }
  });

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Form feedback ──
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
      const btn = this.querySelector('[type="submit"]');
      if (btn) { btn.textContent = 'Enviando...'; btn.disabled = true; }
    });
  });

  // ── Blog filtros ──
  const filterBtns = document.querySelectorAll('[data-filter]');
  const articleCards = document.querySelectorAll('[data-cat]');
  if (filterBtns.length && articleCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        articleCards.forEach(card => {
          const show = filter === 'all' || card.getAttribute('data-cat') === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ── Salida temprana si el usuario prefiere menos movimiento ──
  if (reduceMotion) return;

  // ── Magnetic effect (excluye .hero-photo-frame para evitar conflicto con tilt 3D) ──
  const magneticEls = document.querySelectorAll('.btn, .pillar, .social-card, .blog-card, .art-main, .art-small, .value-item');
  magneticEls.forEach(el => {
    let raf;
    el.addEventListener('mousemove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = el.classList.contains('btn') ? 0.25 : 0.06;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    });
    el.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });

  // ── Photo tilt 3D del hero ──
  const photoFrame = document.querySelector('.hero-photo-frame');
  if (photoFrame) {
    photoFrame.style.transformStyle = 'preserve-3d';
    photoFrame.style.transition = 'transform 0.4s ease-out';
    let tiltRaf;
    document.addEventListener('mousemove', (e) => {
      cancelAnimationFrame(tiltRaf);
      tiltRaf = requestAnimationFrame(() => {
        const rect = photoFrame.getBoundingClientRect();
        if (rect.width === 0) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        photoFrame.style.transform = `perspective(1200px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
      });
    });
  }

  // ── Parallax orbs ──
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');
  let orbRaf;
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(orbRaf);
    orbRaf = requestAnimationFrame(() => {
      const y = window.scrollY;
      if (orb1) orb1.style.transform = `translateY(${y * 0.15}px)`;
      if (orb2) orb2.style.transform = `translateY(${-y * 0.08}px)`;
      if (orb3) orb3.style.transform = `translate(-50%, calc(-50% + ${y * 0.2}px))`;
    });
  }, { passive: true });

});

// ═══════════════════════════════════════
// MOTION UPGRADE v3
// ═══════════════════════════════════════

// ── Scroll Progress ──
(function() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((window.scrollY / total) * 100) + '%';
  }, { passive: true });
})();

// ── Neural Network Canvas ──
(function() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.style.display='none'; return; }

  const ctx = canvas.getContext('2d');
  let nodes = [], raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function spawnNodes() {
    nodes = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 7000), 140);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.6,
        phase: Math.random() * Math.PI * 2,
        hot: Math.random() > 0.6
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const MAX = 175;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX) {
          const a = (1 - d/MAX) * ((nodes[i].hot || nodes[j].hot) ? 0.55 : 0.22);
          ctx.strokeStyle = `rgba(91,142,244,${a})`;
          ctx.lineWidth   = 0.7;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      n.phase += 0.018;
      const r = n.r + Math.sin(n.phase) * 0.6;
      const a = n.hot ? 0.85 + Math.sin(n.phase) * 0.15 : 0.45 + Math.sin(n.phase) * 0.15;

      if (n.hot) {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 18);
        g.addColorStop(0, `rgba(91,142,244,${a * 0.55})`);
        g.addColorStop(0.5, `rgba(36,96,232,${a * 0.2})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 18, 0, Math.PI*2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${n.hot ? '91,142,244' : '36,96,232'},${a})`;
      ctx.fill();

      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    raf = requestAnimationFrame(draw);
  }

  resize(); spawnNodes(); draw();

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      cancelAnimationFrame(raf);
      resize(); spawnNodes(); draw();
    }, 200);
  });
})();

// ── Terminal Typing — 4 escenarios reales ──
(function() {
  const output  = document.getElementById('terminal-output');
  const inputEl = document.getElementById('terminal-input');
  const titleEl = document.getElementById('terminal-scenario');
  if (!output || !inputEl) return;

  // 4 escenarios que se rotan
  const SCENARIOS = [
    {
      label: 'MARKETING · LinkedIn viral',
      lines: [
        { type:'cmd',     text:'gpt "10 hooks que convierten en LinkedIn LATAM"',  d:0    },
        { type:'out',     text:'Generando con GPT-4o · contexto: emprendedor LATAM',d:1100 },
        { type:'out',     text:'──────────────────────────────────────',           d:1700 },
        { type:'insight', text:'1. "Esto me costó $3,400 aprenderlo. Te lo regalo."',d:2200},
        { type:'insight', text:'2. "Borré 7 herramientas. Ahora trabajo el doble."', d:2800},
        { type:'insight', text:'3. "El 80% de la IA es saber preguntar bien."',     d:3400},
        { type:'insight', text:'4. "No es disciplina. Es diseñar fricción correcta."',d:4000},
        { type:'insight', text:'5. "Tu banco no te explica esto. Te conviene."',    d:4600},
        { type:'success', text:'✓ 10 hooks · CTR estimado: 8.4%',                  d:5400 },
      ]
    },
    {
      label: 'FINANZAS · Análisis LATAM 2026',
      lines: [
        { type:'cmd',     text:'analyze --region=LATAM --year=2026',                d:0    },
        { type:'out',     text:'Cargando dataset CEPAL + BID + INEC...',           d:1100 },
        { type:'out',     text:'1,247 puntos procesados ✓',                        d:1700 },
        { type:'out',     text:'──────────────────────────────────────',           d:2100 },
        { type:'insight', text:'⚠ Inflación promedio: 5.8% · Ahorro bancario: 1.2%',d:2600},
        { type:'insight', text:'⚠ 68% sin fondo de emergencia (3-6 meses)',         d:3200},
        { type:'insight', text:'✓ Oportunidad: dólar estable + ETFs USA',           d:3800},
        { type:'success', text:'✓ Reporte: ahorro real negativo de -4.6% anual',   d:4600 },
      ]
    },
    {
      label: 'CONTENIDO · Captions Instagram',
      lines: [
        { type:'cmd',     text:'caption --tema="hábito de ahorro" --tono=directo', d:0    },
        { type:'out',     text:'Generando 3 variantes con Claude...',              d:1100 },
        { type:'out',     text:'──────────────────────────────────────',           d:1700 },
        { type:'insight', text:'A › "El ahorro no es disciplina. Es estructura."', d:2200 },
        { type:'insight', text:'B › "Si ahorrás lo que sobra, nunca ahorrás."',    d:2800 },
        { type:'insight', text:'C › "Tu yo de 40 te paga el café. Hoy."',          d:3400 },
        { type:'success', text:'✓ Hooks listos · best CTR predicho: B (12.1%)',   d:4200 },
      ]
    },
    {
      label: 'REPORTES · Auditoría de gastos',
      lines: [
        { type:'cmd',     text:'audit --bank=statement.pdf --period=30d',          d:0    },
        { type:'out',     text:'Extrayendo 312 transacciones con OCR...',          d:1100 },
        { type:'out',     text:'Categorizando con IA · 98% confianza',             d:1900 },
        { type:'out',     text:'──────────────────────────────────────',           d:2400 },
        { type:'insight', text:'💸 Suscripciones duplicadas detectadas: 3',        d:2900 },
        { type:'insight', text:'💸 Gastos invisibles "delivery": $147/mes',        d:3500 },
        { type:'insight', text:'📈 Patrón: 73% del gasto los viernes',             d:4100 },
        { type:'success', text:'✓ Ahorro potencial mensual: $234',                d:4900 },
      ]
    }
  ];

  let timers = [];
  let scenarioIdx = 0;

  function clearTerm() {
    timers.forEach(clearTimeout);
    timers = [];
    output.innerHTML = '';
    inputEl.textContent = '';
  }

  function appendLine(item) {
    if (item.type === 'empty') {
      const sp = document.createElement('div');
      sp.style.height = '8px';
      output.appendChild(sp);
      return;
    }
    const div = document.createElement('div');
    div.className = 't-line ' + item.type;
    if (item.type === 'cmd') {
      div.innerHTML = `<span class="t-prompt">geo@studio:~$</span><span class="t-text"> ${item.text}</span>`;
      inputEl.textContent = '';
    } else {
      div.innerHTML = `<span class="t-text">${item.text}</span>`;
    }
    output.appendChild(div);
  }

  function typeCommand(text, done) {
    let i = 0;
    inputEl.textContent = '';
    function next() {
      if (i < text.length) {
        inputEl.textContent += text[i++];
        timers.push(setTimeout(next, 32 + Math.random()*22));
      } else {
        timers.push(setTimeout(done, 220));
      }
    }
    next();
  }

  function runScenario() {
    clearTerm();
    const sc = SCENARIOS[scenarioIdx];
    if (titleEl) titleEl.textContent = sc.label;

    let lastDelay = 0;
    sc.lines.forEach(item => {
      const t = setTimeout(() => {
        if (item.type === 'cmd') {
          typeCommand(item.text, () => appendLine(item));
        } else {
          appendLine(item);
        }
      }, item.d);
      timers.push(t);
      lastDelay = item.d;
    });

    // Próximo escenario en 2.5s después del último
    timers.push(setTimeout(() => {
      scenarioIdx = (scenarioIdx + 1) % SCENARIOS.length;
      runScenario();
    }, lastDelay + 2800));
  }

  // Arrancar al cargar la página (1.5s después)
  setTimeout(runScenario, 1500);
})();

// ── Animated Counters ──
(function() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length || !('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.getAttribute('data-count'), 10);
      const dur = 1400;
      const t0  = Date.now();
      function tick() {
        const p = Math.min((Date.now() - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * end);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });

  els.forEach(el => obs.observe(el));
})();

// ── Métricas: trigger chart/donut/bars al entrar en viewport ──
(function() {
  const cards = document.querySelectorAll('.metric-card');
  if (!cards.length || !('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const card = e.target;
      card.classList.add('visible');
      // Donut animation
      const arc = card.querySelector('.donut-arc');
      if (arc) {
        const pct = parseFloat(arc.getAttribute('data-pct'));
        const dash = parseFloat(arc.getAttribute('stroke-dasharray'));
        arc.style.strokeDashoffset = dash * (1 - pct);
      }
      obs.unobserve(card);
    });
  }, { threshold: 0.3 });
  cards.forEach(c => obs.observe(c));
})();

// ── Hero scramble effect on "pensás" ──
(function() {
  const target = document.querySelector('.hero-title em');
  if (!target) return;
  const final = target.textContent;
  const chars = '!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz';
  let frame = 0;
  let scrambling = false;

  function scramble() {
    if (scrambling) return;
    scrambling = true;
    frame = 0;
    const total = 28;
    const id = setInterval(() => {
      let out = '';
      for (let i = 0; i < final.length; i++) {
        const progress = frame / total;
        const revealAt = i / final.length;
        if (progress > revealAt) {
          out += final[i];
        } else {
          out += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      target.textContent = out;
      frame++;
      if (frame > total) {
        clearInterval(id);
        target.textContent = final;
        scrambling = false;
      }
    }, 45);
  }

  // Trigger 1.2s después del page load + cada vez que se hace hover en el título
  setTimeout(scramble, 1400);
  const wrap = document.querySelector('.hero-title');
  if (wrap) wrap.addEventListener('mouseenter', scramble);
})();

// ── Page Loader ──
(function() {
  const loader = document.getElementById('page-loader');
  const fill   = document.getElementById('loader-bar-fill');
  const pctEl  = document.getElementById('loader-pct');
  const status = document.getElementById('loader-status');
  if (!loader || !fill || !pctEl) return;

  const stages = [
    { at: 18,  msg: 'Cargando neural · v3' },
    { at: 42,  msg: 'Inicializando terminal · 4 escenarios' },
    { at: 66,  msg: 'Conectando stack · 6 nodos' },
    { at: 88,  msg: 'Sincronizando datos LATAM' },
    { at: 100, msg: 'Listo' },
  ];

  let pct = 0;
  function tick() {
    pct += Math.random() * 9 + 4;
    if (pct > 100) pct = 100;
    fill.style.width = pct + '%';
    pctEl.textContent = Math.floor(pct) + '%';
    const s = stages.find(x => pct <= x.at);
    if (s && status) status.textContent = s.msg;
    if (pct < 100) {
      setTimeout(tick, 110 + Math.random() * 90);
    } else {
      setTimeout(() => {
        loader.classList.add('done');
        document.body.style.overflow = '';
        const idx = document.getElementById('section-index');
        if (idx) idx.classList.add('ready');
      }, 380);
    }
  }
  document.body.style.overflow = 'hidden';
  setTimeout(tick, 200);
})();

// ── Manifesto reveal on scroll ──
(function() {
  const m = document.getElementById('manifesto');
  if (!m || !('IntersectionObserver' in window)) { if (m) m.classList.add('in-view'); return; }
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) m.classList.add('in-view'); });
  }, { threshold: 0.25 }).observe(m);
})();

// ── Section Index: highlight active section ──
(function() {
  const items = document.querySelectorAll('.si-item');
  if (!items.length) return;
  const sections = Array.from(items).map(it => ({
    item: it,
    el: document.getElementById(it.getAttribute('data-section'))
  })).filter(x => x.el);

  function update() {
    const y = window.scrollY + window.innerHeight * 0.35;
    let active = sections[0];
    sections.forEach(s => {
      const top = s.el.offsetTop;
      if (top <= y) active = s;
    });
    items.forEach(it => it.classList.remove('active'));
    if (active) active.item.classList.add('active');
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  // Smooth scroll on click
  items.forEach(it => {
    it.addEventListener('click', e => {
      e.preventDefault();
      const id = it.getAttribute('data-section');
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
