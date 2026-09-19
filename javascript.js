/* ===== Dark / Light Mode ===== */
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

applyTheme(localStorage.getItem('theme') === 'dark');

themeToggle.addEventListener('click', () => {
    applyTheme(!document.body.classList.contains('dark'));
});

/* ===== Scroll Reveal Animation ===== */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('active');

        setTimeout(() => {
            el.classList.remove('reveal', 'active');
        }, 1600);

        revealObserver.unobserve(el);
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach((el) => revealObserver.observe(el));

/* ===== Active Nav Link on Scroll ===== */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

function updateActiveLink() {
    let current = '';

    sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ===== Contact Form Feedback ===== */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    button.textContent = 'Sent! ✓';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        contactForm.reset();
    }, 2000);
});
