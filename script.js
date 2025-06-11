// Theme Toggle
const body = document.body;
const toggle = document.getElementById('theme-toggle');
const saved = localStorage.getItem('mkweb-theme') || 'dark';
body.classList.add(saved);
toggle.addEventListener('click', () => {
  const next = body.classList.contains('dark') ? 'light' : 'dark';
  body.classList.replace(saved, next);
  localStorage.setItem('mkweb-theme', next);
});

// Live-Zeit und Datum
const timeEl = document.getElementById('time');
function updateTime() {
  const now = new Date();
  timeEl.textContent = now.toLocaleDateString('de-DE', {
    weekday: 'short', day: '2-digit', month: 'short'
  }) + ' • ' + now.toLocaleTimeString('de-DE');
}
setInterval(updateTime, 1000);
updateTime();

// Autocomplete-Suche
const search = document.getElementById('search');
const suggBox = document.getElementById('suggestions');
const terms = ['Google','YouTube','GitHub','Wikipedia','Reddit','StackOverflow'];
search.addEventListener('input', () => {
  const v = search.value.trim().toLowerCase();
  suggBox.innerHTML = '';
  if (!v) return suggBox.classList.remove('visible');
  terms.filter(t => t.toLowerCase().includes(v))
       .forEach(t => {
         const li = document.createElement('li');
         li.textContent = t;
         li.onclick = () => window.location.href = `https://www.google.com/search?q=${encodeURIComponent(t)}`;
         suggBox.append(li);
       });
  suggBox.classList.toggle('visible', suggBox.childElementCount > 0);
});
search.addEventListener('keydown', e => {
  if (e.key === 'Enter' && search.value) {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(search.value)}`;
  }
});
