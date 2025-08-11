
// dark mode
document.addEventListener('DOMContentLoaded', () => {
        const logoEl = document.getElementById('logo');
        const btnThemeToggle = document.getElementById('btnThemeToggle');
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const FADE_MS = 250;

        if (!logoEl || !btnThemeToggle) return; // jika elemen hilang, stop

        const savedTheme = () => localStorage.getItem('theme'); // 'dark' | 'light' | null
        const systemTheme = () => (mql.matches ? 'dark' : 'light');

        function getEffectiveThemeOnLoad() {
          const saved = savedTheme();
          if (saved === 'dark' || saved === 'light') return saved;
          // cek apakah body sudah diberi class (mis. server-side)
          if (document.body.classList.contains('dark-mode')) return 'dark';
          if (document.body.classList.contains('light-mode')) return 'light';
          return systemTheme();
        }

        function setLogoSrc(theme) {
          const newSrc = theme === 'dark' ? '../assets/img/logo-dark.png' : '../assets/img/logo-light.png';
          const newAlt = theme === 'dark' ? 'logo-pratma-dark-mode' : 'logo-pratma-light-mode';

          // kalau sama, tidak usah ubah
          if (logoEl.getAttribute('src') === newSrc) return;

          // fade out -> ganti src -> fade in
          logoEl.style.opacity = 0;
          // beri waktu sesuai transition
          setTimeout(() => {
            logoEl.src = newSrc;
            logoEl.alt = newAlt;
            // small timeout agar browser reflow sebelum fade-in (lebih halus)
            requestAnimationFrame(() => {
              logoEl.style.opacity = 1;
            });
          }, FADE_MS);
        }

        function applyTheme(theme, save = false) {
          document.body.classList.remove('dark-mode', 'light-mode');
          document.body.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');
          if (save) localStorage.setItem('theme', theme);
          setLogoSrc(theme);
        }

        // Init theme on load (don't overwrite stored choice except when deciding)
        const initial = getEffectiveThemeOnLoad();
        applyTheme(initial, false);

        // Toggle button -> ganti theme dan simpan pilihan user
        btnThemeToggle.addEventListener('click', () => {
          const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
          const next = current === 'dark' ? 'light' : 'dark';
          applyTheme(next, true);
        });

        // Jika system theme berubah, otomatis update hanya bila user belum memilih manual (no saved theme)
        mql.addEventListener('change', (e) => {
          if (!savedTheme()) {
            const sys = e.matches ? 'dark' : 'light';
            applyTheme(sys, false);
          }
        });
});

// scroll up/down
const btnUp = document.getElementById('btnUp');
        const btnDown = document.getElementById('btnDown');
        const navbar = document.querySelector('nav') || document.getElementById('navbar'); // Sesuaikan selector navbar
        const footer = document.querySelector('footer') || document.getElementById('footer'); // Sesuaikan selector footer
            function scrollToElement(element) {
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        btnUp.addEventListener('click', () => scrollToElement(navbar));
        btnDown.addEventListener('click', () => scrollToElement(footer));

        function checkScroll() {
            const scrollY = window.scrollY || window.pageYOffset;
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : document.body.scrollHeight;
                // Sembunyikan tombol Up jika scroll di posisi navbar (atas)
                if (scrollY <= navbarHeight + 10) {
                    btnUp.style.display = 'none';
                } else {
                    btnUp.style.display = 'flex';
                }
                // Sembunyikan tombol Down jika sudah di posisi footer (bawah)
                if (scrollY + window.innerHeight >= footerTop - 10) {
                    btnDown.style.display = 'none';
                } else {
                     btnDown.style.display = 'flex';
                }
        }

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