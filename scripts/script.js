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

    const downloadBtn = document.getElementById('DownloadPDF');
    const checkButtonLanguage = document.getElementById('checkButtonLanguage');

    // --- Lógica de Traducción (i18n) ---
    const translations = {
        es: null,
        en: null
    };

    const loadLanguage = async (lang) => {
        // Cambiar el atributo lang del HTML
        document.documentElement.lang = lang;

        // Si ya tenemos las traducciones, las usamos. Si no, las cargamos.
        if (!translations[lang]) {
            try {
                const response = await fetch(`languages/${lang}.json`);
                translations[lang] = await response.json();
            } catch (error) {
                console.error(`Error cargando el idioma ${lang}:`, error);
                return;
            }
        }

        const data = translations[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) {
                // Si la traducción contiene HTML (como tags <span>), usamos innerHTML
                if (data[key].includes('<')) {
                    el.innerHTML = data[key];
                } else {
                    el.textContent = data[key];
                }
            }
        });

        // Actualizar el título de la página
        if (data.page_title) {
            document.title = data.page_title;
        }

        // --- Extensión: Cambiar Meta Tags para SEO por idioma ---
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && data.meta_desc) {
            metaDesc.setAttribute('content', data.meta_desc);
        }

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && data.meta_keywords) {
            metaKeywords.setAttribute('content', data.meta_keywords);
        }

        // Actualizar Open Graph (opcional pero recomendado para "toda la página")
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogTitle && data.page_title) ogTitle.setAttribute('content', data.page_title);
        if (ogDesc && data.meta_desc) ogDesc.setAttribute('content', data.meta_desc);
    };

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            const isEnglish = checkButtonLanguage.checked;
            const pdfUrl = 'docs/cv_srg_' + ((isEnglish) ? 'en' : 'es') + '.pdf'; // Si está pulsado el pdf a descargar será en idioma ingles, si no en español. El idioma por defecto será el
            //const pdfUrl = 'docs/cv_srg.pdf'; // Ruta del PDF (en la carpeta base de GitHub)
            fetch(pdfUrl, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        // Si existe, creamos el enlace y forzamos la descarga
                        const link = document.createElement("a");
                        link.href = pdfUrl;
                        link.download = isEnglish ? "CV_SergioRodriguez_EN.pdf" : "CV_SergioRodriguez_ES.pdf";
                        link.click();
                    } else {
                        alert(isEnglish ? "CV download is currently unavailable. Please try again later." : "No es posible descargar el CV actualmente. Por favor, inténtalo más tarde.");
                    }
                })
                .catch(error => {
                    console.error("Error al intentar descargar el PDF:", error);
                    alert(checkButtonLanguage.checked ? "CV download is currently unavailable. Please try again later." : "No es posible descargar el CV actualmente. Por favor, inténtalo más tarde.");
                });
        });
    }

    if (checkButtonLanguage) {
        const updateLangLabels = () => {
            const esLabel = document.querySelector('.lang-label:first-child');
            const enLabel = document.querySelector('.lang-label:last-child');
            const isEnglish = checkButtonLanguage.checked;
            
            if (isEnglish) {
                if (esLabel) esLabel.style.color = 'var(--text-secondary)';
                if (enLabel) enLabel.style.color = 'var(--primary)';
                loadLanguage('en');
            } else {
                if (esLabel) esLabel.style.color = 'var(--primary)';
                if (enLabel) enLabel.style.color = 'var(--text-secondary)';
                loadLanguage('es');
            }
        };

        checkButtonLanguage.addEventListener('change', updateLangLabels);
        
        // --- Detección automática del idioma del navegador ---
        // Obtenemos el idioma (ej: 'en-US' -> 'en')
        const browserLang = navigator.language.slice(0, 2);
        
        // Si el idioma detectado es inglés, activamos el checkbox
        if (browserLang === 'en') {
            checkButtonLanguage.checked = true;
        } else {
            // Por defecto español (checkbox desactivado)
            checkButtonLanguage.checked = false;
        }
        
        // Forzamos la carga inicial del idioma basado en el estado del checkbox
        updateLangLabels();
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

    // 7. Configuracion de la URL para el botón de proyectos 
    const button_projects = document.getElementById("button_projects").setAttribute("href", "https://sergiorg03.github.io/projects-showcase/");

    // Ejecuto la config para cada uno de mis perfiles
    setupSocialBtn('btn-linkedin');
    setupSocialBtn('btn-github');
    //setupSocialBtn('btn-gitlab');

    // Configuración para el correo electronico y evitar spam
    const user = "sergiorodriguezprofesional";
    const domain = "gmail.com";

    const email = user + "@" + domain;
    document.getElementById("contacto").href = "mailto:" + email;

});
