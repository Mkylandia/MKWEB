// script.js
const settings = JSON.parse(localStorage?.getItem('mkweb-settings')) || {theme: 'dark', showAvatar: true, lastActiveEngine: 'google', userName: '', performanceMode: false};
const save = () => localStorage?.setItem('mkweb-settings', JSON.stringify(settings));

// --- Settings Initialization & Theme Handling ---
const allowedThemes = ['dark', 'light'];
if (!allowedThemes.includes(settings.theme)) {
    settings.theme = 'dark'; // Fallback to 'dark' if an invalid theme was saved
    save();
}

document.body.dataset.theme = settings.theme;
const themePicker = document.getElementById('theme-picker');

// Populate theme picker options
themePicker.innerHTML = ''; // Clear existing options
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

themePicker.value = settings.theme; // Select the current theme

themePicker.onchange = (e) => {
    settings.theme = e.target.value;
    document.body.dataset.theme = settings.theme;
    save();
};

// --- User Avatar & Toggle Logic ---
const userAvatar = document.getElementById('user-avatar');
const userAvatarToggleBtn = document.getElementById('user-avatar-toggle');

const applyAvatarVisibility = () => {
    if (settings.showAvatar) {
        userAvatar.classList.remove('hidden-avatar');
        userAvatar.setAttribute('aria-hidden', 'false'); // For accessibility
        userAvatarToggleBtn.textContent = '🙈 Avatar ausblenden';
    } else {
        userAvatar.classList.add('hidden-avatar');
        userAvatar.setAttribute('aria-hidden', 'true'); // For accessibility
        userAvatarToggleBtn.textContent = '😊 Avatar anzeigen';
    }
};

userAvatarToggleBtn.onclick = () => {
    settings.showAvatar = !settings.showAvatar;
    applyAvatarVisibility();
    save();
};

applyAvatarVisibility(); // Apply initial visibility on load

// --- Fullscreen Toggle ---
const fullscreenBtn = document.getElementById('fullscreen-btn');
fullscreenBtn.onclick = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        fullscreenBtn.textContent = ' shrink';
    } else {
        document.exitFullscreen();
        fullscreenBtn.textContent = '🚀 Vollbild';
    }
};

// --- Time and Date Display ---
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');

const updateTime = () => {
    const now = new Date();
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    timeElement.textContent = now.toLocaleTimeString('de-DE', optionsTime);
    dateElement.textContent = now.toLocaleDateString('de-DE', optionsDate);
};

updateTime();
setInterval(updateTime, 1000);

// --- Quote Display (Fetches a new quote every 30 minutes) ---
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

const fetchQuote = async () => {
    try {
        const response = await fetch('https://api.quotable.io/random?maxLength=100'); // Shorter quotes
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        quoteText.textContent = `"${data.content}"`;
        quoteAuthor.textContent = `- ${data.author}`;
    } catch (error) {
        console.error('Fehler beim Abrufen des Zitats:', error);
        quoteText.textContent = "Das Leben ist wie Fahrradfahren. Um die Balance zu halten, musst du in Bewegung bleiben.";
        quoteAuthor.textContent = "- Albert Einstein";
    }
};

fetchQuote();
setInterval(fetchQuote, 30 * 60 * 1000); // New quote every 30 minutes

// --- Search Engine Handling ---
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchEngineButtons = document.querySelectorAll('.search-engine-button');

const searchEngines = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    youtube: 'https://www.youtube.com/results?search_query=',
    wikipedia: 'https://de.wikipedia.org/wiki/Spezial:Suche?search=',
    github: 'https://github.com/search?q='
};

let currentSearchEngine = settings.lastActiveEngine || 'google';

const setActiveSearchEngineButton = () => {
    searchEngineButtons.forEach(button => {
        if (button.dataset.engine === currentSearchEngine) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
};

searchEngineButtons.forEach(button => {
    button.onclick = () => {
        currentSearchEngine = button.dataset.engine;
        settings.lastActiveEngine = currentSearchEngine;
        save();
        setActiveSearchEngineButton();
    };
});

searchButton.onclick = () => {
    const query = searchInput.value.trim();
    if (query) {
        window.open(searchEngines[currentSearchEngine] + encodeURIComponent(query), '_blank');
        updateStats('search'); // Update search count
        searchInput.value = ''; // Clear input after search
    }
};

searchInput.onkeypress = (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
};

setActiveSearchEngineButton(); // Set initial active button


// --- Weather Widget ---
const weatherText = document.getElementById('weather-text');
const weatherDetails = document.getElementById('weather-details');
const weatherIcon = document.querySelector('.weather-icon');

// Using a free weather API (e.g., OpenWeatherMap - requires API key)
// For demonstration, a placeholder or simple static data is used.
// Replace 'YOUR_API_KEY' with a real API key for live data.
const WEATHER_API_KEY = 'YOUR_API_KEY'; // !!! WICHTIG: Ersetze dies durch deinen OpenWeatherMap API-Schlüssel

const fetchWeather = async (latitude, longitude) => {
    if (WEATHER_API_KEY === 'YOUR_API_KEY') {
        weatherText.textContent = "Wetter: API-Key fehlt";
        weatherDetails.textContent = "Bitte OpenWeatherMap API-Key in script.js eintragen.";
        weatherIcon.textContent = '⚠️';
        console.warn("OpenWeatherMap API Key fehlt. Bitte ersetzen Sie 'YOUR_API_KEY' in script.js.");
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=de`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;

        weatherText.textContent = `${temp}°C, ${description}`;
        weatherDetails.textContent = `Feuchtigkeit: ${data.main.humidity}%, Wind: ${Math.round(data.wind.speed * 3.6)} km/h`; // m/s to km/h

        // Update icon based on OpenWeatherMap icon codes
        // More comprehensive mapping could be done here
        if (iconCode.includes('01')) weatherIcon.textContent = '☀️'; // Clear sky
        else if (iconCode.includes('02')) weatherIcon.textContent = '🌤️'; // Few clouds
        else if (iconCode.includes('03') || iconCode.includes('04')) weatherIcon.textContent = '☁️'; // Scattered/broken clouds
        else if (iconCode.includes('09') || iconCode.includes('10')) weatherIcon.textContent = '🌧️'; // Rain/shower rain
        else if (iconCode.includes('11')) weatherIcon.textContent = '⛈️'; // Thunderstorm
        else if (iconCode.includes('13')) weatherIcon.textContent = '❄️'; // Snow
        else if (iconCode.includes('50')) weatherIcon.textContent = '🌫️'; // Mist
        else weatherIcon.textContent = '🌍'; // Default fallback
    } catch (error) {
        console.error('Fehler beim Abrufen der Wetterdaten:', error);
        weatherText.textContent = "Wetter: N/A";
        weatherDetails.textContent = "Ortungsfehler oder API-Problem.";
        weatherIcon.textContent = '😔';
    }
};

const getWeatherByLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
        }, error => {
            console.warn('Geolocation error:', error);
            weatherText.textContent = "Wetter: Ortung deaktiviert";
            weatherDetails.textContent = "Erlaube den Standortzugriff für Wetterdaten.";
            weatherIcon.textContent = '📍';
            // Fallback for Heidenheim coordinates if location is blocked
            fetchWeather(48.6833, 10.15); // Heidenheim coordinates
        });
    } else {
        weatherText.textContent = "Wetter: Browser-Fehler";
        weatherDetails.textContent = "Geolocation wird nicht unterstützt.";
        weatherIcon.textContent = '🚫';
    }
};

getWeatherByLocation();
setInterval(getWeatherByLocation, 60 * 60 * 1000); // Update weather every hour


// --- User Statistics ---
const stats = JSON.parse(localStorage?.getItem('mkweb-stats')) || {searches: 0, clicks: 0, startTime: Date.now(), timeSpentMinutes: 0};

// Ensure startTime is correctly set for new users or if corrupted
if (!stats.startTime || isNaN(stats.startTime)) {
    stats.startTime = Date.now();
    stats.timeSpentMinutes = 0;
}

const updateStats = type => {
    if (type === 'search') stats.searches++;
    if (type === 'click') stats.clicks++;

    const timeSpentMinutes = Math.round((Date.now() - stats.startTime) / 60000);
    stats.timeSpentMinutes = timeSpentMinutes;

    document.getElementById('search-count').textContent = stats.searches;
    document.getElementById('click-count').textContent = stats.clicks;
    document.getElementById('time-spent').textContent = timeSpentMinutes;

    localStorage?.setItem('mkweb-stats', JSON.stringify(stats));
};

updateStats(); // Initial update to display saved stats

// Track clicks on external links (assuming they open in new tab)
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.onclick = () => updateStats('click');
});


// --- Animate elements on scroll/load ---
const animateOnScroll = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05 // Reduced threshold for earlier animation trigger
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all sections and cards that should animate in
    document.querySelectorAll('.glass, .action-card').forEach(element => {
        observer.observe(element);
    });
};

document.addEventListener('DOMContentLoaded', animateOnScroll);


// --- NEU: Customizable Greeting/Welcome Message ---
if (settings.userName === undefined) {
    settings.userName = ''; // Initialize if not present
}

const greetingText = document.getElementById('greeting-text');
const userNameInput = document.getElementById('user-name-input');

const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    let greeting;
    if (hour < 10) { // bis 10 Uhr
        greeting = 'Guten Morgen';
    } else if (hour < 18) { // 10 bis 18 Uhr
        greeting = 'Guten Tag';
    } else { // Ab 18 Uhr
        greeting = 'Guten Abend';
    }
    greetingText.textContent = `${greeting}, ${settings.userName || 'Gast'}!`;
};

userNameInput.value = settings.userName;
userNameInput.oninput = (e) => {
    settings.userName = e.target.value;
    save();
    updateGreeting();
};

updateGreeting(); // Initial call
setInterval(updateGreeting, 60000); // Update greeting every minute (in case hour changes)


// --- NEU: Performance Mode Toggle ---
const performanceModeToggleBtn = document.getElementById('performance-mode-toggle');
if (settings.performanceMode === undefined) {
    settings.performanceMode = false; // Default to animations on
}

const applyPerformanceMode = () => {
    if (settings.performanceMode) {
        document.body.classList.add('no-animations');
        performanceModeToggleBtn.textContent = '🎨 Normal-Modus';
        performanceModeToggleBtn.setAttribute('title', 'Animationen einschalten');
    } else {
        document.body.classList.remove('no-animations');
        performanceModeToggleBtn.textContent = '⚡ Performance-Modus';
        performanceModeToggleBtn.setAttribute('title', 'Animationen ausschalten (für bessere Performance)');
    }
};

performanceModeToggleBtn.onclick = () => {
    settings.performanceMode = !settings.performanceMode;
    applyPerformanceMode();
    save();
};

// Initial application of performance mode on load
applyPerformanceMode();
