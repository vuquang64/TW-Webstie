function setActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;

  const navLinks = document.querySelectorAll('.site-nav a');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const normalizedHref = href.replace('./', '').replace('.html', '');
    if ((page === 'home' && normalizedHref === 'index') || normalizedHref === page) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function closeMobileNav() {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;
  nav.dataset.visible = 'false';
  toggle.setAttribute('aria-expanded', 'false');
}

function toggleMobileNav() {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;
  const isVisible = nav.dataset.visible === 'true';
  nav.dataset.visible = isVisible ? 'false' : 'true';
  toggle.setAttribute('aria-expanded', String(!isVisible));
}

function enhanceNavLinks() {
  const navLinks = document.querySelectorAll('.site-nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        closeMobileNav();
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  enhanceNavLinks();
  const mobileToggle = document.querySelector('.nav-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileNav);
  }
});
