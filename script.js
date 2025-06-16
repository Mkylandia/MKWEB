// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Refined Parallax

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os7'; // Unique key for OS7 settings
const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
    theme: 'dark', // Theme is fixed to 'dark' for simplicity
    lastActiveEngine: 'google'
};

// Function to save settings - optimized with optional chaining
const saveSettings = () => {
    try {
        localStorage?.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error("Error saving settings to localStorage:", e);
    }
};

// --- DOM Element Caching (Performance) ---
// Fullscreen button removed as per request
const searchInput = document.getElementById('search');
const searchEngines = document.querySelectorAll('.search-engine');
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const scrollToTopBtn = document.createElement('button'); // Created dynamically

// --- Time and Date Display ---
const updateTimeAndDate = () => {
    const now = new Date();
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    timeElement.textContent = now.toLocaleTimeString('de-DE', optionsTime);
    dateElement.textContent = now.toLocaleDateString('de-DE', optionsDate);
};

// Update every second - critical functionality
setInterval(updateTimeAndDate, 1000);
updateTimeAndDate(); // Initial call to display immediately

// --- Search Functionality ---
const searchEnginesMap = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    youtube: 'https://www.youtube.com/results?search_query=', // Corrected Youtube URL
    github: 'https://github.com/search?q='
};

let currentSearchEngine = settings.lastActiveEngine;

const performSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
        // Use _top or _self to stay in the same tab, which is typical for start pages
        window.open(searchEnginesMap[currentSearchEngine] + encodeURIComponent(query), '_self');
    }
};

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

searchEngines.forEach(button => {
    button.addEventListener('click', () => {
        // Deactivate all, then activate clicked
        searchEngines.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentSearchEngine = button.dataset.engine;
        settings.lastActiveEngine = currentSearchEngine;
        saveSettings();
        searchInput.focus(); // Keep focus on search input for continuous typing
    });
});

// Set initial active search engine based on saved settings
const initialActiveButton = document.querySelector(`.search-engine[data-engine="${settings.lastActiveEngine}"]`);
if (initialActiveButton) {
    initialActiveButton.classList.add('active');
} else {
    // Fallback to Google if saved engine is invalid or not found
    document.querySelector('.search-engine[data-engine="google"]').classList.add('active');
    currentSearchEngine = 'google';
    settings.lastActiveEngine = 'google';
    saveSettings();
}

// --- Scroll-to-Top Button ---
scrollToTopBtn.className = 'scroll-to-top material-symbols-outlined';
scrollToTopBtn.innerHTML = 'arrow_upward';
document.body.appendChild(scrollToTopBtn);

const toggleScrollToTopButton = () => {
    // Show after scrolling minimal amount (e.g., 100px) for quick access
    if (window.scrollY > 100) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
};

window.addEventListener('scroll', toggleScrollToTopButton);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Element Animations on Load ---
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-in');
    // Using a simpler class addition for animation trigger (already done in CSS)
    animatedElements.forEach(el => el.classList.add('fade-in-active'));
});

// --- Parallax Effect for Background Shapes (Ultra-Optimized) ---
const applyParallax = () => {
    const parallaxShapes = document.querySelectorAll('.parallax-shape');
    const depths = new Map();

    // Assign very subtle depth values
    parallaxShapes.forEach((shape, index) => {
        depths.set(shape, 0.05 + (index * 0.02)); // Range 0.05 to 0.09 for 3 shapes
    });

    let animationFrameId = null;

    document.addEventListener('mousemove', (e) => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            parallaxShapes.forEach((shape) => {
                const depth = depths.get(shape);

                // Extremely subtle movement intensity
                const translateX = -mouseX * depth * 5; // Reduced from 10
                const translateY = -mouseY * depth * 5; // Reduced from 10
                const rotateX = mouseY * depth * 0.2; // Reduced from 0.5
                const rotateY = -mouseX * depth * 0.2; // Reduced from 0.5
                const rotateZ = (mouseX + mouseY) * depth * 0.1; // Reduced from 0.2

                // Using translate3d for hardware acceleration
                shape.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
            });
        });
    });

    document.addEventListener('mouseleave', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        // Smoothly reset transforms
        parallaxShapes.forEach((shape) => {
            shape.style.transition = 'transform 0.5s ease-out'; // Add transition for reset
            shape.style.transform = 'none';
        });
        // Remove transition after reset to allow immediate new movement
        setTimeout(() => {
            parallaxShapes.forEach((shape) => {
                shape.style.transition = 'none';
            });
        }, 500); // Match this to the transition duration
    });
};

applyParallax();
