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

function extractSectionMeta(section) {
  const headingNode = section.querySelector('.section-header h2, h2, h1');
  const eyebrowNode = section.querySelector('.eyebrow, .contact-kicker, .case-label');
  const navTitle = (section.dataset.navTitle || headingNode?.textContent || '').trim();
  const navLabel = (section.dataset.navLabel || eyebrowNode?.textContent || '').trim();

  if (!navTitle) return null;

  if (!section.dataset.navTitle) {
    section.dataset.navTitle = navTitle;
  }
  if (!section.dataset.navLabel && navLabel) {
    section.dataset.navLabel = navLabel;
  }

  return {
    label: navLabel,
    title: navTitle,
  };
}

function updateHeaderOffset() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const offset = Math.ceil(header.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--header-offset', `${offset}px`);
}

function initializeScrollHeaderTitle() {
  const header = document.querySelector('.site-header');
  const explicitTargets = Array.from(document.querySelectorAll('main [data-scroll-title]'));
  const targets = explicitTargets.length > 0
    ? explicitTargets
    : Array.from(document.querySelectorAll('main section'));
  if (!header || targets.length === 0) return;

  const scrollTitle = document.createElement('div');
  scrollTitle.className = 'nav-scroll-title';
  scrollTitle.setAttribute('aria-hidden', 'true');
  header.appendChild(scrollTitle);

  let currentTitle = '';
  let currentLabel = '';
  let ticking = false;

  const renderTitle = (label, title) => {
    if (!title || (title === currentTitle && label === currentLabel)) return;

    const next = document.createElement('div');
    next.className = 'nav-scroll-title-item';
    const safeLabel = label ? `<span class="nav-scroll-label">${label}</span>` : '';
    const safeTitle = `<span class="nav-scroll-heading">${title}</span>`;
    next.innerHTML = `${safeLabel}${safeTitle}`;

    const previous = scrollTitle.querySelector('.nav-scroll-title-item.is-current');
    scrollTitle.appendChild(next);

    requestAnimationFrame(() => {
      next.classList.add('is-current');
      if (previous) {
        previous.classList.remove('is-current');
        previous.classList.add('is-exiting');
        window.setTimeout(() => previous.remove(), 360);
      }
    });

    currentTitle = title;
    currentLabel = label;
  };

  const refresh = () => {
    updateHeaderOffset();
    const headerHeight = header.getBoundingClientRect().height;
    const triggerY = headerHeight + 2;
    let activeMeta = extractSectionMeta(targets[0]);

    targets.forEach((section) => {
      const top = section.getBoundingClientRect().top;
      if (top <= triggerY) {
        const meta = extractSectionMeta(section);
        if (meta) {
          activeMeta = meta;
        }
      }
    });

    if (activeMeta) {
      renderTitle(activeMeta.label, activeMeta.title);
    }
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(refresh);
  };

  refresh();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

function initializeAboutSplitReveal() {
  if (document.body.dataset.page !== 'about') return;

  const parts = Array.from(document.querySelectorAll('.about-story-part'));
  if (parts.length === 0) return;

  let ticking = false;

  const update = () => {
    const viewportHeight = window.innerHeight;
    let activeIndex = -1;
    let nearest = Number.POSITIVE_INFINITY;

    parts.forEach((part, index) => {
      const rect = part.getBoundingClientRect();
      const distanceToPinLine = Math.abs(rect.top - (viewportHeight * 0.26));
      if (distanceToPinLine < nearest) {
        nearest = distanceToPinLine;
        activeIndex = index;
      }

      const start = viewportHeight * 0.9;
      const end = viewportHeight * 0.22;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      part.style.setProperty('--about-reveal', progress.toFixed(3));
    });

    parts.forEach((part, index) => {
      if (index === activeIndex) {
        part.classList.add('is-active');
      } else {
        part.classList.remove('is-active');
      }
    });

    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

window.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  enhanceNavLinks();
  updateHeaderOffset();
  initializeScrollHeaderTitle();
  initializeAboutSplitReveal();
  const mobileToggle = document.querySelector('.nav-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileNav);
  }
});
