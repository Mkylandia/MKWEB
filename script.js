// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations - LIGHTWEIGHT VERSION

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os7';
let settings = JSON.parse(localStorage?.getItem(SETTINGS_KEY)) || {
    theme: 'dark', // Fester Standardwert
    showAvatar: true,
    lastActiveEngine: 'google',
    dynamicIslandHidden: false // Standardmäßig sichtbar beim Start
};

// Function to save settings
const saveSettings = () => {
    localStorage?.setItem(SETTINGS_KEY, JSON.stringify(settings));
};


// --- DOM Element Caching (Performance) ---
const fullscreenBtn = document.getElementById('fullscreen-btn');
const userAvatar = document.getElementById('user-avatar'); // Kann null sein, wenn kein Avatar-Element existiert
const userAvatarToggleBtn = document.getElementById('user-avatar-toggle');
const searchInput = document.getElementById('search');
const searchEngines = document.querySelectorAll('.search-engine');
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const quoteTextElement = document.getElementById('quote-text');
const quoteAuthorElement = document.getElementById('quote-author');

// Dynamic Island Elemente
const dynamicIslandContainer = document.getElementById('dynamic-island-container');
const dynamicIsland = document.getElementById('dynamic-island');
const islandMainIcon = document.getElementById('island-main-icon');
const islandTitle = document.getElementById('island-title');
const islandMessage = document.getElementById('island-message');
const islandStatus = document.getElementById('island-status');
const islandDismissBtn = document.getElementById('island-dismiss-btn');
const reopenIslandButton = document.getElementById('reopen-island-btn'); // Neuer Button

// --- User Avatar & Toggle Logic ---
const applyAvatarVisibility = () => {
    if (userAvatar) { // Prüfen, ob das Element existiert
        if (settings.showAvatar) {
            userAvatar.classList.remove('hidden-avatar');
            userAvatar.setAttribute('aria-hidden', 'false');
            userAvatarToggleBtn.textContent = '🙈 Avatar ausblenden';
        } else {
            userAvatar.classList.add('hidden-avatar');
            userAvatar.setAttribute('aria-hidden', 'true');
            userAvatarToggleBtn.textContent = '🐵 Avatar anzeigen';
        }
    }
};

if (userAvatarToggleBtn) { // Prüfen, ob der Button existiert
    userAvatarToggleBtn.addEventListener('click', () => {
        settings.showAvatar = !settings.showAvatar;
        saveSettings();
        applyAvatarVisibility();
    });
}
applyAvatarVisibility();


// --- Fullscreen Toggle ---
if (fullscreenBtn) { // Prüfen, ob der Button existiert
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
}


// --- Search Engine Logic ---
const searchEnginesMap = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    youtube: 'https://www.youtube.com/results?search_query=',
    wikipedia: 'https://de.wikipedia.org/w/index.php?search=',
    github: 'https://github.com/search?q='
};

const engineIcons = {
    google: 'travel_explore',
    duckduckgo: 'search',
    youtube: 'play_circle',
    wikipedia: 'article',
    github: 'data_object'
};

const activateEngine = (engine) => {
    // Entferne 'active' von allen Buttons
    searchEngines.forEach(btn => btn.classList.remove('active'));

    // Füge 'active' zum geklickten Button hinzu
    const targetButton = document.querySelector(`.search-engine[data-engine="${engine}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
        settings.lastActiveEngine = engine;
        saveSettings();
    }
};

searchEngines.forEach(engineBtn => {
    engineBtn.addEventListener('click', () => {
        const engine = engineBtn.dataset.engine;
        activateEngine(engine);
        // Dynamic Island aktualisieren bei Suchmaschinenwechsel
        const engineName = engine.charAt(0).toUpperCase() + engine.slice(1);
        updateIsland(engineIcons[engine] || 'search', 'Suchmaschine', `Aktiv: ${engineName}`);
        if (dynamicIsland.classList.contains('expanded')) {
            setTimeout(() => dynamicIsland.classList.remove('expanded'), 300);
        }
    });
});

// Setze die zuletzt aktive Suchmaschine beim Laden
activateEngine(settings.lastActiveEngine);


// --- Time and Date ---
const updateDateTime = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    timeElement.textContent = now.toLocaleTimeString('de-DE', timeOptions);
    dateElement.textContent = now.toLocaleDateString('de-DE', dateOptions);
};

// Initial update and set interval
updateDateTime();
setInterval(updateDateTime, 1000); // Jede Sekunde aktualisieren


// --- Quotes ---
const fetchQuote = async () => {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        quoteTextElement.textContent = `"${data.content}"`;
        quoteAuthorElement.textContent = `- ${data.author}`;
    } catch (error) {
        console.error('Fehler beim Abrufen des Zitats:', error);
        quoteTextElement.textContent = '"Lebe, als würdest du sterben müssen, lerne, als würdest du ewig leben."';
        quoteAuthorElement.textContent = '- Mahatma Gandhi';
    }
};
fetchQuote(); // Zitat beim Laden abrufen


// --- Dynamic Island Functions ---
let islandHideTimeout;

const updateIsland = (icon, title, message, showWaveform = false) => {
    islandMainIcon.textContent = icon;
    islandTitle.textContent = title;
    islandMessage.textContent = message;

    if (showWaveform) {
        islandStatus.innerHTML = `
            <div class="island-waveform">
                <span></span><span></span><span></span><span></span>
            </div>
        `;
    } else {
        islandStatus.innerHTML = '';
    }

    dynamicIslandContainer.classList.remove('hidden');
    settings.dynamicIslandHidden = false; // Island ist jetzt sichtbar
    saveSettings();

    clearTimeout(islandHideTimeout);
    islandHideTimeout = setTimeout(() => {
        dynamicIslandContainer.classList.add('hidden');
        settings.dynamicIslandHidden = true; // Island ist jetzt versteckt
        saveSettings();
        reopenIslandButton.classList.add('visible'); // Reopen-Button sichtbar machen
        dynamicIsland.classList.remove('expanded'); // Sicherstellen, dass es nicht erweitert bleibt
    }, 5000); // 5 Sekunden sichtbar
};

const toggleIslandExpanded = () => {
    dynamicIsland.classList.toggle('expanded');
    clearTimeout(islandHideTimeout); // Verhindert automatisches Ausblenden beim Erweitern
    if (!dynamicIsland.classList.contains('expanded')) {
        // Wenn es geschlossen wird, starte den Hide-Timeout neu
        islandHideTimeout = setTimeout(() => {
            dynamicIslandContainer.classList.add('hidden');
            settings.dynamicIslandHidden = true;
            saveSettings();
            reopenIslandButton.classList.add('visible');
        }, 1000); // Nach 1 Sekunde ausblenden, wenn manuell geschlossen
    }
};

dynamicIsland.addEventListener('click', (e) => {
    if (!islandDismissBtn.contains(e.target)) { // Nicht erweitern, wenn Dismiss geklickt wird
        toggleIslandExpanded();
    }
});

islandDismissBtn.addEventListener('click', () => {
    dynamicIslandContainer.classList.add('hidden');
    settings.dynamicIslandHidden = true;
    saveSettings();
    reopenIslandButton.classList.add('visible');
    dynamicIsland.classList.remove('expanded'); // Sicherstellen, dass es nicht erweitert bleibt
    clearTimeout(islandHideTimeout); // Timeout löschen, da manuell ausgeblendet
});

// Neuer Button zum Wiederherstellen der Dynamic Island
reopenIslandButton.addEventListener('click', () => {
    dynamicIslandContainer.classList.remove('hidden');
    settings.dynamicIslandHidden = false;
    saveSettings();
    reopenIslandButton.classList.remove('visible'); // Button wieder verstecken
    fetchWeatherAndDisplay(); // Wetter beim Wiederöffnen aktualisieren
});


// --- Wetter-Funktionen für Dynamic Island ---
const weatherIconMap = {
    0: 'clear_day',        // Clear sky
    1: 'partly_cloudy_day',// Mainly clear
    2: 'partly_cloudy_day',// Partly cloudy
    3: 'cloud',            // Overcast
    45: 'foggy',           // Fog and rime fog
    48: 'foggy',           // Fog and rime fog
    51: 'rainy_light',     // Drizzle: Light
    53: 'rainy',           // Drizzle: Moderate
    55: 'rainy_heavy',     // Drizzle: Dense intensity
    56: 'freezing_rain',   // Freezing Drizzle: Light
    57: 'freezing_rain',   // Freezing Drizzle: Dense intensity
    61: 'rainy_light',     // Rain: Slight
    63: 'rainy',           // Rain: Moderate
    65: 'rainy_heavy',     // Rain: Heavy intensity
    66: 'freezing_rain',   // Freezing Rain: Light
    67: 'freezing_rain',   // Freezing Rain: Heavy intensity
    71: 'weather_snowy',   // Snow fall: Slight
    73: 'weather_snowy',   // Snow fall: Moderate
    75: 'weather_snowy',   // Snow fall: Heavy intensity
    77: 'weather_snowy',   // Snow grains
    80: 'thunderstorm',    // Rain showers: Slight
    81: 'thunderstorm',    // Rain showers: Moderate
    82: 'thunderstorm',    // Rain showers: Violent
    85: 'weather_snowy',   // Snow showers: Slight
    86: 'weather_snowy',   // Snow showers: Heavy
    95: 'thunderstorm',    // Thunderstorm: Slight or moderate
    96: 'thunderstorm',    // Thunderstorm with slight hail
    99: 'thunderstorm'     // Thunderstorm with heavy hail
};

function getWeatherIcon(weatherCode) {
    return weatherIconMap[weatherCode] || 'thermostat'; // Standard-Icon, wenn kein Match
}

const fetchWeatherAndDisplay = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&forecast_days=1&timezone=auto`;

            try {
                const response = await fetch(weatherApiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Weather data:", data); // Zum Debuggen

                if (data.current_weather) {
                    const temp = data.current_weather.temperature;
                    const weatherCode = data.current_weather.weathercode;
                    const windSpeed = data.current_weather.windspeed;
                    const icon = getWeatherIcon(weatherCode);

                    let message = `${temp}°C, Wind: ${windSpeed} km/h`;
                    // Optional: Wetterbeschreibung basierend auf Code hinzufügen (für Open-Meteo nur Codes)
                    // Könnte hier eine eigene Map für Textbeschreibungen erstellen, wenn gewünscht

                    updateIsland(icon, 'Wetter aktuell', message);
                } else {
                    updateIsland('cloud_off', 'Wetter Fehler', 'Keine Wetterdaten verfügbar.');
                }

            } catch (error) {
                console.error('Fehler beim Abrufen der Wetterdaten:', error);
                updateIsland('cloud_off', 'Wetter Fehler', 'Konnte Wetter nicht abrufen.');
            }
        }, (error) => {
            console.error('Geolocation Fehler:', error);
            let errorMessage = 'Standort unbekannt.';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Standortzugriff verweigert.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Standortinformationen nicht verfügbar.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Standortabfrage Zeitüberschreitung.';
                    break;
            }
            updateIsland('location_off', 'Standortfehler', errorMessage);
        });
    } else {
        updateIsland('location_off', 'Fehler', 'Geolocation nicht unterstützt.');
    }
};

// --- Such-Event erweitern (mit Delay) ---
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            updateIsland('arrow_forward', 'Weiterleitung...', `Suche nach "${query}"`, true);
            dynamicIsland.classList.add('expanded'); // Insel erweitern, um Animation zu zeigen

            // Kurzer Delay vor der Weiterleitung
            setTimeout(() => {
                const activeEngine = settings.lastActiveEngine;
                const searchUrl = searchEnginesMap[activeEngine] + encodeURIComponent(query);
                window.open(searchUrl, '_blank');
                // Nach der Weiterleitung Insel wieder auf den normalen Zustand zurücksetzen
                setTimeout(() => {
                    dynamicIsland.classList.remove('expanded');
                    // Ggf. wieder die zuletzt aktive Engine anzeigen oder Wetter
                    // Hier entscheiden, ob man wieder auf die Engine Info oder Wetter zurückspringt
                    if (!settings.dynamicIslandHidden) { // Nur wenn Island nicht manuell ausgeblendet wurde
                         activateEngine(settings.lastActiveEngine); // Zeigt wieder aktive Engine an
                    }
                }, 1000); // Kurzer Delay, bevor Insel zurückgesetzt wird
            }, 1500); // 1.5 Sekunden Verzögerung vor der eigentlichen Suche
        }
    }
});


// --- Initialer Zustand beim Laden der Seite ---
document.addEventListener('DOMContentLoaded', () => {
    // Sicherstellen, dass der Reopen-Button korrekt initialisiert wird
    if (settings.dynamicIslandHidden) {
        dynamicIslandContainer.classList.add('hidden');
        reopenIslandButton.classList.add('visible');
    } else {
        dynamicIslandContainer.classList.remove('hidden');
        reopenIslandButton.classList.remove('visible');
        // Kleine Verzögerung, um sicherzustellen, dass alles geladen ist, dann Wetter anzeigen
        setTimeout(() => {
            fetchWeatherAndDisplay(); // Wetter beim Start anzeigen
        }, 500);
    }
});
