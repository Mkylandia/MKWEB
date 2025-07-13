// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations - LIGHTWEIGHT VERSION

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os7';
let settings = JSON.parse(localStorage?.getItem(SETTINGS_KEY)) || {
    theme: 'dark', // Fester Standardwert
    showAvatar: true,
    lastActiveEngine: 'google',
    dynamicIslandVisible: true, // Setting to remember island visibility
    weatherLocation: 'Heidenheim' // Default weather location
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
const weatherLinkButton = document.querySelector('.weather-link-button'); // Added for weather click
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

// Event listeners for search engine selection buttons
searchEngines.forEach(button => {
    button.addEventListener('click', () => {
        activateEngine(button.dataset.engine);
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
                // FIX: Corrected YouTube URL to a proper search URL
                case 'youtube': url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`; break;
                case 'github': url = `https://github.com/search?q=${encodeURIComponent(query)}`; break;
                default: url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
            
            // Show Dynamic Island with search animation before opening URL
            showDynamicIsland('arrow_forward', 'Suche läuft...', `Öffne Ergebnisse für "${query}"`, true);
            dynamicIsland.classList.add('expanded');

            setTimeout(() => {
                window.open(url, '_blank');
                // Revert island to original state or hide after search
                hideDynamicIsland(); // Hide after opening the new tab
                activateEngine(settings.lastActiveEngine); // Revert to original island content visually if it reappears
            }, 1200); // 1.2 second delay to see animation
        }
    }
});

activateEngine(activeEngine);


// --- Time and Date Display ---
const updateDateTime = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Ensure elements exist before updating content to prevent errors
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('de-DE', timeOptions);
    }
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('de-DE', dateOptions);
    }
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
    // Check if elements exist to prevent errors if they are not found
    if (quoteTextElement && quoteAuthorElement) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteTextElement.textContent = `"${randomQuote.text}"`;
        quoteAuthorElement.textContent = `- ${randomQuote.author}`;
    }
};

// Display a new quote every hour, and on page load
setInterval(displayRandomQuote, 3600000); // Alle Stunde
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

// Function to show the dynamic island
const showDynamicIsland = (icon, title, subtitle, showWave = false) => {
    // Ensure all elements exist before manipulating them for robustness
    if (islandIcon && islandTitle && islandSubtitle && islandWaveform && dynamicIslandContainer && reopenIslandBtn) {
        islandIcon.textContent = icon;
        islandTitle.textContent = title;
        islandSubtitle.textContent = subtitle;
        islandWaveform.style.display = showWave ? 'flex' : 'none';
        dynamicIslandContainer.classList.remove('hidden');
        reopenIslandBtn.style.display = 'none'; // Hide reopen button when island is visible
        settings.dynamicIslandVisible = true;
        saveSettings();
    }
};

// Function to hide the dynamic island
const hideDynamicIsland = () => {
    if (dynamicIslandContainer && dynamicIsland && reopenIslandBtn) { // Ensure elements exist
        dynamicIslandContainer.classList.add('hidden');
        dynamicIsland.classList.remove('expanded'); // Ensure it's not expanded when hidden
        reopenIslandBtn.style.display = 'block'; // Show reopen button when island is hidden
        settings.dynamicIslandVisible = false;
        saveSettings();
    }
};


// Click-Event zum Erweitern/Verkleinern
dynamicIsland.addEventListener('click', (e) => {
    // Prevent click on dismiss button from closing the island
    if (e.target.closest('#islandDismissBtn')) return;
    dynamicIsland.classList.toggle('expanded');
});

// Hide island (Dismiss button)
islandDismissBtn.addEventListener('click', () => {
    hideDynamicIsland();
});

// Reopen Island button click event
reopenIslandBtn.addEventListener('click', () => {
    showDynamicIsland(engineIcons[settings.lastActiveEngine] || 'search', 'Suchmaschine', `Aktiv: ${settings.lastActiveEngine.charAt(0).toUpperCase() + settings.lastActiveEngine.slice(1)}`);
});


// Extend search engine logic
const originalActivateEngine = activateEngine; // Save old function
activateEngine = (engine) => {
    originalActivateEngine(engine); // Call old function
    const engineName = engine.charAt(0).toUpperCase() + engine.slice(1);
    // Only update island if it's visible, otherwise just update settings
    if (settings.dynamicIslandVisible) {
        showDynamicIsland(engineIcons[engine] || 'search', 'Suchmaschine', `Aktiv: ${engineName}`);
        if (dynamicIsland.classList.contains('expanded')) {
            // Keep expanded briefly, then collapse
            setTimeout(() => dynamicIsland.classList.remove('expanded'), 300);
        }
    }
};

// --- Weather Functionality ---
// Placeholder for weather data fetch
const fetchWeather = async (location) => {
    // In a real application, you would make an real API call here.
    // Example using OpenWeatherMap (you'd need an API key):
    // const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&lang=de`;
    // try {
    //     const response = await fetch(url);
    //     const data = await response.json();
    //     if (data.cod === 200) {
    //         const temp = Math.round(data.main.temp);
    //         const description = data.weather[0].description;
    //         const icon = getWeatherIcon(data.weather[0].icon); // Custom function to map weather codes to Material Symbols
    //         return { temp, description, icon, location: data.name };
    //     } else {
    //         console.error('Weather API error:', data.message);
    //         return null;
    //     }
    // } catch (error) {
    //     console.error('Failed to fetch weather:', error);
    //     return null;
    // }

    // --- MOCK DATA FOR DEMONSTRATION ---
    const mockWeather = {
        'Heidenheim': { temp: 22, description: 'Leicht bewölkt', icon: 'cloud', location: 'Heidenheim' },
        'Berlin': { temp: 18, description: 'Regen', icon: 'rainy', location: 'Berlin' },
        'London': { temp: 15, description: 'Nebel', icon: 'foggy', location: 'London' }
    };

    return new Promise(resolve => {
        setTimeout(() => {
            const data = mockWeather[location] || mockWeather['Heidenheim'];
            resolve(data);
        }, 500); // Simulate network delay
    });
};

// Function to get appropriate Material Symbols icon for weather (mockup)
const getWeatherIcon = (weatherCondition) => {
    // This would be more complex with actual API data, mapping codes to icons
    switch (weatherCondition.toLowerCase()) {
        case 'clear': return 'sunny';
        case 'clouds': return 'cloud';
        case 'rain': return 'rainy';
        case 'snow': return 'ac_unit';
        case 'thunderstorm': return 'thunderstorm';
        case 'drizzle': return 'grain';
        case 'mist':
        case 'fog': return 'foggy';
        default: return 'cloudy_snowing'; // Default icon
    }
};

// Event listener for the weather link button
if (weatherLinkButton) { // Ensure weatherLinkButton exists before adding listener
    weatherLinkButton.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent default link behavior
        
        // Show loading state in Dynamic Island
        showDynamicIsland('refresh', 'Wetter wird geladen...', 'Bitte warten...', true);
        dynamicIsland.classList.add('expanded');

        const weatherData = await fetchWeather(settings.weatherLocation); // Use saved location
        if (weatherData) {
            showDynamicIsland(
                weatherData.icon,
                `${weatherData.temp}°C`,
                `${weatherData.description} in ${weatherData.location}`
            );
            setTimeout(() => dynamicIsland.classList.remove('expanded'), 4000); // Keep expanded for 4 seconds
        } else {
            showDynamicIsland('error', 'Fehler', 'Wetterdaten nicht verfügbar.');
            setTimeout(() => hideDynamicIsland(), 3000);
        }
    });
}


// Initial state on page load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure everything is loaded
    setTimeout(() => {
        if (settings.dynamicIslandVisible) {
           showDynamicIsland(engineIcons[settings.lastActiveEngine] || 'search', 'Willkommen!', 'Wähle eine Suchmaschine aus.');
        } else {
            hideDynamicIsland(); // Ensure it's hidden if setting says so
        }
    }, 100);

    // Initial display of the "reopen" button based on settings
    if (!settings.dynamicIslandVisible) {
        if (reopenIslandBtn) { // Ensure button exists before trying to access its style
            reopenIslandBtn.style.display = 'block';
        }
    }
});
