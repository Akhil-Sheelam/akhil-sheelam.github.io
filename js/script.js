/* ── Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hide'), 600);
});

/* ── Scroll progress + navbar ── */
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('scroll-progress');
const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  const st = window.scrollY;
  const dh = document.documentElement.scrollHeight - window.innerHeight;

  progressBar.style.width = (dh > 0 ? (st / dh) * 100 : 0) + '%';
  navbar.classList.toggle('scrolled', st > 20);
  backTop.classList.toggle('show', st > 400);

  let cur = '';

  document.querySelectorAll('section[id]').forEach(section => {
    if (st >= section.offsetTop - 100) {
      cur = section.id;
    }
  });

  document.querySelectorAll('.nav-center a').forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === '#' + cur
    );
  });
}, { passive: true });

/* ── Back to top ── */
backTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* ── Mobile drawer ── */
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('mobileDrawer');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  drawer.classList.toggle('open');

  document.body.style.overflow =
    drawer.classList.contains('open') ? 'hidden' : '';
});

function closeMob() {
  hamburger.classList.remove('open');
  drawer.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  if (
    drawer.classList.contains('open') &&
    !drawer.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMob();
  }
});

/* ── Scroll reveal ── */
const revealObs = new IntersectionObserver(
  entries => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 70);

        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll('.reveal').forEach(element => {
  revealObs.observe(element);
});

/* ── Project slider ── */
const track = document.getElementById('projTrack');
const prevBtn = document.getElementById('projPrev');
const nextBtn = document.getElementById('projNext');
const dotsWrap = document.getElementById('projDots');

let curProject = 0;
let autoSlide = null;

const projectCards = Array.from(
  track.querySelectorAll('.proj-card')
);

projectCards.forEach((_, index) => {
  const dot = document.createElement('div');

  dot.className =
    'proj-dot' + (index === 0 ? ' active' : '');

  dot.addEventListener('click', () => {
    slideTo(index);
  });

  dotsWrap.appendChild(dot);
});

const dots = Array.from(
  dotsWrap.querySelectorAll('.proj-dot')
);

function slideTo(index) {
  const card = projectCards[index];

  if (!card) return;

  track.scrollTo({
    left: card.offsetLeft - 10,
    behavior: 'smooth'
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  curProject = index;
}

prevBtn.addEventListener('click', () => {
  slideTo(
    (curProject - 1 + projectCards.length) %
      projectCards.length
  );
});

nextBtn.addEventListener('click', () => {
  slideTo(
    (curProject + 1) %
      projectCards.length
  );
});

function startAutoSlide() {
  clearInterval(autoSlide);

  autoSlide = setInterval(() => {
    slideTo(
      (curProject + 1) %
        projectCards.length
    );
  }, 5200);
}

startAutoSlide();

track.addEventListener('pointerdown', () => {
  clearInterval(autoSlide);
});

track.addEventListener('pointerup', startAutoSlide);

track.addEventListener(
  'touchstart',
  () => clearInterval(autoSlide),
  { passive: true }
);

track.addEventListener(
  'touchend',
  startAutoSlide,
  { passive: true }
);

/* ── Hero typing animation ── */
const typingEl =
  document.getElementById('typingRole');

const roleWords = [
  'Data Analyst',
  'Python & SQL Enthusiast',
  'Power BI Dashboard Builder',
  'Business Insights Explorer'
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  if (!typingEl) return;

  const word = roleWords[roleIndex];

  if (deleting) {
    charIndex--;
    typingEl.textContent =
      word.slice(0, charIndex);
  } else {
    charIndex++;
    typingEl.textContent =
      word.slice(0, charIndex);
  }

  if (!deleting && charIndex === word.length) {
    deleting = true;

    setTimeout(typeRole, 1500);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex =
      (roleIndex + 1) % roleWords.length;
  }

  setTimeout(
    typeRole,
    deleting ? 45 : 75
  );
}

setTimeout(typeRole, 700);

/* ── Animated hero counters ── */
const counterObs = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;

      if (element.dataset.done === '1') return;

      element.dataset.done = '1';

      const target =
        parseFloat(element.dataset.target || '0');

      const decimals =
        parseInt(
          element.dataset.decimals || '0',
          10
        );

      const suffix =
        element.dataset.suffix || '';

      const duration = 1300;
      const start = performance.now();

      function tick(now) {
        const progress =
          Math.min(
            (now - start) / duration,
            1
          );

        const eased =
          1 - Math.pow(1 - progress, 3);

        const value =
          target * eased;

        if (
          element.dataset.format === 'k'
        ) {
          const shown =
            value >= 1000
              ? (
                  value / 1000
                ).toFixed(
                  value >= 5000 ? 0 : 1
                ) + 'K'
              : Math.round(value).toString();

          element.textContent =
            shown + suffix;
        } else {
          element.textContent =
            value.toFixed(decimals) +
            suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);

      counterObs.unobserve(element);
    });
  },
  { threshold: 0.6 }
);

document
  .querySelectorAll('.count-up')
  .forEach(element => {
    counterObs.observe(element);
  });

/* ── Contact form → Formspree ── */
const contactForm =
  document.getElementById('contactForm');

const formStatus =
  document.getElementById('form-status');

const submitBtn =
  document.getElementById('submitBtn');

const btnText =
  document.getElementById('btn-text');

const btnLoader =
  document.getElementById('btn-loader');

const formSuccess =
  document.getElementById('formSuccess');

function showStatus(message, success) {
  formStatus.style.display = 'block';

  formStatus.textContent = message;

  formStatus.style.background =
    success
      ? 'rgba(74,222,128,0.1)'
      : 'rgba(248,113,113,0.1)';

  formStatus.style.border =
    success
      ? '1px solid rgba(74,222,128,0.3)'
      : '1px solid rgba(248,113,113,0.3)';

  formStatus.style.color =
    success
      ? '#4ade80'
      : '#f87171';
}

function setLoading(loading) {
  submitBtn.disabled = loading;

  btnText.style.display =
    loading ? 'none' : 'flex';

  btnLoader.style.display =
    loading ? 'flex' : 'none';
}

function resetForm() {
  contactForm.reset();

  contactForm.style.display = 'block';

  formSuccess.classList.remove('show');

  formStatus.style.display = 'none';
}

contactForm.addEventListener(
  'submit',
  async function (event) {
    event.preventDefault();

    setLoading(true);

    formStatus.style.display = 'none';

    const payload = {
      name:
        document
          .getElementById('f-name')
          .value.trim(),

      email:
        document
          .getElementById('f-email')
          .value.trim(),

      phone:
        document
          .getElementById('f-phone')
          .value.trim() ||
        'Not provided',

      subject:
        document
          .getElementById('f-subject')
          .value.trim(),

      message:
        document
          .getElementById('f-message')
          .value.trim()
    };

    try {
      const response =
        await fetch(
          'https://formspree.io/f/mdalbbqg',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
              'Accept':
                'application/json'
            },
            body:
              JSON.stringify(payload)
          }
        );

      const json =
        await response.json();

      if (response.ok) {
        contactForm.style.display =
          'none';

        formSuccess.classList.add(
          'show'
        );
      } else {
        const errorMessage =
          (json.errors || [])
            .map(error => error.message)
            .join(', ') ||
          'Something went wrong. Please try again.';

        showStatus(
          '❌ ' + errorMessage,
          false
        );
      }
    } catch (error) {
      showStatus(
        '❌ Network error. Please check your connection and try again.',
        false
      );
    } finally {
      setLoading(false);
    }
  }
);
