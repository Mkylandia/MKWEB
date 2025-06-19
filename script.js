// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os7';
const settings = JSON.parse(localStorage?.getItem(SETTINGS_KEY)) || {
    theme: 'dark', // Fester Standardwert
    showAvatar: true,
    lastActiveEngine: 'google'
};

// Function to save settings
const saveSettings = () => {
    localStorage?.setItem(SETTINGS_KEY, JSON.stringify(settings));
};


// --- DOM Element Caching (Performance) ---
const fullscreenBtn = document.getElementById('fullscreen-btn');
const userAvatar = document.getElementById('user-avatar');
const userAvatarToggleBtn = document.getElementById('user-avatar-toggle');
const searchInput = document.getElementById('search');
const searchEngines = document.querySelectorAll('.search-engine');
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
// SCROLL TO TOP BUTTON wurde entfernt

// --- User Avatar & Toggle Logic ---
const applyAvatarVisibility = () => {
    if (settings.showAvatar) {
        userAvatar.classList.remove('hidden-avatar');
        userAvatar.setAttribute('aria-hidden', 'false');
        userAvatarToggleBtn.textContent = '🙈 Avatar ausblenden';
    } else {
        userAvatar.classList.add('hidden-avatar');
        userAvatar.setAttribute('aria-hidden', 'true');
        userAvatarToggleBtn.textContent = '🐵 Avatar einblenden';
    }
};

userAvatarToggleBtn.addEventListener('click', () => {
    settings.showAvatar = !settings.showAvatar;
    saveSettings();
    applyAvatarVisibility();
});

applyAvatarVisibility();


// --- Search Functionality ---
let activeEngine = settings.lastActiveEngine;

const activateEngine = (engine) => {
    searchEngines.forEach(btn => {
        const isActive = btn.dataset.engine === engine;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    });
    activeEngine = engine;
    settings.lastActiveEngine = engine;
    saveSettings();
};

searchEngines.forEach(btn => {
    btn.addEventListener('click', () => activateEngine(btn.dataset.engine));
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            let url = '';
            switch (activeEngine) {
                case 'google': url = `https://www.google.com/search?q=${encodeURIComponent(query)}`; break;
                case 'yandex': url = `https://yandex.com/search/?text=${encodeURIComponent(query)}`; break;
                case 'bing': url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`; break;
                case 'duckduckgo': url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`; break;
                case 'youtube': url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`; break;
                case 'github': url = `https://github.com/search?q=${encodeURIComponent(query)}`; break;
                default: url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
            window.open(url, '_blank');
        }
    }
});

activateEngine(activeEngine);


// --- Time and Date Display ---
const updateDateTime = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    timeElement.textContent = now.toLocaleTimeString('de-DE', timeOptions);
    dateElement.textContent = now.toLocaleDateString('de-DE', dateOptions);
};

setInterval(updateDateTime, 1000);
updateDateTime();


// --- Background Shapes Creation (Highly Optimized) ---
const createBackgroundShapes = (numShapes) => {
    const container = document.body;
    document.querySelectorAll('.background-shape').forEach(shape => shape.remove());
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        shape.classList.add('background-shape');

        const size = Math.random() * (400 - 200) + 200;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * (40 - 20) + 20;
        const opacity = Math.random() * (0.04 - 0.01) + 0.01;
        const initialTranslateX = (Math.random() - 0.5) * 100;
        const initialTranslateY = (Math.random() - 0.5) * 100;
        const initialTranslateZ = (Math.random() - 0.5) * 80;
        const initialRotateX = (Math.random() - 0.5) * 8;
        const initialRotateY = (Math.random() - 0.5) * 8;
        const initialRotateZ = (Math.random() - 0.5) * 6;
        const initialScale = Math.random() * (1.1 - 0.9) + 0.9;

        shape.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${top}%;
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            opacity: ${opacity};
            transform: translate3d(${initialTranslateX}px, ${initialTranslateY}px, ${initialTranslateZ}px) scale(${initialScale}) rotateX(${initialRotateX}deg) rotateY(${initialRotateY}deg) rotateZ(${initialRotateZ}deg);
            background-color: ${i % 2 === 0 ? 'var(--acc)' : 'rgba(var(--fg-rgb), 0.07)'};
        `;
        fragment.appendChild(shape);
    }
    container.appendChild(fragment);
};

createBackgroundShapes(5);


// --- Scroll to Top Button Logic (ENTFERNT) ---


// --- Animate-in elements on page load ---
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-in');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.08}s`;
        el.style.animationFillMode = 'forwards';
    });
});


// --- Fullscreen Toggle ---
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen().catch(err => {
            console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`);
        });
    }
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.textContent = 'Shrink';
        fullscreenBtn.setAttribute('title', 'Vollbild verlassen');
    } else {
        fullscreenBtn.textContent = '🚀 Vollbild';
        fullscreenBtn.setAttribute('title', 'Vollbild umschalten');
    }
});


// --- Mouse Parallax Effect (Highly Optimized) ---
const applyParallax = () => {
    const parallaxTargets = document.querySelectorAll('.glass');
    let animationFrameId = null;
    const depths = new Map();
    parallaxTargets.forEach(target => {
        let depth = 0.04;
        if (target.classList.contains('header') || target.classList.contains('main-grid')) {
            depth *= 0.5;
        } else if (target.classList.contains('app-card')) {
            depth *= 0.9;
        }
        depths.set(target, depth);
    });

    document.addEventListener('mousemove', (e) => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            parallaxTargets.forEach((target) => {
                const depth = depths.get(target);
                const translateX = -mouseX * depth * 30;
                const translateY = -mouseY * depth * 30;
                const rotateX = mouseY * depth * 3;
                const rotateY = -mouseX * depth * 3;
                const rotateZ = (mouseX + mouseY) * depth * 1;

                target.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
            });
        });
    });

    document.addEventListener('mouseleave', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        parallaxTargets.forEach((target) => {
            target.style.transform = 'none';
        });
    });
};

applyParallax();
