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
