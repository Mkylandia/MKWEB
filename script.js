// MKWEB OS 7 - Verbesserte Version mit optimierter Performance und Struktur

// --- Konfiguration und Konstanten ---
const CONFIG = {
    SETTINGS_KEY: 'mkweb-settings-os7',
    IDLE_DELAY: 3000,
    QUOTE_UPDATE_INTERVAL: 3600000, // 1 Stunde
    TIME_UPDATE_INTERVAL: 1000,
    ISLAND_CYCLE_INTERVAL: 5000,
    HOVER_DELAY: 300,
    DEFAULT_THEME: 'dark',
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
    smoke: 'smoke_free',
    haze: 'foggy',
    dust: 'dust',
    fog: 'foggy',
    sand: 'storm',
    ash: 'fireplace',
    squall: 'wind_power',
    tornado: 'tornado'
};

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
    },
    ocean: {
        name: 'Ocean',
        properties: {
            '--primary-bg': '#0a1d2e',
            '--secondary-bg': 'rgba(60, 150, 200, 0.1)',
            '--primary-text': '#e0f2f7',
            '--secondary-text': 'rgba(224, 242, 247, 0.7)',
            '--accent-color-main': '#00bcd4',
            '--accent-color-light': '#80deea',
            '--glass-border-color': 'rgba(0, 188, 212, 0.2)',
            '--acc-rgb': '0, 188, 212',
            '--fg-rgb': '224, 242, 247'
        }
    },
    forest: {
        name: 'Forest',
        properties: {
            '--primary-bg': '#1a2a22',
            '--secondary-bg': 'rgba(90, 140, 100, 0.1)',
            '--primary-text': '#e8f5e9',
            '--secondary-text': 'rgba(232, 245, 233, 0.7)',
            '--accent-color-main': '#689f38',
            '--accent-color-light': '#9ccc65',
            '--glass-border-color': 'rgba(104, 159, 56, 0.2)',
            '--acc-rgb': '104, 159, 56',
            '--fg-rgb': '232, 245, 233'
        }
    }
};

// --- Manager Klassen ---

class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.applyInitialSettings();
    }

    loadSettings() {
        try {
            const storedSettings = localStorage.getItem(CONFIG.SETTINGS_KEY);
            return storedSettings ? JSON.parse(storedSettings) : this.getDefaultSettings();
        } catch (e) {
            console.error("Fehler beim Laden der Einstellungen aus dem Local Storage:", e);
            return this.getDefaultSettings();
        }
    }

    getDefaultSettings() {
        return {
            theme: CONFIG.DEFAULT_THEME,
            avatarVisible: true,
            selectedEngine: 'google'
        };
    }

    saveSettings() {
        try {
            localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(this.settings));
        } catch (e) {
            console.error("Fehler beim Speichern der Einstellungen im Local Storage:", e);
        }
    }

    get(key) {
        return this.settings[key];
    }

    set(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    applyInitialSettings() {
        document.documentElement.setAttribute('data-theme', this.get('theme'));
        document.body.setAttribute('data-theme', this.get('theme')); // Apply to body for full CSS variable application
    }
}

class DynamicIslandManager {
    constructor() {
        this.island = document.getElementById('dynamicIsland');
        this.islandIcon = document.getElementById('islandIcon');
        this.islandTitle = document.getElementById('islandTitle');
        this.islandSubtitle = document.getElementById('islandSubtitle');
        this.islandWaveform = document.getElementById('islandWaveform');
        this.islandDismissBtn = document.getElementById('islandDismissBtn');

        this.idleTimer = null;
        this.islandCycleInterval = null;
        this.defaultState = {
            icon: 'info',
            title: 'Willkommen!',
            subtitle: 'Wähle eine Suchmaschine aus.',
            mode: 'text' // 'text' or 'waveform'
        };
        this.currentState = { ...this.defaultState };
        this.queuedMessages = []; // For messages that can be cycled

        this.initDismissButton();
        this.startIdleTimer();
    }

    initDismissButton() {
        if (this.islandDismissBtn) {
            this.islandDismissBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent island click if dismiss is inside
                this.collapse();
                this.resetToDefault();
            });
        }
    }

    update(icon, title, subtitle, mode = 'text') {
        this.clearIdleTimer();
        this.cancelTimeDateCycleSchedule();
        this.islandIcon.textContent = icon;
        this.islandTitle.textContent = title;
        this.islandSubtitle.textContent = subtitle;

        this.currentState = { icon, title, subtitle, mode };
        this.applyMode(mode);
    }

    applyMode(mode) {
        if (mode === 'waveform') {
            this.island.classList.add('waveform');
            this.island.classList.remove('time-date'); // Ensure other classes are removed
            this.islandWaveform.style.display = 'flex';
        } else if (mode === 'time-date') {
            this.island.classList.add('time-date');
            this.island.classList.remove('waveform');
            this.islandWaveform.style.display = 'flex'; // Waveform is used for time/date transition
        } else {
            this.island.classList.remove('waveform', 'time-date');
            this.islandWaveform.style.display = 'none';
        }
    }

    expand() {
        this.island.classList.add('expanded');
    }

    collapse() {
        this.island.classList.remove('expanded');
        this.startIdleTimer();
    }

    resetToDefault() {
        this.update(this.defaultState.icon, this.defaultState.title, this.defaultState.subtitle, this.defaultState.mode);
        this.queuedMessages = [];
    }

    addQueuedMessage(icon, title, subtitle) {
        this.queuedMessages.push({ icon, title, subtitle });
    }

    startIdleTimer() {
        this.clearIdleTimer();
        this.idleTimer = setTimeout(() => {
            this.startCyclingMessages();
        }, CONFIG.IDLE_DELAY);
    }

    clearIdleTimer() {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }
    }

    startCyclingMessages() {
        this.cancelTimeDateCycleSchedule(); // Clear any previous cycles

        const cycleMessages = () => {
            if (this.queuedMessages.length > 0) {
                const message = this.queuedMessages.shift();
                this.update(message.icon, message.title, message.subtitle);
                this.expand();
                this.queuedMessages.push(message); // Add back to end for continuous cycle
            } else {
                // Fallback to time/date if no custom messages
                this.updateTimeDateMessage();
            }
        };

        // Initial call
        cycleMessages();

        // Set interval for subsequent calls
        this.islandCycleInterval = setInterval(cycleMessages, CONFIG.ISLAND_CYCLE_INTERVAL);
    }

    updateTimeDateMessage() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString('de-DE', { weekday: 'short', month: 'short', day: 'numeric' });
        this.update('schedule', timeString, dateString, 'time-date'); // Use 'time-date' mode
        this.expand();
    }

    cancelTimeDateCycleSchedule() {
        if (this.islandCycleInterval) {
            clearInterval(this.islandCycleInterval);
            this.islandCycleInterval = null;
        }
    }
}

class SearchManager {
    constructor() {
        this.searchBox = document.getElementById('search');
        this.searchEngines = document.querySelectorAll('.search-engine');
        this.selectedEngine = settingsManager.get('selectedEngine');

        this.initSearch();
        this.setupEventListeners();
    }

    initSearch() {
        this.updateSelectedEngineButton();
    }

    setupEventListeners() {
        this.searchBox.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.performSearch(this.searchBox.value);
            }
        });

        this.searchEngines.forEach(button => {
            button.addEventListener('click', () => {
                this.selectedEngine = button.dataset.engine;
                settingsManager.set('selectedEngine', this.selectedEngine);
                this.updateSelectedEngineButton();
                dynamicIsland.update(
                    SEARCH_ENGINES[this.selectedEngine].icon,
                    `Engine gewechselt`,
                    `${THEMES[settingsManager.get('theme')].name} ${this.capitalizeFirstLetter(this.selectedEngine)}`
                );
                dynamicIsland.expand();
                dynamicIsland.startIdleTimer();
            });
        });
    }

    updateSelectedEngineButton() {
        this.searchEngines.forEach(button => {
            button.classList.toggle('active', button.dataset.engine === this.selectedEngine);
            button.setAttribute('aria-pressed', button.dataset.engine === this.selectedEngine);
        });
        this.searchBox.placeholder = `Suche mit ${this.capitalizeFirstLetter(this.selectedEngine)}...`;
    }

    performSearch(query) {
        if (!query.trim()) {
            dynamicIsland.update('error', 'Fehler', 'Bitte gib einen Suchbegriff ein.');
            dynamicIsland.expand();
            dynamicIsland.startIdleTimer();
            return;
        }
        const engine = SEARCH_ENGINES[this.selectedEngine];
        const searchUrl = engine.url + encodeURIComponent(query);
        window.open(searchUrl, '_blank');

        dynamicIsland.update(engine.icon, `Suche: "${query.substring(0, 15)}..."`, `via ${this.capitalizeFirstLetter(this.selectedEngine)}`);
        dynamicIsland.expand();
        dynamicIsland.startIdleTimer();
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

class WeatherManager {
    constructor() {
        this.weatherLinkButton = document.querySelector('.weather-link-button');
        this.weatherIconElement = this.weatherLinkButton.querySelector('.weather-icon');
        this.weatherTextElement = this.weatherLinkButton.querySelector('span:last-child');
        this.weatherNotice = document.querySelector('.weather-notice');

        this.setupEventListeners();
        this.getMockWeather(); // Initial mock data
    }

    setupEventListeners() {
        this.weatherLinkButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.getMockWeather();
            dynamicIsland.update('cloud', 'Wetter Update', `Abgerufen für ${CONFIG.DEFAULT_LOCATION}`);
            dynamicIsland.expand();
            dynamicIsland.startIdleTimer();
        });
    }

    getMockWeather() {
        // Simulate API call for weather
        const mockWeatherData = {
            main: { temp: (20 + Math.random() * 5 - 2.5).toFixed(1) }, // Random temp around 20
            weather: [{ main: this.getRandomWeatherCondition() }]
        };
        this.updateWeatherDisplay(mockWeatherData);
    }

    getRandomWeatherCondition() {
        const conditions = ['clear', 'clouds', 'rain', 'snow', 'thunderstorm', 'drizzle', 'mist'];
        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    updateWeatherDisplay(data) {
        const temp = data.main.temp;
        const condition = data.weather[0].main.toLowerCase();
        const icon = WEATHER_ICONS[condition] || 'cloud';

        this.weatherTextElement.textContent = `${temp}°C | ${this.capitalizeFirstLetter(condition)}`;
        this.weatherIconElement.textContent = icon;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

class QuoteManager {
    constructor() {
        this.quoteText = document.getElementById('quote-text');
        this.quoteAuthor = document.getElementById('quote-author');
        this.lastQuoteUpdate = 0; // Timestamp of last update

        this.fetchQuote();
        setInterval(() => this.fetchQuote(), CONFIG.QUOTE_UPDATE_INTERVAL);
    }

    async fetchQuote() {
        const now = Date.now();
        // Prevent fetching too frequently if page is idle for long periods and multiple instances are running
        if (now - this.lastQuoteUpdate < CONFIG.QUOTE_UPDATE_INTERVAL / 2) {
             return;
        }

        try {
            const response = await fetch('https://api.quotable.io/random?maxLength=100');
            const data = await response.json();
            if (data && data.content && data.author) {
                this.quoteText.textContent = `„${data.content}“`;
                this.quoteAuthor.textContent = `— ${data.author}`;
                this.lastQuoteUpdate = now;

                // Update Dynamic Island on new quote
                dynamicIsland.addQueuedMessage('format_quote', 'Neues Zitat', data.author);
            }
        } catch (error) {
            console.error('Fehler beim Abrufen des Zitats:', error);
            this.quoteText.textContent = '„Der einzige Weg, großartige Arbeit zu leisten, ist, zu lieben, was man tut.“';
            this.quoteAuthor.textContent = '— Steve Jobs';
            dynamicIsland.addQueuedMessage('sentiment_dissatisfied', 'Zitat Fehler', 'Konnte Zitat nicht laden.');
        }
    }
}

class UIManager {
    constructor() {
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.userAvatarToggleBtn = document.getElementById('user-avatar-toggle');
        this.userAvatar = document.getElementById('user-avatar');
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        this.appCards = document.querySelectorAll('.app-card');

        this.setupTimeDateUpdates();
        this.setupFullscreenToggle();
        this.setupAvatarToggle();
        this.setupThemeToggle();
        this.setupAppCards();
        this.applyTheme(settingsManager.get('theme')); // Ensure theme is applied on load
    }

    setupTimeDateUpdates() {
        const updateTimeDate = () => {
            const now = new Date();
            this.timeElement.textContent = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
            this.dateElement.textContent = now.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        };
        updateTimeDate();
        setInterval(updateTimeDate, CONFIG.TIME_UPDATE_INTERVAL);
    }

    setupFullscreenToggle() {
        if (!this.fullscreenBtn) return;
        this.fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().then(() => {
                    dynamicIsland.update('fullscreen', 'Vollbild', 'Aktiviert');
                    dynamicIsland.expand();
                    dynamicIsland.startIdleTimer();
                }).catch(err => {
                    dynamicIsland.update('error', 'Vollbild Fehler', err.message);
                    dynamicIsland.expand();
                    dynamicIsland.startIdleTimer();
                });
            } else if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {
                    dynamicIsland.update('fullscreen_exit', 'Vollbild', 'Deaktiviert');
                    dynamicIsland.expand();
                    dynamicIsland.startIdleTimer();
                }).catch(err => {
                    dynamicIsland.update('error', 'Vollbild Fehler', err.message);
                    dynamicIsland.expand();
                    dynamicIsland.startIdleTimer();
                });
            }
        });
    }

    setupAvatarToggle() {
        if (!this.userAvatarToggleBtn || !this.userAvatar) return;

        const applyAvatarVisibility = () => {
            const isVisible = settingsManager.get('avatarVisible');
            this.userAvatar.setAttribute('aria-hidden', !isVisible);
            this.userAvatarToggleBtn.textContent = isVisible ? '🙈 Avatar ausblenden' : '👁️ Avatar anzeigen';
        };

        this.userAvatarToggleBtn.addEventListener('click', () => {
            const currentVisibility = settingsManager.get('avatarVisible');
            settingsManager.set('avatarVisible', !currentVisibility);
            applyAvatarVisibility();
            dynamicIsland.update('person', 'Avatar', !currentVisibility ? 'Sichtbar' : 'Ausgeblendet');
            dynamicIsland.expand();
            dynamicIsland.startIdleTimer();
        });

        applyAvatarVisibility();
    }

    applyTheme(themeName) {
        const theme = THEMES[themeName];
        if (theme) {
            document.documentElement.setAttribute('data-theme', themeName);
            document.body.setAttribute('data-theme', themeName);
            // Update button text
            this.themeToggleBtn.textContent = `🎨 ${theme.name} Theme`;
        }
    }

    setupThemeToggle() {
        if (!this.themeToggleBtn) return;

        this.themeToggleBtn.addEventListener('click', () => {
            const currentTheme = settingsManager.get('theme');
            const themeNames = Object.keys(THEMES);
            const currentThemeIndex = themeNames.indexOf(currentTheme);
            const nextThemeIndex = (currentThemeIndex + 1) % themeNames.length;
            const newTheme = themeNames[nextThemeIndex];
            
            settingsManager.set('theme', newTheme);
            this.applyTheme(newTheme);
            dynamicIsland.update('palette', 'Theme', `"${THEMES[newTheme].name}" aktiv`);
            dynamicIsland.expand();
            dynamicIsland.startIdleTimer();
        });
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
                dynamicIsland.collapse();
                dynamicIsland.resetToDefault();
            });

            card.addEventListener('click', () => {
                dynamicIsland.resetToDefault();
            });
        });
    }
}

// --- Initialisierung ---
let settingsManager, dynamicIsland, searchManager, weatherManager, quoteManager, uiManager;

document.addEventListener('DOMContentLoaded', () => {
    // Initialisiere alle Manager
    settingsManager = new SettingsManager();
    dynamicIsland = new DynamicIslandManager();
    searchManager = new SearchManager();
    weatherManager = new WeatherManager();
    quoteManager = new QuoteManager();
    uiManager = new UIManager();

    console.log('MKWEB OS 7 - Erfolgreich initialisiert');
});
