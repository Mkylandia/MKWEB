// script.js - MKWEB OS 8: Dynamic Data, Enhanced Animations & Polished Functionality

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os8';
const settings = JSON.parse(localStorage?.getItem(SETTINGS_KEY)) || {
    theme: 'dark', // Fester Standardwert
    showAvatar: true,
    lastActiveEngine: 'google',
    // NEU: Speichern der Stadt für das Wetter
    weatherCity: 'Heidenheim' 
};

// Function to save settings
const saveSettings = () => {
    localStorage?.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// --- DOM Element Caching ---
const doc = document;
const fullscreenBtn = doc.getElementById('fullscreen-btn');
const userAvatar = doc.getElementById('user-avatar');
const userAvatarToggleBtn = doc.getElementById('user-avatar-toggle');
const searchInput = doc.getElementById('search');
const searchEngines = doc.querySelectorAll('.search-engine');
const timeElement = doc.getElementById('time');
const dateElement = doc.getElementById('date');
const quoteTextElement = doc.getElementById('quote-text');
const quoteAuthorElement = doc.getElementById('quote-author');
// NEU: DOM-Elemente für das Wetter-Widget
const weatherIconElement = doc.getElementById('weather-icon');
const weatherTempElement = doc.getElementById('weather-temp');
const weatherDescElement = doc.getElementById('weather-desc');
const weatherCityElement = doc.getElementById('weather-city');
const weatherDetailsLink = doc.getElementById('weather-details-link');


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Start all initialization functions
    applyAvatarVisibility();
    activateEngine(settings.lastActiveEngine);
    updateDateTime();
    fetchAndDisplayQuote();
    fetchAndDisplayWeather();

    // Set intervals for updates
    setInterval(updateDateTime, 1000); // Jede Sekunde
    setInterval(fetchAndDisplayQuote, 3600000); // Jede Stunde
    setInterval(fetchAndDisplayWeather, 600000); // Alle 10 Minuten
});

userAvatarToggleBtn.addEventListener('click', () => {
    settings.showAvatar = !settings.showAvatar;
    saveSettings();
    applyAvatarVisibility();
});

searchEngines.forEach(btn => {
    btn.addEventListener('click', () => activateEngine(btn.dataset.engine));
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

fullscreenBtn.addEventListener('click', toggleFullscreen);
doc.addEventListener('fullscreenchange', updateFullscreenButton);


// --- User Avatar ---
const applyAvatarVisibility = () => {
    const isHidden = !settings.showAvatar;
    userAvatar.classList.toggle('hidden-avatar', isHidden);
    userAvatar.setAttribute('aria-hidden', String(isHidden));
    userAvatarToggleBtn.textContent = isHidden ? '🐵 Avatar einblenden' : '🙈 Avatar ausblenden';
};

// --- Search Functionality ---
let activeEngine = settings.lastActiveEngine;

const activateEngine = (engine) => {
    searchEngines.forEach(btn => {
        const isActive = btn.dataset.engine === engine;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });
    activeEngine = engine;
    settings.lastActiveEngine = engine;
    saveSettings();
};

const handleSearch = () => {
    const query = searchInput.value.trim();
    if (!query) return;

    let url = '';
    const encodedQuery = encodeURIComponent(query);

    switch (activeEngine) {
        case 'google':      url = `https://www.google.com/search?q=${encodedQuery}`; break;
        case 'yandex':      url = `https://yandex.com/search/?text=${encodedQuery}`; break;
        case 'bing':        url = `https://www.bing.com/search?q=${encodedQuery}`; break;
        case 'duckduckgo':  url = `https://duckduckgo.com/?q=${encodedQuery}`; break;
        // KORRIGIERT: Korrekte YouTube Such-URL
        case 'youtube':     url = `https://www.youtube.com/results?search_query=${encodedQuery}`; break;
        case 'github':      url = `https://github.com/search?q=${encodedQuery}`; break;
        default:            url = `https://www.google.com/search?q=${encodedQuery}`;
    }
    window.open(url, '_blank');
    searchInput.value = '';
};


// --- Time and Date ---
const updateDateTime = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    timeElement.textContent = now.toLocaleTimeString('de-DE', timeOptions);
    dateElement.textContent = now.toLocaleDateString('de-DE', dateOptions);
};

// --- NEU: Dynamic Quote of the Day (via API) ---
const fetchAndDisplayQuote = async () => {
    try {
        const response = await fetch('https://api.quotable.io/random?language=de');
        if (!response.ok) throw new Error('Network response was not ok');
        const quote = await response.json();
        quoteTextElement.textContent = `"${quote.content}"`;
        quoteAuthorElement.textContent = `- ${quote.author}`;
    } catch (error) {
        console.error("Fehler beim Abrufen des Zitats:", error);
        // Fallback auf ein lokales Zitat, wenn die API fehlschlägt
        quoteTextElement.textContent = '"Der beste Weg, die Zukunft vorauszusagen, ist, sie zu gestalten."';
        quoteAuthorElement.textContent = '- Peter F. Drucker';
    }
};

// --- NEU: Dynamic Weather Widget (via API) ---
const fetchAndDisplayWeather = async () => {
    // WICHTIG: Ersetzen Sie 'DEIN_API_SCHLÜSSEL' durch Ihren eigenen API-Schlüssel von OpenWeatherMap
    const API_KEY = 'DEIN_API_SCHLÜSSEL'; 
    const city = settings.weatherCity;

    if (API_KEY === 'DEIN_API_SCHLÜSSEL') {
        weatherDescElement.textContent = 'API-Schlüssel fehlt';
        console.error("Bitte fügen Sie Ihren OpenWeatherMap API-Schlüssel in script.js ein.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=de`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Wetterdaten konnten nicht abgerufen werden.');
        const data = await response.json();
        
        // Daten in die HTML-Elemente einfügen
        weatherTempElement.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescElement.textContent = data.weather[0].description;
        weatherCityElement.textContent = data.name;
        weatherIconElement.textContent = mapWeatherIcon(data.weather[0].icon);
        weatherDetailsLink.href = `https://www.google.com/search?q=wetter+${encodeURIComponent(data.name)}`;

    } catch (error) {
        console.error("Fehler beim Abrufen des Wetters:", error);
        weatherDescElement.textContent = 'Wetter nicht verfügbar';
    }
};

// Helferfunktion, um API-Icons auf Material Symbols abzubilden
const mapWeatherIcon = (iconCode) => {
    const iconMap = {
        '01d': 'clear_day', '01n': 'clear_night',
        '02d': 'partly_cloudy_day', '02n': 'partly_cloudy_night',
        '03d': 'cloud', '03n': 'cloud',
        '04d': 'cloudy', '04n': 'cloudy',
        '09d': 'rainy', '09n': 'rainy',
        '10d': 'rainy', '10n': 'rainy_light',
        '11d': 'thunderstorm', '11n': 'thunderstorm',
        '13d': 'ac_unit', '13n': 'ac_unit', // Schnee
        '50d': 'foggy', '50n': 'foggy',
    };
    return iconMap[iconCode] || 'thermostat'; // Fallback-Icon
};


// --- Fullscreen ---
function toggleFullscreen() {
    if (!doc.fullscreenElement) {
        doc.documentElement.requestFullscreen().catch(err => {
            console.error(`Vollbild-Fehler: ${err.message}`);
        });
    } else {
        doc.exitFullscreen();
    }
}

function updateFullscreenButton() {
    if (doc.fullscreenElement) {
        fullscreenBtn.textContent = 'Shrink';
        fullscreenBtn.setAttribute('title', 'Vollbild verlassen');
    } else {
        fullscreenBtn.textContent = '🚀 Vollbild';
        fullscreenBtn.setAttribute('title', 'Vollbild umschalten');
    }
}
