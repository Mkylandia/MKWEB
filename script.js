/* styles.css - MKWEB OS 7: Ultra-Fluid NO-SCROLL Layout - Lightweight Version */

/* --- Global Design Variables - Refined for OS 7 & Lightweight --- */
:root {
  /* Skalierungs-Faktoren (unverändert, da die Größen jetzt stimmen) */
  --fluid-min-font: 0.6vw;
  --fluid-max-font: 0.9vw;
  --fluid-header-font: 1.1vw;
  --fluid-time-font: 3vw;

  /* Clamp für Padding (unverändert) */
  --fluid-padding-xs: clamp(0.15rem, 0.25vw + 0.1vh, 0.7rem);
  --fluid-padding-s: clamp(0.3rem, 0.4vw + 0.2vh, 1rem);
  --fluid-padding-m: clamp(0.5rem, 0.7vw + 0.35vh, 1.3rem);
  --fluid-padding-l: clamp(0.7rem, 0.9vw + 0.45vh, 1.8rem);
  --fluid-padding-xl: clamp(0.9rem, 1.1vw + 0.55vh, 2.3rem);

  /* Clamp für Gaps (unverändert) */
  --fluid-gap-xs: clamp(0.15rem, 0.2vw + 0.08vh, 0.5rem);
  --fluid-gap-s: clamp(0.25rem, 0.35vw + 0.15vh, 0.8rem);
  --fluid-gap-m: clamp(0.35rem, 0.45vw + 0.2vh, 1.2rem);

  --t: 0.15s ease-out; /* Transitions (bleibt schnell) */
  --r: 10px; /* **GEÄNDERT: Randradius leicht reduziert für schlankeren Look** */
  --s: 0 2px 8px rgba(0,0,0,0.06); /* **GEÄNDERT: Schatten deutlich leichter** */
  --sh: 0 4px 12px rgba(0,0,0,0.08); /* **GEÄNDERT: Hover-Schatten leichter** */
  --s-light: 0 1px 3px rgba(0,0,0,0.03); /* **GEÄNDERT: Noch leichtere Schatten für Buttons etc.** */
  --border-width: 0.8px; /* **GEÄNDERT: Border-Dicke reduziert für filigraneren Look** */
  --text-gradient-angle: 65deg;
  --glass-reflection: transparent; /* Bleibt entfernt */
  --glow-strength: 0 0 3px; /* **GEÄNDERT: Glow-Stärke reduziert** */
  --glow-color: var(--acc);
  --blur-intensity: 5px; /* **GEÄNDERT: Blur-Intensität reduziert für leichteres Glass** */
  --saturate-intensity: 110%; /* **GEÄNDERT: Sättigung reduziert für weniger Kontrast** */
  --content-max-width: 1800px;
  --inner-shadow-strength: inset 0 0 3px rgba(0,0,0,0.02); /* **GEÄNDERT: Innerer Schatten leichter** */

  /* --- Themed Variables (Nur noch Dark Theme) --- */
  --bg: #0d0d0d;
  --fg: #e0e0e0;
  --dim: rgba(224,224,224,0.5);
  --acc: #8a4ed4; /* Akzentfarbe bleibt */
  --ah: #b080ff; /* Akzent-Hoverfarbe bleibt */
  --gl: rgba(255,255,255,0.02); /* **GEÄNDERT: Glas-Hintergrund noch transparenter** */
  --gb: rgba(255,255,255,0.08); /* **GEÄNDERT: Glas-Border noch transparenter** */
  --inner-shadow: var(--inner-shadow-strength);
  --acc-rgb: 138, 78, 212;
  --fg-rgb: 224, 224, 224;
  --ah-rgb: 176, 128, 255;
  --gb-rgb: 255, 255, 255;
}


/* --- Base Styles --- */
html {
  scroll-behavior: smooth;
  font-size: clamp(6px, 0.6vw + 0.35vh, 17px);
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

/* --- Animated Background Elements - REMOVED (bleiben entfernt) --- */
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

/* --- Glassmorphism Base Style - Optimized for Lightweight --- */
.glass {
  background: var(--gl);
  backdrop-filter: blur(var(--blur-intensity)) saturate(var(--saturate-intensity));
  border: var(--border-width) solid var(--gb);
  border-radius: var(--r);
  box-shadow: var(--s), var(--inner-shadow); /* Nutzt die neuen, leichteren Schatten */
  transition: background var(--t), border-color var(--t), box-shadow var(--t), transform var(--t);
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
    transform: translateY(-0.2em); /* **GEÄNDERT: Weniger starker Hover-Lift** */
    box-shadow: var(--sh), var(--glow-strength) rgba(var(--acc-rgb), 0.15); /* **GEÄNDERT: Weniger starker Hover-Glow** */
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
    filter: blur(4px); /* **GEÄNDERT: Blur des Glows reduziert** */
  }

  &:hover::before {
    opacity: 0.3; /* **GEÄNDERT: Glow-Deckkraft reduziert** */
    filter: blur(6px); /* **GEÄNDERT: Blur des Hover-Glows reduziert** */
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
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.05); /* **GEÄNDERT: Logo-Glow noch subtiler** */
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

/* --- Buttons Styling - Lightweight Optimierung --- */
button {
  padding: var(--fluid-padding-xs) var(--fluid-padding-s);
  border: var(--border-width) solid var(--gb); /* Nutzt reduzierte Border */
  border-radius: var(--r); /* Nutzt reduzierten Radius */
  background: var(--gl); /* Nutzt transparenteren Glas-Hintergrund */
  color: var(--fg);
  cursor: pointer;
  transition: border-color var(--t), transform var(--t), box-shadow var(--t);
  font-size: clamp(0.5rem, var(--fluid-min-font), 0.8rem);
  font-weight: 600;
  outline: none;
  box-shadow: var(--s-light); /* Nutzt den noch leichteren Schatten */
  position: relative;
  z-index: 1;
  overflow: hidden;
  transform: none;

  &:active {
    transform: translateY(0.05em) scale(0.995); /* **GEÄNDERT: Weniger starker Active-Effekt** */
    box-shadow: var(--s-light), inset 0 1px 3px rgba(0,0,0,0.08); /* **GEÄNDERT: Active-Schatten noch leichter** */
    background: rgba(var(--gl-rgb), 0.03); /* **GEÄNDERT: Active-Hintergrund noch transparenter** */
  }
}

button:hover {
  transform: translateY(-0.15em); /* **GEÄNDERT: Weniger starker Hover-Lift** */
  border-color: var(--acc);
  box-shadow: var(--s), var(--glow-strength) rgba(var(--acc-rgb), 0.2); /* **GEÄNDERT: Weniger starker Hover-Glow** */
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
  transition: all var(--t);
  box-shadow: var(--s-light);
  overflow: hidden;
  transform: none;

  &:hover {
    transform: translateY(-0.2em); /* **GEÄNDERT: Weniger starker Hover-Lift** */
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
  height: 100%;
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
}

/* --- Search Section --- */
.search-section {
  padding: var(--fluid-padding-s);
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
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
  padding: clamp(0.2rem, 0.4vw, 0.6rem) clamp(0.4rem, 0.7vw, 1rem);
  border-radius: 30px;
  font-weight: 600;
  font-size: clamp(0.55rem, 0.8vw, 0.9rem);
  border: var(--border-width) solid transparent;
  background: var(--gl);
  transition: all var(--t);

  &.active {
    background: var(--acc);
    color: #fff;
    transform: translateY(-0.1em); /* **GEÄNDERT: Weniger starker Active-Effekt** */
    box-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.1); /* **GEÄNDERT: Active-Glow noch leichter** */
    border-color: var(--acc);
  }

  &:not(.active):hover {
    border-color: var(--acc);
    transform: translateY(-0.05em); /* **GEÄNDERT: Weniger starker Hover-Effekt** */
    box-shadow: inset 0 0 3px rgba(0,0,0,0.05), var(--s-light); /* **GEÄNDERT: Schatten leichter** */
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
  transform: scale(1.002); /* **GEÄNDERT: Weniger starker Fokus-Zoom** */
  box-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.2); /* **GEÄNDERT: Fokus-Glow leichter** */
}

#search {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--fg);
  font-size: clamp(0.6rem, var(--fluid-max-font), 1rem);
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
  flex-grow: 2;
  min-height: 0;
  flex-shrink: 1;
  overflow: hidden;
}

#time {
  font-size: clamp(1.8rem, var(--fluid-time-font), 6rem);
  font-weight: 800;
  margin-bottom: clamp(0.01rem, 0.04vh, 0.25rem);
  background: linear-gradient(var(--text-gradient-angle), var(--acc), var(--fg), var(--acc));
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 15s ease infinite alternate;
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.08); /* **GEÄNDERT: Uhr-Glow leichter** */
}

#date {
  font-size: clamp(0.5rem, var(--fluid-min-font), 1rem);
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
    font-size: clamp(0.75rem, var(--fluid-header-font), 1.4rem);
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
    font-size: clamp(0.6rem, var(--fluid-max-font), 1rem);
    transition: all var(--t);
    box-shadow: var(--s-light), var(--inner-shadow);

    &:hover {
      transform: translateY(-0.2em); /* **GEÄNDERT: Weniger starker Hover-Lift** */
      border-color: var(--acc);
      box-shadow: var(--s), var(--glow-strength) rgba(var(--acc-rgb), 0.15); /* **GEÄNDERT: Weniger starker Hover-Glow** */
    }
}

.weather-link-button .weather-icon {
    font-size: clamp(1rem, 1.2vw, 2.2rem);
    color: var(--acc);
    transition: all var(--t);

    &:hover {
        transform: scale(1.05); /* **GEÄNDERT: Weniger starker Hover-Skalierung** */
    }
}

.weather-notice {
    margin-top: var(--fluid-padding-s);
    font-size: clamp(0.5rem, var(--fluid-min-font), 0.8rem);
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
  font-size: clamp(0.7rem, var(--fluid-max-font), 1.1rem);
  font-weight: 600;
  margin-bottom: clamp(0.1rem, 0.2vw, 0.5rem);
  color: var(--fg);
}

#quote-author {
  font-size: clamp(0.45rem, var(--fluid-min-font), 0.9rem);
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
  font-size: clamp(0.7rem, var(--fluid-header-font), 1.4rem);
  font-weight: 700;
  text-align: center;
  color: var(--dim);
}

.apps-container {
    grid-template-columns: repeat(auto-fill, minmax(clamp(48px, 6.5vw + 4vh, 100px), 1fr));
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
  padding: clamp(0.3rem, 0.5vw + 0.35vh, 1rem);
  text-align: center;
  text-decoration: none;
  color: var(--fg);
  transition: all var(--t);
  position: relative;
  overflow: hidden;
  box-shadow: var(--s-light), var(--inner-shadow); /* Nutzt die leichteren Schatten */
  transform: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  min-width: 0;
  min-height: 0;

  &:hover {
    transform: translateY(-0.2em); /* **GEÄNDERT: Weniger starker Hover-Lift** */
    border-color: var(--acc);
    box-shadow: var(--s), var(--glow-strength) rgba(var(--acc-rgb), 0.15); /* **GEÄNDERT: Weniger starker Hover-Glow** */
  }
}

.app-card .icon {
  font-family: 'Material Symbols Outlined';
  font-size: clamp(0.9rem, 1.5vw + 1.5vh, 2.5rem);
  margin-bottom: clamp(0.1rem, 0.2vw + 0.1vh, 0.5rem);
  display: block;
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.08); /* **GEÄNDERT: Icon-Glow leichter** */
  transition: all 0.15s ease-out;
  line-height: 1;
}

.app-card:hover .icon {
  transform: scale(1.05); /* **GEÄNDERT: Weniger starker Hover-Skalierung** */
}

.app-card .label {
  font-size: clamp(0.4rem, 0.5vw + 0.3vh, 0.9rem);
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

/* --- Media Queries for Layout Change (nicht nur Skalierung) --- */
@media (max-width: 992px) {
  html {
    font-size: clamp(5px, 0.7vw + 0.4vh, 15px);
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
      overflow-y: auto;
      height: auto;
  }
  .grid-left, .grid-right {
      flex-direction: column;
      gap: var(--fluid-gap-m);
      height: auto;
      min-height: 0;
  }

  .time-display, .search-section, .weather-link-section, .quote-section {
      flex-grow: 0;
      padding: var(--fluid-padding-s);
      min-height: 0;
      flex-shrink: 1;
      overflow: hidden;
  }

  #time {
      font-size: clamp(1.5rem, 6vw, 4rem);
  }
  #date {
      font-size: clamp(0.4rem, 1.5vw, 0.9rem);
  }

  .header {
      flex-direction: column;
      gap: var(--fluid-gap-s);
      padding: var(--fluid-padding-s);
  }
  .logo { font-size: clamp(0.8rem, 2.5vw, 1.8rem); }
  .controls { gap: var(--fluid-gap-s); flex-wrap: wrap; justify-content: center; }

  .apps-section {
      order: 4;
      flex-grow: 1;
      min-height: clamp(70px, 14vh, 220px);
      padding: var(--fluid-padding-s);
      overflow-y: auto;
  }
  .apps-section h2 {
      font-size: clamp(0.6rem, 2.2vw, 1.2rem);
      margin-bottom: var(--fluid-padding-s);
  }
  .apps-container {
      grid-template-columns: repeat(auto-fill, minmax(clamp(40px, 8vw + 5vh, 75px), 1fr));
      gap: var(--fluid-gap-s);
      overflow: hidden;
      max-height: none;
  }
  .app-card {
      padding: clamp(0.2rem, 0.35vw + 0.25vh, 0.9rem);
  }
  .app-card .icon {
      font-size: clamp(0.8rem, 2.5vw + 1.5vh, 1.8rem);
  }
  .app-card .label {
      font-size: clamp(0.35rem, 1.2vw + 0.5vh, 0.6rem);
      line-height: 1.1;
  }
}

/* Fallback for browsers that don't support backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .glass {
    background: rgba(var(--fg-rgb), 0.1); /* Fallback für noch transparenteren Hintergrund */
  }
}
