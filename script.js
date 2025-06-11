// — Enhanced Theme System —
const picker = document.getElementById('theme-picker');
const body = document.body;
let savedTheme = 'ocean';

// Load saved theme
try {
  savedTheme = JSON.parse(localStorage.getItem('mkweb-settings') || '{}').theme || 'ocean';
} catch(e) {}

picker.value = savedTheme;
body.dataset.theme = savedTheme;

picker.addEventListener('change', () => {
  body.style.opacity = 0.8;
  setTimeout(() => {
    body.dataset.theme = picker.value;
    saveSettings();
    body.style.opacity = 1;
  }, 200);
});

// — Settings Management —
function saveSettings() {
  const settings = {
    theme: picker.value,
    particlesEnabled: !particles.paused
  };
  try {
    localStorage.setItem('mkweb-settings', JSON.stringify(settings));
  } catch(e) {}
}

function loadSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem('mkweb-settings') || '{}');
    return settings;
  } catch(e) {
    return {};
  }
}

// — Enhanced Clock —
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const searchEl = document.getElementById('search');

function updateClock() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  dateEl.textContent = now.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
setInterval(updateClock, 1000);
updateClock();

searchEl.addEventListener('focus', () => {
  timeEl.classList.add('faded');
  dateEl.classList.add('faded');
});
searchEl.addEventListener('blur', () => {
  timeEl.classList.remove('faded');
  dateEl.classList.remove('faded');
});

// — Multi-Engine Search —
const searchEngines = {
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  youtube: 'https://www.youtube.com/results?search_query='
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

// — Enhanced Autocomplete —
const suggList = document.getElementById('suggestions');
const searchTerms = [
  'Google', 'YouTube', 'GitHub', 'Wikipedia', 'Reddit', 'StackOverflow',
  'Amazon', 'Netflix', 'Spotify', 'Twitter', 'Instagram', 'Facebook',
  'WhatsApp', 'Telegram', 'Discord', 'Twitch', 'TikTok', 'LinkedIn'
];

searchEl.addEventListener('input', () => {
  const query = searchEl.value.trim().toLowerCase();
  suggList.innerHTML = '';
  
  if (!query) {
    suggList.classList.remove('visible');
    return;
  }
  
  const matches = searchTerms
    .filter(term => term.toLowerCase().includes(query))
    .slice(0, 5);
  
  matches.forEach(term => {
    const li = document.createElement('li');
    li.textContent = term;
    li.onclick = () => {
      searchEl.value = term;
      performSearch(term);
    };
    suggList.appendChild(li);
  });
  
  suggList.classList.toggle('visible', matches.length > 0);
});

function performSearch(query) {
  if (!query.trim()) return;
  window.open(searchEngines[currentEngine] + encodeURIComponent(query), '_blank');
  suggList.classList.remove('visible');
}

searchEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    performSearch(searchEl.value);
  }
  if (e.key === 'Escape') {
    suggList.classList.remove('visible');
    searchEl.blur();
  }
});

// — Enhanced Particle System —
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleSettings = {
  count: 80,
  speed: 0.3,
  size: { min: 1, max: 3 },
  paused: false
};

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
  
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
    ctx.fill();
    
    particle.x += particle.dx;
    particle.y += particle.dy;
    
    // Bounce off edges
    if (particle.x <= 0 || particle.x >= canvas.width) particle.dx *= -1;
    if (particle.y <= 0 || particle.y >= canvas.height) particle.dy *= -1;
    
    // Keep particles within bounds
    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
  });
  
  requestAnimationFrame(animateParticles);
}

// Particle toggle
document.getElementById('toggle-particles').addEventListener('click', function() {
  particleSettings.paused = !particleSettings.paused;
  this.textContent = particleSettings.paused ? '▶️ Partikel' : '⏸️ Partikel';
  if (!particleSettings.paused) animateParticles();
  saveSettings();
});

// — Weather Widget —
async function updateWeather() {
  try {
    const weatherText = document.getElementById('weather-text');
    const weatherIcon = document.querySelector('.weather-icon');
    
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Using OpenWeatherMap API (free tier)
          // Replace YOUR_API_KEY with actual key
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY&units=metric&lang=de`);
          
          if (!response.ok) throw new Error('Weather API unavailable');
          
          const data = await response.json();
          const temp = Math.round(data.main.temp);
          const description = data.weather[0].description;
          const icon = getWeatherIcon(data.weather[0].icon);
          
          weatherIcon.textContent = icon;
          weatherText.textContent = `${temp}°C, ${description}`;
        } catch (error) {
          // Fallback to simulated weather
          showSimulatedWeather();
        }
      }, showSimulatedWeather);
    } else {
      showSimulatedWeather();
    }
  } catch (error) {
    showSimulatedWeather();
  }
}

function showSimulatedWeather() {
  const weatherText = document.getElementById('weather-text');
  const weatherIcon = document.querySelector('.weather-icon');
  
  const weathers = [
    { icon: '☀️', temp: 22, desc: 'Sonnig' },
    { icon: '⛅', temp: 18, desc: 'Bewölkt' },
    { icon: '🌤️', temp: 20, desc: 'Teilweise bewölkt' },
    { icon: '🌧️', temp: 15, desc: 'Regnerisch' },
    { icon: '❄️', temp: 2, desc: 'Schnee' }
  ];
  
  const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
  weatherIcon.textContent = randomWeather.icon;
  weatherText.textContent = `${randomWeather.temp}°C, ${randomWeather.desc}`;
}

function getWeatherIcon(iconCode) {
  const iconMap = {
    '01d': '☀️', '01n': '🌙',
    '02d': '🌤️', '02n': '🌙',
    '03d': '⛅', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };
  return iconMap[iconCode] || '🌤️';
}

// — Keyboard Shortcuts —
document.addEventListener('keydown', (e) => {
  // Focus search with '/' key
  if (e.key === '/' && !e.ctrlKey && !e.altKey && document.activeElement !== searchEl) {
    e.preventDefault();
    searchEl.focus();
    searchEl.select();
  }
  
  // Quick theme switching with Ctrl+T
  if (e.ctrlKey && e.key === 't') {
    e.preventDefault();
    const themes = ['ocean', 'sunset', 'forest', 'midnight', 'aurora', 'cyberpunk'];
    const currentIndex = themes.indexOf(body.dataset.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    picker.value = nextTheme;
    body.dataset.theme = nextTheme;
    saveSettings();
  }
  
  // Toggle particles with Ctrl+P
  if (e.ctrlKey && e.key === 'p') {
    e.preventDefault();
    document.getElementById('toggle-particles').click();
  }
});

// — Random Greeting —
function showGreeting() {
  const hour = new Date().getHours();
  let greeting = '';
  
  if (hour < 6) greeting = '🌙 Gute Nacht';
  else if (hour < 12) greeting = '🌅 Guten Morgen';
  else if (hour < 17) greeting = '☀️ Guten Tag';
  else if (hour < 22) greeting = '🌆 Guten Abend';
  else greeting = '🌙 Gute Nacht';
  
  // Create temporary greeting element
  const greetingEl = document.createElement('div');
  greetingEl.textContent = greeting;
  greetingEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    padding: 0.8rem 1.2rem;
    border-radius: 25px;
    border: 1px solid var(--glass-border);
    font-size: 1rem;
    font-weight: 600;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.5s ease;
    pointer-events: none;
  `;
  
  document.body.appendChild(greetingEl);
  
  // Animate in
  setTimeout(() => {
    greetingEl.style.opacity = '1';
    greetingEl.style.transform = 'translateY(0)';
  }, 100);
  
  // Animate out
  setTimeout(() => {
    greetingEl.style.opacity = '0';
    greetingEl.style.transform = 'translateY(-10px)';
    setTimeout(() => greetingEl.remove(), 500);
  }, 3000);
}

// — Productivity Stats —
let stats = {
  searchCount: 0,
  timeSpent: 0,
  lastVisit: Date.now()
};

function loadStats() {
  try {
    const saved = localStorage.getItem('mkweb-stats');
    if (saved) {
      stats = { ...stats, ...JSON.parse(saved) };
    }
  } catch(e) {}
}

function saveStats() {
  try {
    localStorage.setItem('mkweb-stats', JSON.stringify(stats));
  } catch(e) {}
}

function updateStats(type) {
  stats[type]++;
  saveStats();
}

// — Advanced Animations —
function addAnimations() {
  // Add fade-in animation to cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.action-card, .news-card').forEach(el => {
    observer.observe(el);
  });
}

// — Easter Eggs —
let konamiCode = [];
const konamiSequence = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.code);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    activateRainbowMode();
    konamiCode = [];
  }
});

function activateRainbowMode() {
  const style = document.createElement('style');
  style.textContent = `
    * {
      animation: rainbow 2s infinite linear !important;
    }
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  setTimeout(() => style.remove(), 10000);
  
  // Show easter egg message
  const msg = document.createElement('div');
  msg.textContent = '🌈 RAINBOW MODE ACTIVATED! 🌈';
  msg.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--glass-bg);
    backdrop-filter: blur(15px);
    padding: 2rem;
    border-radius: 20px;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    z-index: 10000;
    border: 2px solid var(--accent);
  `;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}

// — Initialization —
function init() {
  // Load saved settings
  const settings = loadSettings();
  if (settings.particlesEnabled === false) {
    particleSettings.paused = true;
    document.getElementById('toggle-particles').textContent = '▶️ Partikel';
  }
  
  // Initialize systems
  loadStats();
  initParticles();
  animateParticles();
  updateWeather();
  addAnimations();
  
  // Show greeting after a short delay
  setTimeout(showGreeting, 1000);
  
  // Update weather every 10 minutes
  setInterval(updateWeather, 600000);
  
  // Track time spent
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    stats.timeSpent += Date.now() - startTime;
    saveStats();
  });
}

// — Event Listeners —
window.addEventListener('resize', initParticles);
window.addEventListener('load', init);

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    suggList.classList.remove('visible');
  }
});

// Enhanced search tracking
const originalPerformSearch = performSearch;
performSearch = function(query) {
  updateStats('searchCount');
  originalPerformSearch(query);
};

// Add some helpful tooltips
function addTooltips() {
  const tooltips = {
    'toggle-particles': 'Partikel ein/ausschalten (Strg+P)',
    'theme-picker': 'Theme wechseln (Strg+T)',
    'search': 'Suche fokussieren mit "/" Taste'
  };

  Object.entries(tooltips).forEach(([id, text]) => {
    const element = document.getElementById(id);
    if (element) {
      element.title = text;
    }
  });
}

// Add tooltips after DOM is ready
document.addEventListener('DOMContentLoaded', addTooltips);

console.log('🚀 MKWEB 2.0 loaded successfully!');
console.log('💡 Keyboard shortcuts:');
console.log('   "/" - Focus search');
console.log('   "Ctrl+T" - Switch theme');
console.log('   "Ctrl+P" - Toggle particles');
console.log('   "Konami Code" - Rainbow mode 🌈');
