// Configuration
const SEARCH_ENGINES = {
  google: 'https://www.google.com/search?q=',
  yandex: 'https://yandex.com/search/?text=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  youtube: 'https://www.youtube.com/results?search_query=',
  github: 'https://github.com/search?q='
};

const QUOTES = [
  { text: "Der einzige Weg, großartige Arbeit zu leisten, ist, zu lieben, was man tut.", author: "Steve Jobs" },
  { text: "Die Logik bringt dich von A nach B. Die Vorstellungskraft bringt dich überall hin.", author: "Albert Einstein" },
  { text: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt.", author: "Mahatma Gandhi" },
  { text: "Was immer du tun kannst oder träumst es zu können, fang damit an.", author: "Johann Wolfgang von Goethe" },
  { text: "Die Zukunft gehört denen, die an der Schönheit ihrer Träume glauben.", author: "Eleanor Roosevelt" },
  { text: "Der beste Weg, die Zukunft vorauszusagen, ist, sie zu gestalten.", author: "Peter F. Drucker" },
  { text: "Erfolg ist die Summe kleiner Bemühungen, die Tag für Tag wiederholt werden.", author: "Robert Collier" },
  { text: "Nicht weil es schwer ist, wagen wir es nicht, sondern weil wir es nicht wagen, ist es schwer.", author: "Seneca" }
];

// State
let activeEngine = 'google';
let islandTimeout = null;
let currentTheme = 'dark';

// Elements
const dynamicIsland = document.getElementById('dynamicIsland');
const islandIcon = document.getElementById('islandIcon');
const islandTitle = document.getElementById('islandTitle');
const islandSubtitle = document.getElementById('islandSubtitle');
const islandClose = document.getElementById('islandClose');
const searchInput = document.getElementById('search');
const searchEngines = document.querySelectorAll('.search-engine');
const themeBtn = document.getElementById('themeBtn');
const themeMenu = document.getElementById('themeMenu');
const themeOptions = document.querySelectorAll('.theme-option');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const weatherBtn = document.getElementById('weatherBtn');
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const appCards = document.querySelectorAll('.app-card');

// Dynamic Island Functions
function updateIsland(icon, title, subtitle, expand = false, showProgress = false) {
  islandIcon.textContent = icon;
  islandTitle.textContent = title;
  islandSubtitle.textContent = subtitle;
  
  if (showProgress) {
    dynamicIsland.classList.add('loading');
  } else {
    dynamicIsland.classList.remove('loading');
  }
  
  if (expand) {
    dynamicIsland.classList.add('expanded');
  }
  
  clearTimeout(islandTimeout);
}

function collapseIsland() {
  dynamicIsland.classList.remove('expanded');
  dynamicIsland.classList.remove('loading');
}

function showIslandNotification(icon, title, subtitle, duration = 3000, showProgress = false) {
  updateIsland(icon, title, subtitle, true, showProgress);
  
  islandTimeout = setTimeout(() => {
    collapseIsland();
    setTimeout(() => {
      resetIslandToDefault();
    }, 300);
  }, duration);
}

function resetIslandToDefault() {
  const engineName = activeEngine.charAt(0).toUpperCase() + activeEngine.slice(1);
  updateIsland('search', 'Suchmaschine', `Aktiv: ${engineName}`, false);
}

// Time & Date
function updateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  timeEl.textContent = timeStr;
  dateEl.textContent = dateStr;
}

// Quote Display
function displayRandomQuote() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  quoteText.textContent = `"${quote.text}"`;
  quoteAuthor.textContent = `— ${quote.author}`;
}

// Search Functionality
function performSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  showIslandNotification('arrow_forward', 'Suche läuft...', `Öffne "${query}"`, 1000, true);
  
  setTimeout(() => {
    const url = SEARCH_ENGINES[activeEngine] + encodeURIComponent(query);
    window.open(url, '_blank');
    searchInput.value = '';
  }, 1000);
}

// Search Engine Selection
searchEngines.forEach(btn => {
  btn.addEventListener('click', () => {
    searchEngines.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeEngine = btn.dataset.engine;
    
    showIslandNotification('check_circle', 'Geändert', `${btn.textContent} aktiv`, 2000);
  });
});

// Search Input
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
});

// Theme Menu Toggle
themeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  themeMenu.classList.toggle('active');
  
  if (themeMenu.classList.contains('active')) {
    showIslandNotification('palette', 'Theme-Auswahl', 'Wähle dein Lieblings-Theme', 2000);
  }
});

// Close theme menu when clicking outside
document.addEventListener('click', (e) => {
  if (!themeMenu.contains(e.target) && !themeBtn.contains(e.target)) {
    themeMenu.classList.remove('active');
  }
});

// Theme Selection
themeOptions.forEach(option => {
  option.addEventListener('click', () => {
    const theme = option.dataset.theme;
    
    // Update active state
    themeOptions.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');
    
    // Apply theme
    document.body.setAttribute('data-theme', theme);
    currentTheme = theme;
    
    // Show notification
    const themeName = option.querySelector('.theme-name').textContent;
    showIslandNotification('palette', 'Theme geändert', `${themeName} Modus aktiv`, 2500);
    
    // Close menu
    setTimeout(() => {
      themeMenu.classList.remove('active');
    }, 300);
  });
});

// Fullscreen Toggle
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error('Fullscreen error:', err);
    });
    showIslandNotification('fullscreen', 'Vollbild', 'Aktiviert', 2000);
  } else {
    document.exitFullscreen().catch(err => {
      console.error('Exit fullscreen error:', err);
    });
    showIslandNotification('fullscreen_exit', 'Vollbild', 'Deaktiviert', 2000);
  }
});

// Weather Button
weatherBtn.addEventListener('click', (e) => {
  e.preventDefault();
  showIslandNotification('refresh', 'Wetter wird geladen...', 'Bitte warten', 2000, true);
  
  setTimeout(() => {
    const temp = Math.floor(Math.random() * 15) + 10;
    const conditions = [
      { name: 'Sonnig', icon: 'sunny' },
      { name: 'Bewölkt', icon: 'cloud' },
      { name: 'Leicht bewölkt', icon: 'partly_cloudy_day' },
      { name: 'Regen', icon: 'rainy' }
    ];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    showIslandNotification(condition.icon, `${temp}°C`, `${condition.name} in Heidenheim`, 4000);
  }, 2000);
});

// App Card Hover
appCards.forEach(card => {
  let hoverTimeout;
  
  card.addEventListener('mouseenter', () => {
    const appName = card.dataset.name;
    const appIcon = card.dataset.icon || 'apps';
    
    hoverTimeout = setTimeout(() => {
      updateIsland(appIcon, appName, 'Klicke zum Öffnen', true);
    }, 400);
  });

  card.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout);
    collapseIsland();
    setTimeout(resetIslandToDefault, 300);
  });
});

// Dynamic Island Click
dynamicIsland.addEventListener('click', (e) => {
  if (e.target.closest('#islandClose')) {
    return;
  }
  dynamicIsland.classList.toggle('expanded');
});

// Island Close Button
islandClose.addEventListener('click', (e) => {
  e.stopPropagation();
  collapseIsland();
  setTimeout(resetIslandToDefault, 300);
});

// Initialize
updateTime();
displayRandomQuote();
resetIslandToDefault();

// Auto-cycle Dynamic Island when idle
let idleTimer;
let cycleIndex = 0;
const cycleModes = [
  { icon: 'schedule', getTitle: () => new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }), subtitle: 'Aktuelle Uhrzeit' },
  { icon: 'calendar_today', getTitle: () => new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }), subtitle: 'Heute' },
  { icon: 'search', getTitle: () => 'Suchmaschine', subtitle: () => `Aktiv: ${activeEngine.charAt(0).toUpperCase() + activeEngine.slice(1)}` }
];

function startIslandCycle() {
  const mode = cycleModes[cycleIndex];
  const title = typeof mode.getTitle === 'function' ? mode.getTitle() : mode.getTitle;
  const subtitle = typeof mode.subtitle === 'function' ? mode.subtitle() : mode.subtitle;
  
  updateIsland(mode.icon, title, subtitle, false);
  cycleIndex = (cycleIndex + 1) % cycleModes.length;
}

function resetIdleTimer() {
  clearTimeout(idleTimer);
  clearInterval(window.islandCycleInterval);
  
  idleTimer = setTimeout(() => {
    startIslandCycle();
    window.islandCycleInterval = setInterval(startIslandCycle, 6000);
  }, 4000);
}

// Reset idle timer on user interaction
['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetIdleTimer);
});

// Update time every second
setInterval(updateTime, 1000);

// Update quote every hour
setInterval(displayRandomQuote, 3600000);

// Initialize idle timer
resetIdleTimer();

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
    showIslandNotification('keyboard', 'Suche aktiv', 'Beginne zu tippen', 1500);
  }
  
  // Escape to blur search or close theme menu
  if (e.key === 'Escape') {
    searchInput.blur();
    themeMenu.classList.remove('active');
    collapseIsland();
  }

  // T to open theme menu
  if (e.key === 't' && !searchInput.matches(':focus')) {
    e.preventDefault();
    themeMenu.classList.toggle('active');
  }

  // F for fullscreen
  if (e.key === 'f' && !searchInput.matches(':focus')) {
    e.preventDefault();
    fullscreenBtn.click();
  }
});

// Welcome notification
setTimeout(() => {
  showIslandNotification('waving_hand', 'Willkommen zurück!', 'MKWEB OS 9 ist bereit', 3000);
}, 500);

// Prevent context menu on island (optional)
dynamicIsland.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
