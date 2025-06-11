const cfgKey = 'mkwebcfg';
const DEFAULT = { 
  theme: 'ocean', 
  font: 'Inter', 
  blur: 20, 
  particles: true,
  sections: {
    search: true, 
    time: true, 
    bookmarks: true, 
    news: true, 
    stats: true
  }
};

let cfg = JSON.parse(localStorage.getItem(cfgKey)) || DEFAULT;
let startTime = Date.now();
let clickCount = 0;
let searchCount = 0;

// DOM-Elemente
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const searchInput = document.getElementById('search-input');
const bookmarkGrid = document.getElementById('bookmark-grid');
const newsGrid = document.getElementById('news-grid');
const statsBar = document.querySelector('.stats-bar');
const settingsModal = document.getElementById('settings-modal');

// Zeitaktualisierung
function updateTime() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString('de-DE');
  dateEl.textContent = now.toLocaleDateString('de-DE', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
}

// Konfiguration anwenden
function applyConfig() {
  // Theme anwenden
  document.body.setAttribute('data-theme', cfg.theme);
  
  // Schriftart anwenden
  document.body.style.fontFamily = cfg.font;
  
  // Unschärfe anwenden
  document.querySelector('.bg-blur').style.backdropFilter = `blur(${cfg.blur}px)`;
  
  // Abschnitts-Sichtbarkeit
  document.getElementById('search-section').style.display = 
    cfg.sections.search ? 'block' : 'none';
  document.getElementById('time-section').style.display = 
    cfg.sections.time ? 'block' : 'none';
  document.getElementById('bookmarks-section').style.display = 
    cfg.sections.bookmarks ? 'block' : 'none';
  document.getElementById('news-section').style.display = 
    cfg.sections.news ? 'block' : 'none';
  statsBar.style.display = cfg.sections.stats ? 'flex' : 'none';
  
  // UI-Elemente aktualisieren
  document.getElementById('theme-select').value = cfg.theme;
  document.getElementById('font-select').value = cfg.font;
  document.getElementById('blur-range').value = cfg.blur;
  document.getElementById('blur-value').textContent = `${cfg.blur}px`;
  document.getElementById('particles-toggle').checked = cfg.particles;
  
  // Lesezeichen laden
  loadBookmarks();
  
  // Nachrichten laden
  loadNews();
}

// Lesezeichen laden
function loadBookmarks() {
  const bookmarks = [
    { name: 'Google', url: 'https://google.com', icon: 'fab fa-google' },
    { name: 'YouTube', url: 'https://youtube.com', icon: 'fab fa-youtube' },
    { name: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' },
    { name: 'Amazon', url: 'https://amazon.de', icon: 'fab fa-amazon' },
    { name: 'Reddit', url: 'https://reddit.com', icon: 'fab fa-reddit' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'fab fa-twitter' }
  ];

  bookmarkGrid.innerHTML = '';
  bookmarks.forEach(bookmark => {
    const bookmarkEl = document.createElement('div');
    bookmarkEl.className = 'bookmark-item';
    bookmarkEl.innerHTML = `
      <i class="${bookmark.icon}"></i>
      <div>${bookmark.name}</div>
    `;
    bookmarkEl.addEventListener('click', () => {
      window.open(bookmark.url, '_blank');
      incrementClickCount();
    });
    bookmarkGrid.appendChild(bookmarkEl);
  });
}

// Nachrichten laden
function loadNews() {
  const news = [
    { title: 'KI-Revolution', source: 'TechNews', icon: 'fas fa-robot' },
    { title: 'Börsenupdate', source: 'Finanzen', icon: 'fas fa-chart-line' },
    { title: 'Wetterwarnung', source: 'Wetter', icon: 'fas fa-cloud-sun' },
    { title: 'Sport-Ergebnisse', source: 'Sport', icon: 'fas fa-futbol' },
    { title: 'Gesundheitstipps', source: 'Gesundheit', icon: 'fas fa-heart' },
    { title: 'Reiseangebote', source: 'Reisen', icon: 'fas fa-suitcase' }
  ];

  newsGrid.innerHTML = '';
  news.forEach(item => {
    const newsEl = document.createElement('div');
    newsEl.className = 'news-item';
    newsEl.innerHTML = `
      <i class="${item.icon}"></i>
      <h3>${item.title}</h3>
      <small>${item.source}</small>
    `;
    newsEl.addEventListener('click', incrementClickCount);
    newsGrid.appendChild(newsEl);
  });
}

// Statistik-Funktionen
function incrementClickCount() {
  clickCount++;
  document.getElementById('click-count').textContent = clickCount;
}

function incrementSearchCount() {
  searchCount++;
  document.getElementById('search-count').textContent = searchCount;
}

function updateTimeSpent() {
  const minutes = Math.floor((Date.now() - startTime) / 60000);
  document.getElementById('time-spent').textContent = minutes;
}

// Einstellungen speichern
function saveConfig() {
  localStorage.setItem(cfgKey, JSON.stringify(cfg));
  applyConfig();
}

// Event-Listener
document.getElementById('settings-btn').addEventListener('click', () => {
  settingsModal.classList.remove('hidden');
});

document.getElementById('settings-close').addEventListener('click', () => {
  settingsModal.classList.add('hidden');
});

document.getElementById('reset-settings').addEventListener('click', () => {
  cfg = {...DEFAULT};
  saveConfig();
});

document.getElementById('theme-select').addEventListener('change', (e) => {
  cfg.theme = e.target.value;
  saveConfig();
});

document.getElementById('font-select').addEventListener('change', (e) => {
  cfg.font = e.target.value;
  saveConfig();
});

document.getElementById('blur-range').addEventListener('input', (e) => {
  cfg.blur = e.target.value;
  document.getElementById('blur-value').textContent = `${cfg.blur}px`;
  saveConfig();
});

document.getElementById('particles-toggle').addEventListener('change', (e) => {
  cfg.particles = e.target.checked;
  saveConfig();
});

document.querySelectorAll('.modal-body input[type="checkbox"][data-section]').forEach(checkbox => {
  checkbox.addEventListener('change', (e) => {
    const section = e.target.dataset.section;
    cfg.sections[section] = e.target.checked;
    saveConfig();
  });
});

document.querySelector('.search-bar button').addEventListener('click', () => {
  if (searchInput.value.trim()) {
    incrementSearchCount();
    window.open(`https://google.com/search?q=${encodeURIComponent(searchInput.value)}`, '_blank');
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && searchInput.value.trim()) {
    incrementSearchCount();
    window.open(`https://google.com/search?q=${encodeURIComponent(searchInput.value)}`, '_blank');
  }
});

document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', incrementClickCount);
});

// Initialisierung
setInterval(updateTime, 1000);
setInterval(updateTimeSpent, 60000);
updateTime();
applyConfig();

// Partikel-Effekt (Platzhalter)
if (cfg.particles) {
  console.log("Partikel-Effekt aktiviert");
}
