// === Enhanced MKWEB 2.0 JavaScript ===

// Core Settings & State Management
class SettingsManager {
  constructor() {
    this.defaultSettings = {
      theme: 'ocean',
      particlesEnabled: true,
      searchEngine: 'google'
    };
    this.settings = this.loadSettings();
  }

  loadSettings() {
    return JSON.parse(localStorage.getItem('mkweb-settings') || '{}') || this.defaultSettings;
  }

  saveSettings() {
    localStorage.setItem('mkweb-settings', JSON.stringify(this.settings));
  }

  get(key) { return this.settings[key]; }
  set(key, value) { this.settings[key] = value; this.saveSettings(); }
}

// Statistics Manager
class StatsManager {
  constructor() {
    this.stats = this.loadStats();
    this.startTime = Date.now();
    this.currentSessionTime = 0;
    setInterval(() => {
      this.currentSessionTime = Math.floor((Date.now() - this.startTime) / 1000);
      this.updateDisplay();
    }, 1000);
  }

  loadStats() {
    return JSON.parse(localStorage.getItem('mkweb-stats') || '{"searchCount":0,"timeSpent":0,"clickCount":0}') || { searchCount: 0, timeSpent: 0, clickCount: 0 };
  }

  saveStats() { localStorage.setItem('mkweb-stats', JSON.stringify(this.stats)); }

  increment(stat) { this.stats[stat]++; this.saveStats(); this.updateDisplay(); }

  setupTracking() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.action-card') || e.target.closest('.news-card')) this.increment('clickCount');
    });
    window.addEventListener('beforeunload', () => {
      this.stats.timeSpent += this.currentSessionTime;
      this.saveStats();
    });
  }

  updateDisplay() {
    document.getElementById('search-count').textContent = this.stats.searchCount;
    document.getElementById('click-count').textContent = this.stats.clickCount;
    const totalTimeSpent = this.stats.timeSpent + this.currentSessionTime;
    const minutes = Math.floor(totalTimeSpent / 60);
    document.getElementById('time-spent').textContent = `${minutes}min`;
  }
}

const settingsManager = new SettingsManager();
const statsManager = new StatsManager();
statsManager.setupTracking();

// Theme Picker
const picker = document.getElementById('theme-picker');
const body = document.body;
picker.value = settingsManager.get('theme');
body.dataset.theme = settingsManager.get('theme');
picker.addEventListener('change', () => {
  body.dataset.theme = picker.value;
  settingsManager.set('theme', picker.value);
});

// Particle System
const particleSettings = { count: 80, speed: 0.3, size: { min: 1, max: 3 }, paused: !settingsManager.get('particlesEnabled') };
const toggleParticlesBtn = document.getElementById('toggle-particles');
toggleParticlesBtn.textContent = particleSettings.paused ? '▶️ Partikel' : '⏸️ Partikel';
toggleParticlesBtn.addEventListener('click', () => {
  particleSettings.paused = !particleSettings.paused;
  toggleParticlesBtn.textContent = particleSettings.paused ? '▶️ Partikel' : '⏸️ Partikel';
  if (!particleSettings.paused) animateParticles();
  settingsManager.set('particlesEnabled', !particleSettings.paused);
});

// Fullscreen Button
document.getElementById('fullscreen-btn').addEventListener('click', function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    this.textContent = '🔳 Vollbild beenden';
  } else {
    document.exitFullscreen();
    this.textContent = '🔳 Vollbild';
  }
});

// Search Functionality
const searchEl = document.getElementById('search');
const suggList = document.getElementById('suggestions');
const searchEngines = {
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  youtube: 'https://www.youtube.com/results?search_query=',
  github: 'https://github.com/search?q='
};
let currentEngine = 'google';

document.querySelectorAll('.search-engine').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.search-engine').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentEngine = btn.dataset.engine;
    searchEl.placeholder = `Suche auf ${btn.textContent}...`;
  });
});

const searchTerms = ['Google', 'YouTube', 'GitHub', 'Wikipedia', 'Reddit', 'StackOverflow', 'Amazon', 'Netflix', 'Spotify'];
searchEl.addEventListener('input', () => {
  const query = searchEl.value.trim().toLowerCase();
  suggList.innerHTML = '';
  if (!query) return suggList.classList.remove('visible');
  const matches = searchTerms.filter(term => term.toLowerCase().includes(query)).slice(0, 5);
  matches.forEach(term => {
    const li = document.createElement('li');
    li.textContent = term;
    li.onclick = () => { searchEl.value = term; performSearch(term); };
    suggList.appendChild(li);
  });
  suggList.classList.toggle('visible', matches.length > 0);
});

function performSearch(query) {
  if (!query.trim()) return;
  statsManager.increment('searchCount');
  window.open(searchEngines[currentEngine] + encodeURIComponent(query), '_blank');
  suggList.classList.remove('visible');
}

searchEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') performSearch(searchEl.value);
});

// Clock
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
function updateClock() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  dateEl.textContent = now.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateClock, 1000);
updateClock();

// Particle Animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initParticles() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = Array.from({ length: particleSettings.count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * (particleSettings.size.max - particleSettings.size.min) + particleSettings.size.min,
    dx: (Math.random() - 0.5) * particleSettings.speed,
    dy: (Math.random() - 0.5) * particleSettings.speed,
    opacity: Math.random() * 0.3 + 0.1
  }));
}

function animateParticles() {
  if (particleSettings.paused) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x <= 0 || p.x >= canvas.width) p.dx *= -1;
    if (p.y <= 0 || p.y >= canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
if (!particleSettings.paused) animateParticles();

// Weather Widget (Simulated)
async function updateWeather() {
  const weatherText = document.getElementById('weather-text');
  const weatherIcon = document.querySelector('.weather-icon');
  const weathers = [
    { icon: '☀️', temp: 22, desc: 'Sonnig' },
    { icon: '⛅', temp: 18, desc: 'Bewölkt' },
    { icon: '🌧️', temp: 15, desc: 'Regnerisch' }
  ];
  const w = weathers[Math.floor(Math.random() * weathers.length)];
  weatherIcon.textContent = w.icon;
  weatherText.textContent = `${w.temp}°C, ${w.desc}`;
}
updateWeather();
