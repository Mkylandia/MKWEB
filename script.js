// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations
// VERSION MIT PERMANENTER, FUNKTIONSREICHER DYNAMIC ISLAND

// --- Initial Setup & Settings ---
const SETTINGS_KEY = 'mkweb-settings-os7';
let settings = JSON.parse(localStorage?.getItem(SETTINGS_KEY)) || {
    showAvatar: true,
    lastActiveEngine: 'google',
    weatherLocation: 'Heidenheim'
};
const saveSettings = () => localStorage?.setItem(SETTINGS_KEY, JSON.stringify(settings));

// --- DOM Element Caching ---
const searchInput = document.getElementById('search');
const searchEngines = document.querySelectorAll('.search-engine');
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const quoteTextElement = document.getElementById('quote-text');
const quoteAuthorElement = document.getElementById('quote-author');
const weatherLinkButton = document.querySelector('.weather-link-button');

// --- Dynamic Island DOM Elements ---
const dynamicIsland = document.getElementById('dynamicIsland');
const islandViews = document.querySelectorAll('.island-view');
// Default/Compact View
const islandDefaultView = document.getElementById('islandDefaultView');
const compactIcon = document.getElementById('compactIcon');
const compactTitle = document.getElementById('compactTitle');
const compactSubtitle = document.getElementById('compactSubtitle');
const islandWaveform = document.querySelector('.island-waveform');
// Media View
const islandMediaView = document.getElementById('islandMediaView');
const mediaAlbumArt = document.getElementById('mediaAlbumArt');
const mediaTitle = document.getElementById('mediaTitle');
const mediaArtist = document.getElementById('mediaArtist');
const mediaPlayPauseBtn = document.getElementById('mediaPlayPauseBtn');
// Weather View
const islandWeatherView = document.getElementById('islandWeatherView');
const weatherIconLarge = document.getElementById('weatherIconLarge');
const weatherTemp = document.getElementById('weatherTemp');
const weatherLocation = document.getElementById('weatherLocation');
const weatherForecast = document.getElementById('weatherForecast');


// --- CORE DYNAMIC ISLAND LOGIC ---
let currentIslandView = 'default';
let isIslandExpanded = false;

// Zentrale Funktion zum Wechseln der Insel-Ansicht
const setIslandView = (viewName, data = {}) => {
    currentIslandView = viewName;
    // Alle Views ausblenden
    islandViews.forEach(v => v.classList.remove('active-view'));

    // Ziel-View aktivieren und mit Daten füllen
    switch (viewName) {
        case 'media':
            islandMediaView.classList.add('active-view');
            compactIcon.textContent = 'music_note';
            compactTitle.textContent = data.title || "Wiedergabe";
            compactSubtitle.textContent = data.artist || "Mediensteuerung";
            mediaTitle.textContent = data.title || "Unbekannter Titel";
            mediaArtist.textContent = data.artist || "Unbekannter Künstler";
            mediaAlbumArt.src = data.art || 'https://picsum.photos/id/40/100/100';
            break;

        case 'weather':
            islandWeatherView.classList.add('active-view');
            compactIcon.textContent = data.icon || 'thermostat';
            compactTitle.textContent = `${data.temp}° in ${data.location}`;
            compactSubtitle.textContent = data.description;
            // Detaillierte Ansicht füllen
            weatherIconLarge.textContent = data.icon || 'thermostat';
            weatherTemp.textContent = `${data.temp}°`;
            weatherLocation.textContent = `${data.location} - ${data.description}`;
            weatherForecast.innerHTML = (data.forecast || []).map(day => `
                <div class="forecast-day">
                    <span>${day.day}</span>
                    <i class="material-symbols-outlined">${day.icon}</i>
                    <span>${day.temp}°</span>
                </div>
            `).join('');
            break;

        case 'search': // Fallback zu Default
        default:
            islandDefaultView.classList.add('active-view');
            compactIcon.textContent = data.icon || 'search';
            compactTitle.textContent = data.title || "Suchmaschine";
            compactSubtitle.textContent = data.subtitle || "Bereit für deine Eingabe";
            break;
    }
};

// Event Listener zum Erweitern/Zuklappen
dynamicIsland.addEventListener('click', (e) => {
    // Klicks auf interaktive Elemente ignorieren
    if (e.target.closest('button, a')) return;
    
    isIslandExpanded = !isIslandExpanded;
    dynamicIsland.classList.toggle('expanded', isIslandExpanded);
    if (!isIslandExpanded) {
        // Beim Zuklappen sicherstellen, dass die Default-Ansicht aktiv ist
        // (außer bei Media, die bleibt kompakt sichtbar)
        if(currentIslandView !== 'media') {
             setIslandView('default', {
                icon: engineIcons[settings.lastActiveEngine] || 'search',
                title: "Suchmaschine",
                subtitle: `Aktiv: ${settings.lastActiveEngine.charAt(0).toUpperCase() + settings.lastActiveEngine.slice(1)}`
            });
        }
    }
});


// --- Search Functionality ---
let activeEngine = settings.lastActiveEngine;
const engineIcons = {
    google: 'search', yandex: 'travel_explore', bing: 'search',
    duckduckgo: 'search_hands_free', youtube: 'play_circle', github: 'code'
};

const activateEngine = (engine) => {
    searchEngines.forEach(btn => btn.classList.toggle('active', btn.dataset.engine === engine));
    activeEngine = engine;
    settings.lastActiveEngine = engine;
    saveSettings();
    // Insel-Anzeige aktualisieren
    const engineName = engine.charAt(0).toUpperCase() + engine.slice(1);
    setIslandView('default', { icon: engineIcons[engine], title: 'Suchmaschine', subtitle: `Aktiv: ${engineName}` });
};

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            const url = `https://www.${activeEngine}.com/${activeEngine === 'google' ? 'search?q=' : 'results?search_query='}${encodeURIComponent(query)}`;
            setIslandView('default', { icon: 'arrow_forward', title: 'Suche läuft...', subtitle: `Öffne "${query}"` });
            islandWaveform.style.display = 'flex';
            
            setTimeout(() => {
                window.open(url, '_blank');
                islandWaveform.style.display = 'none';
                activateEngine(settings.lastActiveEngine); // Reset island
            }, 1200);
        }
    }
});
searchEngines.forEach(button => button.addEventListener('click', () => activateEngine(button.dataset.engine)));
activateEngine(activeEngine);


// --- Time, Date, Quote, Fullscreen (Unverändert) ---
const updateDateTime = () => {
    timeElement.textContent = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    dateElement.textContent = new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};
setInterval(updateDateTime, 1000);
updateDateTime();

const quotes = [{ text: "Der einzige Weg, großartige Arbeit zu leisten, ist, zu lieben, was man tut.", author: "Steve Jobs" }, { text: "Die Logik bringt dich von A nach B. Die Vorstellungskraft bringt dich überall hin.", author: "Albert Einstein" }];
const displayRandomQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteTextElement.textContent = `"${randomQuote.text}"`;
    quoteAuthorElement.textContent = `- ${randomQuote.author}`;
};
setInterval(displayRandomQuote, 3600000);
document.addEventListener('DOMContentLoaded', displayRandomQuote);

document.getElementById('fullscreen-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
});


// --- Weather Functionality ---
const fetchWeather = async (location) => {
    // --- MOCK DATA FOR DEMONSTRATION ---
    const mockWeather = {
        'Heidenheim': { temp: 22, description: 'Leicht bewölkt', icon: 'cloud', location: 'Heidenheim', forecast: [{day:'Mo', icon:'sunny', temp:24}, {day:'Di', icon:'rainy', temp:18}, {day:'Mi', icon:'thunderstorm', temp:16}] },
    };
    return new Promise(resolve => setTimeout(() => resolve(mockWeather[location]), 800));
};

weatherLinkButton.addEventListener('click', async (e) => {
    e.preventDefault();
    isIslandExpanded = true;
    dynamicIsland.classList.add('expanded');
    setIslandView('default', { icon: 'refresh', title: 'Wetter wird geladen...', subtitle: 'Bitte warten...' });
    
    const weatherData = await fetchWeather(settings.weatherLocation);
    if (weatherData) {
        setIslandView('weather', weatherData);
    } else {
        setIslandView('default', { icon: 'error', title: 'Fehler', subtitle: 'Wetterdaten nicht verfügbar.' });
    }
});


// --- Media Player Demo Functionality ---
const showMediaBtn = document.getElementById('showMediaBtn');
let isPlaying = false;
showMediaBtn.addEventListener('click', () => {
    isIslandExpanded = true;
    dynamicIsland.classList.add('expanded');
    setIslandView('media', { 
        title: "Chasing Sunsets", 
        artist: "Digital Dreams", 
        art: 'https://picsum.photos/id/1015/100/100' 
    });
    isPlaying = false;
    mediaPlayPauseBtn.querySelector('.material-symbols-outlined').textContent = 'play_arrow';
    islandWaveform.style.display = 'none';
});

mediaPlayPauseBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    mediaPlayPauseBtn.querySelector('.material-symbols-outlined').textContent = isPlaying ? 'pause' : 'play_arrow';
    islandWaveform.style.display = isPlaying ? 'flex' : 'none';
});


// --- Initial Page Load State ---
document.addEventListener('DOMContentLoaded', () => {
    setIslandView('default', { icon: 'auto_awesome', title: `Willkommen, User!`, subtitle: `MKWEB OS 7 ist bereit.`})
});
