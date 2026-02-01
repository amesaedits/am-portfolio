/* ========== Fixed Header Behavior ========== */
(function() {
    const header = document.querySelector('header');
    if (!header) return;
    
    function updateHeader() {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
})();

/* ========== FAQ Functionality ========== */
(function() {
    // Preguntas frecuentes en español
    const faqQuestions = [
        {
            "q": "¿Qué pasa si no tengo una idea clara del estilo que quiero?",
            "a": "No hay problema. Te ayudo a definir el tono visual, ritmo y referencias según tu objetivo y público."
        },
        {
            "q": "¿Puedo pedir que el video tenga un estilo como el de cierto influencer o marca?",
            "a": "Claro. Mándame ejemplos o reels de referencia, y adapto el look y ritmo a tu estilo personal o profesional."
        },
        {
            "q": "¿Qué diferencia tu edición de otros editores?",
            "a": "No solo corto y pego. Cada video se diseña con intención: retención, storytelling y conversión."
        },
        {
            "q": "¿Cuánto tiempo toma una edición estándar?",
            "a": "Normalmente 48–72 horas para edits tipo social; proyectos largos o con motion graphics pueden tardar más."
        },
        {
            "q": "¿Ofreces entregas urgentes?",
            "a": "Sí — servicio rush 24 h disponible con tarifa adicional y prioridad en la cola de producción."
        },
        {
            "q": "¿Cuántas rondas de revisiones incluye el precio?",
            "a": "Incluyo 2 rondas de revisiones gratuitas. Revisiones extra se cobran aparte o se incluyen en planes mensuales."
        },
        {
            "q": "¿Puedo pagar por proyecto o por paquete mensual?",
            "a": "Ambos. Si produces contenido frecuente, el plan mensual te sale más rentable y con prioridad de entrega."
        }
    ];

    function updateFAQContent() {
        console.log('Actualizando contenido FAQ en español');
        
        const faqList = document.getElementById('faqList');
        
        if (faqList && Array.isArray(faqQuestions) && faqQuestions.length > 0) {
            faqList.innerHTML = '';
            
            faqQuestions.forEach((f, idx) => {
                const item = document.createElement('div');
                item.className = 'faq-item';
                item.setAttribute('role', 'listitem');
                item.innerHTML = `
                    <button class="faq-question" aria-expanded="false" aria-controls="faq${idx}">
                        <span>${f.q}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="faq-answer" id="faq${idx}">
                        <p>${f.a}</p>
                    </div>
                `;
                faqList.appendChild(item);
            });
            
            // Re-attach FAQ events after updating content
            attachFAQEvents();
        }
    }

    function attachFAQEvents() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                // Configurar estado inicial
                question.setAttribute('aria-expanded', 'false');
                answer.style.display = 'none';
                
                // Remover event listeners previos para evitar duplicados
                const newQuestion = question.cloneNode(true);
                question.parentNode.replaceChild(newQuestion, question);
                
                // Agregar nuevos event listeners
                newQuestion.addEventListener('click', handleFAQClick);
                newQuestion.addEventListener('keydown', handleFAQKeydown);
            }
        });
    }

    function handleFAQClick(e) {
        const question = e.currentTarget;
        toggleFaq(question);
    }

    function handleFAQKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const question = e.currentTarget;
            toggleFaq(question);
        }
    }

    function toggleFaq(question) {
        const answer = question.nextElementSibling;
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        question.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            answer.style.display = 'block';
            // Pequeño delay para la transición
            setTimeout(() => {
                answer.style.opacity = '1';
                answer.style.transform = 'translateY(0)';
            }, 10);
        } else {
            answer.style.opacity = '0';
            answer.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                answer.style.display = 'none';
            }, 300);
        }
    }

    // Inicializar FAQ cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateFAQContent);
    } else {
        updateFAQContent();
    }
})();

/* ========== Creators Carousel - AUTOMÁTICO Y EN LOOP SUAVE ========== */
(function(){
    const track = document.querySelector('.creators-track');
    if (!track) return;
    
    const creators = Array.from(track.children);
    if (creators.length === 0) return;

    // Duplicar elementos para loop infinito suave
    creators.forEach(creator => {
        const clone = creator.cloneNode(true);
        track.appendChild(clone);
    });

    let currentPosition = 0;
    let animationId;
    const speed = 0.8; // Velocidad del desplazamiento

    function animateCarousel() {
        currentPosition -= speed;
        
        const trackWidth = track.scrollWidth / 2; // Porque duplicamos los elementos
        if (currentPosition <= -trackWidth) {
            currentPosition = 0;
        }
        
        track.style.transform = `translateX(${currentPosition}px)`;
        animationId = requestAnimationFrame(animateCarousel);
    }

    function startAnimation() {
        if (!animationId) {
            animationId = requestAnimationFrame(animateCarousel);
        }
    }

    function stopAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // Pausar al interactuar
    track.addEventListener('mouseenter', stopAnimation);
    track.addEventListener('mouseleave', startAnimation);
    track.addEventListener('focusin', stopAnimation);
    track.addEventListener('focusout', startAnimation);

    // Inicializar
    startAnimation();
})();

/* ========== Sistema de Partículas para Contact ========== */
(function(){
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;
    
    // Configuración de partículas
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 100 + 0.5;
            this.speedX = Math.random() * 0.2 - 0.25;
            this.speedY = Math.random() * 0.1 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = `rgba(11, 99, 255, ${this.opacity})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Rebote en los bordes
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
            
            // Reaparecer si se sale completamente
            if (this.x < -10 || this.x > canvas.width + 10 || 
                this.y < -10 || this.y > canvas.height + 10) {
                this.reset();
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    function resizeCanvas() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            canvas.width = contactSection.offsetWidth;
            canvas.height = contactSection.offsetHeight;
        }
    }
    
    // Inicializar
    window.addEventListener('resize', resizeCanvas);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                resizeCanvas();
                initParticles();
                animateParticles();
            }, 500);
        });
    } else {
        setTimeout(() => {
            resizeCanvas();
            initParticles();
            animateParticles();
        }, 500);
    }
})();

/* ========== Mobile Menu Functionality ========== */
(function(){
    const menuToggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('main-menu');
    
    if (menuToggle && menu) {
        // Crear botón de menú móvil si no existe
        if (!menuToggle.querySelector('span')) {
            menuToggle.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
        }
        
        // Asegurarse de que el menú tenga la clase para estilos móviles
        if (!menu.classList.contains('mobile-menu')) {
            menu.classList.add('mobile-menu');
        }
        
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        });

        // Cerrar menú móvil al hacer clic en un enlace
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (menu.classList.contains('active') && 
                !menu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Cerrar menú con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
})();

/* ========== Calendly Popup Handler ========== */
(function(){
    // Asegurarse de que Calendly esté disponible
    function initCalendly() {
        if (typeof Calendly !== 'undefined') {
            console.log('Calendly cargado correctamente');
            
            // Agregar event listeners a todos los botones de Calendly
            document.querySelectorAll('[onclick*="Calendly.initPopupWidget"]').forEach(button => {
                // Clonar el botón para eliminar event listeners previos
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Agregar el event listener de forma limpia
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (typeof Calendly !== 'undefined') {
                        Calendly.initPopupWidget({
                            url: 'https://calendly.com/amesaedits01/new-meeting'
                        });
                    } else {
                        console.error('Calendly no está cargado');
                        // Fallback: abrir en nueva pestaña
                        window.open('https://calendly.com/amesaedits01/new-meeting', '_blank');
                    }
                    return false;
                });
            });
        } else {
            console.warn('Calendly no está cargado, reintentando...');
            setTimeout(initCalendly, 500);
        }
    }
    
    // Inicializar Calendly cuando esté disponible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCalendly);
    } else {
        initCalendly();
    }
})();

/* ========== Utility Functions ========== */
(function(){
    // Actualizar año en el footer
    function updateYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                // Calcular posición considerando el header fijo
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Manejo de videos de Vimeo
    function initVideoControls() {
        const videoWrappers = document.querySelectorAll('.video-wrapper');
        
        videoWrappers.forEach((wrapper) => {
            const iframe = wrapper.querySelector('iframe');
            const playPauseBtn = wrapper.querySelector('.play-pause-btn');
            
            if (!iframe || !playPauseBtn) return;
            
            // Verificar si es un iframe de Vimeo
            const isVimeo = iframe.src.includes('vimeo.com');
            
            if (isVimeo) {
                // Cargar Vimeo Player API si no está disponible
                if (typeof Vimeo === 'undefined') {
                    const vimeoScript = document.createElement('script');
                    vimeoScript.src = 'https://player.vimeo.com/api/player.js';
                    vimeoScript.onload = () => setupVimeoPlayer(wrapper);
                    document.body.appendChild(vimeoScript);
                } else {
                    setupVimeoPlayer(wrapper);
                }
            }
        });
    }

    function setupVimeoPlayer(wrapper) {
        const iframe = wrapper.querySelector('iframe');
        const playPauseBtn = wrapper.querySelector('.play-pause-btn');
        const playIcon = wrapper.querySelector('.play-icon');
        const pauseIcon = wrapper.querySelector('.pause-icon');
        
        let player = null;
        let isPlaying = false;
        
        if (typeof Vimeo !== 'undefined') {
            player = new Vimeo.Player(iframe);
            
            player.on('play', function() {
                isPlaying = true;
                wrapper.classList.add('playing');
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = 'block';
            });
            
            player.on('pause', function() {
                isPlaying = false;
                wrapper.classList.remove('playing');
                if (playIcon) playIcon.style.display = 'block';
                if (pauseIcon) pauseIcon.style.display = 'none';
            });
            
            player.on('ended', function() {
                isPlaying = false;
                wrapper.classList.remove('playing');
                if (playIcon) playIcon.style.display = 'block';
                if (pauseIcon) pauseIcon.style.display = 'none';
            });
            
            // Configurar eventos para el botón de play/pause
            if (playPauseBtn) {
                playPauseBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (player) {
                        if (isPlaying) {
                            player.pause();
                        } else {
                            player.play();
                        }
                    }
                });
            }
            
            // Configurar eventos para pausar al hacer clic en el video
            wrapper.addEventListener('click', function(e) {
                if (e.target !== playPauseBtn && isPlaying && player) {
                    player.pause();
                }
            });
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            updateYear();
            initVideoControls();
        });
    } else {
        updateYear();
        initVideoControls();
    }
})();

// INICIALIZACIÓN PRINCIPAL
console.log('AM — Video Editing & Motion Graphics cargado correctamente');

// Asegurar que todo se inicialice después de que el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Todos los componentes inicializados correctamente');
    });
} else {
    console.log('Todos los componentes inicializados correctamente');
}