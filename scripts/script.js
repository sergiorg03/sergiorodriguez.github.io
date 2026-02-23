document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica para las animaciones de aparición al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Aplico la animación a todos los elementos que tienen que aparecer
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Por si las moscas: si en 1.5s no han saltado las animaciones, fuerzo que se vea todo
    setTimeout(() => {
        revealElements.forEach(el => el.classList.add('active'));
    }, 1500);

    // 2. Scroll suave para los links de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.querySelector(targetId);
            if (target) {
                const nav = document.querySelector('nav');
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Efecto de movimiento (parallax) para las burbujas del fondo
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const blob1 = document.querySelector('.blob-1');
        const blob2 = document.querySelector('.blob-2');
        
        if (blob1) {
            blob1.style.transform = `translate(${mouseX * 30}px, ${mouseY * 30}px)`;
        }
        if (blob2) {
            blob2.style.transform = `translate(${-mouseX * 30}px, -${mouseY * 30}px)`;
        }
    });

    // 4. Efecto de la barra de navegación al hacer scroll
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.padding = '0.75rem 0';
                nav.style.boxShadow = 'var(--shadow-md)';
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
            } else {
                nav.style.padding = '1rem 0';
                nav.style.boxShadow = 'none';
                nav.style.background = 'rgba(255, 255, 255, 0.8)';
            }
        });
    }

    // 5. Función para descargar mi CV en PDF
    const downloadBtn = document.getElementById('DownloadPDF');

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {

        if (typeof html2pdf === 'undefined') {
          alert('Espera un segundo, la librería para el PDF aún se está cargando...');
          return;
        }

        // Selecciono el contenedor principal para el PDF
        const element = document.getElementById('cv-content');

        // Reseteo el scroll y estilos para que el PDF salga niquelado
        window.scrollTo(0, 0);
        document.body.style.height = "auto";
        document.body.style.overflow = "visible";

        const opt = {
          margin: 0.2,
          filename: 'SergioRodriguezCV.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0
          },
          jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait'
          }
        };

        // Lanzo la generación y descarga del PDF
        html2pdf().set(opt).from(element).outputPdf('blob').then(function (pdf) {
            const url = URL.createObjectURL(pdf);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'SergioRodriguezCV.pdf';
            a.click();
        });        
      });
    }

    // 6. Configuración de mis botones de redes sociales
    const setupSocialBtn = (id) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                const url = btn.getAttribute('href');
                if (url) {
                    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
                    window.open(targetUrl, '_blank');
                }
            });
        }
    };

    // Ejecuto la config para cada uno de mis perfiles
    setupSocialBtn('btn-linkedin');
    setupSocialBtn('btn-github');
    setupSocialBtn('btn-gitlab');
});
