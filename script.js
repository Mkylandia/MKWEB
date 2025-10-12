// MKWEB OS 8: Enhanced for Modularity and User Experience

document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION ---
    const CONFIG = {
        SETTINGS_KEY: 'mkweb-settings-os8',
        DEFAULT_THEME: 'dark',
        THEMES: ['dark', 'light', 'ocean', 'forest', 'glass'],
        DEFAULT_WIDGETS: {
            time: true, search: true, weather: true, quote: true, apps: true
        }
    };

    const SEARCH_ENGINES = {
        google: { url: 'https://www.google.com/search?q=', icon: 'travel_explore' },
        yandex: { url: 'https://yandex.com/search/?text=', icon: 'search' },
        bing: { url: 'https://www.bing.com/search?q=', icon: 'search' },
        duckduckgo: { url: 'https://duckduckgo.com/?q=', icon: 'search' },
        youtube: { url: 'https://www.youtube.com/results?search_query=', icon: 'smart_display' },
        github: { url: 'https://github.com/search?q=', icon: 'code_blocks' }
    };

    const QUOTES = [
        { text: "Der einzige Weg, großartige Arbeit zu leisten, ist, zu lieben, was man tut.", author: "Steve Jobs" },
        { text: "Die Logik bringt dich von A nach B. Die Vorstellungskraft bringt dich überall hin.", author: "Albert Einstein" },
        { text: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt.", author: "Mahatma Gandhi" },
        { text: "Was immer du tun kannst oder träumst es zu können, fang damit an.", author: "Johann Wolfgang von Goethe" },
        { text: "Die Zukunft gehört denen, die an der Schönheit ihrer Träume glauben.", author: "Eleanor Roosevelt" },
        { text: "Probleme kann man niemals mit derselben Denkweise lösen, durch die sie entstanden sind.", author: "Albert Einstein" }
    ];

    // --- DOM CACHING ---
    const dom = {
        body: document.body,
        time: document.getElementById('time'),
        date: document.getElementById('date'),
        quoteText: document.getElementById('quote-text'),
        quoteAuthor: document.getElementById('quote-author'),
        searchInput: document.getElementById('search'),
        searchEngines: document.querySelectorAll('.search-engine'),
        fullscreenBtn: document.getElementById('fullscreen-btn'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        // Dynamic Island
        island: {
            container: document.getElementById('dynamicIslandContainer'),
            element: document.getElementById('dynamicIsland'),
            icon: document.getElementById('islandIcon'),
            title: document.getElementById('islandTitle'),
            subtitle: document.getElementById('islandSubtitle'),
            waveform: document.getElementById('islandWaveform')
        },
        // Weather
        weather: {
            icon: document.querySelector('.weather-icon'),
            temp: document.querySelector('.weather-temp'),
            desc: document.querySelector('.weather-desc'),
            location: document.querySelector('.weather-location')
        },
        // Settings Panel
        settings: {
            overlay: document.getElementById('settingsOverlay'),
            panel: document.getElementById('settingsPanel'),
            openBtn: document.getElementById('user-avatar'),
            closeBtn: document.getElementById('closeSettingsBtn'),
            themeSelector: document.getElementById('themeSelector'),
            widgetToggles: document.getElementById('widgetToggles')
        },
        widgets: document.querySelectorAll('.widget')
    };

    // --- STATE MANAGER ---
    class StateManager {
        constructor() {
            this.settings = this.load();
        }
        load() {
            try {
                const stored = localStorage.getItem(CONFIG.SETTINGS_KEY);
                const defaults = {
                    theme: CONFIG.DEFAULT_THEME,
                    lastActiveEngine: 'google',
                    widgets: { ...CONFIG.DEFAULT_WIDGETS }
                };
                const parsed = stored ? JSON.parse(stored) : {};
                // Ensure all widget keys are present
                parsed.widgets = { ...defaults.widgets, ...(parsed.widgets || {}) };
                return { ...defaults, ...parsed };
            } catch (e) {
                console.error("Error loading settings:", e);
                return {
                    theme: CONFIG.DEFAULT_THEME,
                    lastActiveEngine: 'google',
                    widgets: { ...CONFIG.DEFAULT_WIDGETS }
                };
            }
        }
        save() {
            localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(this.settings));
        }
        get(key) { return this.settings[key]; }
        set(key, value) {
            this.settings[key] = value;
            this.save();
        }
    }

    const state = new StateManager();

    // --- DYNAMIC ISLAND CONTROLLER ---
    const dynamicIsland = {
        timeout: null,
        update(icon, title, subtitle, showWave = false) {
            dom.island.icon.textContent = icon;
            dom.island.title.textContent = title;
            dom.island.subtitle.textContent = subtitle;
            dom.island.waveform.classList.toggle('active', showWave);
        },
        showTransient(icon, title, subtitle, duration = 3000, showWave = false) {
            clearTimeout(this.timeout);
            this.update(icon, title, subtitle, showWave);
            dom.island.element.classList.add('expanded');
            this.timeout = setTimeout(() => {
                dom.island.element.classList.remove('expanded');
                this.resetToDefault();
            }, duration);
        },
        resetToDefault() {
            const engine = state.get('lastActiveEngine');
            const { icon } = SEARCH_ENGINES[engine];
            const name = engine.charAt(0).toUpperCase() + engine.slice(1);
            this.update(icon, `${name} Suche`, 'Bereit für deine Eingabe.');
        }
    };

    // --- UI MODULES ---
    const UI = {
        init() {
            this.Theme.init();
            this.DateTime.init();
            this.Quotes.init();
            this.Search.init();
            this.Fullscreen.init();
            this.AppCards.init();
            this.Weather.init();
            this.Settings.init();
            dynamicIsland.resetToDefault();
            console.log('MKWEB OS 8 - Initialisiert');
        },

        Theme: {
            init() {
                this.apply(state.get('theme'));
                dom.themeToggleBtn.addEventListener('click', () => this.cycle());
            },
            apply(themeName) {
                dom.body.setAttribute('data-theme', themeName);
            },
            cycle() {
                const current = state.get('theme');
                const currentIndex = CONFIG.THEMES.indexOf(current);
                const nextIndex = (currentIndex + 1) % CONFIG.THEMES.length;
                const nextTheme = CONFIG.THEMES[nextIndex];
                state.set('theme', nextTheme);
                this.apply(nextTheme);
                dynamicIsland.showTransient('palette', 'Theme geändert', nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1), 2000);
            }
        },

        DateTime: {
            init() {
                this.update();
                setInterval(() => this.update(), 1000);
            },
            update() {
                const now = new Date();
                dom.time.textContent = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                dom.date.textContent = now.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }
        },

        Quotes: {
            init() { this.display(); },
            display() {
                const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
                dom.quoteText.textContent = quote.text;
                dom.quoteAuthor.textContent = `— ${quote.author}`;
            }
        },

        Search: {
            init() {
                this.setActive(state.get('lastActiveEngine'));
                dom.searchEngines.forEach(btn => {
                    btn.addEventListener('click', () => this.setActive(btn.dataset.engine));
                });
                dom.searchInput.addEventListener('keypress', e => {
                    if (e.key === 'Enter') this.perform();
                });
            },
            setActive(engine) {
                dom.searchEngines.forEach(btn => {
                    const isActive = btn.dataset.engine === engine;
                    btn.classList.toggle('active', isActive);
                    btn.setAttribute('aria-pressed', isActive);
                });
                state.set('lastActiveEngine', engine);
                dynamicIsland.resetToDefault();
            },
            perform() {
                const query = dom.searchInput.value.trim();
                if (!query) return;
                const engine = state.get('lastActiveEngine');
                const { url } = SEARCH_ENGINES[engine];
                dynamicIsland.showTransient('arrow_outward', 'Suche läuft...', `"${query}"`, 1500, true);
                setTimeout(() => {
                    window.open(url + encodeURIComponent(query), '_blank');
                    dom.searchInput.value = '';
                }, 800);
            }
        },

        Fullscreen: {
            init() {
                dom.fullscreenBtn.addEventListener('click', () => this.toggle());
                document.addEventListener('fullscreenchange', () => this.updateIcon());
            },
            toggle() {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => console.error(err));
                } else {
                    document.exitFullscreen();
                }
            },
            updateIcon() {
                dom.fullscreenBtn.querySelector('.material-symbols-outlined').textContent =
                    document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen';
            }
        },

        AppCards: {
            init() {
                document.querySelectorAll('.app-card').forEach(card => {
                    card.addEventListener('mouseenter', () => this.onHover(card));
                    card.addEventListener('mouseleave', () => dynamicIsland.resetToDefault());
                });
            },
            onHover(card) {
                const name = card.dataset.appName || 'App';
                const icon = card.dataset.appIcon || 'apps';
                const isMedia = name.toLowerCase() === 'spotify';
                dynamicIsland.update(icon, isMedia ? 'Now Playing' : name, isMedia ? 'Spotify' : 'App starten...', isMedia);
            }
        },
        
        Weather: {
            init() {
                this.fetch();
                // Update weather every 30 minutes
                setInterval(() => this.fetch(), 1800000);
            },
            // Using a mock fetch since no API key is available
            fetch() {
                const mockData = { temp: 18, description: 'Leicht bewölkt', icon: 'partly_cloudy_day' };
                setTimeout(() => {
                    this.updateDOM(mockData);
                }, 500);
            },
            updateDOM(data) {
                dom.weather.icon.textContent = data.icon;
                dom.weather.temp.textContent = `${data.temp}°C`;
                dom.weather.desc.textContent = data.description;
            }
        },
        
        Settings: {
            init() {
                dom.settings.openBtn.addEventListener('click', () => this.open());
                dom.settings.closeBtn.addEventListener('click', () => this.close());
                dom.settings.overlay.addEventListener('click', (e) => {
                    if (e.target === dom.settings.overlay) this.close();
                });
                
                // Theme selector
                dom.settings.themeSelector.addEventListener('click', (e) => {
                    if (e.target.matches('.theme-option')) {
                        const theme = e.target.dataset.theme;
                        state.set('theme', theme);
                        UI.Theme.apply(theme);
                        this.updateThemeUI();
                    }
                });

                // Widget toggles
                dom.settings.widgetToggles.addEventListener('change', (e) => {
                    if (e.target.matches('input[type="checkbox"]')) {
                        const widgetName = e.target.dataset.widget;
                        const isVisible = e.target.checked;
                        const currentWidgets = state.get('widgets');
                        currentWidgets[widgetName] = isVisible;
                        state.set('widgets', currentWidgets);
                        this.updateWidgetVisibility();
                    }
                });

                this.updateThemeUI();
                this.updateWidgetUI();
                this.updateWidgetVisibility();
            },
            open() { dom.settings.overlay.classList.add('visible'); },
            close() { dom.settings.overlay.classList.remove('visible'); },
            updateThemeUI() {
                const currentTheme = state.get('theme');
                dom.settings.themeSelector.querySelectorAll('.theme-option').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.theme === currentTheme);
                });
            },
            updateWidgetUI() {
                const widgetSettings = state.get('widgets');
                for (const widgetName in widgetSettings) {
                    const checkbox = dom.settings.widgetToggles.querySelector(`input[data-widget="${widgetName}"]`);
                    if (checkbox) checkbox.checked = widgetSettings[widgetName];
                }
            },
            updateWidgetVisibility() {
                const widgetSettings = state.get('widgets');
                dom.widgets.forEach(widget => {
                    const widgetName = widget.dataset.widget;
                    widget.classList.toggle('visible', widgetSettings[widgetName]);
                });
            }
        }
    };

    // --- INITIALIZE THE APP ---
    UI.init();
});
