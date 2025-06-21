// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations - LIGHTWEIGHT VERSION

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
// quoteTextElement und quoteAuthorElement wurden entfernt


// --- User Avatar & Toggle Logic ---
const applyAvatarVisibility = () => {
    if (settings.showAvatar) {
        userAvatar.classList.remove('hidden-avatar');
        userAvatar.setAttribute('aria-hidden', 'false');
        userAvatarToggleBtn.textContent = '🙈 Avatar ausblenden';
    } else {
        userAvatar.classList.add('hidden-avatar');
        userAvatar.setAttribute('aria-hidden', 'true'); // Korrigiert: war 'false'
        userAvatarToggleBtn.textContent = '😎 Avatar einblenden'; // Text anpassen
    }
};

userAvatarToggleBtn.addEventListener('click', () => {
    settings.showAvatar = !settings.showAvatar;
    saveSettings();
    applyAvatarVisibility();
});

// Apply initial visibility on load
document.addEventListener('DOMContentLoaded', applyAvatarVisibility);


// --- Search Engine Functionality ---
let activeEngine = settings.lastActiveEngine; // Load last active engine

const activateEngine = (engine) => {
    searchEngines.forEach(button => {
        if (button.dataset.engine === engine) {
            button.classList.add('active');
            activeEngine = engine;
        } else {
            button.classList.remove('active');
        }
    });
    settings.lastActiveEngine = engine; // Save active engine
    saveSettings();
    searchInput.focus(); // Keep focus on search input
};

// Event listeners for search engine buttons
searchEngines.forEach(button => {
    button.addEventListener('click', () => {
        activateEngine(button.dataset.engine);
    });
});

// Handle search input submission
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        if (query) {
            let url;
            switch (activeEngine) {
                case 'google':
                    url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    break;
                case 'duckduckgo':
                    url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                    break;
                case 'youtube':
                    url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
                    break;
                case 'bing':
                    url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                    break;
                default:
                    url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
            window.open(url, '_blank');
            searchInput.value = ''; // Clear input after search
        }
    }
});

// Set initial active engine on page load
document.addEventListener('DOMContentLoaded', () => {
    activateEngine(activeEngine);
});


// --- Time & Date Display ---
const updateTimeAndDate = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Format time and date for Germany (de-DE)
    const timeString = now.toLocaleTimeString('de-DE', timeOptions);
    const dateString = now.toLocaleDateString('de-DE', dateOptions);

    timeElement.textContent = timeString;
    dateElement.textContent = dateString;
};

// Update time and date every second
setInterval(updateTimeAndDate, 1000);
// Initial call to display time and date immediately on load
document.addEventListener('DOMContentLoaded', updateTimeAndDate);


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
