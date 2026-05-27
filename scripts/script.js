document.addEventListener('DOMContentLoaded', () => {
  // Cursor personalizado y seguidor (ring)
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (cursor) {
      cursor.style.left = (mx - 4) + 'px';
      cursor.style.top = (my - 4) + 'px';
    }
  });

  (function animRing() {
    rx += (mx - rx - 14) * 0.12;
    ry += (my - ry - 14) * 0.12;
    if (ring) {
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
    }
    requestAnimationFrame(animRing);
  })();

  // Efecto hover en enlaces y botones para agrandar el seguidor
  document.querySelectorAll('a, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (ring) {
        ring.style.width = '44px';
        ring.style.height = '44px';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (ring) {
        ring.style.width = '28px';
        ring.style.height = '28px';
      }
    });
  });

  // Animación de aparición (reveal) al hacer scroll y carga progresiva de barras
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        if (e.target.querySelector('.bar-fill')) {
          e.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
            const pct = bar.dataset.pct;
            setTimeout(() => {
              bar.style.width = pct + '%';
              const pEl = document.getElementById('p' + (i + 1));
              if (pEl) {
                let cur = 0;
                const target = parseInt(pct);
                const inc = setInterval(() => {
                  cur += 2;
                  if (cur >= target) {
                    cur = target;
                    clearInterval(inc);
                  }
                  pEl.textContent = cur + '%';
                }, 20);
              }
            }, i * 150);
          });
        }
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(r => obs.observe(r));
});
