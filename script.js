// script.js
const settings = JSON.parse(localStorage?.getItem('mkweb-settings')) || {theme: 'dark', showAvatar: true, lastActiveEngine: 'google'};
const save = () => localStorage?.setItem('mkweb-settings', JSON.stringify(settings));

// Only 'dark' and 'light' themes allowed
const allowedThemes = ['dark', 'light'];
if (!allowedThemes.includes(settings.theme)) {
    settings.theme = 'dark'; // Fallback to 'dark' if an invalid theme was saved
    save();
}

document.body.dataset.theme = settings.theme;
const themePicker = document.getElementById('theme-picker');

// Only 'dark' and 'light' options added
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

// User Avatar & Toggle Logic
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
        userAvatarToggleBtn.textContent = '👁️ Avatar anzeigen';
    }
};

userAvatarToggleBtn.onclick = () => {
    settings.showAvatar = !settings.showAvatar;
    applyAvatarVisibility();
    save();
};

// Initial application of avatar visibility
applyAvatarVisibility();


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
        // Remove active class from all and add to clicked button
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
        youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`, // Corrected Youtube URL for MKWEB 6.2
        github: `https://github.com/search?q=${encodeURIComponent(query.trim())}`,
        yandex: `https://yandex.com/search/?text=${encodeURIComponent(query.trim())}`
    };
    window.open(urls[activeEngine], '_blank');
    // Removed updateStats('search')
    searchInput.value = '';
};

searchInput.onkeydown = e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        doSearch(searchInput.value);
    }
};

const updateClock = () => {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('date').textContent = now.toLocaleDateString('de-DE', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
};
setInterval(updateClock, 1000);
updateClock();

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
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual key
    const city = 'Heidenheim';

    if (apiKey === 'YOUR_OPENWEATHERMAP_API_KEY' || !apiKey || apiKey.length < 30) {
        console.warn("OpenWeatherMap API Key not set or invalid. Using placeholder weather data.");
        weatherText.textContent = '22°C';
        weatherIcon.textContent = '☀️';
        weatherLocation.textContent = 'Heidenheim';
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            let errorMessage = `Wetterdaten nicht gefunden oder API-Fehler: ${response.statusText}`;
            if (response.status === 401) {
                errorMessage = 'Fehler: Ungültiger API-Schlüssel für OpenWeatherMap. Bitte einen gültigen Schlüssel eingeben.';
            }
            console.error(errorMessage);
            weatherText.textContent = 'N/A';
            weatherIcon.textContent = '❓';
            weatherLocation.textContent = 'API-Fehler';
            return;
        }
        const data = await response.json();
        weatherText.textContent = `${Math.round(data.main.temp)}°C`;
        const iconCode = data.weather[0].icon;
        weatherIcon.textContent = getWeatherEmoji(iconCode);
        weatherLocation.textContent = data.name;
    } catch (error) {
        console.error('Fehler beim Abrufen des Wetters:', error);
        weatherText.textContent = 'N/A';
        weatherIcon.textContent = '❓';
        weatherLocation.textContent = 'Ort unbekannt';
    }
};

fetchWeather();
setInterval(fetchWeather, 3600000); // Update every hour

// Inspirational Quote of the Day
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

const fetchQuote = async () => {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) throw new Error('Zitate-Daten nicht gefunden');
        const data = await response.json();

        // Animate out current quote
        quoteText.style.opacity = '0';
        quoteText.style.transform = 'translateY(-10px)';
        quoteAuthor.style.opacity = '0';
        quoteAuthor.style.transform = 'translateY(-10px)';

        // Wait for the fade-out transition to complete, then update text and fade-in
        setTimeout(() => {
            quoteText.textContent = `"${data.content}"`;
            quoteAuthor.textContent = `- ${data.author}`;
            quoteText.style.opacity = '1';
            quoteText.style.transform = 'translateY(0)';
            quoteAuthor.style.opacity = '1';
            quoteAuthor.style.transform = 'translateY(0)';
        }, 300); // Match this with your CSS transition time for opacity/transform
        
    } catch (error) {
        console.error('Fehler beim Abrufen des Zitats:', error);
        quoteText.textContent = '"Sei die Veränderung, die du in der Welt sehen möchtest."';
        quoteAuthor.textContent = '- Mahatma Gandhi';
        quoteText.style.opacity = '1'; // Ensure fallback is visible
        quoteText.style.transform = 'translateY(0)';
        quoteAuthor.style.opacity = '1';
        quoteAuthor.style.transform = 'translateY(0)';
    }
};

fetchQuote();
setInterval(fetchQuote, 86400000); // Fetch a new quote every 24 hours

// Removed all stats tracking related code as requested.

// Animate elements on scroll/load
const animateOnScroll = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.08 // Slightly increased threshold for earlier animation trigger
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
    document.querySelectorAll('.search-section, .time-display, .quote-of-the-day, .action-card, .news-section, .bookmark-section').forEach(element => {
        observer.observe(element);
    });
};

document.addEventListener('DOMContentLoaded', animateOnScroll);
