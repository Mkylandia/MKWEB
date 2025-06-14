// script.js - MKWEB OS 7: Enhanced Functionality & Animations
const settings = JSON.parse(localStorage?.getItem('mkweb-settings')) || {theme: 'dark', showAvatar: true, lastActiveEngine: 'google'};
const save = () => localStorage?.setItem('mkweb-settings', JSON.stringify(settings));

// Only 'dark' and 'light' are allowed themes
const allowedThemes = ['dark', 'light'];
if (!allowedThemes.includes(settings.theme)) {
    settings.theme = 'dark'; // Fallback if an invalid theme was saved
    save();
}

document.body.dataset.theme = settings.theme;
const themePicker = document.getElementById('theme-picker');

// Add only 'dark' and 'light' options and select current theme
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

themePicker.addEventListener('change', (e) => {
    settings.theme = e.target.value;
    document.body.dataset.theme = settings.theme;
    save();
    // Update weather widget theme if it relies on CSS variables
    fetchWeather(); // Re-fetch weather to update icon and colors if theme affects them
});

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
        userAvatarToggleBtn.textContent = '🐵 Avatar einblenden';
    }
};

userAvatarToggleBtn.addEventListener('click', () => {
    settings.showAvatar = !settings.showAvatar;
    save();
    applyAvatarVisibility();
});

// Apply initial visibility
applyAvatarVisibility();


// Search Functionality
const searchInput = document.getElementById('search');
const searchEngines = document.querySelectorAll('.search-engine');
let activeEngine = settings.lastActiveEngine || 'google'; // Default or last active

const activateEngine = (engine) => {
    searchEngines.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.engine === engine) {
            btn.classList.add('active');
            activeEngine = engine;
            settings.lastActiveEngine = engine; // Save last active engine
            save();
        }
    });
};

searchEngines.forEach(btn => {
    btn.addEventListener('click', () => activateEngine(btn.dataset.engine));
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
            window.open(url, '_blank');
        }
    }
});

// Initialize active engine
activateEngine(activeEngine);

// Time and Date Display
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');

const updateDateTime = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    timeElement.textContent = now.toLocaleTimeString('de-DE', timeOptions);
    dateElement.textContent = now.toLocaleDateString('de-DE', dateOptions);
};

// Update every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call

// Weather Widget
const weatherText = document.getElementById('weather-text');
const weatherLocation = document.getElementById('weather-location');
const weatherIcon = document.querySelector('.weather-icon');

// This API key is for demonstration only. Please replace with a real one or use a proxy.
const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
const DEFAULT_CITY = 'Heidenheim'; // Default city for weather

const getWeatherIcon = (iconCode) => {
    // Map OpenWeatherMap icon codes to simple emojis
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
        case '13n': return '❄️'; // snow
        case '50d':
        case '50n': return '🌫️'; // mist
        default: return '❓'; // unknown
    }
};

const fetchWeather = async () => {
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
        weatherText.textContent = 'Wetter API Key fehlt!';
        weatherLocation.textContent = '';
        weatherIcon.textContent = '⚠️';
        console.warn('OpenWeatherMap API Key is missing. Please replace "YOUR_OPENWEATHERMAP_API_KEY" in script.js.');
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&appid=${WEATHER_API_KEY}&units=metric&lang=de`);
        if (!response.ok) {
            throw new Error(`Wetterdaten konnten nicht geladen werden: ${response.statusText}`);
        }
        const data = await response.json();
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;

        weatherText.textContent = `${temperature}°C, ${description}`;
        weatherLocation.textContent = data.name;
        weatherIcon.textContent = getWeatherIcon(iconCode);
    } catch (error) {
        console.error('Fehler beim Abrufen der Wetterdaten:', error);
        weatherText.textContent = 'Wetter nicht verfügbar';
        weatherLocation.textContent = DEFAULT_CITY;
        weatherIcon.textContent = '🚫';
    }
};

// Fetch weather data on load and every 10 minutes
fetchWeather();
setInterval(fetchWeather, 10 * 60 * 1000);

// Quote of the Day
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

const fetchQuote = async () => {
    try {
        const response = await fetch('https://api.quotable.io/random?maxLength=100'); // Shorter quotes
        if (!response.ok) {
            throw new Error(`Zitat konnte nicht geladen werden: ${response.statusText}`);
        }
        const data = await response.json();
        quoteText.textContent = `"${data.content}"`;
        quoteAuthor.textContent = `- ${data.author}`;

        // Re-apply the animation class to trigger it for new quotes
        quoteText.classList.remove('quoteFadeIn'); // Remove to allow re-trigger
        quoteAuthor.classList.remove('quoteFadeIn'); // Remove to allow re-trigger
        void quoteText.offsetWidth; // Trigger reflow
        void quoteAuthor.offsetWidth; // Trigger reflow
        quoteText.classList.add('animate-in'); // Use the general animate-in for simplicity
        quoteAuthor.classList.add('animate-in'); // Use the general animate-in for simplicity
    } catch (error) {
        console.error('Fehler beim Abrufen des Zitats:', error);
        quoteText.textContent = 'Manchmal muss man einfach schweigen und das Chaos genießen.';
        quoteAuthor.textContent = '- Unbekannt';
    }
};

// Fetch a new quote every 24 hours (or on page load)
fetchQuote();
setInterval(fetchQuote, 24 * 60 * 60 * 1000);

// Background Shapes Creation - Enhanced for more 3D variety
const createBackgroundShapes = (numShapes) => {
    const container = document.body; // Or a specific container if you want them limited
    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        shape.classList.add('background-shape');

        const size = Math.random() * (400 - 200) + 200; // Size between 200px and 400px
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 20; // Animation delay up to 20s
        const duration = Math.random() * (45 - 30) + 30; // Animation duration between 30s and 45s
        const opacity = Math.random() * (0.05 - 0.01) + 0.01; // Opacity between 0.01 and 0.05

        // Introduce random initial 3D transforms for more variety
        const initialTranslateX = (Math.random() - 0.5) * 100; // -50 to 50px
        const initialTranslateY = (Math.random() - 0.5) * 100;
        const initialTranslateZ = (Math.random() - 0.5) * 100; // Depth
        const initialRotateX = (Math.random() - 0.5) * 10; // -5 to 5 degrees
        const initialRotateY = (Math.random() - 0.5) * 10;
        const initialScale = Math.random() * (1.1 - 0.9) + 0.9; // 0.9 to 1.1

        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.top = `${top}%`;
        shape.style.left = `${left}%`;
        shape.style.animationDelay = `${delay}s`;
        shape.style.animationDuration = `${duration}s`;
        shape.style.opacity = opacity;
        shape.style.transform = `translate3d(${initialTranslateX}px, ${initialTranslateY}px, ${initialTranslateZ}px) scale(${initialScale}) rotateX(${initialRotateX}deg) rotateY(${initialRotateY}deg)`;


        if (i % 2 === 0) {
            shape.style.backgroundColor = 'var(--acc)';
        } else {
            shape.style.backgroundColor = 'rgba(var(--fg-rgb), 0.08)'; // Slightly more color variation
        }
        shape.style.opacity = opacity;

        container.appendChild(shape);
    }
};

createBackgroundShapes(5); // Create 5 dynamic background shapes (increased from 4)


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

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animate-in elements on page load
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-in');
    animatedElements.forEach((el, index) => {
        // Apply a staggered animation delay based on index for a cascading effect
        el.style.animationDelay = `${index * 0.08}s`; // Staggered by 80ms
        el.style.animationFillMode = 'forwards'; // Keep the final state of the animation
    });
});

// Mouse parallax effect (optional, more advanced 3D interaction)
// This is a more complex addition and can impact performance if not optimized.
// I will provide a basic structure.
/*
const applyParallax = () => {
    const parallaxTargets = document.querySelectorAll('.glass'); // Apply to all glass elements
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        parallaxTargets.forEach((target, index) => {
            const depth = parseFloat(target.dataset.parallaxDepth || 0.05) + (index * 0.01); // Vary depth slightly
            const translateX = -mouseX * depth * 50; // Adjust multiplier for effect strength
            const translateY = -mouseY * depth * 50;
            const rotateX = mouseY * depth * 5; // Subtle rotation
            const rotateY = -mouseX * depth * 5;

            // Preserve existing transforms if any
            const currentTransform = target.style.transform.replace(/translate3d\(.*?\)|rotateX\(.*?\)|rotateY\(.*?\)/g, '').trim();
            target.style.transform = `${currentTransform} translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
};
// Uncomment the line below to enable parallax effect if desired.
// applyParallax();
*/
