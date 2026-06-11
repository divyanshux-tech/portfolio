// --- Interactive Motion & Logic ---

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Animations
    AOS.init({
        duration: 1200,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });

    // Particles Background Configuration
    particlesJS('particles-js', {
        "particles": {
            "number": { "value":300, "density": { "enable": true, "value_area": 900 } },
            "color": { "value": "#8b5cf6" },
            "shape": { "type": "circle" },
            "opacity": { "value": 1, "random": true },
            "size": { "value": 5, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#8b5cf6", "opacity": 0.3, "width": 1.2 },
            "move": { "enable": true, "speed": 2.5 }
        },
        "interactivity": {
            "events": {
                "onhover": { "enable": true, "mode": "grab" },
                "onclick": { "enable": true, "mode": "push" }
            },
            "modes": {
                "grab": { "distance": 200, "line_linked": { "opacity": 1 } },
                "push": { "particles_nb": 4 }
            }
        },
        "retina_detect": true
    });

    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn.querySelector('i');

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            themeIcon.className = 'fas fa-sun';
        } else {
            document.body.classList.remove('light-mode');
            themeIcon.className = 'fas fa-moon';
        }
    };

    themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        applyTheme(isLight ? 'light' : 'dark');
        localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    });

    // Initialize saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) applyTheme(savedTheme);

    // Secure EmailJS Proxy Implementation
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Securing Connection... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value
            };

            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    formStatus.innerHTML = "Message dispatched securely! 🚀✨";
                    formStatus.style.color = "var(--primary)";
                    contactForm.reset();
                } else {
                    const error = await response.json().catch(() => ({}));
                    console.error('Full Server Error Detail:', error);
                    throw new Error(`Server Error: ${response.status} - ${error.error || 'Unknown Error'}`);
                }
            } catch (error) {
                formStatus.innerHTML = "Security error or server failure. Please try again. ❌";
                formStatus.style.color = "#ff4d4d";
                console.error('Submission Error:', error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Interactive Mouse Parallax for Hero
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 50;
            const y = (window.innerHeight / 2 - e.pageY) / 50;
            heroTitle.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }

    // Scroll Spy & Navbar Highlight
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Smart Navbar Hide (Scroll Logic)
    let lastScroll = 0;
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 100) {
            navbar.classList.remove('nav-hidden');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('nav-hidden')) {
            // Scroll down
            navbar.classList.add('nav-hidden');
        } else if (currentScroll < lastScroll && navbar.classList.contains('nav-hidden')) {
            // Scroll up
            navbar.classList.remove('nav-hidden');
        }
        lastScroll = currentScroll;
    });
});
