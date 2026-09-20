// =========================================================
// PORTOFOLIO — Razi Hafitz
// =========================================================

// 0. THEME TOGGLE — Dark/Light Mode
const themeCheckbox = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

if (themeCheckbox) {
    themeCheckbox.checked = (savedTheme === 'light');

    themeCheckbox.addEventListener('change', () => {
        const newTheme = themeCheckbox.checked ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        console.log(`🎨 Theme: ${newTheme}`);
    });
}

// Deteksi preferensi sistem (kalau belum pernah pilih)
if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (themeCheckbox) themeCheckbox.checked = (theme === 'light');
}

// 1. Tahun otomatis
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 2. Scroll reveal
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// 3. Active nav link saat scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
        }
    });
}, { threshold: 0.5 });

sections.forEach(sec => navObserver.observe(sec));

// =========================================================
// 4. SMOOTH SCROLL — Custom easing
// =========================================================
const SMOOTH_SCROLL = {
    duration: 1000,
    offset: 80,

    easing(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },

    scrollTo(targetY) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const startTime = performance.now();

        if (Math.abs(distance) < 2) return;

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / SMOOTH_SCROLL.duration, 1);
            const eased = SMOOTH_SCROLL.easing(progress);

            window.scrollTo(0, startY + distance * eased);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    },

    scrollToElement(element) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const targetY = window.pageYOffset + rect.top - SMOOTH_SCROLL.offset;
        SMOOTH_SCROLL.scrollTo(Math.max(0, targetY));
    }
};

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        SMOOTH_SCROLL.scrollToElement(target);
        history.pushState(null, '', href);

        navLinks.forEach(l => l.classList.remove('active'));
        if (link.classList.contains('nav-link')) {
            link.classList.add('active');
        }

        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) menuToggle.checked = false;
    });
});

window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) SMOOTH_SCROLL.scrollToElement(target);
    }
});

// =========================================================
// 5. FORM SUBMIT — Formspree
// =========================================================
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email   = form.email.value.trim();
        const nama    = form.nama.value.trim();
        const message = form.message.value.trim();

        if (!email || !nama || !message) {
            formStatus.textContent = '⚠️ Semua field wajib diisi!';
            formStatus.className = 'form-note error';
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            formStatus.textContent = '⚠️ Format email tidak valid!';
            formStatus.className = 'form-note error';
            return;
        }

        if (message.length < 5) {
            formStatus.textContent = '⚠️ Pesan terlalu pendek (min 5 karakter).';
            formStatus.className = 'form-note error';
            return;
        }

        formStatus.textContent = '⏳ Mengirim pesan...';
        formStatus.className = 'form-note';

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.textContent = '✅ Pesan terkirim! Terima kasih ' + nama + '.';
                formStatus.className = 'form-note success';
                form.reset();
            } else {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || 'Gagal mengirim');
            }
        } catch (err) {
            console.error('[Form Error]', err);
            formStatus.textContent = '❌ Gagal kirim. Coba lagi atau email langsung ke razihafitz@gmail.com';
            formStatus.className = 'form-note error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// 6. Tutup menu mobile saat klik link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) menuToggle.checked = false;
    });
});

console.log('%c👋 Portofolio Razi Hafitz loaded!', 'color: #e94560; font-size: 14px; font-weight: bold;');