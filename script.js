// script.js - MKWEB 6.3: Enhanced Functionality & Animations
const settings = JSON.parse(localStorage?.getItem('mkweb-settings')) || {theme: 'dark', showAvatar: true, lastActiveEngine: 'google'};
const save = () => localStorage?.setItem('mkweb-settings', JSON.stringify(settings));

// Nur noch 'dark' und 'light' als erlaubte Themes
const allowedThemes = ['dark', 'light'];
if (!allowedThemes.includes(settings.theme)) {
    settings.theme = 'dark'; // Fallback, falls ein ungültiges Theme gespeichert war
    save();
}

document.body.dataset.theme = settings.theme;
const themePicker = document.getElementById('theme-picker');

// Nur 'dark' und 'light' Optionen hinzufügen und aktuelles Theme auswählen
themePicker.innerHTML = '';
const themes = [
    { value: 'dark', text: 'Dark Theme' },
    { value: 'light', text: 'Light Theme' }
];

themes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.value;
    option.textContent = theme.text;
    themePicker.appendChild(option);
});

themePicker.value = settings.theme;

// User Avatar & Toggle Logic
const userAvatar = document.getElementById('user-avatar');
const userAvatarToggleBtn = document.getElementById('user-avatar-toggle');

const applyAvatarVisibility = () => {
    if (settings.showAvatar) {
        userAvatar.classList.remove('hidden-avatar');
        userAvatar.setAttribute('aria-hidden', 'false');
        userAvatarToggleBtn.textContent = '🙈 Avatar ausblenden';
    } else {
        userAvatar.classList.add('hidden-avatar');
        userAvatar.setAttribute('aria-hidden', 'true');
        userAvatarToggleBtn.textContent = '👁️ Avatar anzeigen';
    }
};

userAvatarToggleBtn.onclick = () => {
    settings.showAvatar = !settings.showAvatar;
    applyAvatarVisibility();
    save();
};

applyAvatarVisibility(); // Initial application

themePicker.onchange = e => {
    settings.theme = e.target.value;
    document.body.dataset.theme = e.target.value;
    save();
};

document.getElementById('fullscreen-btn').onclick = () => {
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
};

const searchInput = document.getElementById('search');
const engines = document.querySelectorAll('.search-engine');
let activeEngine = settings.lastActiveEngine;

// Set initial active engine button
const initialEngineButton = document.querySelector(`.search-engine[data-engine="${activeEngine}"]`);
if (initialEngineButton) {
    initialEngineButton.classList.add('active');
} else {
    activeEngine = 'google'; // Fallback
    document.querySelector('.search-engine[data-engine="google"]').classList.add('active');
    settings.lastActiveEngine = activeEngine;
    save();
}

engines.forEach(btn => {
    btn.onclick = () => {
        engines.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeEngine = btn.dataset.engine;
        settings.lastActiveEngine = activeEngine;
        save();
        searchInput.focus();
    };
});

const doSearch = query => {
    if (!query || query.trim() === '') return;
    const urls = {
        google: `https://google.com/search?q=${encodeURIComponent(query.trim())}`,
        bing: `https://bing.com/search?q=${encodeURIComponent(query.trim())}`,
        duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query.trim())}`,
        youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`, // Korrigierte YouTube URL
        github: `https://github.com/search?q=${encodeURIComponent(query.trim())}`,
        yandex: `https://yandex.com/search/?text=${encodeURIComponent(query.trim())}`
    };

    const searchIcon = document.querySelector('.search-box .search-icon-magnify');
    searchIcon.style.animation = 'none';
    void searchIcon.offsetWidth; // Trigger reflow
    searchIcon.style.animation = 'pulseSearch 0.4s ease-out'; // Kürzere, prägnantere Animation

    searchInput.classList.add('searching');
    setTimeout(() => {
        searchInput.classList.remove('searching');
    }, 400);

    window.open(urls[activeEngine], '_blank');
    updateStats('search');
    searchInput.value = '';
};

searchInput.onkeydown = e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        doSearch(searchInput.value);
    }
};

// Keyframe for search icon pulse (Ensures it's always there)
if (!document.querySelector('style#dynamic-search-pulse')) {
    const style = document.createElement('style');
    style.id = 'dynamic-search-pulse';
    style.innerHTML = `
        @keyframes pulseSearch {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.9; } /* Sanfterer Puls */
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}


// Verbesserte Uhrzeit-Anzeige
const updateClock = () => {
    const now = new Date();
    // Stellen Sie sicher, dass 'de-DE' für deutsche Ausgabe verwendet wird
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    document.getElementById('time').textContent = now.toLocaleTimeString('de-DE', timeOptions);
    document.getElementById('date').textContent = now.toLocaleDateString('de-DE', dateOptions);
};
setInterval(updateClock, 1000);
updateClock(); // Initialer Aufruf

// Weather Widget functionality
const weatherText = document.getElementById('weather-text');
const weatherIcon = document.querySelector('.weather-widget .weather-icon');
const weatherLocation = document.getElementById('weather-location');

// Helper function to map OpenWeatherMap icon codes to emojis
const getWeatherEmoji = (iconCode) => {
    switch (iconCode) {
        case '01d': return '☀️'; // clear sky day
        case '01n': return '🌙'; // clear sky night
        case '02d': return '🌤️'; // few clouds day
        case '02n': return '☁️'; // few clouds night
        case '03d':
        case '03n': return '☁️'; // scattered clouds
        case '04d':
        case '04n': return '☁️'; // broken clouds
        case '09d':
        case '09n': return '🌧️'; // shower rain
        case '10d': return '🌦️'; // rain day
        case '10n': return '🌧️'; // rain night
        case '11d':
        case '11n': return '⛈️'; // thunderstorm
        case '13d':
        case '13n': return '🌨️'; // snow
        case '50d':
        case '50n': return '🌫️'; // mist
        default: return '❓';
    }
};

const fetchWeather = async () => {
    weatherText.textContent = 'Lädt...';
    weatherIcon.textContent = '🔄';
    weatherLocation.textContent = '';

    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // ERSETZE DIES MIT DEINEM ECHTEN API KEY!
    const city = 'Heidenheim'; // Standardstadt

    if (apiKey === 'YOUR_OPENWEATHERMAP_API_KEY' || !apiKey || apiKey.length < 30) {
        console.warn("OpenWeatherMap API Key ist nicht gesetzt oder ungültig. Es werden Platzhalter-Wetterdaten verwendet.");
        weatherText.textContent = '22°C';
        weatherIcon.textContent = '☀️';
        weatherLocation.textContent = 'Heidenheim';
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401) {
                console.error('Fehler: Ungültiger API-Schlüssel für OpenWeatherMap.');
            } else {
                throw new Error(`Wetterdaten nicht gefunden oder API-Fehler: ${response.statusText}`);
            }
            weatherText.textContent = 'N/A';
            weatherIcon.textContent = '❓';
            weatherLocation.textContent = 'API Fehler';
            return;
        }
        const data = await response.json();
        weatherText.textContent = `${Math.round(data.main.temp)}°C`;
        const iconCode = data.weather[0].icon;
        weatherIcon.textContent = getWeatherEmoji(iconCode);
        weatherLocation.textContent = data.name;
    } catch (error) {
        console.error('Fehler beim Abrufen der Wetterdaten:', error);
        weatherText.textContent = 'N/A';
        weatherIcon.textContent = '❓';
        weatherLocation.textContent = 'Ort unbekannt';
    }
};

fetchWeather();
setInterval(fetchWeather, 3600000); // Aktualisiere jede Stunde

// Inspirational Quote of the Day
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteSection = document.querySelector('.quote-of-the-day');

const fetchQuote = async () => {
    quoteText.textContent = 'Lade Zitat...';
    quoteAuthor.textContent = '';
    quoteSection.classList.add('loading-quote');

    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) throw new Error('Zitatdaten nicht gefunden');
        const data = await response.json();

        // Animationen zurücksetzen und neu starten
        quoteText.style.animation = 'none';
        quoteAuthor.style.animation = 'none';
        void quoteText.offsetWidth; // Erzwingt Reflow
        void quoteAuthor.offsetWidth;

        quoteText.style.animation = 'quoteFadeIn 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) forwards';
        quoteAuthor.style.animation = 'quoteFadeIn 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) forwards 0.1s';

        quoteText.textContent = `"${data.content}"`;
        quoteAuthor.textContent = `- ${data.author}`;
    } catch (error) {
        console.error('Fehler beim Abrufen des Zitats:', error);
        quoteText.textContent = '"Sei die Veränderung, die du in der Welt sehen möchtest."';
        quoteAuthor.textContent = '- Mahatma Gandhi';
    } finally {
        quoteSection.classList.remove('loading-quote');
    }
};

fetchQuote();
setInterval(fetchQuote, 86400000); // Aktualisiere alle 24 Stunden

// Füge einen Button zum manuellen Aktualisieren des Zitats hinzu (nur einmal)
if (!document.getElementById('refresh-quote-btn')) {
    const refreshQuoteBtn = document.createElement('button');
    refreshQuoteBtn.id = 'refresh-quote-btn'; // ID für eindeutigkeit
    refreshQuoteBtn.textContent = '🔄 Neues Zitat';
    refreshQuoteBtn.classList.add('glass'); // Nutzt den Glass-Style
    refreshQuoteBtn.style.marginTop = '1.5rem'; // Bessere vertikale Ausrichtung
    refreshQuoteBtn.onclick = fetchQuote;
    quoteSection.appendChild(refreshQuoteBtn);
}


// Stats Tracking (wie zuvor)
let stats = {searches: 0, clicks: 0, startTime: Date.now()};

const savedStats = JSON.parse(localStorage?.getItem('mkweb-stats'));
if (savedStats) {
    stats = savedStats;
    stats.startTime = Date.now() - (savedStats.timeSpentMinutes * 60000 || 0);
}

const updateStats = type => {
    if (type === 'search') stats.searches++;
    if (type === 'click') stats.clicks++;

    const timeSpentMinutes = Math.round((Date.now() - stats.startTime) / 60000);
    stats.timeSpentMinutes = timeSpentMinutes;

    // Optional: Stats in HTML anzeigen, falls du Elemente dafür hast
    // document.getElementById('search-count').textContent = stats.searches;
    // document.getElementById('click-count').textContent = stats.clicks;
    // document.getElementById('time-spent').textContent = timeSpentMinutes;

    localStorage?.setItem('mkweb-stats', JSON.stringify(stats));
};

updateStats();

document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.onclick = () => updateStats('click');
});

// Animate elements on scroll/load
const animateOnScroll = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.03 // Reduzierter Schwellenwert für früheres Auslösen
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass').forEach(element => { // Alle Glass-Elemente animieren
        observer.observe(element);
    });
};

document.addEventListener('DOMContentLoaded', animateOnScroll);

// Dynamic Background Shapes
const createBackgroundShapes = (count) => {
    const container = document.body;
    document.querySelectorAll('.background-shape').forEach(shape => shape.remove()); // Entfernt bestehende

    for (let i = 0; i < count; i++) {
        const shape = document.createElement('div');
        shape.classList.add('background-shape');
        const size = Math.random() * (350 - 150) + 150; // Größe zwischen 150px und 350px
        const top = Math.random() * 100 - 10; // -10% bis 90%
        const left = Math.random() * 100 - 10; // -10% bis 90%
        const delay = Math.random() * 15; // Animation delay bis 15s
        const duration = Math.random() * (40 - 25) + 25; // Animation duration zwischen 25s und 40s
        const opacity = Math.random() * (0.04 - 0.01) + 0.01; // Opacity zwischen 0.01 und 0.04

        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.top = `${top}%`;
        shape.style.left = `${left}%`;
        shape.style.animationDelay = `${delay}s`;
        shape.style.animationDuration = `${duration}s`;
        shape.style.opacity = opacity;
        
        if (i % 2 === 0) {
            shape.style.backgroundColor = 'var(--acc)';
        } else {
            shape.style.backgroundColor = 'rgba(var(--fg-rgb), 0.08)'; // Etwas mehr Farbe
        }
        shape.style.opacity = opacity;

        container.appendChild(shape);
    }
};

createBackgroundShapes(4); // Erstelle 4 dynamische Hintergrundformen


// Scroll to top button logic
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.classList.add('scroll-to-top');
scrollToTopBtn.innerHTML = '⬆️';
scrollToTopBtn.title = 'Nach oben scrollen';
document.body.appendChild(scrollToTopBtn);

window.onscroll = () => {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
};

scrollToTopBtn.onclick = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};
