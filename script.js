/* styles.css - MKWEB OS 7: Ultra-Fluid NO-SCROLL Layout - EXTREME LIGHTWEIGHT VERSION */

/* --- Global Design Variables - Refined for OS 7 & Extreme Lightweight --- */
:root {
  /* Skalierungs-Faktoren: Weniger aggressiv bei VH, mehr auf feste Werte/REM */
  /* Min-Werte wurden weiter erhöht, VH-Anteil für fluid-font reduziert */
  --fluid-min-font: clamp(0.7rem, 0.5vw + 0.2vh, 1rem); /* **GEÄNDERT: Min-REM erhöht, VW/VH Anteil reduziert** */
  --fluid-max-font: clamp(0.9rem, 0.7vw + 0.3vh, 1.3rem); /* **GEÄNDERT: Min-REM erhöht, VW/VH Anteil reduziert** */
  --fluid-header-font: clamp(1rem, 0.8vw + 0.4vh, 1.8rem); /* **GEÄNDERT: Min-REM erhöht, VW/VH Anteil reduziert** */
  --fluid-time-font: clamp(2.5rem, 4.5vw, 6rem); /* **GEÄNDERT: Uhrzeit Min-REM stark erhöht, VW als Haupttreiber** */

  /* Clamp für Padding: min-val, fluid-val (vw/vh-mix), max-val */
  /* VH-Anteile weiter reduziert für mehr Stabilität */
  --fluid-padding-xs: clamp(0.2rem, 0.3vw, 0.6rem); /* **GEÄNDERT: VH entfernt, Min-REM erhöht** */
  --fluid-padding-s: clamp(0.4rem, 0.6vw, 1rem); /* **GEÄNDERT: VH entfernt, Min-REM erhöht** */
  --fluid-padding-m: clamp(0.6rem, 0.9vw, 1.4rem); /* **GEÄNDERT: VH entfernt, Min-REM erhöht** */
  --fluid-padding-l: clamp(0.8rem, 1.2vw, 2rem); /* **GEÄNDERT: VH entfernt, Min-REM erhöht** */
  --fluid-padding-xl: clamp(1rem, 1.5vw, 2.5rem); /* **GEÄNDERT: VH entfernt, Min-REM erhöht** */

  /* Clamp für Gaps: min-val, fluid-val (vw/vh-mix), max-val */
  /* VH-Anteile weiter reduziert für mehr Stabilität */
  --fluid-gap-xs: clamp(0.2rem, 0.25vw, 0.6rem); /* **GEÄNDERT: VH entfernt, Min-REM erhöht** */
  --fluid-gap-s: clamp(0.3rem, 0.45vw, 1rem); /* **GEÄNDERT: VH entfernt, Min-REM erhöht** */
  --fluid-gap-m: clamp(0.5rem, 0.7vw, 1.5rem); /* **GEÄNDERT: VH entfernt, Min-REM erhöht** */

  --t: 0.1s ease-out; /* **GEÄNDERT: Noch schnellere Transitions** */
  --r: 8px; /* **GEÄNDERT: Randradius noch stärker reduziert** */
  --s: 0 1px 4px rgba(0,0,0,0.04); /* **GEÄNDERT: Schatten extrem leicht** */
  --sh: 0 2px 6px rgba(0,0,0,0.06); /* **GEÄNDERT: Hover-Schatten extrem leicht** */
  --s-light: 0 0.5px 2px rgba(0,0,0,0.02); /* **GEÄNDERT: Noch leichtere Schatten (fast unsichtbar)** */
  --border-width: 0.5px; /* **GEÄNDERT: Border-Dicke extrem reduziert** */
  --text-gradient-angle: 65deg;
  --glass-reflection: transparent; /* Bleibt entfernt */
  --glow-strength: 0 0 2px; /* **GEÄNDERT: Glow-Stärke minimal** */
  --glow-color: var(--acc);
  --blur-intensity: 3px; /* **GEÄNDERT: Blur-Intensität minimal (nahezu flach)** */
  --saturate-intensity: 105%; /* **GEÄNDERT: Sättigung fast neutral** */
  --content-max-width: 1800px;
  --inner-shadow-strength: inset 0 0 2px rgba(0,0,0,0.01); /* **GEÄNDERT: Innerer Schatten fast unsichtbar** */

  /* --- Themed Variables (Nur noch Dark Theme) --- */
  --bg: #0b0b0b; /* **GEÄNDERT: Hintergrund noch dunkler für mehr Kontrast zur Transparenz** */
  --fg: #f0f0f0; /* **GEÄNDERT: Vordergrund noch heller für mehr Kontrast** */
  --dim: rgba(240,240,240,0.4); /* **GEÄNDERT: Dim Farbe an neuen Vordergrund angepasst** */
  --acc: #8a4ed4;
  --ah: #b080ff;
  --gl: rgba(255,255,255,0.01); /* **GEÄNDERT: Glas-Hintergrund fast komplett transparent** */
  --gb: rgba(255,255,255,0.05); /* **GEÄNDERT: Glas-Border noch transparenter** */
  --inner-shadow: var(--inner-shadow-strength);
  --acc-rgb: 138, 78, 212;
  --fg-rgb: 240, 240, 240;
  --ah-rgb: 176, 128, 255;
  --gb-rgb: 255, 255, 255;
}


/* --- Base Styles --- */
html {
  scroll-behavior: smooth;
  /* **GEÄNDERT: Grundschriftgröße stärker an REM gebunden, VH reduziert** */
  font-size: clamp(8px, 0.7vw + 0.2vh, 18px); /* Min-REM erhöht */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  -webkit-tap-highlight-color: transparent;
}

body {
  background: var(--bg);
  color: var(--fg);
  height: 100vh;
  width: 100vw;
  transition: background var(--t), color var(--t);
  overflow: hidden;
  position: relative;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
}

/* Hintergrundelemente bleiben entfernt */
.background-shape { display: none; }
.grain { display: none; }

.container {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: var(--fluid-padding-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--fluid-gap-m);
  flex-grow: 1;
  min-height: 0;
}

/* --- Glassmorphism Base Style - Extreme Lightweight --- */
.glass {
  background: var(--gl); /* Extrem transparent */
  backdrop-filter: blur(var(--blur-intensity)) saturate(var(--saturate-intensity)); /* Minimaler Blur/Sättigung */
  border: var(--border-width) solid var(--gb); /* Extrem dünne, transparente Border */
  border-radius: var(--r); /* Kleinerer Radius */
  box-shadow: var(--s), var(--inner-shadow); /* Extrem leichter Schatten */
  transition: background var(--t), border-color var(--t), box-shadow var(--t); /* **GEÄNDERT: Transform von Transition entfernt** */
  position: relative;
  overflow: hidden;
  transform: none; /* Keine Initial-Transformation */

  &::after { /* Glas-Reflexion bleibt entfernt */
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--glass-reflection);
    pointer-events: none;
    opacity: 0;
    transition: none;
  }

  &:hover {
    transform: none; /* **GEÄNDERT: KEIN LIFT BEI HOVER** */
    box-shadow: var(--sh), var(--glow-strength) rgba(var(--acc-rgb), 0.1); /* Minimaler Hover-Glow */
  }

  &::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px; right: -1px; bottom: -1px;
    border-radius: calc(var(--r) + 1px);
    background: linear-gradient(45deg, var(--acc), var(--ah));
    z-index: -1;
    opacity: 0;
    transition: opacity var(--t);
    filter: blur(2px); /* **GEÄNDERT: Blur des Glows minimal** */
  }

  &:hover::before {
    opacity: 0.2; /* **GEÄNDERT: Glow-Deckkraft minimal** */
    filter: blur(4px); /* **GEÄNDERT: Blur des Hover-Glows minimal** */
  }
}

/* --- Header --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: var(--content-max-width);
  padding: var(--fluid-padding-s) var(--fluid-padding-l);
}

.logo {
  font-size: clamp(1rem, var(--fluid-header-font), 2.2rem);
  font-weight: 800;
  background: linear-gradient(var(--text-gradient-angle), var(--acc), var(--fg), var(--acc));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 15s ease infinite alternate; /* Animation bleibt für Dynamik */
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.03); /* **GEÄNDERT: Logo-Glow extrem subtil** */
  position: relative;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.controls {
  display: flex;
  gap: var(--fluid-gap-s);
  align-items: center;
}

/* --- Buttons Styling - Extreme Lightweight --- */
button {
  padding: var(--fluid-padding-xs) var(--fluid-padding-s);
  border: var(--border-width) solid var(--gb);
  border-radius: var(--r);
  background: var(--gl);
  color: var(--fg);
  cursor: pointer;
  transition: border-color var(--t), box-shadow var(--t); /* **GEÄNDERT: Transform von Transition entfernt** */
  font-size: var(--fluid-min-font); /* **GEÄNDERT: Vereinfacht auf Variable** */
  font-weight: 600;
  outline: none;
  box-shadow: var(--s-light);
  position: relative;
  z-index: 1;
  overflow: hidden;
  transform: none; /* **GEÄNDERT: Keine Initial-Transformation** */

  &:active {
    transform: none; /* **GEÄNDERT: KEIN LIFT/SCALE BEI ACTIVE** */
    box-shadow: var(--s-light), inset 0 0.5px 2px rgba(0,0,0,0.05); /* Minimaler Active-Schatten */
    background: rgba(var(--gl-rgb), 0.02); /* Minimal transparenter Active-Hintergrund */
  }
}

button:hover {
  transform: none; /* **GEÄNDERT: KEIN LIFT BEI HOVER** */
  border-color: var(--acc);
  box-shadow: var(--s), var(--glow-strength) rgba(var(--acc-rgb), 0.1); /* Minimaler Hover-Glow */
}

.user-avatar {
  width: clamp(20px, 2.5vw, 40px);
  height: clamp(20px, 2.5vw, 40px);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(0.8rem, 1vw, 1.8rem);
  background: var(--gl);
  border: var(--border-width) solid var(--gb);
  color: var(--acc);
  cursor: pointer;
  transition: all var(--t); /* **GEÄNDERT: Transform von Transition entfernt** */
  box-shadow: var(--s-light);
  overflow: hidden;
  transform: none; /* **GEÄNDERT: Keine Initial-Transformation** */

  &:hover {
    transform: none; /* **GEÄNDERT: KEIN LIFT BEI HOVER** */
    border-color: var(--acc);
    box-shadow: var(--glow-strength) var(--acc), var(--s);
  }
}

.hidden-avatar {
  opacity: 0 !important;
  transform: scale(0.6) !important;
  pointer-events: none !important;
}


/* --- Main Grid Layout --- */
.main-grid {
  width: 100%;
  max-width: var(--content-max-width);
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--fluid-gap-m);
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
}

.grid-left, .grid-right {
  display: flex;
  flex-direction: column;
  gap: var(--fluid-gap-m);
  height: 100%; /* Wichtig, damit sie den verfügbaren Platz im Grid nutzen */
  flex-grow: 1; /* Nehmen den verfügbaren Platz in der Spalte ein */
  min-height: 0; /* Erlaubt ihnen, zu schrumpfen */
  overflow: hidden; /* Verhindert internes Scrollen in den Spalten */
}

/* --- Search Section --- */
.search-section {
  padding: var(--fluid-padding-s);
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1; /* Kann im Desktop-Grid wachsen */
  min-height: 0;
  flex-shrink: 1;
  overflow: hidden;
}

.search-engines {
  display: flex;
  gap: var(--fluid-gap-xs);
  margin-bottom: var(--fluid-padding-s);
  flex-wrap: wrap;
  justify-content: center;
}

.search-engine {
  padding: var(--fluid-padding-xs) var(--fluid-padding-s); /* **GEÄNDERT: Padding vereinfacht auf Variablen** */
  border-radius: 30px;
  font-weight: 600;
  font-size: var(--fluid-min-font); /* **GEÄNDERT: Vereinfacht auf Variable** */
  border: var(--border-width) solid transparent;
  background: var(--gl);
  transition: all var(--t);

  &.active {
    background: var(--acc);
    color: #fff;
    transform: none; /* **GEÄNDERT: KEIN LIFT BEI ACTIVE** */
    box-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.05); /* Minimaler Active-Glow */
    border-color: var(--acc);
  }

  &:not(.active):hover {
    border-color: var(--acc);
    transform: none; /* **GEÄNDERT: KEIN LIFT BEI HOVER** */
    box-shadow: inset 0 0 1px rgba(0,0,0,0.02), var(--s-light); /* Minimaler Schatten */
  }
}

.search-box {
  display: flex;
  align-items: center;
  border-radius: 30px;
  padding: var(--fluid-padding-s);
  transition: all var(--t);
  box-shadow: var(--s), var(--inner-shadow);
}

.search-box:focus-within {
  border-color: var(--acc);
  transform: none; /* **GEÄNDERT: KEIN ZOOM BEI FOKUS** */
  box-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.1); /* Minimaler Fokus-Glow */
}

#search {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--fg);
  font-size: var(--fluid-max-font); /* **GEÄNDERT: Vereinfacht auf Variable** */
  outline: none;
  margin-left: var(--fluid-padding-xs);
}

#search::placeholder {
  color: var(--dim);
}

/* --- Time Display --- */
.time-display {
  text-align: center;
  padding: var(--fluid-padding-s);
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 2; /* Behält höheren Flex-Grow für Prominenz */
  min-height: clamp(8rem, 15vh, 20rem); /* **GEÄNDERT: DEUTLICH HÖHERE MIN-HEIGHT FÜR DIE UHR** */
  flex-shrink: 0; /* **WICHTIG: Soll nicht schrumpfen, außer absolut notwendig** */
  overflow: hidden;
  box-sizing: border-box; /* Sicherstellen, dass Padding in Höhe eingeht */
}

#time {
  font-size: var(--fluid-time-font); /* Nutzt die neue, hohe Fluid-Time-Font Variable */
  font-weight: 800;
  margin-bottom: var(--fluid-gap-xs); /* **GEÄNDERT: Vereinfacht auf Gap Variable** */
  background: linear-gradient(var(--text-gradient-angle), var(--acc), var(--fg), var(--acc));
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 15s ease infinite alternate;
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.05); /* Minimaler Uhr-Glow */
}

#date {
  font-size: var(--fluid-min-font); /* **GEÄNDERT: Vereinfacht auf Variable** */
  color: var(--dim);
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: clamp(0.2px, 0.07vw, 1.8px);
}

/* --- Wetter Link Sektion Styles --- */
.weather-link-section {
    padding: var(--fluid-padding-s);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
    min-height: 0;
    flex-shrink: 1;
    overflow: hidden;
}

.weather-link-section h2 {
    font-size: var(--fluid-header-font); /* **GEÄNDERT: Vereinfacht auf Variable** */
    font-weight: 700;
    margin-bottom: var(--fluid-padding-s);
    color: var(--fg);
}

.weather-link-button {
    display: inline-flex;
    align-items: center;
    gap: var(--fluid-gap-s);
    padding: var(--fluid-padding-s) var(--fluid-padding-m);
    background: var(--gl);
    border: var(--border-width) solid var(--gb);
    border-radius: var(--r);
    text-decoration: none;
    color: var(--fg);
    font-weight: 600;
    font-size: var(--fluid-max-font); /* **GEÄNDERT: Vereinfacht auf Variable** */
    transition: all var(--t); /* **GEÄNDERT: Transform von Transition entfernt** */
    box-shadow: var(--s-light), var(--inner-shadow);

    &:hover {
      transform: none; /* **GEÄNDERT: KEIN LIFT BEI HOVER** */
      border-color: var(--acc);
      box-shadow: var(--s), var(--glow-strength) rgba(var(--acc-rgb), 0.1);
    }
}

.weather-link-button .weather-icon {
    font-size: clamp(1rem, 1.2vw, 2.2rem);
    color: var(--acc);
    transition: all var(--t); /* **GEÄNDERT: Transform von Transition entfernt** */

    &:hover {
        transform: none; /* **GEÄNDERT: KEIN SCALE BEI HOVER** */
    }
}

.weather-notice {
    margin-top: var(--fluid-padding-s);
    font-size: var(--fluid-min-font); /* **GEÄNDERT: Vereinfacht auf Variable** */
    color: var(--dim);
}

/* --- Zitate Sektion Styles --- */
.quote-section {
  padding: var(--fluid-padding-s);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-grow: 1;
  min-height: 0;
  flex-shrink: 1;
  overflow: hidden;
}

#quote-text {
  font-size: var(--fluid-max-font); /* **GEÄNDERT: Vereinfacht auf Variable** */
  font-weight: 600;
  margin-bottom: var(--fluid-gap-xs); /* **GEÄNDERT: Vereinfacht auf Variable** */
  color: var(--fg);
}

#quote-author {
  font-size: var(--fluid-min-font); /* **GEÄNDERT: Vereinfacht auf Variable** */
  color: var(--dim);
}

/* --- Apps & Bookmarks Section --- */
.apps-section {
  width: 100%;
  padding: var(--fluid-padding-s);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
  flex-shrink: 1;
}

.apps-section h2 {
  margin-bottom: var(--fluid-padding-s);
  font-size: var(--fluid-header-font); /* **GEÄNDERT: Vereinfacht auf Variable** */
  font-weight: 700;
  text-align: center;
  color: var(--dim);
}

.apps-container {
    /* **GEÄNDERT: Min-Breite der App-Karten erhöht, VH-Anteil entfernt** */
    grid-template-columns: repeat(auto-fill, minmax(clamp(55px, 7vw, 110px), 1fr));
    gap: var(--fluid-gap-s);
    overflow: hidden;
    padding: var(--fluid-padding-xs);
    flex-grow: 1;
    min-height: 0;
    display: grid;
    max-height: 100%;
}

.app-card {
  background: var(--gl);
  border: var(--border-width) solid var(--gb);
  border-radius: var(--r);
  padding: var(--fluid-padding-xs); /* **GEÄNDERT: Padding vereinfacht auf Variable** */
  text-align: center;
  text-decoration: none;
  color: var(--fg);
  transition: all var(--t); /* **GEÄNDERT: Transform von Transition entfernt** */
  position: relative;
  overflow: hidden;
  box-shadow: var(--s-light), var(--inner-shadow);
  transform: none; /* **GEÄNDERT: Keine Initial-Transformation** */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  min-width: 0;
  min-height: 0;

  &:hover {
    transform: none; /* **GEÄNDERT: KEIN LIFT BEI HOVER** */
    border-color: var(--acc);
    box-shadow: var(--s), var(--glow-strength) rgba(var(--acc-rgb), 0.1);
  }
}

.app-card .icon {
  font-family: 'Material Symbols Outlined';
  /* **GEÄNDERT: Icon-Größe stärker an REM gebunden, VH-Anteil reduziert** */
  font-size: clamp(1.2rem, 1.8vw, 3rem);
  margin-bottom: var(--fluid-gap-xs); /* **GEÄNDERT: Vereinfacht auf Variable** */
  display: block;
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.03); /* Minimaler Icon-Glow */
  transition: all var(--t); /* **GEÄNDERT: Transform von Transition entfernt** */
  line-height: 1;

  &:hover {
    transform: none; /* **GEÄNDERT: KEIN SCALE BEI HOVER** */
  }
}

.app-card .label {
  /* **GEÄNDERT: Label-Größe stärker an REM gebunden, VH-Anteil entfernt** */
  font-size: clamp(0.6rem, 0.7vw, 1rem);
  font-weight: 500;
  line-height: 1.1;
  word-break: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* --- SR-Only class for accessibility --- */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* --- Media Queries for Layout Change (Mobile Optimization) --- */
@media (max-width: 992px) {
  /* **GEÄNDERT: Grundschriftgröße für Mobile erhöht** */
  html {
    font-size: clamp(10px, 0.9vw, 16px);
  }

  .container {
      padding: var(--fluid-padding-m);
      gap: var(--fluid-gap-m);
  }
  .main-grid {
      grid-template-columns: 1fr;
      display: flex;
      flex-direction: column;
      gap: var(--fluid-gap-m);
      overflow-y: auto; /* Erlaube Scrollen auf mobilen Geräten */
      height: auto;
  }
  .grid-left, .grid-right {
      flex-direction: column;
      gap: var(--fluid-gap-m);
      height: auto;
      min-height: 0;
  }

  /* Diese Sektionen sollen ihre natürliche Höhe behalten */
  .time-display, .search-section, .weather-link-section, .quote-section {
      flex-grow: 0;
      padding: var(--fluid-padding-s);
      min-height: 0;
      flex-shrink: 1;
      overflow: hidden;
  }

  /* Die Uhr auf schmaleren Screens */
  #time {
      font-size: clamp(2rem, 8vw, 5rem); /* **GEÄNDERT: Uhrzeit Min-REM für Mobile stark erhöht, VW als Haupttreiber** */
  }
  #date {
      font-size: var(--fluid-min-font);
  }

  .header {
      flex-direction: column;
      gap: var(--fluid-gap-s);
      padding: var(--fluid-padding-s);
  }
  .logo { font-size: clamp(1rem, 2.8vw, 2rem); }
  .controls { gap: var(--fluid-gap-s); flex-wrap: wrap; justify-content: center; }

  /* Apps-Sektion bleibt der flexible Bereich */
  .apps-section {
      order: 4;
      flex-grow: 1;
      min-height: clamp(100px, 18vh, 300px); /* **GEÄNDERT: Min-Höhe der Apps-Sektion für Mobile erhöht** */
      padding: var(--fluid-padding-s);
      overflow-y: auto; /* **WICHTIG: Hier erlauben wir Scrollen** */
  }
  .apps-section h2 {
      font-size: var(--fluid-header-font);
      margin-bottom: var(--fluid-padding-s);
  }
  .apps-container {
      /* **GEÄNDERT: Min-Breite der App-Karten für Mobile erhöht, VH-Anteil entfernt** */
      grid-template-columns: repeat(auto-fill, minmax(clamp(50px, 10vw, 90px), 1fr));
      gap: var(--fluid-gap-s);
      overflow: hidden;
      max-height: none;
  }
  .app-card {
      padding: var(--fluid-padding-xs);
  }
  .app-card .icon {
      font-size: clamp(1.1rem, 3vw, 2.5rem);
  }
  .app-card .label {
      font-size: clamp(0.5rem, 1.5vw, 0.8rem);
      line-height: 1.1;
  }
}

/* Fallback for browsers that don't support backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .glass {
    background: rgba(var(--fg-rgb), 0.08); /* Fallback für noch transparenteren Hintergrund */
  }
}
