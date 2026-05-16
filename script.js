/* =============================================
   RemTax Iwona Janiak – script.js
   ============================================= */

'use strict';

/* --- Navbar scroll effect --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* --- Mobile nav toggle --- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

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


/* --- Stats counter animation --- */
const counters = document.querySelectorAll('.stat-num[data-target]');
let counterTriggered = false;

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const animateCounter = (el, target, duration = 1800) => {
  const start = Date.now();
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
};

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counterTriggered) {
    counterTriggered = true;
    counters.forEach(el => {
      animateCounter(el, parseInt(el.dataset.target, 10));
    });
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);


/* --- Testimonials slider --- */
const track = document.getElementById('testimonialsTrack');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let autoSlideTimer;
let isDragging = false;
let startX = 0;
let scrollStartX = 0;

const totalSlides = dots.length;

const goToSlide = (index) => {
  currentSlide = (index + totalSlides) % totalSlides;
  const slideWidth = track.parentElement.offsetWidth;
  track.style.transform = `translateX(-${currentSlide * (slideWidth + 32)}px)`;
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
    d.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
  });
};

const resetAutoSlide = () => {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(() => goToSlide(currentSlide + 1), 5500);
};

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { goToSlide(i); resetAutoSlide(); });
});

// Drag / swipe support
track.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  scrollStartX = currentSlide;
  track.style.transition = 'none';
});
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  const slideWidth = track.parentElement.offsetWidth;
  track.style.transform = `translateX(${-currentSlide * (slideWidth + 32) + dx}px)`;
});
window.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  track.style.transition = '';
  const dx = e.clientX - startX;
  if (dx < -60) goToSlide(currentSlide + 1);
  else if (dx > 60) goToSlide(currentSlide - 1);
  else goToSlide(currentSlide);
  resetAutoSlide();
});

// Touch support
track.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  track.style.transition = 'none';
}, { passive: true });
track.addEventListener('touchend', (e) => {
  track.style.transition = '';
  const dx = e.changedTouches[0].clientX - startX;
  if (dx < -60) goToSlide(currentSlide + 1);
  else if (dx > 60) goToSlide(currentSlide - 1);
  else goToSlide(currentSlide);
  resetAutoSlide();
}, { passive: true });

resetAutoSlide();


/* --- Contact form handler --- */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Basic validation
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
      field.style.borderColor = '#E07070';
      valid = false;
    }
  });
  if (!valid) return;

  // Simulate sending
  submitBtn.disabled = true;
  submitText.textContent = 'Wysyłanie…';

  setTimeout(() => {
    submitBtn.hidden = true;
    form.querySelectorAll('input, select, textarea, button').forEach(el => {
      if (el !== submitBtn) el.disabled = true;
    });
    successMsg.hidden = false;
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1400);
});

/* --- Hero subtle parallax --- */
const heroBg = document.querySelector('.hero-bg-pattern');
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
  }
}, { passive: true });


/* ======================================================
   COOKIE CONSENT – Google Consent Mode v2
   ====================================================== */
const COOKIE_KEY = 'remtax_consent_v2';

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
const savedConsent = JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null');
if (savedConsent) updateGCM(savedConsent.analytics, savedConsent.marketing);

const cookieBar = document.getElementById('cookieBar');
const cookiePrefModal = document.getElementById('cookiePrefModal');
const consentAnalytics = document.getElementById('consentAnalytics');
const consentMarketing = document.getElementById('consentMarketing');

const showBar = () => setTimeout(() => cookieBar.classList.add('visible'), 900);
const hideBar = () => cookieBar.classList.remove('visible');

if (!savedConsent) showBar();

function saveConsent(analytics, marketing) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics, marketing, ts: Date.now() }));
  updateGCM(analytics, marketing);
  hideBar();
  closePrefModal();
}

function openPrefModal(e) {
  if (e) e.preventDefault();
  const s = JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null');
  consentAnalytics.checked = s ? !!s.analytics : false;
  consentMarketing.checked = s ? !!s.marketing : false;
  cookiePrefModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePrefModal() {
  cookiePrefModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cookieAcceptAll').addEventListener('click', () => saveConsent(true, true));
document.getElementById('cookieRejectAll').addEventListener('click', () => saveConsent(false, false));
document.getElementById('cookieCustomize').addEventListener('click', openPrefModal);
document.getElementById('cookiePrefClose').addEventListener('click', closePrefModal);
document.getElementById('cookieAcceptAllPref').addEventListener('click', () => saveConsent(true, true));
document.getElementById('cookieSavePrefs').addEventListener('click', () => {
  saveConsent(consentAnalytics.checked, consentMarketing.checked);
});

cookiePrefModal.addEventListener('click', e => { if (e.target === cookiePrefModal) closePrefModal(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && cookiePrefModal.classList.contains('open')) closePrefModal();
});

['openCookieSettings', 'openCookieSettingsNote'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', e => { e.preventDefault(); openPrefModal(e); });
});

const cookiePrivacy = document.getElementById('cookiePrivacyLink');


/* ======================================================
   PRIVACY POLICY MODAL
   ====================================================== */
const privacyModal = document.getElementById('privacyModal');
const privacyClose = document.getElementById('privacyClose');

const openPrivacyModal = (e) => {
  if (e) e.preventDefault();
  privacyModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  privacyClose.focus();
};

const closePrivacyModal = () => {
  privacyModal.classList.remove('open');
  document.body.style.overflow = '';
};

// Close on button click
privacyClose.addEventListener('click', closePrivacyModal);

// Close on backdrop click
privacyModal.addEventListener('click', (e) => {
  if (e.target === privacyModal) closePrivacyModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && privacyModal.classList.contains('open')) {
    closePrivacyModal();
  }
});

// Open triggers – privacy
const privacyTriggers = [
  document.getElementById('openPrivacyLink'),
  document.getElementById('openPrivacyFooter'),
  cookiePrivacy,
];

privacyTriggers.forEach(trigger => {
  if (trigger) trigger.addEventListener('click', openPrivacyModal);
});

// RODO modal
const rodoModal = document.getElementById('rodoModal');
const rodoClose = document.getElementById('rodoClose');

const openRodoModal = (e) => {
  if (e) e.preventDefault();
  rodoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  rodoClose.focus();
};

const closeRodoModal = () => {
  rodoModal.classList.remove('open');
  document.body.style.overflow = '';
};

rodoClose.addEventListener('click', closeRodoModal);

rodoModal.addEventListener('click', (e) => {
  if (e.target === rodoModal) closeRodoModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && rodoModal.classList.contains('open')) {
    closeRodoModal();
  }
});

const rodoTrigger = document.getElementById('openRodoFooter');
if (rodoTrigger) rodoTrigger.addEventListener('click', openRodoModal);
