// script.js
const settings = JSON.parse(localStorage?.getItem('mkweb-settings')) || {theme: 'neon', showAvatar: true, lastActiveEngine: 'google'};
const save = () => localStorage?.setItem('mkweb-settings', JSON.stringify(settings));

document.body.dataset.theme = settings.theme;
document.getElementById('theme-picker').value = settings.theme;

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


document.getElementById('theme-picker').onchange = e => {
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

const getWeatherEmoji = (iconCode) => {
  switch (iconCode) {
    case '01d': return '☀️';
    case '01n': return '🌙';
    case '02d': return '🌤️';
    case '02n': return '☁️';
    case '03d':
    case '03n': return '☁️';
    case '04d':
    case '04n': return ' overcast';
    case '09d':
    case '09n': return '🌧️';
    case '10d': return '🌦️';
    case '10n': return '🌧️';
    case '11d':
    case '11n': return '⛈️';
    case '13d':
    case '13n': return '❄️';
    case '50d':
    case '50n': return '🌫️';
    default: return '❓';
  }
};

fetchWeather();
setInterval(fetchWeather, 3600000);

// Inspirational Quote of the Day
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

const fetchQuote = async () => {
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
    }
};

fetchQuote();
setInterval(fetchQuote, 86400000); // Fetch a new quote every 24 hours

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

  document.getElementById('search-count').textContent = stats.searches;
  document.getElementById('click-count').textContent = stats.clicks;
  document.getElementById('time-spent').textContent = timeSpentMinutes;

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
