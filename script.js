// — Settings Management —
function loadSettings() { /* … aus localStorage … */ }
function saveSettings() { /* … in localStorage … */ }

// — Theme Picker —
const picker = document.getElementById('theme-picker'),
      body   = document.body;
let settings = loadSettings();
picker.value = settings.theme || 'ocean';
body.dataset.theme = picker.value;
picker.addEventListener('change', () => {
  body.style.opacity = 0.8;
  setTimeout(() => {
    body.dataset.theme = picker.value;
    saveSettings();
    body.style.opacity = 1;
  }, 200);
});

// — Clock & Date —
const timeEl   = document.getElementById('time'),
      dateEl   = document.getElementById('date'),
      searchEl = document.getElementById('search');
function updateClock() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString('de-DE', { hour:'2-digit',minute:'2-digit',second:'2-digit' });
  dateEl.textContent = now.toLocaleDateString('de-DE', { weekday:'long',year:'numeric',month:'long',day:'numeric' });
}
setInterval(updateClock,1000);
updateClock();
searchEl.addEventListener('focus', ()=>{ timeEl.classList.add('faded'); dateEl.classList.add('faded'); });
searchEl.addEventListener('blur',  ()=>{ timeEl.classList.remove('faded'); dateEl.classList.remove('faded'); });

// — Multi-Engine Search & Autocomplete —
// Definiere searchEngines-Objekt, eventListener auf Buttons, performSearch(), suggestions…

// — ToDo System —
// loadTodos(), renderTodos(), addTodo(), toggleTodo(), deleteTodo(), clearTodos()

// — Particle System —
// initParticles(), animateParticles(), toggle per Button…

// — Weather Widget —
// updateWeather() mit Geolocation & fallback showSimulatedWeather(), getWeatherIcon()

// — News Fetch —
// Dynamisch per Fetch API in #news-grid laden oder statisch befüllen

// — Keyboard Shortcuts —
// „/“ → fokus Suche, Strg+T → Theme wechseln, Strg+P → Partikel toggle

// — Easter Egg (Konami Code) —
// Abfangen der Sequenz, activateRainbowMode()

// — IntersectionObserver für fade-in-up —

// — Random Greeting —

// — Productivity Stats Tracking —

// — Tooltips —

// — Initialization —
function init() {
  const cfg = loadSettings();
  if (cfg.particlesEnabled===false) particleSettings.paused = true;
  loadTodos();
  loadStats();
  initParticles();
  animateParticles();
  updateWeather();
  addAnimations();
  setTimeout(showGreeting,1000);
  setInterval(updateWeather,600000);
  window.addEventListener('beforeunload', ()=>{
    stats.timeSpent += Date.now()-startTime;
    saveStats();
  });
}
window.addEventListener('resize', initParticles);
window.addEventListener('load', init);

