/* =============================================
   Biuro Rachunkowe Emilia Motylska – script.js
   ============================================= */

'use strict';

/** Identyfikator pomiaru GA4 (G-XXXXXXXXXX). Puste = analityka wyłączona. */
const GA4_ID = '';

/* Skrypt jest współdzielony przez stronę główną i podstrony usługowe,
   więc każdy element traktujemy jako opcjonalny – brak elementu nie może
   przerwać wykonania reszty pliku. */
const $ = (id) => document.getElementById(id);
const on = (el, ev, fn, opts) => { if (el) el.addEventListener(ev, fn, opts); };

/* --- Navbar scroll effect --- */
const navbar = $('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* --- Mobile nav toggle --- */
const navToggle = $('navToggle');
const navLinks = $('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --- Smooth active nav link highlight --- */
const sections = document.querySelectorAll('section[id], header[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const activateNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', activateNav, { passive: true });


/* --- Intersection Observer – reveal animations --- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});


/* --- Contact form handler --- */
const form = $('contactForm');
const submitBtn = $('submitBtn');
const submitText = $('submitText');
const successMsg = $('formSuccess');
const errorMsg = $('formError');

function encodeFormData(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

on(form, 'submit', (e) => {
  e.preventDefault();

  // Basic validation – uses native constraints (type=email itp.) mimo novalidate
  const required = form.querySelectorAll('[required]');
  let firstInvalid = null;
  required.forEach(field => {
    const ok = field.type === 'checkbox'
      ? field.checked
      : field.value.trim() !== '' && field.checkValidity();
    field.classList.toggle('invalid', !ok);
    field.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (!ok && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  submitBtn.disabled = true;
  submitText.textContent = 'Wysyłanie…';
  errorMsg.hidden = true;

  const data = Object.fromEntries(new FormData(form).entries());

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeFormData(data),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Network response was not ok');
      submitBtn.hidden = true;
      form.querySelectorAll('input, select, textarea, button').forEach(el => {
        if (el !== submitBtn) el.disabled = true;
      });
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof gtag === 'function' && GA4_ID) gtag('event', 'formularz_wyslany');
    })
    .catch(() => {
      submitBtn.disabled = false;
      submitText.textContent = 'Wyślij wiadomość';
      errorMsg.hidden = false;
    });
});

/* --- Hero subtle parallax --- */
const heroBg = document.querySelector('.hero-bg-pattern');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (heroBg) {
  let parallaxQueued = false;
  window.addEventListener('scroll', () => {
    if (parallaxQueued || reduceMotion.matches) return;
    parallaxQueued = true;
    requestAnimationFrame(() => {
      parallaxQueued = false;
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
      }
    });
  }, { passive: true });
}


/* ======================================================
   COOKIE CONSENT – Google Consent Mode v2
   ====================================================== */
const COOKIE_KEY = 'motylska_consent_v2';

/** Bezpieczny odczyt zgody – uszkodzony wpis w localStorage nie może wywrócić skryptu. */
function readConsent() {
  try {
    return JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null');
  } catch {
    localStorage.removeItem(COOKIE_KEY);
    return null;
  }
}

function updateGCM(analytics, marketing) {
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
    });
  }
}

// Restore on page load
const savedConsent = readConsent();
if (savedConsent) updateGCM(savedConsent.analytics, savedConsent.marketing);

const cookieBar = $('cookieBar');
const cookiePrefModal = $('cookiePrefModal');
const consentAnalytics = $('consentAnalytics');
const consentMarketing = $('consentMarketing');

const showBar = () => { if (cookieBar) setTimeout(() => cookieBar.classList.add('visible'), 900); };
const hideBar = () => { if (cookieBar) cookieBar.classList.remove('visible'); };

if (!savedConsent) showBar();

function saveConsent(analytics, marketing) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics, marketing, ts: Date.now() }));
  updateGCM(analytics, marketing);
  hideBar();
  closePrefModal();
}

/* ======================================================
   GOOGLE ANALYTICS 4
   ------------------------------------------------------
   Wystarczy wkleić identyfikator pomiaru poniżej (G-XXXXXXXXXX).
   Dopóki stała jest pusta, nic się nie ładuje – zero żądań,
   zero cookies. Zgodą sterują ustawienia Consent Mode v2
   zadeklarowane w <head>, więc do momentu akceptacji GA4
   działa w trybie bezcookiesowym.
   ====================================================== */
if (GA4_ID) {
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(tag);

  gtag('js', new Date());
  gtag('config', GA4_ID, { anonymize_ip: true });

  // Zdarzenia konwersji: telefon, e-mail i wysłanie formularza
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.addEventListener('click', () => gtag('event', 'klik_telefon', { miejsce: location.pathname }));
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.addEventListener('click', () => gtag('event', 'klik_email', { miejsce: location.pathname }));
  });
}


/* ======================================================
   MODALE – wspólna obsługa (fokus, Escape, kliknięcie w tło)
   ====================================================== */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
let openModal = null;
let lastFocused = null;

function showModal(modal, initialFocus) {
  if (!modal) return;
  lastFocused = document.activeElement;
  modal.classList.add('open');
  modal.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  openModal = modal;
  // Overlay ma visibility: hidden z transition – focus() zadziała dopiero po
  // przeliczeniu stylów. setTimeout, nie rAF: rAF nie odpala się w nieaktywnej karcie.
  setTimeout(() => {
    (initialFocus || modal.querySelector(FOCUSABLE))?.focus();
  }, 0);
}

function hideModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (openModal === modal) openModal = null;
  // Fokus wraca tam, skąd modal otwarto – wymóg WCAG 2.4.3
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

// Jeden globalny listener zamiast trzech: Escape zamyka, Tab krąży wewnątrz modala
document.addEventListener('keydown', (e) => {
  if (!openModal) return;
  if (e.key === 'Escape') {
    hideModal(openModal);
    return;
  }
  if (e.key !== 'Tab') return;
  const items = [...openModal.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/** Podpina zamykanie kliknięciem w tło modala. */
function bindBackdrop(modal) {
  on(modal, 'click', (e) => { if (e.target === modal) hideModal(modal); });
}

/* --- Modal preferencji cookies --- */
function openPrefModal(e) {
  if (e) e.preventDefault();
  if (!cookiePrefModal) return;
  const s = readConsent();
  if (consentAnalytics) consentAnalytics.checked = s ? !!s.analytics : false;
  if (consentMarketing) consentMarketing.checked = s ? !!s.marketing : false;
  showModal(cookiePrefModal, $('cookiePrefClose'));
}

function closePrefModal() {
  hideModal(cookiePrefModal);
}

on($('cookieAcceptAll'), 'click', () => saveConsent(true, true));
on($('cookieRejectAll'), 'click', () => saveConsent(false, false));
on($('cookieCustomize'), 'click', openPrefModal);
on($('cookiePrefClose'), 'click', closePrefModal);
on($('cookieAcceptAllPref'), 'click', () => saveConsent(true, true));
on($('cookieSavePrefs'), 'click', () => {
  saveConsent(!!consentAnalytics?.checked, !!consentMarketing?.checked);
});
bindBackdrop(cookiePrefModal);

['openCookieSettings', 'openCookieSettingsNote'].forEach(id => {
  on($(id), 'click', e => { e.preventDefault(); openPrefModal(e); });
});


/* --- Modal polityki prywatności --- */
const privacyModal = $('privacyModal');
const privacyClose = $('privacyClose');

const openPrivacyModal = (e) => {
  if (e) e.preventDefault();
  showModal(privacyModal, privacyClose);
};

on(privacyClose, 'click', () => hideModal(privacyModal));
bindBackdrop(privacyModal);

['openPrivacyLink', 'openPrivacyFooter', 'cookiePrivacyLink'].forEach(id => {
  on($(id), 'click', openPrivacyModal);
});


/* --- Modal RODO --- */
const rodoModal = $('rodoModal');
const rodoClose = $('rodoClose');

const openRodoModal = (e) => {
  if (e) e.preventDefault();
  showModal(rodoModal, rodoClose);
};

on(rodoClose, 'click', () => hideModal(rodoModal));
bindBackdrop(rodoModal);

on($('openRodoFooter'), 'click', openRodoModal);


/* --- Rok w stopce --- */
const footerYear = $('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();


/* --- FAQ – akordeon --- */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!btn || !answer) return;
  btn.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    answer.hidden = !open;
  });
});
