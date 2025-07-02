// main.js - Lightweight MKWEB OS 7 UI logic

// === Clock & Date ===
function updateTime() {
  const now = new Date();
  // Format: HH:MM
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // Format: Mittwoch, 2. Juli 2025
  const date = now.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const timeEl = document.getElementById('time');
  const dateEl = document.getElementById('date');
  if (timeEl) timeEl.textContent = time;
  if (dateEl) dateEl.textContent = date;
}

// Initial + auto update every minute
updateTime();
setInterval(updateTime, 1000 * 10);

// === Search Engine Switcher ===
document.querySelectorAll('.search-engine').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.search-engine').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    // Optionally: change search placeholder or logic per engine
    const engine = this.getAttribute('data-engine');
    const searchInput = document.getElementById('search');
    if (searchInput) {
      switch (engine) {
        case 'google':
          searchInput.placeholder = "Google durchsuchen...";
          break;
        case 'bing':
          searchInput.placeholder = "Bing durchsuchen...";
          break;
        case 'duckduckgo':
          searchInput.placeholder = "DuckDuckGo durchsuchen...";
          break;
        default:
          searchInput.placeholder = "Suche...";
      }
    }
  });
});

// === Search Box: Submit to selected search engine ===
document.querySelector('.search-box')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const q = document.getElementById('search')?.value.trim();
  if (!q) return;
  const engine = document.querySelector('.search-engine.active')?.getAttribute('data-engine') || 'google';
  let url = '';
  if (engine === 'google') url = 'https://www.google.com/search?q=' + encodeURIComponent(q);
  if (engine === 'bing') url = 'https://www.bing.com/search?q=' + encodeURIComponent(q);
  if (engine === 'duckduckgo') url = 'https://duckduckgo.com/?q=' + encodeURIComponent(q);
  if (url) window.open(url, '_blank');
});

// === Quote Section: Random Quote (static for lightweight) ===
const quotes = [
  { text: "Eleganz ist die Balance von Proportion, Emotion und Überraschung.", author: "Valentino Garavani" },
  { text: "Die Zukunft gehört denen, die an die Schönheit ihrer Träume glauben.", author: "Eleanor Roosevelt" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Weniger ist mehr.", author: "Ludwig Mies van der Rohe" }
];
function showRandomQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  const textEl = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  if (textEl) textEl.textContent = q.text;
  if (authorEl) authorEl.textContent = q.author;
}
showRandomQuote();

// === Apps: Card Click (open link) ===
document.querySelectorAll('.app-card[data-url]').forEach(card => {
  card.addEventListener('click', function () {
    const url = card.getAttribute('data-url');
    if (url) window.open(url, '_blank');
  });
});

// === Weather Button (example: open wetter.com) ===
document.querySelector('.weather-link-button')?.addEventListener('click', function (e) {
  e.preventDefault();
  window.open('https://www.wetter.com/', '_blank');
});
