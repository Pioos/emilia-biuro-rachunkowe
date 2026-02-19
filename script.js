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
   COOKIE CONSENT BANNER
   ====================================================== */
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieReject = document.getElementById('cookieReject');
const cookiePrivacy = document.getElementById('cookiePrivacyLink');

const COOKIE_KEY = 'remtax_cookie_consent';

const hideCookieBanner = () => {
  cookieBanner.classList.remove('visible');
};

const showCookieBanner = () => {
  // Small delay so it slides in after page load
  setTimeout(() => cookieBanner.classList.add('visible'), 900);
};

if (!localStorage.getItem(COOKIE_KEY)) {
  showCookieBanner();
}

cookieAccept.addEventListener('click', () => {
  localStorage.setItem(COOKIE_KEY, 'accepted');
  hideCookieBanner();
});

cookieReject.addEventListener('click', () => {
  localStorage.setItem(COOKIE_KEY, 'rejected');
  hideCookieBanner();
});


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

// Open triggers
const privacyTriggers = [
  document.getElementById('openPrivacyLink'),
  document.getElementById('openPrivacyFooter'),
  document.getElementById('openRodoFooter'),
  cookiePrivacy,
];

privacyTriggers.forEach(trigger => {
  if (trigger) trigger.addEventListener('click', openPrivacyModal);
});
