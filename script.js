// script.js - MKWEB OS 7: Ultra-Optimierte Funktionalität & Verbesserte Dynamik

// --- Initialisierung & Einstellungen ---
const SETTINGS_KEY = 'mkweb-settings-os7'; // Eindeutiger Schlüssel für OS7-Einstellungen
const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
    // Theme ist fest auf 'dark' gesetzt, kein Themenwechsel mehr
    lastActiveEngine: 'google' // Letzte aktive Suchmaschine speichern
};

// Funktion zum Speichern der Einstellungen (mit Fehlerbehandlung)
const saveSettings = () => {
    try {
        localStorage?.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error("Fehler beim Speichern der Einstellungen im localStorage:", e);
    }
};

// --- DOM-Element-Caching (Für Performance) ---
// Vollbild-Button wurde entfernt
// Avatar- und Themenwechsel-Elemente wurden entfernt
const searchInput = document.getElementById('search');
const searchEngines = document.querySelectorAll('.search-engine');
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const scrollToTopBtn = document.createElement('button'); // Dynamisch erstellt

// --- Zeit- und Datumsanzeige ---
const updateTimeAndDate = () => {
    const now = new Date();
    // 'de-DE' für deutsches Format
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    timeElement.textContent = now.toLocaleTimeString('de-DE', optionsTime);
    dateElement.textContent = now.toLocaleDateString('de-DE', optionsDate);
};

// Aktualisiert jede Sekunde (essenziell, bleibt beibehalten)
setInterval(updateTimeAndDate, 1000);
updateTimeAndDate(); // Sofortige Initialanzeige beim Laden

// --- Suchfunktionalität ---
const searchEnginesMap = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    youtube: 'https://www.youtube.com/results?search_query=', // Korrekte YouTube-Such-URL
    github: 'https://github.com/search?q='
};

let currentSearchEngine = settings.lastActiveEngine;

const performSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
        // _self verwenden, um im selben Tab zu bleiben, was typisch für Startseiten ist
        window.open(searchEnginesMap[currentSearchEngine] + encodeURIComponent(query), '_self');
    }
};

// Event-Listener für Enter-Taste im Suchfeld
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Event-Listener für Suchmaschinen-Buttons
searchEngines.forEach(button => {
    button.addEventListener('click', () => {
        // Alle Buttons deaktivieren, dann den geklickten aktivieren
        searchEngines.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentSearchEngine = button.dataset.engine;
        settings.lastActiveEngine = currentSearchEngine; // Aktive Engine speichern
        saveSettings();
        searchInput.focus(); // Fokus auf Suchfeld beibehalten
    });
});

// Setze die anfängliche aktive Suchmaschine basierend auf den gespeicherten Einstellungen
const initialActiveButton = document.querySelector(`.search-engine[data-engine="${settings.lastActiveEngine}"]`);
if (initialActiveButton) {
    initialActiveButton.classList.add('active');
} else {
    // Fallback auf Google, falls die gespeicherte Engine ungültig ist
    document.querySelector('.search-engine[data-engine="google"]').classList.add('active');
    currentSearchEngine = 'google';
    settings.lastActiveEngine = 'google';
    saveSettings();
}

// --- Scroll-to-Top Button ---
scrollToTopBtn.className = 'scroll-to-top material-symbols-outlined';
scrollToTopBtn.innerHTML = 'arrow_upward';
document.body.appendChild(scrollToTopBtn);

const toggleScrollToTopButton = () => {
    // Zeigen, nachdem man eine moderate Menge gescrollt hat (z.B. 200px)
    if (window.scrollY > 200) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
};

window.addEventListener('scroll', toggleScrollToTopButton);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Element-Animationen beim Laden ---
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-in');
    // Die CSS-Klasse 'animate-in' steuert die Animation mit Verzögerungen
    // Hier ist keine zusätzliche JS-Klasse notwendig, da die Animation direkt durch CSS getriggert wird
    // wenn die Elemente im DOM sind und die Verzögerungen greifen.
    // (Der vorherige 'fade-in-active' classList.add war redundant zur CSS-Animation)
});

// --- Parallax-Effekt für Hintergrundformen (Optimiert für Design & Performance) ---
const applyParallax = () => {
    const parallaxShapes = document.querySelectorAll('.parallax-shape');
    const depths = new Map();

    // Subtle, aber spürbare Tiefenwerte für die Parallax-Formen
    parallaxShapes.forEach((shape, index) => {
        // Etwas größere Werte als im "ultra-optimierten" Zustand, um den Effekt sichtbarer zu machen
        depths.set(shape, 0.15 + (index * 0.05)); // Bereich z.B. 0.15, 0.20, 0.25
    });

    let animationFrameId = null;

    document.addEventListener('mousemove', (e) => {
        // Vorherigen Animationsframe abbrechen, um Überlappungen zu vermeiden und Performance zu verbessern
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
            const mouseX = e.clientX / window.innerWidth - 0.5; // Normalisiert auf -0.5 bis 0.5
            const mouseY = e.clientY / window.innerHeight - 0.5; // Normalisiert auf -0.5 bis 0.5

            parallaxShapes.forEach((shape) => {
                const depth = depths.get(shape);

                // Moderater Bewegungskoeffizient für einen ansprechenden Parallax-Effekt
                const translateX = -mouseX * depth * 20; // Reduziert von 30 (von Nutzer-Snippet), erhöht von 5 (von letztem Iteration)
                const translateY = -mouseY * depth * 20;
                const rotateX = mouseY * depth * 2; // Reduziert von 3, erhöht von 0.2
                const rotateY = -mouseX * depth * 2;
                const rotateZ = (mouseX + mouseY) * depth * 0.8; // Reduziert von 1, erhöht von 0.1

                // translate3d für Hardware-Beschleunigung nutzen
                shape.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
            });
        });
    });

    document.addEventListener('mouseleave', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        parallaxShapes.forEach((shape) => {
            shape.style.transition = 'transform 0.5s ease-out'; // Sanfter Übergang zurück zur Ruheposition
            shape.style.transform = 'none';
        });
        // Übergang nach dem Reset entfernen, um sofortige Reaktion auf neue Mausbewegung zu gewährleisten
        setTimeout(() => {
            parallaxShapes.forEach((shape) => {
                shape.style.transition = 'none';
            });
        }, 500); // Entspricht der Übergangsdauer
    });
};

applyParallax(); // Aktiviert den optimierten Maus-Parallax-Effekt
