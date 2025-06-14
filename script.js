// script.js - MKWEB OS 7: Performance Optimized Functionality & Dynamic Animations

// Load settings from localStorage or set defaults
const settings = JSON.parse(localStorage?.getItem('mkweb-settings')) || {theme: 'dark', showAvatar: true, lastActiveEngine: 'google'};
const save = () => localStorage?.setItem('mkweb-settings', JSON.stringify(settings));

// Ensure theme is valid, fallback to 'dark'
const allowedThemes = ['dark', 'light'];
if (!allowedThemes.includes(settings.theme)) {
    settings.theme = 'dark';
    save();
}

// Apply initial theme
document.body.dataset.theme = settings.theme;

// Theme Toggle Button Logic
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Function to update the button text based on the current theme
const updateThemeToggleButton = () => {
    if (settings.theme === 'dark') {
        themeToggleBtn.textContent = '☀️ Light Theme';
        themeToggleBtn.setAttribute('aria-label', 'Wechsel zu hellem Design');
    } else {
        themeToggleBtn.textContent = '🌙 Dark Theme';
        themeToggleBtn.setAttribute('aria-label', 'Wechsel zu dunklem Design');
    }
};

// Add event listener for theme toggle button
themeToggleBtn.addEventListener('click', () => {
    settings.theme = (settings.theme === 'dark' ? 'light' : 'dark'); // Toggle theme
    document.body.dataset.theme = settings.theme; // Apply new theme
    save(); // Save new theme
    updateThemeToggleButton(); // Update button text
});

// Initial update of the theme toggle button text
updateThemeToggleButton();


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
                case 'youtube': url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`; break; // Corrected YouTube URL
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

// Quote of the Day
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

const fetchQuote = async () => {
    try {
        const response = await fetch('https://api.quotable.io/random?maxLength=100'); // Slightly shorter quotes for better display
        if (!response.ok) {
            throw new Error(`Zitat konnte nicht geladen werden: ${response.statusText}`);
        }
        const data = await response.json();
        quoteText.textContent = `"${data.content}"`;
        quoteAuthor.textContent = `- ${data.author}`;

        // Re-apply animation classes for a fresh animation on new quote
        quoteText.classList.remove('animate-in');
        quoteAuthor.classList.remove('animate-in');
        void quoteText.offsetWidth; // Trigger reflow to restart animation
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

// Background Shapes Creation - OPTIMIZED for performance
const createBackgroundShapes = (numShapes) => {
    const container = document.body;
    // Remove existing shapes before creating new ones if called multiple times (e.g. for theme change, though not needed now)
    document.querySelectorAll('.background-shape').forEach(shape => shape.remove());

    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        shape.classList.add('background-shape');

        const size = Math.random() * (500 - 250) + 250; // Smaller range: 250px to 500px
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 20; // Shorter delay range: up to 20s
        const duration = Math.random() * (50 - 30) + 30; // Shorter duration: 30s to 50s
        const opacity = Math.random() * (0.05 - 0.02) + 0.02; // Reduced opacity range: 0.02 to 0.05

        // Less aggressive initial 3D transforms
        const initialTranslateX = (Math.random() - 0.5) * 150; // -75 to 75px
        const initialTranslateY = (Math.random() - 0.5) * 150;
        const initialTranslateZ = (Math.random() - 0.5) * 100; // Shallower Z
        const initialRotateX = (Math.random() - 0.5) * 10; // -5 to 5 degrees
        const initialRotateY = (Math.random() - 0.5) * 10;
        const initialRotateZ = (Math.random() - 0.5) * 8; // Reduced Z-rotation
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
            shape.style.backgroundColor = `rgba(${getComputedStyle(document.body).getPropertyValue('--fg-rgb').trim()}, 0.09)`; // Dynamically pick fg color, slightly lower opacity
        }
        // Opacity already set above, no need for second setting
        // shape.style.opacity = opacity;

        container.appendChild(shape);
    }
};

createBackgroundShapes(6); // REDUCED number of shapes for better performance


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

// Animate-in elements on page load with optimized staggering
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-in');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`; // Slightly reduced staggering delay
        el.style.animationFillMode = 'forwards';
    });
});

// Fullscreen Toggle - no change
const fullscreenBtn = document.getElementById('fullscreen-btn');
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
        fullscreenBtn.textContent = ' shrink';
        fullscreenBtn.setAttribute('title', 'Vollbild verlassen');
    }).catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen().then(() => {
        fullscreenBtn.textContent = '🚀 Vollbild';
        fullscreenBtn.setAttribute('title', 'Vollbild umschalten');
    }).catch(err => {
      console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`);
    });
  }
});

// Mouse parallax effect - SIGNIFICANTLY REDUCED INTENSITY FOR PERFORMANCE
const applyParallax = () => {
    const parallaxTargets = document.querySelectorAll('.glass'); // Still applies to all glass elements

    let animationFrameId = null; // To manage requestAnimationFrame

    document.addEventListener('mousemove', (e) => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            parallaxTargets.forEach((target) => {
                let depth = parseFloat(target.dataset.parallaxDepth || 0.05); // Base depth SIGNIFICANTLY reduced

                // Adjust depth based on element type for varied effect (still applies, but overall less intense)
                if (target.classList.contains('header') || target.classList.contains('main')) {
                    depth *= 0.6; // Even less movement for large containers
                } else if (target.classList.contains('action-card') || target.classList.contains('bookmark-card')) {
                    depth *= 1.0; // Slightly less movement for smaller cards
                }

                const translateX = -mouseX * depth * 40; // Reduced translation
                const translateY = -mouseY * depth * 40;
                const rotateX = mouseY * depth * 4; // Reduced rotation
                const rotateY = -mouseX * depth * 4;
                const rotateZ = (mouseX + mouseY) * depth * 1.5; // Reduced Z-rotation

                // Preserve existing transforms
                const currentTransform = target.style.transform.replace(/translate3d\(.*?\)|rotateX\(.*?\)|rotateY\(.*?\)|rotateZ\(.*?\)|scale\(.*?\)/g, '').trim();
                target.style.transform = `${currentTransform} translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
            });
        });
    });

    // Optional: Reset transforms when mouse leaves document for cleaner state
    document.addEventListener('mouseleave', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        parallaxTargets.forEach((target) => {
            // Remove the dynamic parallax part of the transform, keeping original CSS transforms
            target.style.transform = target.style.transform.replace(/translate3d\(.*?\)|rotateX\(.*?\)|rotateY\(.*?\)|rotateZ\(.*?\)/g, '').trim();
        });
    });
};

// UNCOMMENT THE LINE BELOW TO ENABLE THE OPTIMIZED MOUSE PARALLAX EFFECT:
applyParallax();
