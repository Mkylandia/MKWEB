// script.js - MKWEB OS 7: Ultra-Optimized Functionality & Enhanced Dynamic Animations - LIGHTWEIGHT VERSION

// --- Initial Setup & Settings Management ---
const SETTINGS_KEY = 'mkweb-settings-os7';
let settings = JSON.parse(localStorage?.getItem(SETTINGS_KEY)) || {
    theme: 'dark', // Fester Standardwert
    showAvatar: true,
    lastActiveEngine: 'google'
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
                case 'youtube': url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`; break; // Korrigierte YouTube URL
                case 'github': url = `https://github.com/search?q=${encodeURIComponent(query)}`; break;
                default: url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
            window.open(url, '_blank');
        }
    }
});

activateEngine(activeEngine);


// --- Time and Date Display ---
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

// Funktion zum Aktualisieren der Insel
const updateIsland = (icon, title, subtitle, showWave = false) => {
    islandIcon.textContent = icon;
    islandTitle.textContent = title;
    islandSubtitle.textContent = subtitle;
    islandWaveform.style.display = showWave ? 'flex' : 'none';
};

// Click-Event zum Erweitern/Verkleinern
dynamicIsland.addEventListener('click', (e) => {
    // Verhindern, dass der Klick auf den Button die Insel schließt
    if (e.target.closest('#islandDismissBtn')) return;
    dynamicIsland.classList.toggle('expanded');
});

// Insel ausblenden
islandDismissBtn.addEventListener('click', () => {
    dynamicIslandContainer.classList.add('hidden');
});

// Suchmaschinen-Logik erweitern
const originalActivateEngine = activateEngine; // Alte Funktion speichern
activateEngine = (engine) => {
    originalActivateEngine(engine); // Alte Funktion aufrufen
    const engineName = engine.charAt(0).toUpperCase() + engine.slice(1);
    updateIsland(engineIcons[engine] || 'search', 'Suchmaschine', `Aktiv: ${engineName}`);
    if (dynamicIsland.classList.contains('expanded')) {
        setTimeout(() => dynamicIsland.classList.remove('expanded'), 300);
    }
};

// Such-Event erweitern
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            updateIsland('arrow_forward', 'Weiterleitung...', `Suche nach "${query}"`, true);
            dynamicIsland.classList.add('expanded');
            // Nach kurzer Zeit zur normalen Ansicht zurückkehren
            setTimeout(() => {
                activateEngine(settings.lastActiveEngine);
                dynamicIsland.classList.remove('expanded');
            }, 2500);
        }
    }
});

// Initialer Zustand beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    // Kleine Verzögerung, um sicherzustellen, dass alles geladen ist
    setTimeout(() => {
        if (!dynamicIslandContainer.classList.contains('hidden')) {
           activateEngine(settings.lastActiveEngine);
        }
    }, 100);
});
