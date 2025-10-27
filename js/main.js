/* main.js — Putrama Nusantara
 * Rapi, aman dipakai di semua halaman, tema adaptif (Modal & komponen Bootstrap ikut berubah)
 */
(() => {
  'use strict';

  // =========================
  // THEME (Light / Dark) + Logo
  // =========================
  const KEY = 'theme';
  const FADE_MS = 250;
  const root = document.documentElement;
  const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false, addEventListener(){} };

  function getSavedTheme() { try { return localStorage.getItem(KEY); } catch { return null; } }
  function getSystemTheme() { return mql.matches ? 'dark' : 'light'; }
  function getEffectiveThemeOnLoad() {
    const saved = getSavedTheme();
    if (saved === 'dark' || saved === 'light') return saved;
    if (document.body.classList.contains('dark-mode')) return 'dark';
    if (document.body.classList.contains('light-mode')) return 'light';
    return getSystemTheme();
  }

  function setLogoSrc(theme) {
    const logos = document.querySelectorAll('.logo-img');
    const newSrc = theme === 'dark' ? 'logo-dark.png' : 'logo-light.png';
    const newAlt = theme === 'dark' ? 'logo-putrama-dark-mode' : 'logo-putrama-light-mode';

    logos.forEach(logoEl => {
      if (!logoEl) return;
      if (logoEl.getAttribute('src') === newSrc) return;
      logoEl.style.transition = `opacity ${FADE_MS}ms ease-in-out`;
      logoEl.style.opacity = '0';
      setTimeout(() => {
        logoEl.src = newSrc;
        logoEl.alt = newAlt;
        requestAnimationFrame(() => { logoEl.style.opacity = '1'; });
      }, FADE_MS);
    });
  }

  function syncDropdownMenus(theme) {
    // Jika ingin pakai varian .dropdown-menu-dark
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.toggle('dropdown-menu-dark', theme === 'dark');
    });
  }

  function applyTheme(theme, save = false) {
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');
    root.setAttribute('data-bs-theme', theme);          // <-- penting agar Modal/komponen Bootstrap ikut tema
    if (save) { try { localStorage.setItem(KEY, theme); } catch {} }
    setLogoSrc(theme);
    syncDropdownMenus(theme);
    const btn = document.getElementById('btnThemeToggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark');
  }

  function initTheme() {
    const initial = getEffectiveThemeOnLoad();
    applyTheme(initial, false);

    const btn = document.getElementById('btnThemeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      });
    }

    if (mql && mql.addEventListener) {
      // Jika user belum override manual, ikuti perubahan sistem
      mql.addEventListener('change', e => {
        if (!getSavedTheme()) applyTheme(e.matches ? 'dark' : 'light', false);
      });
    }

    // Pastikan setiap modal mewarisi tema saat akan ditampilkan
    document.addEventListener('show.bs.modal', (ev) => {
      const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      ev.target.setAttribute('data-bs-theme', theme);
    });
  }

  // =========================
  // SCROLL TO TOP
  // =========================
  function initScrollUp() {
    const btnUp = document.getElementById('btnUp');
    if (!btnUp) return;
    const navbar = document.querySelector('nav') || document.getElementById('navbar');
    btnUp.setAttribute('aria-label', 'Kembali ke atas');

    btnUp.addEventListener('click', () => {
      if (navbar) navbar.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let ticking = false;
    const check = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      // Gunakan class "hidden" (sudah ada di CSS: .btn-circle.hidden { opacity:0; ... })
      if (scrollY <= navbarHeight + 10) btnUp.classList.add('hidden');
      else btnUp.classList.remove('hidden');
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(check);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', check);
    check();
  }

  // =========================
  // HERO & SECTION ANIMATIONS
  // =========================
  function initHeroAnimations() {
    const hero = document.querySelector('.hero-section');
    if (!hero || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) hero.classList.add('show'); });
    }, { threshold: 0.3 });
    obs.observe(hero);
  }

  function initFadeUp() {
    const sections = document.querySelectorAll('.fade-up-section');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        target.classList.add('animate');
        target.querySelectorAll('.fade-up-card, .services-card').forEach((card, i) => {
          setTimeout(() => card.classList.add('animate'), i * 150);
        });
        observer.unobserve(target);
      });
    }, { threshold: 0.1 });
    sections.forEach(s => obs.observe(s));
  }

  // =========================
  // ISOTOPE (Grid + Filters)
  // =========================
  function initIsotopeAndFilters() {
    const isoContainer = document.querySelector('.isotope-container');
    if (!isoContainer || !window.Isotope) return;

    const createIso = () => new Isotope(isoContainer, {
      itemSelector: '.portfolio-item',
      layoutMode: 'masonry',
      percentPosition: true
    });

    let iso;
    if (window.imagesLoaded) {
      imagesLoaded(isoContainer, () => { iso = createIso(); });
    } else {
      iso = createIso();
    }

    const filters = document.querySelectorAll('.portfolio-filters li');
    filters.forEach(li => {
      li.addEventListener('click', function() {
        filters.forEach(f => {
          f.classList.remove('filter-active');
          f.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('filter-active');
        this.setAttribute('aria-pressed', 'true');

        const filterValue = this.getAttribute('data-filter') || '*';
        iso.arrange({ filter: filterValue });
      });
    });
  }

  // =========================
  // CAROUSEL builder (dari kartu #portfolio ke #portfolioCarousel)
  // =========================
  function initPortfolioCarousel() {
    const carouselInner = document.querySelector('#portfolioCarousel .carousel-inner');
    const items = document.querySelectorAll('#portfolio .portfolio-item');
    if (!carouselInner || !items.length) return;
    if (carouselInner.children.length) return; // hindari duplikasi

    items.forEach((item, idx) => {
      const clone = item.cloneNode(true);
      clone.classList.remove('col-lg-4', 'col-md-6');
      clone.classList.add('d-block', 'w-100');

      const slide = document.createElement('div');
      slide.className = 'carousel-item' + (idx === 0 ? ' active' : '');
      slide.appendChild(clone);
      carouselInner.appendChild(slide);
    });
  }

  // =========================
  // MODAL PORTFOLIO (payload tersembunyi -> modal)
  // =========================
  function initPortfolioModal() {
    let modalEl = document.getElementById('portfolioModal');
    if (!modalEl) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
      <div class="modal fade" id="portfolioModal" tabindex="-1" aria-hidden="true" aria-labelledby="portfolioModalLabel">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="portfolioModalLabel" class="modal-title">Detail Proyek</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
              <a href="#" target="_self" class="btn btn-primary d-none" id="btnProjectPage" rel="noopener">Halaman Proyek</a>
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            </div>
          </div>
        </div>
      </div>`;
      modalEl = wrapper.firstElementChild;
      document.body.appendChild(modalEl);
    }

    const modalTitle = modalEl.querySelector('.modal-title');
    const modalBody  = modalEl.querySelector('.modal-body');
    const btnProject = modalEl.querySelector('#btnProjectPage');

    function fillModalFromTrigger(trigger) {
      const title    = trigger.getAttribute('data-title')   || 'Detail Proyek';
      const selector = trigger.getAttribute('data-content') || '';
      const linkUrl  = trigger.getAttribute('data-link')    || '';

      if (modalTitle) modalTitle.textContent = title;

      if (modalBody) {
        modalBody.innerHTML = '';
        const payload = selector ? document.querySelector(selector) : null;
        if (payload) {
          modalBody.appendChild(payload.cloneNode(true));
        } else {
          modalBody.innerHTML = '<p class="text-muted mb-0">Konten proyek belum tersedia.</p>';
        }
      }

      if (btnProject) {
        if (linkUrl) {
          btnProject.classList.remove('d-none');
          btnProject.setAttribute('href', linkUrl);
        } else {
          btnProject.classList.add('d-none');
          btnProject.removeAttribute('href');
        }
      }
    }

    // Delegasi klik untuk semua .portfolio-trigger
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.portfolio-trigger');
      if (!trigger) return;
      e.preventDefault();
      e.stopPropagation();

      fillModalFromTrigger(trigger);

      const Modal = window.bootstrap?.Modal;
      if (Modal) Modal.getOrCreateInstance(modalEl).show();
    });

    // Pastikan tema modal sinkron tepat saat tampil
    modalEl.addEventListener('show.bs.modal', () => {
      const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      modalEl.setAttribute('data-bs-theme', theme);
    });

    // Kosongkan body saat ditutup
    modalEl.addEventListener('hidden.bs.modal', () => {
      if (modalBody) modalBody.innerHTML = '';
    });
  }

  // =========================
  // BOOT
  // =========================
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollUp();
    initHeroAnimations();
    initFadeUp();
    initIsotopeAndFilters();
    initPortfolioCarousel();
    initPortfolioModal();
  });
})();
