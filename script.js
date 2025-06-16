// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os7';
const settings = JSON.parse(localStorage?.getItem(SETTINGS_KEY)) || {
    theme: 'dark', // Fixed dark theme
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
const searchEnginesContainer = document.querySelector('.search-engines'); // Parent for delegation
const searchEngines = document.querySelectorAll('.search-engine');
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const scrollToTopBtn = document.createElement('button'); // Created dynamically

// --- User Avatar Toggle ---
const toggleUserAvatar = () => {
    settings.showAvatar = !settings.showAvatar;
    userAvatar.classList.toggle('show', settings.showAvatar);
    userAvatar.setAttribute('aria-hidden', !settings.showAvatar);
    saveSettings();
};

userAvatarToggleBtn.addEventListener('click', toggleUserAvatar);
// Set initial avatar state based on settings
userAvatar.classList.toggle('show', settings.showAvatar);
userAvatar.setAttribute('aria-hidden', !settings.showAvatar);

// --- Fullscreen Toggle ---
const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(e => console.error(`Error attempting to enable fullscreen: ${e.message}`));
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};
fullscreenBtn.addEventListener('click', toggleFullscreen);

// --- Search Functionality (Optimized with Event Delegation) ---
const searchBaseUrls = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    youtube: 'https://www.youtube.com/results?search_query=',
    github: 'https://github.com/search?q=',
    chatgpt: 'https://chat.openai.com/?q=', // This might not work directly for search, more for direct access
    perplexity: 'https://www.perplexity.ai/search?q='
};

const performSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
        const activeEngine = settings.lastActiveEngine;
        const url = searchBaseUrls[activeEngine] + encodeURIComponent(query);
        window.open(url, '_blank');
        searchInput.value = ''; // Clear input after search
    }
};

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

searchEnginesContainer.addEventListener('click', (e) => {
    const targetButton = e.target.closest('.search-engine');
    if (targetButton) {
        searchEngines.forEach(btn => btn.classList.remove('active'));
        targetButton.classList.add('active');
        settings.lastActiveEngine = targetButton.dataset.engine;
        saveSettings();
        searchInput.focus(); // Keep focus on search input
    }
});

// Set initial active search engine
const initialActiveEngineBtn = document.querySelector(`.search-engine[data-engine="${settings.lastActiveEngine}"]`);
if (initialActiveEngineBtn) {
    initialActiveEngineBtn.classList.add('active');
} else {
    // Fallback to Google if lastActiveEngine is not found
    searchEngines[0]?.classList.add('active');
    settings.lastActiveEngine = searchEngines[0]?.dataset.engine || 'google';
    saveSettings();
}

// --- Time and Date Display ---
const updateDateTime = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    timeElement.textContent = now.toLocaleTimeString('de-DE', timeOptions);
    dateElement.textContent = now.toLocaleDateString('de-DE', dateOptions);
};

// Update every second for time, less frequently for date if needed
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call

// --- Scroll to Top Button ---
scrollToTopBtn.innerHTML = '<span class="material-symbols-outlined">arrow_upward</span>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.setAttribute('aria-label', 'Nach oben scrollen');
document.body.appendChild(scrollToTopBtn);

const toggleScrollToTopButton = () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
};

window.addEventListener('scroll', toggleScrollToTopButton);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// --- Optimized Mouse Parallax Effect ---
const applyParallax = () => {
    const parallaxTargets = document.querySelectorAll('.glass');
    if (parallaxTargets.length === 0) return;

    const depths = new Map();
    parallaxTargets.forEach((target) => {
        // Assign a random depth or a fixed depth based on element type
        let depth;
        if (target.classList.contains('top-bar')) depth = 0.5;
        else if (target.classList.contains('search-section')) depth = 0.7;
        else if (target.classList.contains('menu-section')) depth = 0.6;
        else if (target.classList.contains('bookmark-section')) depth = 0.6;
        else if (target.classList.contains('news-section')) depth = 0.5;
        else if (target.classList.contains('action-card') || target.classList.contains('bookmark-card')) depth = 0.3;
        else depth = 0.4; // Default
        depths.set(target, depth);
    });

    let animationFrameId = null;

    document.addEventListener('mousemove', (e) => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            parallaxTargets.forEach((target) => {
                const depth = depths.get(target);

                // Further reduced translation and rotation for subtler effect and less computation
                const translateX = -mouseX * depth * 20;
                const translateY = -mouseY * depth * 20;
                const rotateX = mouseY * depth * 2;
                const rotateY = -mouseX * depth * 2;
                const rotateZ = (mouseX + mouseY) * depth * 0.5;

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

applyParallax(); // Enable the optimized mouse parallax effect

// --- Initial Animation on Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Add 'animate-in' class to elements after DOM is loaded for CSS animations
    document.querySelectorAll('.animate-in').forEach(el => {
        el.style.opacity = '1'; // Ensure they are visible after animation
    });
});
