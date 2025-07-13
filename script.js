// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations - LIGHTWEIGHT VERSION

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os7';
let settings = JSON.parse(localStorage?.getItem(SETTINGS_KEY)) || {
    theme: 'dark', // Fester Standardwert
    showAvatar: true,
    lastActiveEngine: 'google',
    dynamicIslandVisible: true, // NEW: Setting to remember island visibility
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
const weatherLocationInput = document.getElementById('weather-location'); // NEW: Weather location input
const currentWeatherLocationDisplay = document.getElementById('current-weather-location-display'); // NEW: Display for current location
// NEW: Reopen Island Button
const reopenIslandBtn = document.getElementById('reopen-island-btn');


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
};

searchEngines.forEach(button => {
    button.addEventListener('click', () => {
        activateEngine(button.dataset.engine);
        // Do not hide or collapse island here, user controls it
    });
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
            
            // Show Dynamic Island with search animation before opening URL
            showDynamicIsland('arrow_forward', 'Suche läuft...', `Öffne Ergebnisse für "${query}"`, true);
            dynamicIsland.classList.add('expanded');

            setTimeout(() => {
                window.open(url, '_blank');
                // REMOVED: hideDynamicIsland() here. User must dismiss manually.
            }, 1200);
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


// --- Quote of the Day (Local Data) ---
const quotes = [
    { text: "Der einzige Weg, großartige Arbeit zu leisten, ist, zu lieben, was man tut.", author: "Steve Jobs" },
    { text: "Die Logik bringt dich von A nach B. Die Vorstellungskraft bringt dich überall hin.", author: "Albert Einstein" },
    { text: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt.", author: "Mahatma Gandhi" },
    { text: "Was immer du tun kannst oder träumst es zu können, fang damit an.", author: "Johann Wolfgang von Goethe" },
    { text: "Glück ist nicht das, was man besitzt, sondern das, was man gibt.", author: "Unbekannt" },
    { text: "Die Zukunft gehört denen, die an die Schönheit ihrer Träume glauben.", author: "Eleanor Roosevelt" },
    { text: "Handle so, dass die Maxime deines Willens jederzeit zugleich als Prinzip einer allgemeinen Gesetzgebung gelten könnte.", author: "Immanuel Kant" },
    { text: "Es ist nicht genug zu wissen, man muss es auch anwenden; es ist nicht genug zu wollen, man muss es auch tun.", author: "Johann Wolfgang von Goethe" },
    { text: "Der beste Weg, die Zukunft vorauszusagen, ist, sie zu gestalten.", author: "Peter F. Drucker" },
    { text: "Probleme kann man niemals mit derselben Denkweise lösen, durch die sie entstanden sind.", author: "Albert Einstein" }
];

const displayRandomQuote = () => {
    if (quoteTextElement && quoteAuthorElement) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteTextElement.textContent = `"${randomQuote.text}"`;
        quoteAuthorElement.textContent = `- ${randomQuote.author}`;
    }
};

setInterval(displayRandomQuote, 3600000);
document.addEventListener('DOMContentLoaded', displayRandomQuote);


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


// --- Dynamic Island Functionality ---
const dynamicIslandContainer = document.getElementById('dynamicIslandContainer');
const dynamicIsland = document.getElementById('dynamicIsland');
const islandIcon = document.getElementById('islandIcon');
const islandTitle = document.getElementById('islandTitle');
const islandSubtitle = document.getElementById('islandSubtitle');
const islandDismissBtn = document.getElementById('islandDismissBtn');
const islandWaveform = document.getElementById('islandWaveform');

const engineIcons = {
    google: 'search',
    yandex: 'travel_explore',
    bing: 'search',
    duckduckgo: 'search_hands_free',
    youtube: 'play_circle',
    github: 'code'
};

const showDynamicIsland = (icon, title, subtitle, showWave = false) => {
    islandIcon.textContent = icon;
    islandTitle.textContent = title;
    islandSubtitle.textContent = subtitle;
    islandWaveform.style.display = showWave ? 'flex' : 'none';
    dynamicIslandContainer.classList.remove('hidden');
    reopenIslandBtn.style.display = 'none';
    settings.dynamicIslandVisible = true;
    saveSettings();
};

const hideDynamicIsland = () => {
    dynamicIslandContainer.classList.add('hidden');
    dynamicIsland.classList.remove('expanded');
    reopenIslandBtn.style.display = 'block';
    settings.dynamicIslandVisible = false;
    saveSettings();
};


// Click-Event zum Erweitern/Verkleinern
dynamicIsland.addEventListener('click', (e) => {
    if (e.target.closest('#islandDismissBtn')) return;
    dynamicIsland.classList.toggle('expanded');
});

// Insel ausblenden (Dismiss button)
islandDismissBtn.addEventListener('click', () => {
    hideDynamicIsland();
});

// Reopen Island button click event
reopenIslandBtn.addEventListener('click', () => {
    showDynamicIsland(engineIcons[settings.lastActiveEngine] || 'search', 'Suchmaschine', `Aktiv: ${settings.lastActiveEngine.charAt(0).toUpperCase() + settings.lastActiveEngine.slice(1)}`);
});


// Suchmaschinen-Logik erweitern
const originalActivateEngine = activateEngine;
activateEngine = (engine) => {
    originalActivateEngine(engine);
    const engineName = engine.charAt(0).toUpperCase() + engine.slice(1);
    if (settings.dynamicIslandVisible) {
        showDynamicIsland(engineIcons[engine] || 'search', 'Suchmaschine', `Aktiv: ${engineName}`);
        // REMOVED: setTimeout to collapse here. User must dismiss manually.
    }
};

// --- Weather Functionality ---
const fetchWeather = async (location) => {
    const mockWeather = {
        'Heidenheim': { temp: 22, description: 'Leicht bewölkt', icon: 'cloud', location: 'Heidenheim' },
        'Berlin': { temp: 18, description: 'Regen', icon: 'rainy', location: 'Berlin' },
        'London': { temp: 15, description: 'Nebel', icon: 'foggy', location: 'London' },
        'New York': { temp: 25, description: 'Sonnig', icon: 'sunny', location: 'New York' },
        'Paris': { temp: 20, description: 'Wolkig', icon: 'partly_cloudy', location: 'Paris' },
        'Tokyo': { temp: 28, description: 'Klar', icon: 'clear_day', location: 'Tokyo' },
        'Sydney': { temp: 17, description: 'Windig', icon: 'wind_power', location: 'Sydney' }
    };

    return new Promise(resolve => {
        setTimeout(() => {
            // Case-insensitive match, or default to Heidenheim if not found
            const normalizedLocation = Object.keys(mockWeather).find(key => key.toLowerCase() === location.toLowerCase());
            const data = normalizedLocation ? mockWeather[normalizedLocation] : mockWeather['Heidenheim'];
            resolve(data);
        }, 500);
    });
};

const getWeatherIcon = (weatherCondition) => {
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
        case 'clear_day': return 'sunny';
        case 'clouds':
        case 'partly_cloudy': return 'cloud';
        case 'rain': return 'rainy';
        case 'snow': return 'ac_unit';
        case 'thunderstorm': return 'thunderstorm';
        case 'drizzle': return 'grain';
        case 'mist':
        case 'fog': return 'foggy';
        case 'windy':
        case 'wind_power': return 'wind_power';
        default: return 'cloudy_snowing';
    }
};

// Update weather location display
const updateWeatherLocationDisplay = () => {
    currentWeatherLocationDisplay.textContent = settings.weatherLocation;
    weatherLocationInput.value = settings.weatherLocation; // Set input value on load
};

// Event listener for weather location input
weatherLocationInput.addEventListener('change', () => { // Using 'change' event to save on blur or enter
    const newLocation = weatherLocationInput.value.trim();
    if (newLocation) {
        settings.weatherLocation = newLocation;
        saveSettings();
        updateWeatherLocationDisplay(); // Update display immediately
    }
});

// Event listener for the weather link button
weatherLinkButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    showDynamicIsland('refresh', 'Wetter wird geladen...', 'Bitte warten...', true);
    dynamicIsland.classList.add('expanded');

    const weatherData = await fetchWeather(settings.weatherLocation);
    if (weatherData) {
        showDynamicIsland(
            weatherData.icon,
            `${weatherData.temp}°C`,
            `${weatherData.description} in ${weatherData.location}`
        );
        // REMOVED: setTimeout to hide/collapse here. User must dismiss manually.
    } else {
        showDynamicIsland('error', 'Fehler', 'Wetterdaten nicht verfügbar.');
        // REMOVED: setTimeout to hide here. User must dismiss manually.
    }
});


// Initialer Zustand beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (settings.dynamicIslandVisible) {
           showDynamicIsland(engineIcons[settings.lastActiveEngine] || 'search', 'Willkommen!', 'Wähle eine Suchmaschine aus.');
        } else {
            hideDynamicIsland();
        }
    }, 100);

    if (!settings.dynamicIslandVisible) {
        reopenIslandBtn.style.display = 'block';
    }
    updateWeatherLocationDisplay(); // Initialize weather location display on load
});

// Example of how to use showDynamicIsland for other useful notifications:
const showNotification = (icon, title, subtitle, duration = 5000) => {
    showDynamicIsland(icon, title, subtitle);
    dynamicIsland.classList.add('expanded');
    setTimeout(() => {
        // Option to auto-hide notifications after a duration, if desired
        // For general use, if island is controlled manually, this might be removed
        // hideDynamicIsland();
    }, duration);
};
