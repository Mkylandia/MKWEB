// MKWEB OS 7 - Verbesserte Version mit optimierter Performance und Struktur
// Erweitert um Theme-Anpassung und verbesserte Dynamic Island

// --- Konfiguration und Konstanten ---
const CONFIG = {
    SETTINGS_KEY: 'mkweb-settings-os7',
    IDLE_DELAY: 3000,
    QUOTE_UPDATE_INTERVAL: 3600000, // 1 Stunde
    TIME_UPDATE_INTERVAL: 1000,
    ISLAND_CYCLE_INTERVAL: 5000,
    HOVER_DELAY: 300,
    DEFAULT_THEME: 'dark', // Added default theme
    DEFAULT_LOCATION: 'Heidenheim'
};

const SEARCH_ENGINES = {
    google: { url: 'https://www.google.com/search?q=', icon: 'travel_explore' },
    yandex: { url: 'https://yandex.com/search/?text=', icon: 'search' },
    bing: { url: 'https://www.bing.com/search?q=', icon: 'search' },
    duckduckgo: { url: 'https://duckduckgo.com/?q=', icon: 'search_hands_free' },
    youtube: { url: 'https://www.youtube.com/results?search_query=', icon: 'play_circle' },
    github: { url: 'https://github.com/search?q=', icon: 'code' }
};

const WEATHER_ICONS = {
    clear: 'sunny',
    clouds: 'cloud',
    rain: 'rainy',
    snow: 'ac_unit',
    thunderstorm: 'thunderstorm',
    drizzle: 'grain',
    mist: 'foggy',
    fog: 'foggy',
    default: 'cloudy_snowing'
};

const QUOTES = [
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

// Define available themes and their properties for easier management
const THEMES = {
    dark: {
        name: 'Dark',
        properties: {
            '--primary-bg': '#0e0e0e',
            '--secondary-bg': 'rgba(255,255,255,0.06)',
            '--primary-text': '#f8f8f8',
            '--secondary-text': 'rgba(248,248,248,0.65)',
            '--accent-color-main': '#8a4ed4',
            '--accent-color-light': '#b080ff',
            '--glass-border-color': 'rgba(255,255,255,0.14)',
            '--acc-rgb': '138, 78, 212',
            '--fg-rgb': '248, 248, 248'
        }
    },
    light: {
        name: 'Light',
        properties: {
            '--primary-bg': '#f0f2f5',
            '--secondary-bg': 'rgba(255,255,255,0.8)',
            '--primary-text': '#333',
            '--secondary-text': 'rgba(51,51,51,0.65)',
            '--accent-color-main': '#4a90e2',
            '--accent-color-light': '#7cb9f6',
            '--glass-border-color': 'rgba(0,0,0,0.1)',
            '--acc-rgb': '74, 144, 226',
            '--fg-rgb': '51, 51, 51'
        }
    }
    // Add more themes here if desired, e.g.:
    // ocean: {
    //     name: 'Ocean',
    //     properties: {
    //         '--primary-bg': '#0a1d2e',
    //         '--secondary-bg': 'rgba(60, 150, 200, 0.1)',
    //         '--primary-text': '#e0f2f7',
    //         '--secondary-text': 'rgba(224, 242, 247, 0.7)',
    //         '--accent-color-main': '#00bcd4',
    //         '--accent-color-light': '#80deea',
    //         '--glass-border-color': 'rgba(0, 188, 212, 0.2)',
    //         '--acc-rgb': '0, 188, 212',
    //         '--fg-rgb': '224, 242, 247'
    //     }
    // }
};


// --- Utility Functions ---
const utils = {
    createElement: (tag, className = '', textContent = '') => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    formatTime: (date) => date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    formatDate: (date) => date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    formatShortDate: (date) => ({
        date: date.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' }),
        weekday: date.toLocaleDateString('de-DE', { weekday: 'long' })
    })
};

// --- Settings Manager ---
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
    }

    loadSettings() {
        try {
            const stored = localStorage?.getItem(CONFIG.SETTINGS_KEY);
            return stored ? JSON.parse(stored) : this.getDefaultSettings();
        } catch (error) {
            console.warn('Fehler beim Laden der Einstellungen:', error);
            return this.getDefaultSettings();
        }
    }

    getDefaultSettings() {
        return {
            theme: CONFIG.DEFAULT_THEME,
            showAvatar: true,
            lastActiveEngine: 'google',
            weatherLocation: CONFIG.DEFAULT_LOCATION
        };
    }

    save() {
        try {
            localStorage?.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Fehler beim Speichern der Einstellungen:', error);
        }
    }

    get(key) {
        return this.settings[key];
    }

    set(key, value) {
        this.settings[key] = value;
        this.save();
    }
}

// --- Dynamic Island Manager ---
class DynamicIslandManager {
    constructor() {
        this.container = document.getElementById('dynamicIslandContainer');
        this.island = document.getElementById('dynamicIsland');
        this.icon = document.getElementById('islandIcon');
        this.title = document.getElementById('islandTitle');
        this.subtitle = document.getElementById('islandSubtitle');
        this.dismissBtn = document.getElementById('islandDismissBtn');
        this.waveform = document.getElementById('islandWaveform');

        this.state = {
            icon: 'info',
            title: 'Willkommen!',
            subtitle: 'Wähle eine Suchmaschine aus.',
            showWave: false
        };

        this.timers = {
            transient: null,
            cycle: null,
            idle: null
        };

        this.isTimeDisplay = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.resetToDefault();
        this.scheduleTimeDateCycle();
    }

    setupEventListeners() {
        this.island.addEventListener('click', (e) => {
            if (e.target.closest('#islandDismissBtn')) return;
            this.toggleExpanded();
        });

        this.dismissBtn.addEventListener('click', () => {
            this.collapse();
            this.resetToDefault();
        });
    }

    update(icon, title, subtitle, showWave = false) {
        // Apply opacity transition to details for smoother text changes
        this.title.style.opacity = '0';
        this.subtitle.style.opacity = '0';

        setTimeout(() => {
            this.icon.textContent = icon;
            this.title.textContent = title;
            this.subtitle.textContent = subtitle;
            this.waveform.style.display = showWave ? 'flex' : 'none';
            this.title.style.opacity = '1';
            this.subtitle.style.opacity = '1';
        }, 100); // Small delay to allow opacity transition to start

        this.state = { icon, title, subtitle, showWave };
        this.clearTimer('transient');
    }

    expand() {
        this.island.classList.add('expanded');
    }

    collapse() {
        this.island.classList.remove('expanded');
    }

    toggleExpanded() {
        this.island.classList.toggle('expanded');
        if (this.island.classList.contains('expanded')) {
            this.cancelTimeDateCycleSchedule();
        } else {
            this.resetToDefault();
        }
    }

    showTransient(icon, title, subtitle, showWave = false, duration = 3000) {
        this.cancelTimeDateCycleSchedule();
        this.update(icon, title, subtitle, showWave);
        this.expand();

        this.timers.transient = setTimeout(() => {
            this.collapse();
            this.resetToDefault();
        }, duration);
    }

    resetToDefault() {
        const engine = settingsManager.get('lastActiveEngine');
        const engineConfig = SEARCH_ENGINES[engine] || SEARCH_ENGINES.google;
        
        this.update(
            engineConfig.icon,
            'Suchmaschine',
            `Aktiv: ${engine.charAt(0).toUpperCase() + engine.slice(1)}`
        );
        this.collapse();
        this.scheduleTimeDateCycle();
    }

    scheduleTimeDateCycle() {
        this.clearTimer('idle');
        this.clearTimer('cycle');
        
        this.timers.idle = setTimeout(() => {
            this.startTimeDateCycle();
        }, CONFIG.IDLE_DELAY);
    }

    cancelTimeDateCycleSchedule() {
        this.clearTimer('idle');
        this.clearTimer('cycle');
    }

    startTimeDateCycle() {
        this.clearTimer('cycle');
        this.updateTimeDate();
        this.timers.cycle = setInterval(() => {
            this.updateTimeDate();
        }, CONFIG.ISLAND_CYCLE_INTERVAL);
    }

    updateTimeDate() {
        const now = new Date();
        if (this.isTimeDisplay) {
            this.update(
                'schedule',
                utils.formatTime(now),
                'Aktuelle Uhrzeit'
            );
        } else {
            const dateInfo = utils.formatShortDate(now);
            this.update(
                'calendar_today',
                dateInfo.date,
                dateInfo.weekday
            );
        }
        this.isTimeDisplay = !this.isTimeDisplay;
    }

    clearTimer(type) {
        if (this.timers[type]) {
            if (type === 'cycle') {
                clearInterval(this.timers[type]);
            } else {
                clearTimeout(this.timers[type]);
            }
            this.timers[type] = null;
        }
    }
}

// --- Search Manager ---
class SearchManager {
    constructor() {
        this.input = document.getElementById('search');
        this.engineButtons = document.querySelectorAll('.search-engine');
        this.activeEngine = settingsManager.get('lastActiveEngine');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.activateEngine(this.activeEngine);
    }

    setupEventListeners() {
        this.engineButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.activateEngine(button.dataset.engine);
            });
        });

        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    }

    activateEngine(engine) {
        this.engineButtons.forEach(btn => {
            const isActive = btn.dataset.engine === engine;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });

        this.activeEngine = engine;
        settingsManager.set('lastActiveEngine', engine);
        
        // Update Dynamic Island
        dynamicIsland.resetToDefault();
    }

    performSearch() {
        const query = this.input.value.trim();
        if (!query) return;

        const engineConfig = SEARCH_ENGINES[this.activeEngine] || SEARCH_ENGINES.google;
        const url = engineConfig.url + encodeURIComponent(query);

        dynamicIsland.showTransient(
            'arrow_forward',
            'Suche läuft...',
            `Öffne Ergebnisse für "${query}"`,
            true,
            800
        );

        setTimeout(() => {
            window.open(url, '_blank');
            this.input.value = '';
        }, 800);
    }
}

// --- Weather Manager ---
class WeatherManager {
    constructor() {
        this.button = document.querySelector('.weather-link-button');
        this.mockData = {
            'Heidenheim': { temp: 22, description: 'Leicht bewölkt', icon: 'cloud', location: 'Heidenheim' },
            'Berlin': { temp: 18, description: 'Regen', icon: 'rain', location: 'Berlin' },
            'London': { temp: 15, description: 'Nebel', icon: 'fog', location: 'London' }
        };
        this.init();
    }

    init() {
        if (this.button) {
            this.button.addEventListener('click', this.handleWeatherClick.bind(this));
        }
    }

    async handleWeatherClick(e) {
        e.preventDefault();
        
        dynamicIsland.showTransient('refresh', 'Wetter wird geladen...', 'Bitte warten...', true, 2500);

        try {
            const weatherData = await this.fetchWeather(settingsManager.get('weatherLocation'));
            if (weatherData) {
                dynamicIsland.showTransient(
                    this.getWeatherIcon(weatherData.icon),
                    `${weatherData.temp}°C`,
                    `${weatherData.description} in ${weatherData.location}`,
                    false,
                    4000
                );
            }
        } catch (error) {
            dynamicIsland.showTransient('error', 'Fehler', 'Wetterdaten nicht verfügbar.', false, 3000);
        }
    }

    async fetchWeather(location) {
        return new Promise(resolve => {
            setTimeout(() => {
                const data = this.mockData[location] || this.mockData['Heidenheim'];
                resolve(data);
            }, 800);
        });
    }

    getWeatherIcon(condition) {
        return WEATHER_ICONS[condition.toLowerCase()] || WEATHER_ICONS.default;
    }
}

// --- UI Manager ---
class UIManager {
    constructor() {
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');
        this.quoteTextElement = document.getElementById('quote-text');
        this.quoteAuthorElement = document.getElementById('quote-author');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.userAvatar = document.getElementById('user-avatar');
        this.userAvatarToggleBtn = document.getElementById('user-avatar-toggle');
        this.appCards = document.querySelectorAll('.app-card');
        this.themeToggleBtn = document.getElementById('theme-toggle-btn'); // New theme toggle button
        
        this.init();
    }

    init() {
        this.setupDateTime();
        this.setupQuotes();
        this.setupFullscreen();
        this.setupAvatar();
        this.setupAppCards();
        this.setupThemeToggle(); // New: Setup theme toggle
        this.applyTheme(settingsManager.get('theme')); // Apply initial theme
    }

    setupDateTime() {
        const updateDateTime = () => {
            const now = new Date();
            if (this.timeElement) this.timeElement.textContent = utils.formatTime(now);
            if (this.dateElement) this.dateElement.textContent = utils.formatDate(now);
        };

        updateDateTime();
        setInterval(updateDateTime, CONFIG.TIME_UPDATE_INTERVAL);
    }

    setupQuotes() {
        const displayRandomQuote = () => {
            if (!this.quoteTextElement || !this.quoteAuthorElement) return;
            
            const randomIndex = Math.floor(Math.random() * QUOTES.length);
            const quote = QUOTES[randomIndex];
            
            this.quoteTextElement.textContent = `"${quote.text}"`;
            this.quoteAuthorElement.textContent = `- ${quote.author}`;
        };

        displayRandomQuote();
        setInterval(displayRandomQuote, CONFIG.QUOTE_UPDATE_INTERVAL);
    }

    setupFullscreen() {
        if (!this.fullscreenBtn) return;

        this.fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error('Vollbild-Fehler:', err);
                });
            } else {
                document.exitFullscreen().catch(err => {
                    console.error('Vollbild-Exit-Fehler:', err);
                });
            }
        });

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.fullscreenBtn.textContent = 'Shrink';
                this.fullscreenBtn.setAttribute('title', 'Vollbild verlassen');
            } else {
                this.fullscreenBtn.textContent = '🚀 Vollbild';
                this.fullscreenBtn.setAttribute('title', 'Vollbild umschalten');
            }
        });
    }

    setupAvatar() {
        if (!this.userAvatar || !this.userAvatarToggleBtn) return;

        const applyAvatarVisibility = () => {
            const showAvatar = settingsManager.get('showAvatar');
            if (showAvatar) {
                this.userAvatar.classList.remove('hidden-avatar');
                this.userAvatar.setAttribute('aria-hidden', 'false');
                this.userAvatarToggleBtn.textContent = '🙈 Avatar ausblenden';
            } else {
                this.userAvatar.classList.add('hidden-avatar');
                this.userAvatar.setAttribute('aria-hidden', 'true');
                this.userAvatarToggleBtn.textContent = '🐵 Avatar einblenden';
            }
        };

        this.userAvatarToggleBtn.addEventListener('click', () => {
            const currentState = settingsManager.get('showAvatar');
            settingsManager.set('showAvatar', !currentState);
            applyAvatarVisibility();
        });

        applyAvatarVisibility();
    }

    setupAppCards() {
        this.appCards.forEach(card => {
            let hoverTimeout;
            
            card.addEventListener('mouseenter', () => {
                dynamicIsland.cancelTimeDateCycleSchedule();
                
                hoverTimeout = setTimeout(() => {
                    const appName = card.dataset.appName || 'App';
                    const appIcon = card.dataset.appIcon || 'apps';
                    dynamicIsland.update(appIcon, appName, 'Starte App...');
                    dynamicIsland.expand();
                }, CONFIG.HOVER_DELAY);
            });

            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                // Only collapse if the island is currently expanded due to this hover
                // and not already in a transient state.
                if (!dynamicIsland.timers.transient) {
                    dynamicIsland.collapse();
                    dynamicIsland.resetToDefault();
                }
            });

            card.addEventListener('click', () => {
                // When an app is clicked, immediately dismiss any app-related island state
                dynamicIsland.resetToDefault();
            });
        });
    }

    // New: Theme Toggle Functionality
    setupThemeToggle() {
        if (!this.themeToggleBtn) return;

        this.themeToggleBtn.addEventListener('click', () => {
            const currentTheme = settingsManager.get('theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark'; // Toggle between dark and light
            settingsManager.set('theme', newTheme);
            this.applyTheme(newTheme);
        });
    }

    applyTheme(themeName) {
        const body = document.body;
        const theme = THEMES[themeName];

        if (theme) {
            body.setAttribute('data-theme', themeName);
            for (const [prop, value] of Object.entries(theme.properties)) {
                document.documentElement.style.setProperty(prop, value);
            }
            this.updateThemeToggleButton(themeName);
        } else {
            console.warn(`Theme "${themeName}" not found. Applying default dark theme.`);
            body.setAttribute('data-theme', CONFIG.DEFAULT_THEME);
            for (const [prop, value] of Object.entries(THEMES[CONFIG.DEFAULT_THEME].properties)) {
                document.documentElement.style.setProperty(prop, value);
            }
            settingsManager.set('theme', CONFIG.DEFAULT_THEME);
            this.updateThemeToggleButton(CONFIG.DEFAULT_THEME);
        }
    }

    updateThemeToggleButton(currentTheme) {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.textContent = currentTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
            this.themeToggleBtn.setAttribute('title', `Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`);
        }
    }
}

// --- Initialisierung ---
let settingsManager, dynamicIsland, searchManager, weatherManager, uiManager;

document.addEventListener('DOMContentLoaded', () => {
    // Initialisiere alle Manager
    settingsManager = new SettingsManager();
    dynamicIsland = new DynamicIslandManager();
    searchManager = new SearchManager();
    weatherManager = new WeatherManager();
    uiManager = new UIManager(); // This will now apply the saved theme on load.

    console.log('MKWEB OS 7 - Erfolgreich initialisiert');
});
