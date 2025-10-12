/* MKWEB OS 8: Redesigned for Elegance & Performance */

:root {
  --fluid-min-font: 14px;
  --fluid-max-font: 16px;
  --fluid-header-font: 22px;
  --fluid-time-font: clamp(3.5rem, 12vw, 7rem);

  --radius-s: 8px;
  --radius-m: 16px;
  --radius-l: 24px;
  --radius-xl: 32px;

  --gap-s: 0.5rem;
  --gap-m: 1rem;
  --gap-l: 1.5rem;

  --t-fast: 0.2s;
  --t-normal: 0.3s;
  --t-slow: 0.5s;
  --t-timing-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
  --t-timing-elastic: cubic-bezier(0.18, 0.89, 0.32, 1.28);

  --shadow-s: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-m: 0 8px 24px rgba(0,0,0,0.12);
  --shadow-l: 0 12px 36px rgba(0,0,0,0.15);
  --content-max-width: 1600px;
}

/* --- THEMES --- */
/* Dark (Default) */
body[data-theme="dark"] {
  --bg: #101010;
  --fg: #f0f0f0;
  --dim: #a0a0a0;
  --acc: #8a4ed4;
  --ah: #b080ff;
  --glass-bg: rgba(28, 28, 28, 0.6);
  --glass-border: rgba(255, 255, 255, 0.1);
  --acc-rgb: 138, 78, 212;
}
/* Light */
body[data-theme="light"] {
  --bg: #f2f2f7;
  --fg: #1d1d1f;
  --dim: #8a8a8e;
  --acc: #007aff;
  --ah: #3395ff;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.08);
  --acc-rgb: 0, 122, 255;
}
/* Ocean */
body[data-theme="ocean"] {
  --bg: #0a192f;
  --fg: #ccd6f6;
  --dim: #8892b0;
  --acc: #64ffda;
  --ah: #a7ffed;
  --glass-bg: rgba(17, 34, 64, 0.6);
  --glass-border: rgba(100, 255, 218, 0.1);
  --acc-rgb: 100, 255, 218;
}
/* Forest */
body[data-theme="forest"] {
  --bg: #1e392a;
  --fg: #e8f5e9;
  --dim: #a5d6a7;
  --acc: #81c784;
  --ah: #a5d6a7;
  --glass-bg: rgba(46, 81, 57, 0.6);
  --glass-border: rgba(255, 255, 255, 0.15);
  --acc-rgb: 129, 199, 132;
}
/* Glass (New) */
body[data-theme="glass"] {
  --bg: #d8d8d8;
  --fg: #1d1d1f;
  --dim: #8a8a8e;
  --acc: #ff69b4; /* Hot Pink */
  --ah: #ff85c1;
  --glass-bg: rgba(255, 255, 255, 0.4);
  --glass-border: rgba(0, 0, 0, 0.05);
  --acc-rgb: 255, 105, 180;
}
body[data-theme="glass"]::before {
  content: '';
  position: fixed;
  inset: 0;
  background: url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2000&auto=format&fit=crop') no-repeat center center/cover;
  z-index: -2;
}

/* --- BASE STYLES --- */
html { font-size: 100%; }
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  background-color: var(--bg);
  color: var(--fg);
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  transition: background-color var(--t-normal) var(--t-timing-smooth);
}
h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--dim);
    margin-bottom: var(--gap-m);
}
button {
  cursor: pointer;
  background: none;
  border: none;
  color: inherit;
}
a {
  text-decoration: none;
  color: inherit;
}

/* --- LAYOUT --- */
.container {
  width: 100%;
  max-width: var(--content-max-width);
  padding: var(--gap-m);
  display: flex;
  flex-direction: column;
  gap: var(--gap-m);
}
.main-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--gap-m);
  width: 100%;
}
@media (min-width: 1024px) {
    .container { padding: var(--gap-l); gap: var(--gap-l); }
    .main-grid {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: auto auto 1fr;
      grid-auto-rows: auto;
    }
    .time-display { grid-column: 1 / 3; }
    .search-section { grid-column: 3 / 5; grid-row: 1 / 3; }
    .weather-section { grid-column: 1 / 2; grid-row: 2 / 3; }
    .quote-section { grid-column: 2 / 3; grid-row: 2 / 3; }
    .apps-section { grid-column: 1 / 5; grid-row: 3 / 4; }
}

/* --- WIDGET & GLASS EFFECT --- */
.widget {
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-l);
  padding: var(--gap-m);
  box-shadow: var(--shadow-s);
  transition: transform var(--t-normal) var(--t-timing-smooth), 
              box-shadow var(--t-normal) var(--t-timing-smooth);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Important for child elements */
  display: none; /* Hidden by default */
}
.widget.visible {
  display: flex;
}
.widget:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-m);
}

/* --- HEADER --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.logo {
  font-size: var(--fluid-header-font);
  font-weight: 700;
  background: linear-gradient(45deg, var(--acc), var(--ah));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.controls {
  display: flex;
  align-items: center;
  gap: var(--gap-s);
}
.control-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  transition: all var(--t-fast) var(--t-timing-smooth);
}
.control-btn:hover {
  background: rgba(var(--acc-rgb), 0.1);
  color: var(--ah);
  transform: scale(1.1);
}
.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--acc);
  color: var(--bg);
  font-weight: 600;
  cursor: pointer;
  transition: transform var(--t-normal) var(--t-timing-elastic);
}
.user-avatar:hover {
  transform: scale(1.1);
}

/* --- TIME & DATE --- */
.time-display {
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 180px;
}
#time {
  font-size: var(--fluid-time-font);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
  background: linear-gradient(45deg, var(--fg), var(--dim));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
#date {
  font-size: clamp(0.8rem, 2vw, 1rem);
  color: var(--dim);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* --- SEARCH --- */
.search-section { justify-content: center; }
.search-engines {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-s);
  margin-bottom: var(--gap-m);
}
.search-engine {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: 0.875rem;
  background: rgba(var(--acc-rgb), 0.05);
  border: 1px solid transparent;
  transition: all var(--t-normal) var(--t-timing-elastic);
}
.search-engine:hover {
  transform: translateY(-2px);
  background: rgba(var(--acc-rgb), 0.15);
}
.search-engine.active {
  background: var(--acc);
  color: var(--bg);
  box-shadow: 0 4px 15px rgba(var(--acc-rgb), 0.3);
  transform: translateY(-2px) scale(1.05);
}
.search-box {
  display: flex;
  align-items: center;
  padding: 0 var(--gap-m);
  height: 56px;
  border-radius: var(--radius-m);
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.1);
  transition: all var(--t-normal) var(--t-timing-smooth);
}
.search-box:focus-within {
  border-color: var(--acc);
  box-shadow: 0 0 0 3px rgba(var(--acc-rgb), 0.3);
}
.search-icon { font-size: 1.5rem; color: var(--dim); }
#search {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--fg);
  font-size: 1rem;
  outline: none;
  margin-left: var(--gap-s);
  height: 100%;
}
#search::placeholder { color: var(--dim); }

/* --- WEATHER --- */
.weather-section {
    justify-content: space-between;
}
.weather-content {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    margin: auto 0;
}
.weather-icon {
    font-size: 3rem;
    color: var(--acc);
}
.weather-temp {
    font-size: 2rem;
    font-weight: 600;
}
.weather-desc {
    color: var(--dim);
}
.weather-location {
    text-align: center;
    font-size: 0.8rem;
    color: var(--dim);
    font-weight: 500;
}


/* --- QUOTE --- */
.quote-section {
  justify-content: center;
  align-items: center;
  text-align: center;
}
#quote-text {
  font-size: 1rem;
  font-style: italic;
  line-height: 1.6;
  position: relative;
  max-width: 90%;
}
#quote-text::before {
  content: '“';
  position: absolute;
  top: -0.5em;
  left: -0.6em;
  font-size: 3em;
  color: rgba(var(--acc-rgb), 0.2);
}
#quote-author {
  margin-top: var(--gap-s);
  color: var(--dim);
  font-weight: 500;
}

/* --- APPS --- */
.apps-section {
    justify-content: space-between;
}
.apps-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--gap-m);
  flex-grow: 1;
}
.app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  aspect-ratio: 1 / 1;
  padding: var(--gap-s);
  border-radius: var(--radius-m);
  background: rgba(var(--acc-rgb), 0.05);
  transition: all var(--t-normal) var(--t-timing-elastic);
}
.app-card:hover {
  transform: scale(1.08);
  background: rgba(var(--acc-rgb), 0.15);
  color: var(--ah);
}
.app-card .icon {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}
.app-card .label {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.2;
}

/* --- DYNAMIC ISLAND --- */
.dynamic-island-container {
    position: fixed;
    top: var(--gap-m);
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    transition: all var(--t-slow) var(--t-timing-smooth);
}
.dynamic-island {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    padding: 0.5rem;
    background-color: #000;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-l);
    color: #fff;
    cursor: pointer;
    transition: all var(--t-slow) var(--t-timing-elastic);
    min-width: 200px;
    height: 48px;
    position: relative;
}
.dynamic-island.expanded {
    min-width: 300px;
}
.island-content {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    padding: 0 0.5rem;
    overflow: hidden;
    white-space: nowrap;
}
#islandIcon { font-size: 1.5rem; color: var(--acc); }
.island-details { display: flex; flex-direction: column; }
#islandTitle { font-weight: 600; font-size: 0.9rem; }
#islandSubtitle { font-size: 0.8rem; color: var(--dim); }
.island-waveform {
    display: none;
    align-items: center;
    gap: 3px;
    position: absolute;
    right: 1rem;
}
.island-waveform.active { display: flex; }
.island-waveform span {
    width: 3px;
    height: 16px;
    background: var(--acc);
    border-radius: 2px;
    animation: wave 1.2s ease-in-out infinite alternate;
}
.island-waveform span:nth-child(2) { animation-delay: -0.3s; }
.island-waveform span:nth-child(3) { animation-delay: -0.6s; }
@keyframes wave {
  from { transform: scaleY(0.2); }
  to { transform: scaleY(1); }
}

/* --- SETTINGS PANEL --- */
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--t-normal) var(--t-timing-smooth), visibility var(--t-normal) var(--t-timing-smooth);
}
.settings-overlay.visible {
  opacity: 1;
  visibility: visible;
}
.settings-panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-l);
  padding: var(--gap-l);
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-l);
  position: relative;
  transform: scale(0.95);
  transition: transform var(--t-normal) var(--t-timing-smooth);
}
.settings-overlay.visible .settings-panel {
  transform: scale(1);
}
.settings-panel h3 {
  margin-bottom: var(--gap-l);
  text-align: center;
}
.setting-group {
  margin-bottom: var(--gap-l);
}
.setting-group label {
  display: block;
  font-weight: 600;
  margin-bottom: var(--gap-s);
  color: var(--dim);
}
.theme-selector {
  display: flex;
  gap: var(--gap-s);
}
.theme-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--glass-border);
  transition: transform var(--t-fast);
}
.theme-option:hover {
  transform: scale(1.1);
}
.theme-option.active {
  border-color: var(--acc);
  box-shadow: 0 0 0 2px var(--acc);
}
.theme-option[data-theme="dark"] { background-color: #101010; }
.theme-option[data-theme="light"] { background-color: #f2f2f7; }
.theme-option[data-theme="ocean"] { background-color: #0a192f; }
.theme-option[data-theme="forest"] { background-color: #1e392a; }
.theme-option[data-theme="glass"] { background-image: linear-gradient(45deg, #ff69b4, #8a4ed4); }

.widget-toggles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap-s);
}
.widget-toggles label {
  display: flex;
  align-items: center;
  gap: var(--gap-s);
  font-weight: 500;
  color: var(--fg);
}
input[type="checkbox"] {
  accent-color: var(--acc);
}

.close-settings-btn {
  position: absolute;
  top: var(--gap-s);
  right: var(--gap-s);
  width: 36px;
  height: 36px;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--dim);
  transition: color var(--t-fast);
}
.close-settings-btn:hover {
  color: var(--fg);
}


/* --- UTILITIES --- */
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

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
