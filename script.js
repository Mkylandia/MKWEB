// script.js - MKWEB 3.0 - The Ultimate Animated Dashboard

// Initial settings load or default to 'dark'
const settings = JSON.parse(localStorage.getItem('mkweb-settings')) || {
  theme: 'dark',
  avatarHidden: false,
  searchCount: 0,
  timeSpent: 0, // in seconds
  clickCount: 0
};

// --- Theme Management ---
const body = document.body;
const themePicker = document.getElementById('theme-picker');

const applyTheme = (theme) => {
  body.dataset.theme = theme;
  themePicker.value = theme;
  settings.theme = theme;
  saveSettings();
};

themePicker.addEventListener('change', (e) => {
  applyTheme(e.target.value);
});

// Apply initial theme
applyTheme(settings.theme);

// --- Fullscreen Toggle ---
const fullscreenBtn = document.getElementById('fullscreen-btn');
fullscreenBtn.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
});

// --- User Avatar Toggle ---
const userAvatarToggleBtn = document.getElementById('user-avatar-toggle');
const userAvatar = document.getElementById('user-avatar');

const toggleAvatarVisibility = () => {
  settings.avatarHidden = !settings.avatarHidden;
  userAvatar.classList.toggle('hidden', settings.avatarHidden);
  userAvatarToggleBtn.textContent = settings.avatarHidden ? '👀 Avatar einblenden' : '🙈 Avatar ausblenden';
  saveSettings();
};

userAvatarToggleBtn.addEventListener('click', toggleAvatarVisibility);

// Apply initial avatar visibility
userAvatar.classList.toggle('hidden', settings.avatarHidden);
userAvatarToggleBtn.textContent = settings.avatarHidden ? '👀 Avatar einblenden' : '🙈 Avatar ausblenden';


// --- Search Functionality ---
const searchInput = document.getElementById('search');
const searchEngines = document.querySelectorAll('.search-engine');
let activeSearchEngine = document.querySelector('.search-engine.active')?.dataset.engine || 'google';

const searchEnginesMap = {
  google: 'https://www.google.com/search?q=',
  yandex: 'https://yandex.com/search/?text=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  youtube: 'https://www.youtube.com/results?search_query=',
  github: 'https://github.com/search?q='
};

searchEngines.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    searchEngines.forEach(btn => btn.classList.remove('active'));
    // Add active class to the clicked button
    button.classList.add('active');
    activeSearchEngine = button.dataset.engine;
  });
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) {
      window.open(searchEnginesMap[activeSearchEngine] + encodeURIComponent(query), '_blank');
      settings.searchCount++;
      updateStats();
      searchInput.value = ''; // Clear input after search
    }
  }
});

// --- Time and Date Display ---
const timeDisplay = document.getElementById('time');
const dateDisplay = document.getElementById('date');

const updateDateTime = () => {
  const now = new Date();
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  timeDisplay.textContent = now.toLocaleTimeString('de-DE', timeOptions);
  dateDisplay.textContent = now.toLocaleDateString('de-DE', dateOptions);
};

setInterval(updateDateTime, 1000); // Update every second
updateDateTime(); // Initial call

// --- Weather Widget (Simulated) ---
const weatherText = document.getElementById('weather-text');
const weatherLocation = document.getElementById('weather-location');
const weatherIcon = document.querySelector('.weather-icon');

const weatherConditions = [
  { text: 'Sonnig', icon: '☀️' },
  { text: 'Leicht bewölkt', icon: '🌤️' },
  { text: 'Bewölkt', icon: '☁️' },
  { text: 'Regen', icon: '🌧️' },
  { text: 'Sturm', icon: '⛈️' },
  { text: 'Schnee', icon: '❄️' },
  { text: 'Nebel', icon: '🌫️' }
];

const simulateWeather = () => {
  const temp = Math.floor(Math.random() * (30 - 5 + 1)) + 5; // Temp between 5°C and 30°C
  const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  const location = 'Heidenheim'; // Based on your current location

  weatherText.textContent = `${temp}°C ${condition.text}`;
  weatherIcon.textContent = condition.icon;
  weatherLocation.textContent = location;
};

// Simulate weather update every 5 minutes (300000 ms)
simulateWeather(); // Initial load
setInterval(simulateWeather, 300000);


// --- Quote of the Day ---
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

const quotes = [
  { text: "Der beste Weg, die Zukunft vorauszusagen, ist, sie zu erschaffen.", author: "Peter Drucker" },
  { text: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt.", author: "Mahatma Gandhi" },
  { text: "Das Leben ist das, was passiert, während du beschäftigt bist, andere Pläne zu schmieden.", author: "John Lennon" },
  { text: "Die größten Entdeckungen sind die, die man im Herzen macht.", author: "Jean de La Fontaine" },
  { text: "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.", author: "Bertolt Brecht" },
  { text: "Die Logik bringt dich von A nach B. Deine Vorstellungskraft bringt dich überall hin.", author: "Albert Einstein" },
  { text: "Es ist nicht genug zu wissen, man muss es auch anwenden. Es ist nicht genug zu wollen, man muss es auch tun.", author: "Johann Wolfgang von Goethe" }
];

const displayRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteText.textContent = `"${quote.text}"`;
  quoteAuthor.textContent = `– ${quote.author}`;
};

displayRandomQuote(); // Initial quote
// Optional: Update quote periodically (e.g., every hour)
// setInterval(displayRandomQuote, 3600000);


// --- Statistics Panel ---
const searchCountSpan = document.getElementById('search-count');
const timeSpentSpan = document.getElementById('time-spent');
const clickCountSpan = document.getElementById('click-count');

const updateStats = () => {
  searchCountSpan.textContent = settings.searchCount;
  timeSpentSpan.textContent = Math.floor(settings.timeSpent / 60); // Display in minutes
  clickCountSpan.textContent = settings.clickCount;
  saveSettings();
};

// Increment time spent every minute
setInterval(() => {
  settings.timeSpent += 60; // Add 60 seconds (1 minute)
  updateStats();
}, 60000);

// Increment click count on relevant elements
document.addEventListener('click', (e) => {
  // Only count clicks on interactive elements that lead somewhere
  if (e.target.closest('a') || e.target.closest('button')) {
    settings.clickCount++;
    updateStats();
  }
});

updateStats(); // Initial update of stats

// --- Settings Save Function ---
function saveSettings() {
  localStorage.setItem('mkweb-settings', JSON.stringify(settings));
}


// --- Element Animation on Load/Scroll ---
const animateOnScroll = () => {
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);

  // Observe all sections and action cards
  document.querySelectorAll('.glass, .action-card').forEach(element => {
    observer.observe(element);
  });
};

document.addEventListener('DOMContentLoaded', animateOnScroll);
