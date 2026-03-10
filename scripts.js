/* ═══════════════════════════════════════════════════
   KANAK SHRI JEWELLERS — Shared Scripts v3.0
   Fixes:
   - Back-button black page (bfcache compatible)
   - Mobile cursor disabled
   - Page transition uses class-based approach
   - Active nav link highlight fixed for index.html
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── CUSTOM CURSOR (desktop pointer only) ── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (cursor && ring && !isTouch) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animateCursor() {
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a, button, .product-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); ring.classList.add('hovered'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); ring.classList.remove('hovered'); });
    });
  }

  /* ── STICKY NAV ── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load in case page is already scrolled
  }

  /* ── HAMBURGER MENU ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    function closeMenu() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    // Close on Escape
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    // Fallback: make all visible immediately
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ── PRODUCT FILTER ── */
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

  /* ── PAGE TRANSITIONS
     FIX: Use bfcache-friendly approach.
     - Do NOT set opacity on 'load' — let CSS handle the initial state.
     - Use pageshow event to clear the overlay (handles back/forward cache).
     - Only apply transition overlay on deliberate internal link clicks.
  ── */
  const overlay = document.getElementById('page-transition');
  if (overlay) {
    // Immediately hide overlay on any page show (including bfcache restore)
    window.addEventListener('pageshow', function (e) {
      overlay.classList.remove('active');
    });

    // On internal link click, show overlay then navigate
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('http') &&
        !href.startsWith('//') &&
        !href.startsWith('tel') &&
        !href.startsWith('mailto') &&
        !href.startsWith('javascript')
      ) {
        link.addEventListener('click', e => {
          e.preventDefault();
          overlay.classList.add('active');
          setTimeout(() => { window.location.href = href; }, 360);
        });
      }
    });
  }

  /* ── ACTIVE NAV LINK HIGHLIGHT ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const linkHref = a.getAttribute('href');
    if (!linkHref) return;
    const linkPage = linkHref.split('/').pop().split('#')[0];
    // Match exact page, or treat index.html as home
    if (
      linkPage === page ||
      (page === '' && linkPage === 'index.html') ||
      (page === 'index.html' && linkPage === 'index.html')
    ) {
      a.classList.add('active');
    }
  });

})();
