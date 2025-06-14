// script.js - MKWEB OS 7: Enhanced Functionality & Animations (No Weather)
const settings = JSON.parse(localStorage?.getItem('mkweb-settings')) || {theme: 'dark', showAvatar: true, lastActiveEngine: 'google'};
const save = () => localStorage?.setItem('mkweb-settings', JSON.stringify(settings));

// Only 'dark' and 'light' are allowed themes
const allowedThemes = ['dark', 'light'];
if (!allowedThemes.includes(settings.theme)) {
    settings.theme = 'dark'; // Fallback if an invalid theme was saved
    save();
}

document.body.dataset.theme = settings.theme;
const themePicker = document.getElementById('theme-picker');

// Add only 'dark' and 'light' options and select current theme
themePicker.innerHTML = '';
const themes = [
    { value: 'dark', text: 'Dark Theme' },
    { value: 'light', text: 'Light Theme' }
];

themes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.value;
    option.textContent = theme.text;
    themePicker.appendChild(option);
});

themePicker.value = settings.theme;

themePicker.addEventListener('change', (e) => {
    settings.theme = e.target.value;
    document.body.dataset.theme = settings.theme;
    save();
});

// User Avatar & Toggle Logic
const userAvatar = document.getElementById('user-avatar');
const userAvatarToggleBtn = document.getElementById('user-avatar-toggle');

const applyAvatarVisibility = () => {
    if (settings.showAvatar) {
        userAvatar.classList.remove('hidden-avatar');
        userAvatar.setAttribute('aria-hidden', 'false');
        userAvatarToggleBtn.textContent = '🙈 Avatar ausblenden';
    } else {
        userAvatar.classList.add('hidden-avatar');
        userAvatar.setAttribute('aria-hidden', 'true');
        userAvatarToggleBtn.textContent = '🐵 Avatar einblenden';
    }
};

userAvatarToggleBtn.addEventListener('click', () => {
    settings.showAvatar = !settings.showAvatar;
    save();
    applyAvatarVisibility();
});

// Apply initial visibility
applyAvatarVisibility();


// Search Functionality
const searchInput = document.getElementById('search');
const searchEngines = document.querySelectorAll('.search-engine');
let activeEngine = settings.lastActiveEngine || 'google'; // Default or last active

const activateEngine = (engine) => {
    searchEngines.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.engine === engine) {
            btn.classList.add('active');
            activeEngine = engine;
            settings.lastActiveEngine = engine; // Save last active engine
            save();
        }
    });
};

searchEngines.forEach(btn => {
    btn.addEventListener('click', () => activateEngine(btn.dataset.engine));
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            let url = '';
            switch (activeEngine) {
                case 'google': url = `https://www.google.com/search?q=${encodeURIComponent(query)}`; break;
                case 'yandex': url = `https://yandex.com/search/?text=${encodeURIComponent(query)}`; break;
                case 'bing': url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`; break;
                case 'duckduckgo': url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`; break;
                case 'youtube': url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`; break;
                case 'github': url = `https://github.com/search?q=${encodeURIComponent(query)}`; break;
                default: url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
            window.open(url, '_blank');
        }
    }
});

// Initialize active engine
activateEngine(activeEngine);

// Time and Date Display
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');

const updateDateTime = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    timeElement.textContent = now.toLocaleTimeString('de-DE', timeOptions);
    dateElement.textContent = now.toLocaleDateString('de-DE', dateOptions);
};

// Update every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call

// REMOVED WEATHER WIDGET FUNCTIONS AND VARIABLES

// Quote of the Day
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

const fetchQuote = async () => {
    try {
        const response = await fetch('https://api.quotable.io/random?maxLength=100'); // Shorter quotes
        if (!response.ok) {
            throw new Error(`Zitat konnte nicht geladen werden: ${response.statusText}`);
        }
        const data = await response.json();
        quoteText.textContent = `"${data.content}"`;
        quoteAuthor.textContent = `- ${data.author}`;

        // Re-apply the animation class to trigger it for new quotes
        // Using `animate-in` which is a general purpose class for fade-in slide-up effect
        quoteText.classList.remove('animate-in');
        quoteAuthor.classList.remove('animate-in');
        void quoteText.offsetWidth; // Trigger reflow
        void quoteAuthor.offsetWidth; // Trigger reflow
        quoteText.classList.add('animate-in');
        quoteAuthor.classList.add('animate-in');
    } catch (error) {
        console.error('Fehler beim Abrufen des Zitats:', error);
        quoteText.textContent = 'Manchmal muss man einfach schweigen und das Chaos genießen.';
        quoteAuthor.textContent = '- Unbekannt';
    }
};

// Fetch a new quote every 24 hours (or on page load)
fetchQuote();
setInterval(fetchQuote, 24 * 60 * 60 * 1000);

// Background Shapes Creation - Enhanced for more 3D variety
const createBackgroundShapes = (numShapes) => {
    const container = document.body;
    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        shape.classList.add('background-shape');

        const size = Math.random() * (450 - 250) + 250; // Size between 250px and 450px (increased range)
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 25; // Animation delay up to 25s (increased)
        const duration = Math.random() * (50 - 35) + 35; // Animation duration between 35s and 50s (increased range)
        const opacity = Math.random() * (0.06 - 0.02) + 0.02; // Opacity between 0.02 and 0.06 (increased range)

        // Introduce random initial 3D transforms for more variety
        const initialTranslateX = (Math.random() - 0.5) * 150; // -75 to 75px
        const initialTranslateY = (Math.random() - 0.5) * 150;
        const initialTranslateZ = (Math.random() - 0.5) * 100; // Depth
        const initialRotateX = (Math.random() - 0.5) * 15; // -7.5 to 7.5 degrees
        const initialRotateY = (Math.random() - 0.5) * 15;
        const initialRotateZ = (Math.random() - 0.5) * 10; // Added Z-rotation
        const initialScale = Math.random() * (1.2 - 0.8) + 0.8; // 0.8 to 1.2

        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.top = `${top}%`;
        shape.style.left = `${left}%`;
        shape.style.animationDelay = `${delay}s`;
        shape.style.animationDuration = `${duration}s`;
        shape.style.opacity = opacity;
        shape.style.transform = `translate3d(${initialTranslateX}px, ${initialTranslateY}px, ${initialTranslateZ}px) scale(${initialScale}) rotateX(${initialRotateX}deg) rotateY(${initialRotateY}deg) rotateZ(${initialRotateZ}deg)`;


        if (i % 2 === 0) {
            shape.style.backgroundColor = 'var(--acc)';
        } else {
            shape.style.backgroundColor = 'rgba(var(--fg-rgb), 0.1)'; // Slightly more color variation
        }
        shape.style.opacity = opacity;

        container.appendChild(shape);
    }
};

createBackgroundShapes(6); // Create 6 dynamic background shapes (increased from 5)


// Scroll to top button logic
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.classList.add('scroll-to-top');
scrollToTopBtn.innerHTML = '⬆️';
scrollToTopBtn.title = 'Nach oben scrollen';
document.body.appendChild(scrollToTopBtn);

window.onscroll = () => {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
};

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animate-in elements on page load
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-in');
    animatedElements.forEach((el, index) => {
        // Apply a staggered animation delay based on index for a cascading effect
        el.style.animationDelay = `${index * 0.1}s`; // Staggered by 100ms (slightly slower)
        el.style.animationFillMode = 'forwards'; // Keep the final state of the animation
    });
});

// Mouse parallax effect (optional, more advanced 3D interaction)
// This is a more complex addition and can impact performance if not optimized.
// I will provide a basic structure.
/*
const applyParallax = () => {
    const parallaxTargets = document.querySelectorAll('.glass'); // Apply to all glass elements
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        parallaxTargets.forEach((target, index) => {
            const depth = parseFloat(target.dataset.parallaxDepth || 0.06) + (index * 0.015); // Vary depth slightly more
            const translateX = -mouseX * depth * 60; // Adjust multiplier for effect strength
            const translateY = -mouseY * depth * 60;
            const rotateX = mouseY * depth * 6; // Subtle rotation
            const rotateY = -mouseX * depth * 6;
            const rotateZ = (mouseX + mouseY) * depth * 2; // Added subtle Z-rotation

            // Preserve existing transforms if any
            const currentTransform = target.style.transform.replace(/translate3d\(.*?\)|rotateX\(.*?\)|rotateY\(.*?\)|rotateZ\(.*?\)/g, '').trim();
            target.style.transform = `${currentTransform} translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
        });
    });
};
// Uncomment the line below to enable parallax effect if desired.
// applyParallax();
*/
