// script.js
const settings = JSON.parse(localStorage?.getItem('mkweb-settings')) || {theme: 'dark', showAvatar: true, lastActiveEngine: 'google'};
const save = () => localStorage?.setItem('mkweb-settings', JSON.stringify(settings));

// Nur noch 'dark' und 'light' als erlaubte Themes
const allowedThemes = ['dark', 'light'];
if (!allowedThemes.includes(settings.theme)) {
    settings.theme = 'dark'; // Fallback auf 'dark', falls 'deep-dark' oder ein ungültiges Theme gespeichert war
    save();
}

document.body.dataset.theme = settings.theme;
const themePicker = document.getElementById('theme-picker');

// Nur 'dark' und 'light' Optionen hinzufügen
themePicker.innerHTML = ''; // Vorhandene Optionen löschen
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

themePicker.value = settings.theme; // Aktuelles Theme auswählen

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
        youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`, // Corrected Youtube URL
        github: `https://github.com/search?q=${encodeURIComponent(query.trim())}`,
        yandex: `https://yandex.com/search/?text=${encodeURIComponent(query.trim())}`
    };

    // Animate search icon on search
    const searchIcon = document.querySelector('.search-box .search-icon-magnify');
    searchIcon.style.animation = 'none';
    void searchIcon.offsetWidth; // Trigger reflow
    searchIcon.style.animation = 'pulseSearch 0.5s ease-out';

    // Optional: add a temporary class for a brief input animation
    searchInput.classList.add('searching');
    setTimeout(() => {
        searchInput.classList.remove('searching');
    }, 500);


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

// Keyframe for search icon pulse
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
    @keyframes pulseSearch {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
    }
`, styleSheet.cssRules.length);


// Verbesserte Uhrzeit-Anzeige
const updateClock = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' }; // Sekunden hinzugefügt
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    document.getElementById('time').textContent = now.toLocaleTimeString('de-DE', timeOptions);
    document.getElementById('date').textContent = now.toLocaleDateString('de-DE', dateOptions);
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
    weatherText.textContent = 'Lädt...'; // Loading state
    weatherIcon.textContent = '🔄';
    weatherLocation.textContent = '';

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
            if (response.status === 401) {
                console.error('Error: Invalid API key for OpenWeatherMap. Please get a valid key.');
                weatherText.textContent = 'N/A';
                weatherIcon.textContent = '❓';
                weatherLocation.textContent = 'API Fehler';
            } else {
                throw new Error(`Weather data not found or API error: ${response.statusText}`);
            }
            return;
        }
        const data = await response.json();
        weatherText.textContent = `${Math.round(data.main.temp)}°C`;
        const iconCode = data.weather[0].icon;
        weatherIcon.textContent = getWeatherEmoji(iconCode);
        weatherLocation.textContent = data.name;
    } catch (error) {
        console.error('Error fetching weather:', error);
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
const quoteSection = document.querySelector('.quote-of-the-day');

const fetchQuote = async () => {
    quoteText.textContent = 'Lade Zitat...'; // Loading state
    quoteAuthor.textContent = '';
    quoteSection.classList.add('loading-quote'); // Add a class for potential loading animation

    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) throw new Error('Quote data not found');
        const data = await response.json();

        // Apply fade-out before setting new text, then fade-in
        // Resetting animations by reading offsetWidth forces reflow
        quoteText.style.animation = 'none';
        quoteAuthor.style.animation = 'none';
        void quoteText.offsetWidth;
        void quoteAuthor.offsetWidth;

        quoteText.style.animation = '';
        quoteAuthor.style.animation = '';

        quoteText.textContent = `"${data.content}"`;
        quoteAuthor.textContent = `- ${data.author}`;
    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteText.textContent = '"Sei die Veränderung, die du in der Welt sehen möchtest."';
        quoteAuthor.textContent = '- Mahatma Gandhi';
    } finally {
        quoteSection.classList.remove('loading-quote');
    }
};

fetchQuote();
setInterval(fetchQuote, 86400000); // Fetch a new quote every 24 hours

// Add a button to manually refresh the quote
const refreshQuoteBtn = document.createElement('button');
refreshQuoteBtn.textContent = '🔄 Neues Zitat';
refreshQuoteBtn.classList.add('glass');
refreshQuoteBtn.style.marginTop = '20px';
refreshQuoteBtn.onclick = fetchQuote;
quoteSection.appendChild(refreshQuoteBtn);


// Stats Tracking
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

    // You might want to display these stats somewhere in your HTML
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

// Dynamic Background Shapes (More advanced, remove static shapes from HTML)
const createBackgroundShapes = (count) => {
    const container = document.body;
    // Remove existing static shapes if any
    document.querySelectorAll('.background-shape').forEach(shape => shape.remove());

    for (let i = 0; i < count; i++) {
        const shape = document.createElement('div');
        shape.classList.add('background-shape');
        const size = Math.random() * (400 - 200) + 200; // Size between 200px and 400px
        const top = Math.random() * 100 - 20; // -20% to 80%
        const left = Math.random() * 100 - 20; // -20% to 80%
        const delay = Math.random() * 20; // Animation delay up to 20s
        const duration = Math.random() * (50 - 30) + 30; // Animation duration between 30s and 50s
        const opacity = Math.random() * (0.05 - 0.01) + 0.01; // Opacity between 0.01 and 0.05

        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.top = `${top}%`;
        shape.style.left = `${left}%`;
        shape.style.animationDelay = `${delay}s`;
        shape.style.animationDuration = `${duration}s`;
        shape.style.opacity = opacity;
        
        // Ensure color is theme-aware by using CSS variables.
        // This will allow the color to switch with theme.
        // The opacity is set directly here as it's random.
        if (i % 2 === 0) {
            shape.style.backgroundColor = 'var(--acc)';
        } else {
            // Use a slightly desaturated version of foreground or background for variety
            shape.style.backgroundColor = 'rgba(var(--fg-rgb), 0.1)'; 
        }
        shape.style.opacity = opacity; // Reapply opacity, it might be overridden by background-color if not careful

        container.appendChild(shape);
    }
};

// Call this to generate shapes on load
createBackgroundShapes(3); // You can adjust the number of shapes


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
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};
