
// dark mode logo switch
document.addEventListener('DOMContentLoaded', () => {
  const logos = document.querySelectorAll('.logo-img'); // ambil semua logo
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const FADE_MS = 250;

  if (!logos.length || !btnThemeToggle) return;

  const savedTheme = () => localStorage.getItem('theme');
  const systemTheme = () => (mql.matches ? 'dark' : 'light');

  function getEffectiveThemeOnLoad() {
    const saved = savedTheme();
    if (saved === 'dark' || saved === 'light') return saved;
    if (document.body.classList.contains('dark-mode')) return 'dark';
    if (document.body.classList.contains('light-mode')) return 'light';
    return systemTheme();
  }

  function setLogoSrc(theme) {
    const newSrc = theme === 'dark' ? 'logo-dark.png' : 'logo-light.png';
    const newAlt = theme === 'dark' ? 'logo-pratma-dark-mode' : 'logo-pratma-light-mode';

    logos.forEach((logoEl) => {
      if (logoEl.getAttribute('src') === newSrc) return;

      logoEl.style.transition = `opacity ${FADE_MS}ms ease-in-out`;
      logoEl.style.opacity = 0;

      setTimeout(() => {
        logoEl.src = newSrc;
        logoEl.alt = newAlt;
        requestAnimationFrame(() => {
          logoEl.style.opacity = 1;
        });
      }, FADE_MS);
    });
  }

  function applyTheme(theme, save = false) {
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');
    if (save) localStorage.setItem('theme', theme);
    setLogoSrc(theme);
  }

  // Init theme on load
  const initial = getEffectiveThemeOnLoad();
  applyTheme(initial, false);

  // Toggle button
  btnThemeToggle.addEventListener('click', () => {
    const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  });

  // Update jika sistem berubah (kalau user belum set manual)
  mql.addEventListener('change', (e) => {
    if (!savedTheme()) {
      const sys = e.matches ? 'dark' : 'light';
      applyTheme(sys, false);
    }
  });
});



// // scroll up/down
const btnUp = document.getElementById('btnUp');
const navbar = document.querySelector('nav') || document.getElementById('navbar');

// Fungsi scroll ke atas
btnUp.addEventListener('click', () => {
    if (navbar) {
        navbar.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Cek posisi scroll
function checkScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const navbarHeight = navbar ? navbar.offsetHeight : 0;

    if (scrollY <= navbarHeight + 10) {
        btnUp.classList.add('hide-btn');
    } else {
        btnUp.classList.remove('hide-btn');
    }
}

// Jalankan saat scroll dan saat halaman load
window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);

// portofolio js
document.addEventListener('DOMContentLoaded', function() {
    const isoContainer = document.querySelector('.isotope-container');
    const iso = new Isotope(isoContainer, {
      itemSelector: '.portfolio-item',
      layoutMode: 'masonry'
    });

    const filters = document.querySelectorAll('.portfolio-filters li');
    filters.forEach(filterEl => {
      filterEl.addEventListener('click', function() {
        // Toggle active class
        filters.forEach(li => li.classList.remove('filter-active'));
        this.classList.add('filter-active');

        // Apply filter
        const filterValue = this.getAttribute('data-filter');
        iso.arrange({ filter: filterValue });
      });
    });
  });

//   dropdown service
document.addEventListener('DOMContentLoaded', function () {
  const root = document.documentElement;

  // helper untuk set awal
  function applyDropdownTheme(theme) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.toggle('dropdown-menu-dark', theme === 'dark');
    });
  }

  // apply initial theme
  applyDropdownTheme(root.getAttribute('data-bs-theme') || 'light');

  // observe perubahan attribute data-bs-theme
  const obs = new MutationObserver(muts => {
    muts.forEach(m => {
      if (m.attributeName === 'data-bs-theme') {
        applyDropdownTheme(root.getAttribute('data-bs-theme'));
      }
    });
  });
  obs.observe(root, { attributes: true });
});

// Animasi muncul saat scroll ke hero section
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-section");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          hero.classList.add("show");
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(hero);
});

document.addEventListener("DOMContentLoaded", () => {

  // Fade-up section
  const fadeSections = document.querySelectorAll('.fade-up-section');

  const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('animate');

        // Animasi tiap card dalam section
        const cards = entry.target.querySelectorAll('.fade-up-card, .services-card');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('animate'), i * 150); // delay 150ms tiap card
        });

        obs.unobserve(entry.target); // hanya sekali
      }
    });
  }, { threshold: 0.1 });

  fadeSections.forEach(section => fadeObserver.observe(section));

});


// Carrousel Portofolio
document.addEventListener("DOMContentLoaded", function(){
  const portfolioItems = document.querySelectorAll("#portfolio .portfolio-item");
  const carouselInner = document.querySelector("#portfolioCarousel .carousel-inner");

  portfolioItems.forEach((item, index) => {
    // Clone isi card
    let clone = item.cloneNode(true);
    clone.classList.remove("col-lg-4", "col-md-6"); // buang grid
    clone.classList.add("d-block", "w-100"); // biar pas di carousel

    // Bungkus jadi slide carousel
    let slide = document.createElement("div");
    slide.className = "carousel-item" + (index === 0 ? " active" : "");
    slide.appendChild(clone);

    carouselInner.appendChild(slide);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  // 1) Pastikan modal ada; kalau tidak, buat skeleton-nya
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
              // <a href="#" target="_self" class="btn btn-primary d-none" id="btnProjectPage">Halaman Proyek</a>
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

  // Helper: isi modal dari trigger
  function fillModalFromTrigger(trigger) {
    const title    = trigger.getAttribute('data-title')   || 'Detail Proyek';
    const selector = trigger.getAttribute('data-content') || '';
    const linkUrl  = trigger.getAttribute('data-link')    || '';

    if (modalTitle) modalTitle.textContent = title;

    const payload = selector ? document.querySelector(selector) : null;
    if (modalBody) {
      modalBody.innerHTML = '';
      if (payload) {
        const frag = document.createDocumentFragment();
        Array.from(payload.children).forEach(node => frag.appendChild(node.cloneNode(true)));
        modalBody.appendChild(frag);
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

  // 2) Delegasi klik: buka modal manual (hindari handler data-bs-toggle bawaan)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.portfolio-trigger');
    if (!trigger) return;

    // kalau markup masih pakai data-bs-toggle/target, stop propagation biar Bootstrap tidak double-handle
    e.preventDefault();
    e.stopPropagation();

    fillModalFromTrigger(trigger);

    // Tampilkan modal via API Bootstrap
    // (pastikan bootstrap.bundle.min.js yang dipakai—ada Modal di global "bootstrap")
    const Modal = window.bootstrap?.Modal;
    if (Modal) {
      Modal.getOrCreateInstance(modalEl).show();
    } else {
      // fallback aman kalau namespace global tidak ada (misal pakai ESM): trigger event native
      const ev = new Event('show.bs.modal', { bubbles: true, cancelable: true });
      modalEl.dispatchEvent(ev);
      modalEl.classList.add('show');
      modalEl.style.display = 'block';
      modalEl.removeAttribute('aria-hidden');
      modalEl.setAttribute('aria-modal', 'true');
    }
  });

  // 3) Bersihkan isi saat modal ditutup
  modalEl.addEventListener('hidden.bs.modal', () => {
    if (modalBody) modalBody.innerHTML = '';
  });
});
