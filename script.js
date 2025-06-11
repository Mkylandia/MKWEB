// script.js
const settings = JSON.parse(localStorage?.getItem('mkweb-settings')) || {theme: 'neon'};
const save = () => localStorage?.setItem('mkweb-settings', JSON.stringify(settings));

document.body.dataset.theme = settings.theme;
document.getElementById('theme-picker').value = settings.theme;

document.getElementById('theme-picker').onchange = e => {
  settings.theme = e.target.value;
  document.body.dataset.theme = e.target.value;
  save();
};

document.getElementById('fullscreen-btn').onclick = () => {
  document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
};

const search = document.getElementById('search');
const engines = document.querySelectorAll('.search-engine');
let activeEngine = 'google';

engines.forEach(btn => {
  btn.onclick = () => {
    engines.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeEngine = btn.dataset.engine;
  };
});

const doSearch = query => {
  const urls = {
    google: `https://google.com/search?q=${encodeURIComponent(query)}`,
    bing: `https://bing.com/search?q=${encodeURIComponent(query)}`,
    duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
    youtube: `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
    github: `https://github.com/search?q=${encodeURIComponent(query)}`
  };
  open(urls[activeEngine], '_blank');
  updateStats('search');
};

search.onkeydown = e => e.key === 'Enter' && doSearch(search.value);

const updateClock = () => {
  const now = new Date();
  document.getElementById('time').textContent = now.toLocaleTimeString('de-DE');
  document.getElementById('date').textContent = now.toLocaleDateString('de-DE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};
setInterval(updateClock, 1000);
updateClock();

let stats = {searches: 0, clicks: 0, startTime: Date.now()};
const updateStats = type => {
  if (type === 'search') stats.searches++;
  if (type === 'click') stats.clicks++;
  document.getElementById('search-count').textContent = stats.searches;
  document.getElementById('click-count').textContent = stats.clicks;
  document.getElementById('time-spent').textContent = Math.round((Date.now() - stats.startTime) / 60000);
};

document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.onclick = () => updateStats('click');
});
