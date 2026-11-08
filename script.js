// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMenu() {
  mobileMenu.classList.remove('open');
}

// Scroll-in animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-card, .about-card, .skill-group, .contact-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Add visible class toggle via IntersectionObserver
const styleSheet = document.createElement('style');
styleSheet.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(styleSheet);

// Screenshot carousels (swipe / arrows / dots)
document.querySelectorAll('.proof-gallery').forEach(gallery => {
  const track = gallery.querySelector('.proof-grid');
  const items = [...track.querySelectorAll('.proof-item')];
  const prev = gallery.querySelector('.proof-nav.prev');
  const next = gallery.querySelector('.proof-nav.next');
  const dotsWrap = gallery.querySelector('.proof-dots');
  const step = () => items[0].offsetWidth + 16;
  const dots = items.map((_, i) => {
    const d = document.createElement('button');
    d.setAttribute('aria-label', 'Go to screenshot ' + (i + 1));
    d.addEventListener('click', () => track.scrollTo({ left: i * step() }));
    dotsWrap.appendChild(d);
    return d;
  });
  const update = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const atEnd = track.scrollLeft >= maxScroll - 4;
    const idx = atEnd ? items.length - 1 : Math.round(track.scrollLeft / step());
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = atEnd;
    dotsWrap.style.display = maxScroll > 4 ? '' : 'none';
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step() }));
  next.addEventListener('click', () => track.scrollBy({ left: step() }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});

// Screenshot lightbox (swipe or arrows to move between screenshots)
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = lightbox.querySelector('img');
  const lbCap = lightbox.querySelector('.lightbox-caption');
  let group = [], current = 0;
  const show = i => {
    current = (i + group.length) % group.length;
    const link = group[current];
    lbImg.src = link.href;
    lbImg.alt = link.querySelector('img').alt;
    lbCap.textContent = link.dataset.caption + '  (' + (current + 1) + ' / ' + group.length + ')';
  };
  const closeLightbox = () => { lightbox.hidden = true; lbImg.src = ''; };
  document.querySelectorAll('.proof-item').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      group = [...link.closest('.proof-grid').querySelectorAll('.proof-item')];
      show(group.indexOf(link));
      lightbox.hidden = false;
    });
  });
  lightbox.querySelector('.lightbox-nav.prev').addEventListener('click', e => { e.stopPropagation(); show(current - 1); });
  lightbox.querySelector('.lightbox-nav.next').addEventListener('click', e => { e.stopPropagation(); show(current + 1); });
  lightbox.addEventListener('click', e => { if (e.target !== lbImg) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  let startX = null;
  lightbox.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
}
