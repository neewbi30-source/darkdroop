const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

function closeMenu() {
  navMenu?.classList.remove('is-open');
  navToggle?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

function openMenu() {
  navMenu?.classList.add('is-open');
  navToggle?.classList.add('is-open');
  navToggle?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
}

navToggle?.addEventListener('click', () => {
  if (navMenu?.classList.contains('is-open')) closeMenu();
  else openMenu();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const form = document.querySelector('.join-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const original = btn.textContent;
    btn.textContent = 'SIGNAL LOST IN THE FOG';
    btn.style.background = 'var(--magenta)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      form.reset();
    }, 2500);
  });
}

/* scroll reveal */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.querySelector('.meter-bar[data-width]')) {
          entry.target.querySelectorAll('.meter-bar[data-width]').forEach((bar) => {
            bar.style.setProperty('--w', bar.dataset.width + '%');
          });
        }
        if (entry.target.classList.contains('hero-stats')) {
          animateCounters(entry.target);
        }
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .hero-stats').forEach((el) => {
  revealObserver.observe(el);
});

/* hero load */
requestAnimationFrame(() => {
  document.body.classList.add('is-loaded');
});

/* counter animation */
function animateCounters(container) {
  container.querySelectorAll('[data-count]').forEach((el) => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();
    const isInfinite = target >= 9999;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (isInfinite) {
        el.textContent = progress < 1 ? Math.floor(eased * 9999).toLocaleString() : '∞';
      } else {
        el.textContent = Math.floor(eased * target).toLocaleString();
      }
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* nav scroll */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* cursor glow */
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  document.body.classList.add('has-cursor');
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  }, { passive: true });
}

/* hero parallax — desktop only */
const heroFrame = document.getElementById('hero-frame');
if (heroFrame && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    heroFrame.style.transform = `perspective(800px) rotateY(${x * 0.3}deg) rotateX(${-y * 0.3}deg) translate(${x}px, ${y}px)`;
  }, { passive: true });
}

/* floating particles */
const particlesEl = document.getElementById('particles');
if (particlesEl) {
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = 8 + Math.random() * 12 + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    if (Math.random() > 0.7) p.style.background = 'var(--magenta)';
    if (Math.random() > 0.85) p.style.background = 'var(--cyan)';
    particlesEl.appendChild(p);
  }
}

/* terminal typewriter */
const terminalLines = [
  '[ORACLE] dr_foss: folk warmth meets machine logic. floor is ready.',
  '[ELF] basswitch: foss sent the filter. we obey. o yeah baby.',
  '[ELF] droop_elder: the bass is a prayer. the herb is the answer.',
  '[SYS] signal encrypted. next drop incoming...',
  '[ELF] neonknave: firewall breached. warehouse coords uploading...',
  '[ORACLE] dr_foss: voice of a poet. mind of a system. make it dance.',
  '[ELF] basswitch: kick drum at 04:00. don\'t be late.',
  '[SYS] connection stable. smoke levels: optimal.',
];

const typingEl = document.getElementById('terminal-typing');
let lineIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeTerminal() {
  if (!typingEl) return;
  const current = terminalLines[lineIndex];

  if (!isDeleting) {
    typingEl.innerHTML = '<span class="t-cyan">' + current.substring(0, charIndex + 1) + '</span>';
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeTerminal, 2500);
      return;
    }
  } else {
    typingEl.innerHTML = '<span class="t-cyan">' + current.substring(0, charIndex) + '</span>';
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      lineIndex = (lineIndex + 1) % terminalLines.length;
    }
  }

  setTimeout(typeTerminal, isDeleting ? 30 : 50);
}

setTimeout(typeTerminal, 2000);

/* logo glitch */
const logo = document.querySelector('.logo.glitch');
if (logo) {
  setInterval(() => {
    if (Math.random() > 0.7) {
      logo.style.textShadow = '2px 0 var(--magenta), -2px 0 var(--cyan)';
      setTimeout(() => { logo.style.textShadow = ''; }, 100);
    }
  }, 3000);
}

/* strain meters on scroll - also observe strains directly */
document.querySelectorAll('.strain').forEach((strain) => {
  revealObserver.observe(strain);
  const bar = strain.querySelector('.meter-bar[data-width]');
  if (bar) {
    const barObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bar.style.setProperty('--w', bar.dataset.width + '%');
        }
      },
      { threshold: 0.5 }
    );
    barObserver.observe(strain);
  }
});

/* gallery tilt — desktop only */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
}

document.body.addEventListener('click', (e) => {
  if (document.body.classList.contains('menu-open') &&
      !navMenu?.contains(e.target) && !navToggle?.contains(e.target)) {
    closeMenu();
  }
});
