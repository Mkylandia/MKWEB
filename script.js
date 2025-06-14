// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os7'; // Unique key for OS7 settings
const settings = JSON.parse(localStorage?.getItem(SETTINGS_KEY)) || {
    theme: 'dark',
    showAvatar: true,
    lastActiveEngine: 'google'
};
const saveSettings = () => localStorage?.setItem(SETTINGS_KEY, JSON.stringify(settings));

// Ensure theme is valid, fallback to 'dark'
const allowedThemes = ['dark', 'light'];
if (!allowedThemes.includes(settings.theme)) {
    settings.theme = 'dark';
    saveSettings();
}

// Apply initial theme immediately to html element for broader CSS scope
document.documentElement.setAttribute('data-theme', settings.theme);


// --- DOM Element Caching (Performance) ---
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const userAvatar = document.getElementById('user-avatar');
const userAvatarToggleBtn = document.getElementById('user-avatar-toggle');
const searchInput = document.getElementById('search');
const searchEngines = document.querySelectorAll('.search-engine');
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const scrollToTopBtn = document.createElement('button'); // Created dynamically

// Slider Elements (No longer explicitly needed for controlling movement, but kept for general reference if styling is complex)
const quickActionsContainer = document.getElementById('quick-actions-container');
const bookmarksContainer = document.getElementById('bookmarks-container');


// --- Theme Toggle Logic ---
const updateThemeToggleButton = () => {
    if (settings.theme === 'dark') {
        themeToggleBtn.textContent = '☀️ Light Theme';
        themeToggleBtn.setAttribute('aria-label', 'Wechsel zu hellem Design');
    } else {
        themeToggleBtn.textContent = '🌙 Dark Theme';
        themeToggleBtn.setAttribute('aria-label', 'Wechsel zu dunklem Design');
    }
};

themeToggleBtn.addEventListener('click', () => {
    settings.theme = (settings.theme === 'dark' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', settings.theme); // Update theme on html
    saveSettings();
    updateThemeToggleButton();
});

// Initial update of the theme toggle button text
updateThemeToggleButton();


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

// Apply initial visibility
applyAvatarVisibility();


// --- Search Functionality ---
let activeEngine = settings.lastActiveEngine; // Default or last active

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
                case 'youtube': url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`; break; // Corrected YouTube URL
                case 'github': url = `https://github.com/search?q=${encodeURIComponent(query)}`; break;
                default: url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
            window.open(url, '_blank');
        }
    }
});

// Initialize active engine
activateEngine(activeEngine);


// --- Time and Date Display ---
const updateDateTime = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    timeElement.textContent = now.toLocaleTimeString('de-DE', timeOptions);
    dateElement.textContent = now.toLocaleDateString('de-DE', dateOptions);
};

// Update every second (minimal performance impact)
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call


// --- Background Shapes Creation (Highly Optimized) ---
const createBackgroundShapes = (numShapes) => {
    const container = document.body;
    // Remove existing shapes to prevent duplicates if function is called multiple times
    document.querySelectorAll('.background-shape').forEach(shape => shape.remove());

    const fragment = document.createDocumentFragment(); // Use DocumentFragment for performance

    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        shape.classList.add('background-shape');

        const size = Math.random() * (400 - 200) + 200; // Smaller range: 200px to 400px
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 15; // Shorter delay range: up to 15s
        const duration = Math.random() * (40 - 20) + 20; // Shorter duration: 20s to 40s
        const opacity = Math.random() * (0.04 - 0.01) + 0.01; // Reduced opacity range: 0.01 to 0.04

        // Subtler initial 3D transforms for smoother start and lower load
        const initialTranslateX = (Math.random() - 0.5) * 100; // -50 to 50px
        const initialTranslateY = (Math.random() - 0.5) * 100;
        const initialTranslateZ = (Math.random() - 0.5) * 80; // Shallower Z
        const initialRotateX = (Math.random() - 0.5) * 8; // -4 to 4 degrees
        const initialRotateY = (Math.random() - 0.5) * 8;
        const initialRotateZ = (Math.random() - 0.5) * 6; // Reduced Z-rotation
        const initialScale = Math.random() * (1.1 - 0.9) + 0.9; // 0.9 to 1.1

        shape.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${top}%;
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            opacity: ${opacity};
            transform: translate3d(${initialTranslateX}px, ${initialTranslateY}px, ${initialTranslateZ}px) scale(${initialScale}) rotateX(${initialRotateX}deg) rotateY(${initialRotateY}deg) rotateZ(${initialRotateZ}deg);
            background-color: ${i % 2 === 0 ? 'var(--acc)' : 'rgba(var(--fg-rgb), 0.07)'}; /* Dynamic color with even lower opacity */
        `;

        fragment.appendChild(shape);
    }
    container.appendChild(fragment); // Append all shapes at once
};

createBackgroundShapes(5); // Reduced number of shapes to 5 for better performance


// --- Scroll to Top Button Logic ---
scrollToTopBtn.classList.add('scroll-to-top');
scrollToTopBtn.innerHTML = '⬆️';
scrollToTopBtn.title = 'Nach oben scrollen';
document.body.appendChild(scrollToTopBtn);

// Use requestAnimationFrame for scroll-based updates
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(() => {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


// --- Animate-in elements on page load with optimized staggering ---
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-in');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.08}s`; // Slightly faster staggering delay
        el.style.animationFillMode = 'forwards';
    });
});


// --- Fullscreen Toggle ---
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            fullscreenBtn.textContent = ' shrink';
            fullscreenBtn.setAttribute('title', 'Vollbild verlassen');
            fullscreenBtn.setAttribute('aria-label', 'Vollbild verlassen');
        }).catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen().then(() => {
            fullscreenBtn.textContent = '🚀 Vollbild';
            fullscreenBtn.setAttribute('title', 'Vollbild umschalten');
            fullscreenBtn.setAttribute('aria-label', 'Vollbild umschalten');
        }).catch(err => {
            console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`);
        });
    }
});


// --- Mouse Parallax Effect (Highly Optimized with requestAnimationFrame & Reduced Intensity) ---
const applyParallax = () => {
    const parallaxTargets = document.querySelectorAll('.glass');
    let animationFrameId = null; // To manage requestAnimationFrame

    // Pre-calculate depths for slight performance gain
    const depths = new Map();
    parallaxTargets.forEach(target => {
        let depth = 0.04; // Even further reduced base depth
        if (target.classList.contains('header') || target.classList.contains('main')) {
            depth *= 0.5; // Even less movement for large containers
        } else if (target.classList.contains('action-card') || target.classList.contains('bookmark-card')) {
            depth *= 0.9; // Slightly less movement for smaller cards
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

                const translateX = -mouseX * depth * 30; // Further reduced translation
                const translateY = -mouseY * depth * 30;
                const rotateX = mouseY * depth * 3; // Further reduced rotation
                const rotateY = -mouseX * depth * 3;
                const rotateZ = (mouseX + mouseY) * depth * 1; // Further reduced Z-rotation

                // Optimized transform string building
                target.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
            });
        });
    });

    // Reset transforms when mouse leaves document for cleaner state
    document.addEventListener('mouseleave', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        parallaxTargets.forEach((target) => {
            // Reset to identity transform to remove dynamic parallax
            target.style.transform = 'none'; // Or set back to base CSS transform if it has one
        });
    });
};

applyParallax(); // Enable the optimized mouse parallax effect

// No slider initialization needed anymore as buttons are removed.
// The `horizontal-scroll-container` now relies purely on CSS for scrolling.
