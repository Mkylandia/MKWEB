// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations (Enhanced)

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os7';
let settings = JSON.parse(localStorage?.getItem(SETTINGS_KEY)) || {
    theme: 'dark', // Fester Standardwert
    showAvatar: true,
    lastActiveEngine: 'google',
    dynamicIslandVisible: true, // ALWAYS VISIBLE by default as per user request
    weatherLocation: 'Heidenheim' // NEW: Default weather location
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
const quoteTextElement = document.getElementById('quote-text');
const quoteAuthorElement = document.getElementById('quote-author');
const weatherLinkButton = document.querySelector('.weather-link-button');
const appCards = document.querySelectorAll('.app-card'); // NEW: Select all app cards

// --- Dynamic Island Elements ---
const dynamicIslandContainer = document.getElementById('dynamicIslandContainer');
const dynamicIsland = document.getElementById('dynamicIsland');
const islandIcon = document.getElementById('islandIcon');
const islandTitle = document.getElementById('islandTitle');
const islandSubtitle = document.getElementById('islandSubtitle');
const islandDismissBtn = document.getElementById('islandDismissBtn');
const islandWaveform = document.getElementById('islandWaveform');
const reopenIslandBtn = document.getElementById('reopen-island-btn'); // Renamed from previous to manage visibility if added back

// --- Dynamic Island State Management ---
let islandTimeoutId = null; // To clear previous timeouts
let islandCycleInterval = null; // To manage time/date cycling
let currentIslandState = {
    icon: 'info',
    title: 'Willkommen!',
    subtitle: 'Wähle eine Suchmaschine aus.',
    showWave: false
};

const defaultIslandContent = {
    icon: 'search',
    title: 'Suchmaschine',
    getSubtitle: () => `Aktiv: ${settings.lastActiveEngine.charAt(0).toUpperCase() + settings.lastActiveEngine.slice(1)}`,
    showWave: false
};

const engineIcons = {
    google: 'travel_explore', // Changed to represent exploration more
    yandex: 'search',
    bing: 'search',
    duckduckgo: 'search_hands_free',
    youtube: 'play_circle',
    github: 'code'
};

const appIcons = { // Mapping for app icons (based on material symbols)
    'ChatGPT': 'chat',
    'Gemini': 'bubble_chart',
    'Notion': 'article',
    'Calendar': 'calendar_month',
    'Gmail': 'mail',
    'WhatsApp': 'chat_bubble',
    'Spotify': 'headphones',
    'GitHub': 'data_object',
    'MDN Docs': 'menu_book',
    'Stack Overflow': 'lightbulb',
    'CodePen': 'code',
    'Unsplash': 'image'
};


// Function to update the Dynamic Island content
const updateDynamicIsland = (icon, title, subtitle, showWave = false) => {
    islandIcon.textContent = icon;
    islandTitle.textContent = title;
    islandSubtitle.textContent = subtitle;
    islandWaveform.style.display = showWave ? 'flex' : 'none';
    currentIslandState = { icon, title, subtitle, showWave }; // Store current state
    clearTimeout(islandTimeoutId); // Clear any pending timeouts
};

// Function to reset the Dynamic Island to its default search engine state
const resetIslandToDefault = () => {
    updateDynamicIsland(
        engineIcons[settings.lastActiveEngine] || defaultIslandContent.icon,
        defaultIslandContent.title,
        defaultIslandContent.getSubtitle()
    );
    dynamicIsland.classList.remove('expanded'); // Collapse from expanded state
    startIslandTimeDateCycle(); // Restart time/date cycle after transient event
};


// --- Dynamic Island Time/Date Cycling ---
let isTimeDisplay = true; // State for time/date cycle

const updateIslandTimeDate = () => {
    const now = new Date();
    if (isTimeDisplay) {
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        updateDynamicIsland(
            'schedule',
            now.toLocaleTimeString('de-DE', timeOptions),
            'Aktuelle Uhrzeit',
            false // No wave for time/date
        );
    } else {
        const dateOptions = { month: 'short', day: 'numeric' };
        updateDynamicIsland(
            'calendar_today',
            now.toLocaleDateString('de-DE', dateOptions),
            now.toLocaleDateString('de-DE', { weekday: 'long' }),
            false // No wave for time/date
        );
    }
    isTimeDisplay = !isTimeDisplay; // Toggle for next cycle
};

const startIslandTimeDateCycle = () => {
    clearInterval(islandCycleInterval); // Clear any existing cycle
    updateIslandTimeDate(); // Initial display
    islandCycleInterval = setInterval(updateIslandTimeDate, 5000); // Cycle every 5 seconds
};

// Stop time/date cycle and show specific content
const showTransientIslandContent = (icon, title, subtitle, showWave = false, duration = 3000) => {
    clearInterval(islandCycleInterval); // Stop the cycling
    updateDynamicIsland(icon, title, subtitle, showWave);
    dynamicIsland.classList.add('expanded'); // Expand for transient content

    islandTimeoutId = setTimeout(() => {
        resetIslandToDefault(); // Revert to default after duration
    }, duration);
};


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

let activateEngine = (engine) => {
    searchEngines.forEach(btn => {
        const isActive = btn.dataset.engine === engine;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    });
    activeEngine = engine;
    settings.lastActiveEngine = engine;
    saveSettings();

    // Update Dynamic Island to show active search engine
    updateDynamicIsland(
        engineIcons[engine] || defaultIslandContent.icon,
        defaultIslandContent.title,
        defaultIslandContent.getSubtitle()
    );
};

// Event listeners for search engine selection buttons
searchEngines.forEach(button => {
    button.addEventListener('click', () => {
        activateEngine(button.dataset.engine);
    });
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            let url = '';
            switch (activeEngine) {
                case 'google':
                    url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    break;
                case 'yandex':
                    url = `https://yandex.com/search/?text=${encodeURIComponent(query)}`;
                    break;
                case 'bing':
                    url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                    break;
                case 'duckduckgo':
                    url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                    break;
                case 'youtube':
                    url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`; // Corrected YouTube URL
                    break;
                case 'github':
                    url = `https://github.com/search?q=${encodeURIComponent(query)}`;
                    break;
                default:
                    url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }

            // Show Dynamic Island with search animation before opening URL
            showTransientIslandContent('arrow_forward', 'Suche läuft...', `Öffne Ergebnisse für "${query}"`, true, 2000); // 2 second display

            setTimeout(() => {
                window.open(url, '_blank');
                searchInput.value = ''; // Clear search input
                resetIslandToDefault(); // Revert island to default after search
            }, 2000); // Wait for island animation to finish before opening URL
        }
    }
});

// Set initial active engine
activateEngine(settings.lastActiveEngine);


// --- Fullscreen Toggle ---
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenBtn.textContent = ' shrinking_button Vollbild beenden';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullscreenBtn.textContent = '🚀 Vollbild';
        }
    }
});


// --- Quote of the Day Functionality ---
const fetchQuote = async () => {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        quoteTextElement.textContent = data.content;
        quoteAuthorElement.textContent = data.author;
    } catch (error) {
        console.error('Fehler beim Laden des Zitats:', error);
        quoteTextElement.textContent = 'Glück ist keine Station, an der man ankommt, sondern eine Art zu reisen.';
        quoteAuthorElement.textContent = 'Margaret Lee Runbeck';
    }
};

// Initial quote fetch and set interval
fetchQuote();
setInterval(fetchQuote, 30000); // Fetch a new quote every 30 seconds


// --- Weather Data Fetching ---
const fetchWeather = async (location) => {
    const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
    if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
        console.warn('OpenWeatherMap API Key ist nicht gesetzt. Wetterdaten werden nicht geladen.');
        return null;
    }
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric&lang=de`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const weatherIconCode = data.weather[0].icon;
        const materialSymbol = mapWeatherIconToMaterialSymbol(weatherIconCode);

        return {
            icon: materialSymbol,
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            location: data.name
        };
    } catch (error) {
        console.error('Fehler beim Abrufen der Wetterdaten:', error);
        return null;
    }
};

// Map OpenWeatherMap icons to Material Symbols
const mapWeatherIconToMaterialSymbol = (iconCode) => {
    switch (iconCode) {
        case '01d': return 'light_mode'; // clear sky day
        case '01n': return 'dark_mode'; // clear sky night
        case '02d': return 'partly_cloudy_day'; // few clouds day
        case '02n': return 'partly_cloudy_night'; // few clouds night
        case '03d':
        case '03n': return 'cloud'; // scattered clouds
        case '04d':
        case '04n': return 'cloudy'; // broken clouds
        case '09d':
        case '09n': return 'cloud_download'; // shower rain
        case '10d': return 'rainy'; // rain day
        case '10n': return 'thunderstorm'; // rain night (changed to thunderstorm for more impact)
        case '11d':
        case '11n': return 'thunderstorm'; // thunderstorm
        case '13d':
        case '13n': return 'ac_unit'; // snow
        case '50d':
        case '50n': return 'foggy'; // mist
        default: return 'cloud'; // default icon
    }
};

// Event listener for the weather link button
weatherLinkButton.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default link behavior
    
    // Show loading state in Dynamic Island
    showTransientIslandContent('refresh', 'Wetter wird geladen...', 'Bitte warten...', true, 4000); // 4 sec loading display

    const weatherData = await fetchWeather(settings.weatherLocation); // Use saved location
    if (weatherData) {
        // Update island with actual weather data after loading
        updateDynamicIsland(
            weatherData.icon,
            `${weatherData.temp}°C`,
            `${weatherData.description} in ${weatherData.location}`
        );
        dynamicIsland.classList.add('expanded'); // Keep expanded for a bit longer
        setTimeout(() => resetIslandToDefault(), 4000); // Revert after 4 seconds
    } else {
        updateDynamicIsland('error', 'Fehler', 'Wetterdaten nicht verfügbar.');
        dynamicIsland.classList.add('expanded');
        setTimeout(() => resetIslandToDefault(), 3000);
    }
});


// --- App Card Interaction (Dynamic Island integration) ---
appCards.forEach(card => {
    let hoverTimeout;

    card.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout); // Clear any existing timeout
        hoverTimeout = setTimeout(() => {
            const appName = card.dataset.appName || 'App';
            const appIcon = card.dataset.appIcon || 'apps';
            updateDynamicIsland(appIcon, appName, 'Starte App...');
            dynamicIsland.classList.add('expanded'); // Expand on hover
        }, 300); // Short delay to prevent flickering on quick mouse-overs
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout); // Clear the hover timeout if mouse leaves before it triggers
        // If it was expanded by hover, collapse after a short delay and reset content
        setTimeout(() => dynamicIsland.classList.remove('expanded'), 300);
        resetIslandToDefault(); // Revert to default when mouse leaves
    });

    // Handle click on app card to ensure island resets after opening app
    card.addEventListener('click', () => {
        resetIslandToDefault();
    });
});


// Initialer Zustand beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure everything is loaded, then ensure island is visible and starts cycling
    setTimeout(() => {
        dynamicIsland.classList.remove('expanded'); // Start compact
        // Set initial content to default search engine info
        updateDynamicIsland(
            engineIcons[settings.lastActiveEngine] || defaultIslandContent.icon,
            defaultIslandContent.title,
            defaultIslandContent.getSubtitle()
        );
        startIslandTimeDateCycle(); // Start the time/date cycle
    }, 100);

    // No need for 'reopenIslandBtn' logic as island is always visible
    if (reopenIslandBtn) { // Safety check
        reopenIslandBtn.style.display = 'none';
    }

    // Handle dismiss button click for Dynamic Island
    islandDismissBtn.addEventListener('click', () => {
        resetIslandToDefault(); // Reset to default state
    });
});
