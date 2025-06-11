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
    particlesEnabled: !particleSettings.paused,
    todos: todos
  };
  try {
    localStorage.setItem('mkweb-settings', JSON.stringify(settings));
  } catch(e) {}
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem('mkweb-settings') || '{}');
  } catch(e) {
    return {};
  }
}

// — Enhanced Clock —
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
function updateClock() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString('de-DE', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  dateEl.textContent = now.toLocaleDateString('de-DE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}
setInterval(updateClock, 1000);
updateClock();

// — Multi-Engine Search —
const searchEl = document.getElementById('search');
const suggList = document.getElementById('suggestions');
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

const searchTerms = [
  'Google','YouTube','GitHub','Wikipedia','Reddit','StackOverflow',
  'Amazon','Netflix','Spotify','Twitter','Instagram','Facebook',
  'WhatsApp','Telegram','Discord','Twitch','TikTok','LinkedIn'
];

searchEl.addEventListener('input', () => {
  const query = searchEl.value.trim().toLowerCase();
  suggList.innerHTML = '';
  if (!query) {
    suggList.classList.remove('visible');
    return;
  }
  const matches = searchTerms.filter(term => term.toLowerCase().includes(query)).slice(0,5);
  matches.forEach(term => {
    const li = document.createElement('li');
    li.textContent = term;
    li.onclick = () => {
      searchEl.value = term;
      performSearch(term);
    };
    suggList.appendChild(li);
  });
  suggList.classList.toggle('visible', matches.length>0);
});

function performSearch(query) {
  if (!query.trim()) return;
  window.open(searchEngines[currentEngine] + encodeURIComponent(query), '_blank');
  suggList.classList.remove('visible');
}

searchEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') performSearch(searchEl.value);
  if (e.key === 'Escape') {
    suggList.classList.remove('visible');
    searchEl.blur();
  }
});

// — Todo System —
let todos = [];
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const addTodoBtn = document.getElementById('add-todo');
const clearTodosBtn = document.getElementById('clear-todos');

function loadTodos() {
  const settings = loadSettings();
  todos = settings.todos || [];
  renderTodos();
}
function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo,index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed?'completed':''}`;
    li.innerHTML = `
      <input type="checkbox" ${todo.completed?'checked':''} onchange="toggleTodo(${index})">
      <span>${todo.text}</span>
      <button onclick="deleteTodo(${index})" style="margin-left:auto;background:none;border:none;color:var(--accent);cursor:pointer;">❌</button>
    `;
    todoList.appendChild(li);
  });
}
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ text, completed: false, id: Date.now() });
  todoInput.value = '';
  renderTodos();
  saveSettings();
}
window.toggleTodo = function(index) {
  todos[index].completed = !todos[index].completed;
  renderTodos();
  saveSettings();
};
window.deleteTodo = function(index) {
  todos.splice(index,1);
  renderTodos();
  saveSettings();
};
function clearTodos() {
  if (confirm('Alle Aufgaben löschen?')) {
    todos = [];
    renderTodos();
    saveSettings();
  }
}
addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', e => { if (e.key==='Enter') addTodo(); });
clearTodosBtn.addEventListener('click', clearTodos);

// — Enhanced Particle System —
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleSettings = { count:80, speed:0.3, size:{min:1,max:3}, paused:false };

function initParticles() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = Array.from({length:particleSettings.count},() => ({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*(particleSettings.size.max-particleSettings.size.min)+particleSettings.size.min,
    dx: (Math.random()-0.5)*particleSettings.speed,
    dy: (Math.random()-0.5)*particleSettings.speed,
    opacity: Math.random()*0.3+0.1
  }));
}

function animateParticles() {
  if (particleSettings.paused) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x<=0||p.x>=canvas.width) p.dx*=-1;
    if (p.y<=0||p.y>=canvas.height) p.dy*=-1;
    p.x = Math.max(0,Math.min(canvas.width,p.x));
    p.y = Math.max(0,Math.min(canvas.height,p.y));
  });
  requestAnimationFrame(animateParticles);
}

document.getElementById('toggle-particles').addEventListener('click', function(){
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async pos => {
        const {latitude, longitude} = pos.coords;
        try {
          const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY&units=metric&lang=de`);
          if (!resp.ok) throw new Error();
          const data = await resp.json();
          const temp = Math.round(data.main.temp);
          const desc = data.weather[0].description;
          const icon = getWeatherIcon(data.weather[0].icon);
          weatherIcon.textContent = icon;
          weatherText.textContent = `${temp}°C, ${desc}`;
        } catch {
          showSimulatedWeather();
        }
      }, showSimulatedWeather);
    } else {
      showSimulatedWeather();
    }
  } catch {
    showSimulatedWeather();
  }
}

function showSimulatedWeather() {
  const weatherText = document.getElementById('weather-text');
  const weatherIcon = document.querySelector('.weather-icon');
  const weathers = [
    { icon:'☀️', temp:22, desc:'Sonnig' },
    { icon:'⛅', temp:18, desc:'Bewölkt' },
    { icon:'🌤️', temp:20, desc:'Teilweise bewölkt' },
    { icon:'🌧️', temp:15, desc:'Regnerisch' },
    { icon:'❄️', temp:2,  desc:'Schnee' }
  ];
  const w = weathers[Math.floor(Math.random()*weathers.length)];
  weatherIcon.textContent = w.icon;
  weatherText.textContent = `${w.temp}°C, ${w.desc}`;
}

function getWeatherIcon(code) {
  const map = {
    '01d':'☀️','01n':'🌙','02d':'🌤️','02n':'🌙','03d':'⛅','03n':'☁️',
    '04d':'☁️','04n':'☁️','09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌧️',
    '11d':'⛈️','11n':'⛈️','13d':'❄️','13n':'❄️','50d':'🌫️','50n':'🌫️'
  };
  return map[code]||'🌤️';
}

// — Keyboard Shortcuts —
document.addEventListener('keydown', e => {
  if (e.key==='/' && document.activeElement!==searchEl) {
    e.preventDefault();
    searchEl.focus(); searchEl.select();
  }
  if (e.ctrlKey && e.key==='t') {
    e.preventDefault();
    const themes = ['ocean','sunset','forest','midnight','aurora','cyberpunk'];
    const idx = themes.indexOf(body.dataset.theme);
    const next = themes[(idx+1)%themes.length];
    picker.value = next; body.dataset.theme = next; saveSettings();
  }
  if (e.ctrlKey && e.key==='p') {
    e.preventDefault(); document.getElementById('toggle-particles').click();
  }
});

// — Random Greeting —
function showGreeting() {
  const hour = new Date().getHours();
  let greeting = '';
  if (hour<6) greeting='🌙 Gute Nacht';
  else if (hour<12) greeting='🌅 Guten Morgen';
  else if (hour<17) greeting='☀️ Guten Tag';
  else if (hour<22) greeting='🌆 Guten Abend';
  else greeting='🌙 Gute Nacht';
  const el = document.createElement('div');
  el.textContent = greeting;
  el.style.cssText = `
    position: fixed; top:20px; right:20px;
    background: var(--glass-bg); backdrop-filter: blur(10px);
    padding:0.8rem 1.2rem; border-radius:25px;
    border:1px solid var(--glass-border);
    font-size:1rem; font-weight:600;
    opacity:0; transform: translateY(-10px);
    transition: all 0.5s ease; pointer-events:none; z-index:1000;
  `;
  document.body.appendChild(el);
  setTimeout(()=>{ el.style.opacity='1'; el.style.transform='translateY(0)'; },100);
  setTimeout(()=>{
    el.style.opacity='0'; el.style.transform='translateY(-10px)';
    setTimeout(()=>el.remove(),500);
  },3000);
}

// — Productivity Stats —
let stats = { searchCount:0, todosCompleted:0, timeSpent:0, lastVisit:Date.now() };
function loadStats() {
  try {
    const s = localStorage.getItem('mkweb-stats');
    if (s) stats = {...stats, ...JSON.parse(s)};
  } catch {}
}
function saveStats() { try { localStorage.setItem('mkweb-stats', JSON.stringify(stats)); } catch {} }
function updateStats(type) { stats[type]++; saveStats(); }

// Track search completions
const origSearch = performSearch;
performSearch = function(q) { updateStats('searchCount'); origSearch(q); };

// Track todo completions
const origToggle = window.toggleTodo;
window.toggleTodo = function(i) {
  if (!todos[i].completed) updateStats('todosCompleted');
  origToggle(i);
};

// — Advanced Animations —
function addAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('fade-in-up'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.action-card, .news-card, .todo-widget').forEach(el => obs.observe(el));
}

// — Easter Egg (Konami Code) —
let konamiCode = [];
const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
document.addEventListener('keydown', e => {
  konamiCode.push(e.code);
  if (konamiCode.length>konamiSeq.length) konamiCode.shift();
  if (konamiCode.join(',')===konamiSeq.join(',')) {
    activateRainbowMode(); konamiCode = [];
  }
});
function activateRainbowMode() {
  const style = document.createElement('style');
  style.textContent = `*{animation:rainbow 2s infinite linear!important}@keyframes rainbow{0%{filter:hue-rotate(0deg);}100%{filter:hue-rotate(360deg);}}`;
  document.head.appendChild(style);
  setTimeout(()=>style.remove(),10000);
  const msg = document.createElement('div');
  msg.textContent = '🌈 RAINBOW MODE ACTIVATED! 🌈';
  msg.style.cssText = `
    position: fixed; top:50%; left:50%; transform:translate(-50%,-50%);
    background: var(--glass-bg); backdrop-filter: blur(15px);
    padding:2rem; border-radius:20px; font-size:1.5rem;
    font-weight:bold; text-align:center; z-index:10000;
    border:2px solid var(--accent);
  `;
  document.body.appendChild(msg);
  setTimeout(()=>msg.remove(),3000);
}

// — Tooltips —
function addTooltips() {
  const tooltips = {
    'toggle-particles': 'Partikel ein/ausschalten (Strg+P)',
    'theme-picker': 'Theme wechseln (Strg+T)',
    'search': 'Suche fokussieren mit "/" Taste'
  };
  Object.entries(tooltips).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.title = text;
  });
}
document.addEventListener('DOMContentLoaded', addTooltips);

// — Initialization —
window.addEventListener('resize', initParticles);
window.addEventListener('load', () => {
  const settings = loadSettings();
  if (settings.particlesEnabled===false) {
    particleSettings.paused = true;
    document.getElementById('toggle-particles').textContent = '▶️ Partikel';
  }
  loadTodos();
  loadStats();
  initParticles();
  animateParticles();
  updateWeather();
  addAnimations();
  setTimeout(showGreeting, 1000);
  setInterval(updateWeather, 600000);
  // Track time spent
  const start = Date.now();
  window.addEventListener('beforeunload', () => {
    stats.timeSpent += Date.now() - start;
    saveStats();
  });
  console.log('🚀 MKWEB 2.0 loaded successfully!');
  console.log('💡 Shortcuts: "/" - Search, Ctrl+T - Theme, Ctrl+P - Partikel, Konami Code - Rainbow');
});
