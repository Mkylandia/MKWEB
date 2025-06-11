// — Settings Management —
function loadSettings() { /* … */ }
function saveSettings() { /* … */ }

// — Theme Picker —
const picker = document.getElementById('theme-picker'),
      body   = document.body;
let settings = loadSettings();
picker.value = settings.theme || 'ocean';
body.dataset.theme = picker.value;
picker.addEventListener('change', ()=>{ /* fade + set theme + save */ });

// — Clock & Date —
function updateClock() { /* Zeit & Datum aktualisieren */ }
setInterval(updateClock,1000); updateClock();
document.getElementById('search').addEventListener('focus', ()=>{/* fade Uhr*/});
document.getElementById('search').addEventListener('blur', ()=>{/* restore Uhr*/});

// — Multi-Engine Search & Autocomplete —
// (searchEngines-Objekt, event listener, performSearch, suggestions…)

// — ToDo System —
// (loadTodos, renderTodos, addTodo, toggleTodo, deleteTodo, clearTodos…)

// — Particle System —
// (initParticles, animateParticles, toggle via button & save…)

// — Weather Widget —
// (updateWeather mit Geolocation & Fallback, getWeatherIcon, showSimulatedWeather…)

// — News Fetch —
// Option: statisch per Hand in HTML, oder dynamisch via fetch(RSS/API) ins #news-grid

// — Keyboard Shortcuts —
// (‘/’ fokussiert Suche, Strg+T Theme, Strg+P Partikel…)

// — Easter-Egg (Konami Code) —
// (Konami-Sequenz abfangen, rainbow-Mode…)

// — IntersectionObserver für fade-in-up —

// — Random Greeting —

// — Productivity Stats Tracking —

// — Tooltips —

// — Initialization —
function init() {
  /* loadSettings, loadTodos, loadStats,
     initParticles, animateParticles,
     updateWeather(), addAnimations(),
     showGreeting(), set intervals… */
}
window.addEventListener('load', init);
window.addEventListener('resize', ()=>{ /* initParticles() */ });
