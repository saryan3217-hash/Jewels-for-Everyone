/* ═══════════════════════════════════════════════════
   KANAK SHRI JEWELLERS — Shared Scripts v2.0
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (cursor && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animateCursor() {
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    // Hover expand effect
    document.querySelectorAll('a, button, .product-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); ring.classList.add('hovered'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); ring.classList.remove('hovered'); });
    });
  }

  /* ── STICKY NAV ── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      mobileMenu.style.display = open ? 'flex' : 'none';
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        mobileMenu.style.display = 'none';
        document.body.style.overflow = '';
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ── PRODUCT FILTER (collection pages) ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tag = btn.dataset.filter;
        document.querySelectorAll('.product-card').forEach(card => {
          if (tag === 'all' || card.dataset.tag === tag) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ── LAZY IMAGE OBSERVER (extra fallback for older browsers) ── */
  if ('IntersectionObserver' in window) {
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    const imgIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
          imgIO.unobserve(img);
        }
      });
    });
    imgs.forEach(img => imgIO.observe(img));
  }

  /* ── PAGE TRANSITIONS (smooth exit) ── */
  const overlay = document.getElementById('page-transition');
  if (overlay) {
    // Fade in on load
    window.addEventListener('load', () => {
      overlay.style.opacity = '0';
    });
    // Fade out on link click (internal pages only)
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('tel') && !href.startsWith('mailto')) {
        link.addEventListener('click', e => {
          e.preventDefault();
          overlay.style.opacity = '1';
          overlay.style.pointerEvents = 'all';
          setTimeout(() => { window.location.href = href; }, 350);
        });
      }
    });
  }

  /* ── ACTIVE NAV LINK HIGHLIGHT ── */
  const page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

})();
