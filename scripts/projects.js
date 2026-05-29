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

  // Animación de aparición (reveal) al hacer scroll
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(r => obs.observe(r));

  // Formulario de Ideas (Formspree)
  const ideasForm = document.getElementById('ideas-form');
  if (ideasForm) {
    ideasForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = ideasForm.querySelector('.submit-btn');
      const originalText = './enviar_propuesta.sh';
      
      submitBtn.innerText = './enviando.sh...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(`https://formspree.io/f/xlgpbznk`, {
          method: 'POST',
          body: new FormData(ideasForm),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          submitBtn.innerText = './enviado_con_exito.sh!';
          submitBtn.style.borderColor = '#00ff6e';
          submitBtn.style.color = '#00ff6e';
          ideasForm.reset();
        } else {
          throw new Error('Error al enviar el formulario');
        }
      } catch (error) {
        console.error('Error:', error);
        submitBtn.innerText = './error_al_enviar.sh';
        submitBtn.style.borderColor = '#ef4444';
        submitBtn.style.color = '#ef4444';
      } finally {
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 4000);
      }
    });
  }
});
