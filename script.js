// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os7'; // Unique key for OS7 settings
// HIER: theme ist fest auf 'dark' gesetzt, kein Themenwechsel mehr
const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
    theme: 'dark', // Fester Standardwert
    showAvatar: true, // Keep for potential future use if avatar is re-introduced
    lastActiveEngine: 'google'
};

// Function to save settings
const saveSettings = () => {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error("Error saving settings to localStorage:", e);
    }
};

// --- DOM Element Caching (Performance) ---
const fullscreenBtn = document.getElementById('fullscreen-btn');
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

// Update every second
setInterval(updateTimeAndDate, 1000);
updateTimeAndDate(); // Initial call

// --- Search Functionality ---
const searchEnginesMap = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    youtube: 'https://www.youtube.com/results?search_query=',
    github: 'https://github.com/search?q='
};

let currentSearchEngine = settings.lastActiveEngine;

const performSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
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
        // Deactivate all
        searchEngines.forEach(btn => btn.classList.remove('active'));
        // Activate clicked
        button.classList.add('active');
        currentSearchEngine = button.dataset.engine;
        settings.lastActiveEngine = currentSearchEngine; // Save active engine
        saveSettings();
        searchInput.focus(); // Keep focus on search input
    });
});

// Set initial active search engine based on saved settings
const initialActiveButton = document.querySelector(`.search-engine[data-engine="${settings.lastActiveEngine}"]`);
if (initialActiveButton) {
    initialActiveButton.classList.add('active');
} else {
    // Fallback to Google if saved engine is invalid
    document.querySelector('.search-engine[data-engine="google"]').classList.add('active');
    currentSearchEngine = 'google';
    settings.lastActiveEngine = 'google';
    saveSettings();
}

// --- Fullscreen Toggle ---
if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
            fullscreenBtn.querySelector('.icon').textContent = 'fullscreen_exit';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenBtn.querySelector('.icon').textContent = 'fullscreen';
            }
        }
    });

    // Update icon if fullscreen state changes (e.g., via F11)
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenBtn.querySelector('.icon').textContent = 'fullscreen_exit';
        } else {
            fullscreenBtn.querySelector('.icon').textContent = 'fullscreen';
        }
    });
}


// --- Scroll-to-Top Button ---
scrollToTopBtn.className = 'scroll-to-top material-symbols-outlined';
scrollToTopBtn.innerHTML = 'arrow_upward';
document.body.appendChild(scrollToTopBtn);

const toggleScrollToTopButton = () => {
    if (window.scrollY > 300) { // Show after scrolling 300px
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
    animatedElements.forEach(el => el.classList.add('fade-in-active')); // Trigger animation
});

// --- Parallax Effect for Background Shapes ---
const applyParallax = () => {
    const parallaxBg = document.querySelector('.parallax-bg');
    const parallaxShapes = document.querySelectorAll('.parallax-shape');
    const depths = new Map(); // Store depth for each shape

    // Assign random depths to shapes for varied movement
    parallaxShapes.forEach((shape, index) => {
        // More subtle depth values for smoother effect
        depths.set(shape, 0.5 + (index * 0.1)); // Range 0.5 to 0.8 for 4 shapes
    });

    let animationFrameId = null;

    document.addEventListener('mousemove', (e) => {
        // Cancel previous frame if it exists to ensure only one animation frame is requested
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            parallaxShapes.forEach((shape) => {
                const depth = depths.get(shape);

                // Reduced movement intensity for smoother parallax
                const translateX = -mouseX * depth * 25; // Adjusted from 30
                const translateY = -mouseY * depth * 25; // Adjusted from 30
                const rotateX = mouseY * depth * 2; // Adjusted from 3
                const rotateY = -mouseX * depth * 2; // Adjusted from 3
                const rotateZ = (mouseX + mouseY) * depth * 0.5; // Adjusted from 1

                // Optimized transform string building
                shape.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
            });
        });
    });

    // Reset transforms when mouse leaves document for cleaner state
    document.addEventListener('mouseleave', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        parallaxShapes.forEach((shape) => {
            // Reset to identity transform to remove dynamic parallax
            shape.style.transform = 'none';
        });
    });
};

applyParallax(); // Enable the optimized mouse parallax effect
