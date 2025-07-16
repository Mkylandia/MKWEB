// MKWEB OS 7 Custom - Verbesserte Version mit Customization & erweiterter Dynamic Island

// --- Konfiguration und Konstanten ---
const CONFIG = {
    SETTINGS_KEY: 'mkweb-settings-os7-custom',
    IDLE_DELAY: 3000,
    QUOTE_UPDATE_INTERVAL: 3600000,
    TIME_UPDATE_INTERVAL: 1000,
    ISLAND_CYCLE_INTERVAL: 5000,
    HOVER_DELAY: 300,
    DEFAULT_THEME: 'dark-purple', // Default theme
    DEFAULT_LOCATION: 'Heidenheim'
};

const SEARCH_ENGINES = { /* Unverändert */ };
const WEATHER_ICONS = { /* Unverändert */ };
const QUOTES = [ /* Unverändert */ ];
// --- Utility Functions --- (Unverändert)
const utils = {
    createElement: (tag, className = '', textContent = '') => { /*...*/ },
    debounce: (func, wait) => { /*...*/ },
    throttle: (func, limit) => { /*...*/ },
    formatTime: (date) => date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    formatDate: (date) => date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    formatShortDate: (date) => ({
        date: date.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' }),
        weekday: date.toLocaleDateString('de-DE', { weekday: 'long' })
    })
};

// --- Settings Manager (Erweitert) ---
class SettingsManager {
    constructor() { this.settings = this.loadSettings(); }
    loadSettings() {
        try {
            const stored = localStorage.getItem(CONFIG.SETTINGS_KEY);
            const defaults = this.getDefaultSettings();
            return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
        } catch (error) { console.warn('Fehler beim Laden der Einstellungen:', error); return this.getDefaultSettings(); }
    }
    getDefaultSettings() {
        return {
            theme: CONFIG.DEFAULT_THEME, showAvatar: true,
            lastActiveEngine: 'google', weatherLocation: CONFIG.DEFAULT_LOCATION
        };
    }
    save() { try { localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(this.settings)); } catch (error) { console.warn('Fehler beim Speichern der Einstellungen:', error); } }
    get(key) { return this.settings[key]; }
    set(key, value) { this.settings[key] = value; this.save(); }
}

// --- Dynamic Island Manager (Stark verbessert) ---
class DynamicIslandManager {
    constructor() {
        this.container = document.getElementById('dynamicIslandContainer');
        this.island = document.getElementById('dynamicIsland');
        this.dismissBtn = document.getElementById('islandDismissBtn');
        this.waveform = document.getElementById('islandWaveform');

        // Wrapper für Cross-Fade
        this.contentWrappers = document.querySelectorAll('.island-content-wrapper');
        this.activeWrapperIndex = 0;

        this.state = { icon: 'info', title: 'Willkommen!', subtitle: 'Wähle eine Suchmaschine aus.', showWave: false };
        this.timers = { transient: null, cycle: null, idle: null };
        this.isTimeDisplay = true;
        this.init();
    }

    init() { this.setupEventListeners(); this.resetToDefault(); this.scheduleTimeDateCycle(); }
    setupEventListeners() {
        this.island.addEventListener('click', (e) => { if (e.target.closest('#islandDismissBtn')) return; this.toggleExpanded(); });
        this.dismissBtn.addEventListener('click', () => { this.collapse(); this.resetToDefault(); });
    }

    update(icon, title, subtitle, showWave = false) {
        this.clearTimer('transient');
        this.state = { icon, title, subtitle, showWave };

        const nextWrapperIndex = (this.activeWrapperIndex + 1) % 2;
        const currentWrapper = this.contentWrappers[this.activeWrapperIndex];
        const nextWrapper = this.contentWrappers[nextWrapperIndex];

        // Nächsten Wrapper im Hintergrund befüllen
        nextWrapper.querySelector('[id^="islandIcon"]').textContent = icon;
        nextWrapper.querySelector('[id^="islandTitle"]').textContent = title;
        nextWrapper.querySelector('[id^="islandSubtitle"]').textContent = subtitle;

        this.waveform.classList.toggle('active', showWave);

        // Cross-Fade
        currentWrapper.classList.remove('active');
        nextWrapper.classList.add('active');
        this.activeWrapperIndex = nextWrapperIndex;
    }

    expand() { this.island.classList.add('expanded'); }
    collapse() { this.island.classList.remove('expanded'); }
    toggleExpanded() {
        this.island.classList.toggle('expanded');
        if (this.island.classList.contains('expanded')) { this.cancelTimeDateCycleSchedule(); }
        else { this.resetToDefault(); }
    }

    showTransient(icon, title, subtitle, showWave = false, duration = 3000) {
        this.cancelTimeDateCycleSchedule();
        this.update(icon, title, subtitle, showWave);
        this.expand();
        this.timers.transient = setTimeout(() => { this.collapse(); this.resetToDefault(); }, duration);
    }
    
    showMusicPlayer(track, artist) {
        this.showTransient('music_note', track, artist, true, 10000);
    }

    resetToDefault() {
        const engine = settingsManager.get('lastActiveEngine');
        const engineConfig = SEARCH_ENGINES[engine] || SEARCH_ENGINES.google;
        this.update(engineConfig.icon, 'Suchmaschine', `Aktiv: ${engine.charAt(0).toUpperCase() + engine.slice(1)}`);
        this.collapse(); this.scheduleTimeDateCycle();
    }

    scheduleTimeDateCycle() {
        this.clearTimer('idle'); this.clearTimer('cycle');
        this.timers.idle = setTimeout(() => { this.startTimeDateCycle(); }, CONFIG.IDLE_DELAY);
    }

    cancelTimeDateCycleSchedule() { this.clearTimer('idle'); this.clearTimer('cycle'); }
    startTimeDateCycle() {
        this.clearTimer('cycle'); this.updateTimeDate();
        this.timers.cycle = setInterval(() => this.updateTimeDate(), CONFIG.ISLAND_CYCLE_INTERVAL);
    }

    updateTimeDate() {
        const now = new Date();
        if (this.isTimeDisplay) { this.update('schedule', utils.formatTime(now), 'Aktuelle Uhrzeit'); }
        else { const dateInfo = utils.formatShortDate(now); this.update('calendar_today', dateInfo.date, dateInfo.weekday); }
        this.isTimeDisplay = !this.isTimeDisplay;
    }

    clearTimer(type) {
        if (this.timers[type]) {
            (type === 'cycle') ? clearInterval(this.timers[type]) : clearTimeout(this.timers[type]);
            this.timers[type] = null;
        }
    }
}

// --- Search Manager (Unverändert) ---
class SearchManager {
    constructor() { /*...*/ }
    init() { /*...*/ }
    setupEventListeners() { /*...*/ }
    activateEngine(engine) { /*...*/ }
    performSearch() { /*...*/ }
}

// --- Weather Manager (Unverändert) ---
class WeatherManager {
    constructor() { /*...*/ }
    init() { /*...*/ }
    async handleWeatherClick(e) { /*...*/ }
    async fetchWeather(location) { /*...*/ }
    getWeatherIcon(condition) { /*...*/ }
}

// --- UI Manager (Stark umgebaut für Settings) ---
class UIManager {
    constructor() {
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');
        this.quoteTextElement = document.getElementById('quote-text');
        this.quoteAuthorElement = document.getElementById('quote-author');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.appCards = document.querySelectorAll('.app-card');
        
        // Settings Modal elements
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsOverlay = document.getElementById('settingsOverlay');
        this.settingsCloseBtn = document.getElementById('settingsCloseBtn');
        this.themeSelector = document.getElementById('themeSelector');
        this.userAvatar = document.getElementById('user-avatar');
        this.userAvatarToggleBtn = document.getElementById('user-avatar-toggle');
        
        this.init();
    }

    init() {
        this.setupDateTime();
        this.setupQuotes();
        this.setupFullscreen();
        this.setupAppCards();
        this.setupSettings(); // Neue Methode für alles rund um Einstellungen
    }

    setupDateTime() { /* Unverändert */ }
    setupQuotes() { /* Unverändert */ }
    setupFullscreen() { /* Unverändert */ }

    setupSettings() {
        // Initiales Theme und Avatar-Status anwenden
        this.applyTheme(settingsManager.get('theme'));
        this.applyAvatarVisibility(settingsManager.get('showAvatar'));

        // Event Listeners für Modal
        this.settingsBtn.addEventListener('click', () => this.settingsOverlay.classList.remove('hidden'));
        this.settingsCloseBtn.addEventListener('click', () => this.settingsOverlay.classList.add('hidden'));
        this.settingsOverlay.addEventListener('click', (e) => { if(e.target === this.settingsOverlay) this.settingsOverlay.classList.add('hidden'); });

        // Event Listener für Theme-Wechsel
        this.themeSelector.addEventListener('click', (e) => {
            if (e.target.matches('.theme-swatch')) {
                const theme = e.target.dataset.theme;
                this.applyTheme(theme);
                settingsManager.set('theme', theme);
            }
        });
        
        // Event Listener für Avatar-Toggle
        this.userAvatarToggleBtn.addEventListener('click', () => {
            const newVisibility = !settingsManager.get('showAvatar');
            this.applyAvatarVisibility(newVisibility);
            settingsManager.set('showAvatar', newVisibility);
        });
    }

    applyTheme(theme) {
        document.body.dataset.theme = theme;
        // Active-Status auf Swatches aktualisieren
        this.themeSelector.querySelectorAll('.theme-swatch').forEach(swatch => {
            swatch.classList.toggle('active', swatch.dataset.theme === theme);
        });
    }

    applyAvatarVisibility(show) {
        this.userAvatar.classList.toggle('hidden-avatar', !show);
        this.userAvatarToggleBtn.textContent = show ? '🙈 Avatar ausblenden' : '🐵 Avatar einblenden';
    }
    
    setupAppCards() {
        this.appCards.forEach(card => {
            let hoverTimeout;
            card.addEventListener('mouseenter', () => {
                dynamicIsland.cancelTimeDateCycleSchedule();
                hoverTimeout = setTimeout(() => {
                    dynamicIsland.update(card.dataset.appIcon || 'apps', card.dataset.appName || 'App', 'Starte App...');
                    dynamicIsland.expand();
                }, CONFIG.HOVER_DELAY);
            });
            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                dynamicIsland.collapse();
                dynamicIsland.resetToDefault();
            });
            // Spezielle Interaktion für Spotify
            if (card.id === 'spotify-app') {
                card.addEventListener('click', (e) => {
                    e.preventDefault(); // Verhindert das Öffnen des Links
                    dynamicIsland.showMusicPlayer('MKWEB Radio', 'Now Playing...');
                    setTimeout(() => window.open(card.href, '_blank'), 800);
                });
            } else {
                 card.addEventListener('click', () => { dynamicIsland.resetToDefault(); });
            }
        });
    }
}

// --- Initialisierung ---
let settingsManager, dynamicIsland, searchManager, weatherManager, uiManager;

document.addEventListener('DOMContentLoaded', () => {
    // Manager in korrekter Reihenfolge initialisieren
    settingsManager = new SettingsManager();
    dynamicIsland = new DynamicIslandManager();
    searchManager = new SearchManager(); // searchManager might need settings
    weatherManager = new WeatherManager(); // weatherManager might need settings
    uiManager = new UIManager(); // uiManager applies settings

    console.log('MKWEB OS 7 Custom - Erfolgreich initialisiert');
});

// Füllen der unveränderten Klassen mit ihrer ursprünglichen Logik
Object.assign(SearchManager.prototype, {
    init() { this.setupEventListeners(); this.activateEngine(this.activeEngine); },
    setupEventListeners() { this.engineButtons.forEach(b => b.addEventListener('click', () => this.activateEngine(b.dataset.engine))); this.input.addEventListener('keypress', e => e.key === 'Enter' && this.performSearch()); },
    activateEngine(engine) { this.engineButtons.forEach(b => b.classList.toggle('active', b.dataset.engine === engine)); this.activeEngine = engine; settingsManager.set('lastActiveEngine', engine); dynamicIsland.resetToDefault(); },
    performSearch() { const q = this.input.value.trim(); if (!q) return; const u = (SEARCH_ENGINES[this.activeEngine] || SEARCH_ENGINES.google).url + encodeURIComponent(q); dynamicIsland.showTransient('arrow_forward', 'Suche läuft...', `Öffne: "${q}"`, true, 800); setTimeout(() => { window.open(u, '_blank'); this.input.value = ''; }, 800); },
    constructor() { this.input = document.getElementById('search'); this.engineButtons = document.querySelectorAll('.search-engine'); this.activeEngine = settingsManager.get('lastActiveEngine'); this.init(); }
});
Object.assign(WeatherManager.prototype, {
    init() { if (this.button) this.button.addEventListener('click', e => this.handleWeatherClick(e)); },
    async handleWeatherClick(e) { e.preventDefault(); dynamicIsland.showTransient('refresh', 'Wetter wird geladen...', 'Bitte warten...', true, 2500); try { const d = await this.fetchWeather(settingsManager.get('weatherLocation')); if (d) dynamicIsland.showTransient(this.getWeatherIcon(d.icon), `${d.temp}°C`, `${d.description} in ${d.location}`, false, 4000); } catch (err) { dynamicIsland.showTransient('error', 'Fehler', 'Wetterdaten nicht verfügbar.', false, 3000); } },
    async fetchWeather(location) { return new Promise(res => setTimeout(() => res(this.mockData[location] || this.mockData['Heidenheim']), 800)); },
    getWeatherIcon(condition) { return WEATHER_ICONS[condition.toLowerCase()] || WEATHER_ICONS.default; },
    constructor() { this.button = document.querySelector('.weather-link-button'); this.mockData = { 'Heidenheim': { temp: 22, description: 'Leicht bewölkt', icon: 'cloud', location: 'Heidenheim' }, 'Berlin': { temp: 18, description: 'Regen', icon: 'rain', location: 'Berlin' }, 'London': { temp: 15, description: 'Nebel', icon: 'fog', location: 'London' } }; this.init(); }
});
Object.assign(UIManager.prototype, {
    setupDateTime() { const u = () => { const n = new Date(); if (this.timeElement) this.timeElement.textContent = utils.formatTime(n); if (this.dateElement) this.dateElement.textContent = utils.formatDate(n); }; u(); setInterval(u, CONFIG.TIME_UPDATE_INTERVAL); },
    setupQuotes() { const d = () => { const q = QUOTES[Math.floor(Math.random() * QUOTES.length)]; this.quoteTextElement.textContent = `"${q.text}"`; this.quoteAuthorElement.textContent = `- ${q.author}`; }; d(); setInterval(d, CONFIG.QUOTE_UPDATE_INTERVAL); },
    setupFullscreen() { if (!this.fullscreenBtn) return; this.fullscreenBtn.addEventListener('click', () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }); document.addEventListener('fullscreenchange', () => { this.fullscreenBtn.textContent = document.fullscreenElement ? 'Shrink' : '🚀 Vollbild'; }); },
});
