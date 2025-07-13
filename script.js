// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations - LIGHTWEIGHT VERSION

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os7';
let settings = JSON.parse(localStorage?.getItem(SETTINGS_KEY)) || {
    theme: 'dark', // Fester Standardwert
    showAvatar: true,
    lastActiveEngine: 'google',
    weatherLocation: 'Heidenheim' // NEW: Default weather location
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
const weatherLinkButton = document.querySelector('.weather-link-button');
const appCards = document.querySelectorAll('.app-card'); // NEW: Select all app cards

// --- Dynamic Island Elements ---
const dynamicIslandContainer = document.getElementById('dynamicIslandContainer');
const dynamicIsland = document.getElementById('dynamicIsland');
const islandIcon = document.getElementById('islandIcon');
const islandTitle = document.getElementById('islandTitle');
const islandSubtitle = document.getElementById('islandSubtitle');
const islandDismissBtn = document.getElementById('islandDismissBtn');
const islandWaveform = document.getElementById('islandWaveform');

// --- Dynamic Island State Management ---
let islandTimeoutId = null; // To clear previous timeouts
let islandCycleInterval = null; // To manage time/date cycling
let currentIslandState = {
    icon: 'info',
    title: 'Willkommen!',
    subtitle: 'Wähle eine Suchmaschine aus.',
    showWave: false
};

const defaultIslandContent = {
    icon: 'search',
    title: 'Suchmaschine',
    getSubtitle: () => `Aktiv: ${settings.lastActiveEngine.charAt(0).toUpperCase() + settings.lastActiveEngine.slice(1)}`,
    showWave: false
};

const engineIcons = {
    google: 'travel_explore', // Changed to represent exploration more
    yandex: 'search',
    bing: 'search',
    duckduckgo: 'search_hands_free',
    youtube: 'play_circle',
    github: 'code'
};

const appIcons = { // Mapping for app icons (based on material symbols)
    'ChatGPT': 'chat',
    'Gemini': 'bubble_chart',
    'Notion': 'article',
    'Calendar': 'calendar_month',
    'Gmail': 'mail',
    'WhatsApp': 'chat_bubble',
    'Spotify': 'headphones',
    'GitHub': 'data_object',
    'MDN Docs': 'menu_book',
    'Stack Overflow': 'lightbulb',
    'CodePen': 'code',
    'Unsplash': 'image'
};


// Function to update the Dynamic Island content
const updateDynamicIsland = (icon, title, subtitle, showWave = false) => {
    islandIcon.textContent = icon;
    islandTitle.textContent = title;
    islandSubtitle.textContent = subtitle;
    islandWaveform.style.display = showWave ? 'flex' : 'none';
    currentIslandState = { icon, title, subtitle, showWave }; // Store current state
    dynamicIsland.classList.remove('expanded'); // Collapse by default when content changes
    clearTimeout(islandTimeoutId); // Clear any pending timeouts
};

// Function to reset the Dynamic Island to its default search engine state
const resetIslandToDefault = () => {
    updateDynamicIsland(
        engineIcons[settings.lastActiveEngine] || defaultIslandContent.icon,
        defaultIslandContent.title,
        defaultIslandContent.getSubtitle()
    );
    startIslandTimeDateCycle(); // Restart time/date cycle after transient event
};


// --- Dynamic Island Time/Date Cycling ---
let isTimeDisplay = true; // State for time/date cycle

const updateIslandTimeDate = () => {
    const now = new Date();
    if (isTimeDisplay) {
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        updateDynamicIsland(
            'schedule',
            now.toLocaleTimeString('de-DE', timeOptions),
            'Aktuelle Uhrzeit',
            false // No wave for time/date
        );
    } else {
        const dateOptions = { month: 'short', day: 'numeric' };
        updateDynamicIsland(
            'calendar_today',
            now.toLocaleDateString('de-DE', dateOptions),
            now.toLocaleDateString('de-DE', { weekday: 'long' }),
            false // No wave for time/date
        );
    }
    isTimeDisplay = !isTimeDisplay; // Toggle for next cycle
};

const startIslandTimeDateCycle = () => {
    clearInterval(islandCycleInterval); // Clear any existing cycle
    updateIslandTimeDate(); // Initial display
    islandCycleInterval = setInterval(updateIslandTimeDate, 5000); // Cycle every 5 seconds
};

// Stop time/date cycle and show specific content
const showTransientIslandContent = (icon, title, subtitle, showWave = false, duration = 3000) => {
    clearInterval(islandCycleInterval); // Stop the cycling
    updateDynamicIsland(icon, title, subtitle, showWave);
    dynamicIsland.classList.add('expanded'); // Expand for transient content

    islandTimeoutId = setTimeout(() => {
        resetIslandToDefault(); // Revert to default after duration
    }, duration);
};


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

    // Update Dynamic Island to show active search engine
    updateDynamicIsland(
        engineIcons[engine] || defaultIslandContent.icon,
        defaultIslandContent.title,
        defaultIslandContent.getSubtitle()
    );
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
                case 'youtube': url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`; break; // Corrected YouTube URL
                case 'github': url = `https://github.com/search?q=${encodeURIComponent(query)}`; break;
                default: url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
            
            // Show Dynamic Island with search animation before opening URL
            showTransientIslandContent('arrow_forward', 'Suche läuft...', `Öffne Ergebnisse für "${query}"`, true, 800); // 2 second display
            
            setTimeout(() => {
                window.open(url, '_blank');
                searchInput.value = ''; // Clear search input
                resetIslandToDefault(); // Revert island to default after search
            }, 1800); // Slightly less delay than island display to ensure smooth transition
        }
    }
});

activateEngine(activeEngine); // Initialize active engine and island display


// --- Time and Date Display (Main Section) ---
const updateDateTime = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    timeElement.textContent = now.toLocaleTimeString('de-DE', timeOptions);
    dateElement.textContent = now.toLocaleDateString('de-DE', dateOptions);
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
    if (quoteTextElement && quoteAuthorElement) { // Check if elements exist
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


// --- Dynamic Island Click-Event & Dismiss ---
dynamicIsland.addEventListener('click', (e) => {
    // Prevent dismiss button from toggling expansion
    if (e.target.closest('#islandDismissBtn')) return;
    dynamicIsland.classList.toggle('expanded');
});

islandDismissBtn.addEventListener('click', () => {
    dynamicIsland.classList.remove('expanded'); // Just collapse it, don't hide
    // If it's showing transient content, clear timeout and revert
    if (islandTimeoutId) {
        clearTimeout(islandTimeoutId);
        resetIslandToDefault();
    }
});


// --- Weather Functionality ---
const fetchWeather = async (location) => {
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
        }, 800); // Simulate network delay
    });
};

const getWeatherIcon = (weatherCondition) => {
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
weatherLinkButton.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default link behavior
    
    // Show loading state in Dynamic Island
    showTransientIslandContent('refresh', 'Wetter wird geladen...', 'Bitte warten...', true, 2500); // Show for 2.5 seconds

    const weatherData = await fetchWeather(settings.weatherLocation); // Use saved location
    if (weatherData) {
        showTransientIslandContent(
            getWeatherIcon(weatherData.icon), // Use actual icon from mock data
            `${weatherData.temp}°C`,
            `${weatherData.description} in ${weatherData.location}`,
            false, // No waveform for final weather display
            4000 // Display weather for 4 seconds
        );
    } else {
        showTransientIslandContent('error', 'Fehler', 'Wetterdaten nicht verfügbar.', false, 3000);
    }
});


// --- App Card Hover Effect for Dynamic Island ---
appCards.forEach(card => {
    let hoverTimeout;
    card.addEventListener('mouseenter', () => {
        // Clear any ongoing time/date cycle or previous transient display
        clearInterval(islandCycleInterval);
        clearTimeout(islandTimeoutId);

        hoverTimeout = setTimeout(() => {
            const appName = card.dataset.appName || 'App';
            const appIcon = card.dataset.appIcon || 'apps';
            updateDynamicIsland(appIcon, appName, 'Starte App...');
            dynamicIsland.classList.add('expanded'); // Expand on hover
        }, 300); // Short delay to prevent flickering on quick mouse-overs
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout); // Clear the hover timeout if mouse leaves before it triggers
        if (!dynamicIsland.classList.contains('expanded')) { // Only reset if not manually expanded
             resetIslandToDefault(); // Revert to default when mouse leaves
        } else {
            // If it was expanded, collapse after a short delay, but keep default content
            setTimeout(() => dynamicIsland.classList.remove('expanded'), 300);
            resetIslandToDefault(); // Ensure default content is set even if expanded
        }
    });

    // Handle click on app card to ensure island resets after opening app
    card.addEventListener('click', () => {
        resetIslandToDefault();
    });
});


// --- Initial State on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Start the time/date cycle by default
    startIslandTimeDateCycle();

    // Set initial content to default search engine info
    updateDynamicIsland(
        engineIcons[settings.lastActiveEngine] || defaultIslandContent.icon,
        defaultIslandContent.title,
        defaultIslandContent.getSubtitle()
    );
});
