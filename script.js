/* styles.css - MKWEB OS 7: Performance Optimized Polish & Dynamic Animations */
:root {
  /* Global Design Variables - Tuned for balanced polish and performance (MKWEB OS 7 Refinements) */
  --t: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* Slightly faster, still smooth transitions */
  --r: 22px; /* Slightly less rounded, still soft */
  --s: 0 12px 35px rgba(0,0,0,0.18); /* Moderate depth shadow */
  --sh: 0 20px 60px rgba(0,0,0,0.35); /* Prominent but optimized hover shadow */
  --s-light: 0 6px 15px rgba(0,0,0,0.09); /* Lighter shadow for subtle lift */
  --border-width: 1.2px; /* Slightly thinner borders for crispness */
  --text-gradient-angle: 60deg;
  --glass-reflection: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 55%, rgba(255, 255, 255, 0.02) 100%); /* Slightly less opaque reflection */
  --glow-strength: 0 0 12px; /* Reduced base glow strength for performance */
  --glow-color: var(--acc);
  --blur-intensity: 20px; /* Main backdrop-filter blur value - slightly reduced */
  --saturate-intensity: 170%; /* Slightly reduced saturate for glass effect */
  --content-max-width: 1300px; /* Slightly narrower max width */
  --inner-shadow-strength: inset 0 0 8px rgba(0,0,0,0.08); /* Slightly less prominent inner shadow */
}

/* Themed Variables - no change here for performance */
[data-theme="dark"] {
  --bg: linear-gradient(135deg, #050505 0%, #0e0e0e 100%);
  --fg: #e8e8e8;
  --dim: rgba(232,232,232,0.55);
  --acc: #a56ddf;
  --ah: #c08cff;
  --gl: rgba(255,255,255,0.05); /* Slightly less opaque glass background */
  --gb: rgba(255,255,255,0.18); /* Slightly less opaque, defined glass border */
  --inner-shadow: var(--inner-shadow-strength);
  --acc-rgb: 165, 109, 223;
  --fg-rgb: 232, 232, 232;
  --ah-rgb: 192, 140, 255;
  --gb-rgb: 255, 255, 255;
}

[data-theme="light"] {
  --bg: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  --fg: #212529;
  --dim: rgba(33,37,41,0.55);
  --acc: #007bff;
  --ah: #3399ff;
  --gl: rgba(0,0,0,0.05); /* Slightly less opaque glass background */
  --gb: rgba(0,0,0,0.13); /* Slightly less opaque, defined glass border */
  --inner-shadow: var(--inner-shadow-strength);
  --acc-rgb: 0, 123, 255;
  --fg-rgb: 33, 37, 41;
  --ah-rgb: 51, 153, 255;
  --gb-rgb: 0, 0, 0;
}

/* Base Styles */
html {
  scroll-behavior: smooth;
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
  min-height: 100vh;
  transition: background var(--t), color var(--t);
  overflow-x: hidden;
  position: relative;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  perspective: 1200px; /* REDUCED: Still 3D, but less extreme for better performance */
}

/* Animated Background Elements - OPTIMIZED for performance */
.background-shape {
  content: '';
  position: fixed;
  border-radius: 50%;
  opacity: 0.04; /* Slightly lower opacity */
  filter: blur(60px); /* REDUCED blur for performance */
  z-index: -1;
  pointer-events: none;
  width: 450px; /* Slightly smaller base size */
  height: 450px; /* Slightly smaller base size */
  background: var(--acc);
  /* Slower animations for reduced CPU/GPU load */
  animation: floatEffect 60s ease-in-out infinite alternate, pulseOpacity 8s infinite alternate;
  will-change: transform, opacity, filter;
}

@keyframes floatEffect {
  0% { transform: translate3d(0, 0, 0) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  20% { transform: translate3d(25px, 30px, -70px) scale(1.03) rotateX(4deg) rotateY(3deg) rotateZ(1.5deg); } /* Slightly less aggressive 3D movements */
  40% { transform: translate3d(-20px, -25px, 40px) scale(0.97) rotateX(-3deg) rotateY(-4deg) rotateZ(-2deg); }
  60% { transform: translate3d(18px, -20px, -60px) scale(1.02) rotateX(3deg) rotateY(3deg) rotateZ(1.2deg); }
  80% { transform: translate3d(-8px, 12px, 15px) scale(0.99) rotateX(-1deg) rotateY(-2deg) rotateZ(-0.7deg); }
  100% { transform: translate3d(0, 0, 0) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
}

@keyframes pulseOpacity {
    0% { opacity: 0.04; }
    50% { opacity: 0.06; } /* Reduced peak opacity */
    100% { opacity: 0.04; }
}

.grain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px); /* Slightly less visible grain */
  background-size: 80px 80px; /* Larger pattern for less dense, less frequent noise */
  animation: grain 0.5s steps(1) infinite; /* Slower step animation for less energetic noise */
  pointer-events: none;
  z-index: 0;
  opacity: 0.2; /* Slightly lower opacity */
}

@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-0.3%, 0.3%); } /* Smaller translation for more subtle movement */
}

.container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding: 3.5rem; /* Slightly reduced padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem; /* Slightly reduced gap */
}

/* Glassmorphism Base Style with optimized reflection and 3D hover */
.glass {
  background: var(--gl);
  backdrop-filter: blur(var(--blur-intensity)) saturate(var(--saturate-intensity));
  border: var(--border-width) solid var(--gb);
  border-radius: var(--r);
  box-shadow: var(--s), var(--inner-shadow);
  transition: background var(--t), border-color var(--t), box-shadow var(--t), transform var(--t), backdrop-filter var(--t), filter var(--t);
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow, border-color, background, backdrop-filter, filter;

  &::after { /* Reflection optimization */
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--glass-reflection);
    pointer-events: none;
    opacity: 0.8; /* Slightly less visible reflection */
    transition: opacity var(--t);
  }

  &:hover {
    transform: perspective(1000px) rotateX(1.5deg) rotateY(-1.5deg) translateY(-8px) scale(1.005); /* Slightly less intense 3D tilt and lift */
    box-shadow: var(--sh), var(--inner-shadow), var(--glow-strength) rgba(var(--acc-rgb), 0.3); /* Reduced glow strength on hover */
  }

  &::before { /* Animated glowing border on hover - optimized */
    content: '';
    position: absolute;
    top: -2px; left: -2px; right: -2px; bottom: -2px; /* Thinner border for glow */
    border-radius: calc(var(--r) + 2px);
    background: linear-gradient(45deg, var(--acc), var(--ah), var(--acc));
    z-index: -1;
    opacity: 0;
    transition: opacity var(--t), filter var(--t);
    filter: blur(8px); /* Reduced blur for performance */
  }

  &:hover::before {
    opacity: 1;
    filter: blur(10px); /* Reduced blur on hover */
  }
}

/* Animation for elements appearing on scroll - optimized */
.animate-in {
  opacity: 0;
  transform: translateY(25px) scale(0.97) rotateX(3deg); /* Slightly less aggressive initial state */
  animation: fadeInSlideUp 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; /* Slightly faster, still impactful animation */
  will-change: opacity, transform;
}

@keyframes fadeInSlideUp {
  to {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: var(--content-max-width);
  padding: 2.5rem 3rem; /* Slightly reduced padding */
}

.logo {
  font-size: 3.5rem; /* Slightly smaller logo */
  font-weight: 900;
  background: linear-gradient(var(--text-gradient-angle), var(--acc), var(--fg), var(--acc));
  background-size: 400% 400%; /* Smaller gradient area for less calculation */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 25s ease infinite alternate, logoGlowPulse 5s infinite alternate ease-in-out; /* Slower gradient, slower pulse */
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.25); /* Reduced logo glow */
  position: relative;
  will-change: background-position, text-shadow;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

/* Optimized breathing glow for logo */
@keyframes logoGlowPulse {
    0% { text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.15); } /* Reduced base glow */
    100% { text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.35); } /* Reduced peak glow */
}

.controls {
  display: flex;
  gap: 1.5rem; /* Slightly reduced gap */
  align-items: center;
  flex-wrap: wrap;
}

/* Buttons Styling - Optimized */
button {
  padding: 1rem 2.2rem; /* Slightly smaller padding */
  border: var(--border-width) solid var(--gb);
  border-radius: var(--r);
  background: var(--gl);
  color: var(--fg);
  cursor: pointer;
  transition: border-color var(--t), transform var(--t), box-shadow var(--t), background var(--t), color var(--t);
  font-size: 1rem;
  font-weight: 600;
  outline: none;
  box-shadow: var(--s-light);
  position: relative;
  z-index: 1;
  overflow: hidden;
  will-change: transform, box-shadow, border-color, background, color;

  &:active { /* Optimized press effect */
    transform: translateY(3px) scale(0.97); /* Slightly less aggressive press */
    box-shadow: var(--s-light), inset 0 4px 10px rgba(0,0,0,0.2); /* Slightly less intense inner shadow */
    background: rgba(var(--gl-rgb), 0.08);
  }
}

button:hover {
  border-color: var(--acc);
  transform: translateY(-7px) scale(1.02); /* Slightly less pronounced lift and scale */
  box-shadow: var(--sh), var(--glow-strength) rgba(var(--acc-rgb), 0.4); /* Reduced glow on hover */
}

/* Animated hover glow border for buttons - optimized */
button::after {
  content: '';
  position: absolute;
  top: -3px; bottom: -3px; left: -3px; right: -3px; /* Slightly thinner border for glow */
  border-radius: calc(var(--r) + 3px);
  background: linear-gradient(45deg, var(--acc), var(--ah), var(--acc)) border-box;
  -webkit-mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity var(--t), filter var(--t);
  z-index: -1;
  will-change: opacity;
  filter: blur(8px); /* Reduced blur for performance */
}

button:hover::after {
  opacity: 1;
  filter: blur(10px); /* Reduced blur on hover */
}

/* User Avatar Toggle & Avatar Itself - Optimized */
.hidden-avatar {
  opacity: 0 !important;
  transform: scale(0.5) !important; /* Slightly less aggressive scale */
  pointer-events: none !important;
  transition: opacity var(--t), transform var(--t) !important;
}

#user-avatar-toggle {
  padding: 1rem 2.2rem;
  border-radius: var(--r);
  background: var(--gl);
  border: var(--border-width) solid var(--gb);
  color: var(--fg);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: border-color var(--t), transform var(--t), box-shadow var(--t), background var(--t);
  outline: none;
  box-shadow: var(--s-light);
  will-change: transform, box-shadow, border-color;
}

#user-avatar-toggle:hover {
  border-color: var(--acc);
  transform: translateY(-7px) scale(1.02);
  box-shadow: var(--sh), var(--glow-strength) rgba(var(--acc-rgb), 0.3);
}

.user-avatar {
  width: 55px; /* Slightly smaller avatar */
  height: 55px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem; /* Slightly smaller icon */
  background: var(--gl);
  border: var(--border-width) solid var(--gb);
  color: var(--acc);
  cursor: pointer;
  transition: border-color var(--t), transform var(--t), box-shadow var(--t), background var(--t);
  box-shadow: var(--s-light);
  overflow: hidden;
  will-change: transform, box-shadow, border-color;
}

.user-avatar:hover {
  transform: scale(1.15) rotate(3deg); /* Slightly less distinct scale and rotation */
  border-color: var(--acc);
  box-shadow: var(--glow-strength) var(--acc), var(--sh);
}

/* Main Content Layout */
.main {
  width: 100%;
  max-width: var(--content-max-width);
  display: flex;
  flex-direction: column;
  gap: 4rem; /* Slightly reduced gap */
}

.search-section { padding: 3rem; } /* Slightly less padding */

/* Search Engines - Optimized */
.search-engines {
  display: flex;
  gap: 1.5rem; /* Slightly reduced gap */
  margin-bottom: 3rem; /* Slightly reduced margin */
  flex-wrap: wrap;
  justify-content: center;
}

.search-engine {
  padding: 1rem 2.5rem; /* Slightly smaller padding */
  border-radius: 50px;
  font-weight: 700;
  border: var(--border-width) solid transparent;
  background: var(--gl);
  box-shadow: inset 0 0 0 transparent;
  transition: border-color var(--t), transform var(--t), box-shadow var(--t), background var(--t), color var(--t);
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow, background-color, border-color, color;

  &.active {
    background: var(--acc);
    color: #fff;
    transform: scale(1.04) translateY(-5px); /* Slightly less distinct pop-out effect */
    box-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.3), var(--s); /* Reduced glow when active */
    border-color: var(--acc);
    animation: activeEnginePulse 2.5s infinite alternate ease-in-out; /* Slower, more subtle pulse when active */
  }

  &:not(.active):hover {
    border-color: var(--acc);
    transform: translateY(-3px) scale(1.01); /* Slightly less pronounced hover */
    box-shadow: inset 0 0 12px rgba(var(--acc-rgb), 0.15), var(--s-light); /* Lighter inner glow, reduced outer shadow */
  }
}

@keyframes activeEnginePulse {
  0% { transform: scale(1.04) translateY(-5px); box-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.25), var(--s); }
  100% { transform: scale(1.045) translateY(-5.5px); box-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.4), var(--s); }
}

/* Search Box - Optimized */
.search-box {
  display: flex;
  align-items: center;
  background: var(--gl);
  border: var(--border-width) solid var(--gb);
  border-radius: 50px;
  padding: 1.8rem 2.5rem; /* Slightly less padding */
  transition: border-color var(--t), transform var(--t), box-shadow var(--t);
  position: relative;
  overflow: hidden;
  box-shadow: var(--s), var(--inner-shadow);
  will-change: transform, box-shadow, border-color;
}

.search-box:focus-within {
  border-color: var(--acc);
  transform: scale(1.005); /* Even more subtle scale on focus */
  box-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.4), var(--s); /* Reduced glow on focus */
}

/* Optimized search box focus animation */
.search-box:focus-within::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px; /* Thinner animated border */
    background: linear-gradient(90deg, transparent, var(--acc), transparent);
    animation: borderScan 1.2s infinite linear; /* Slower, less prominent continuous scanline animation */
    will-change: transform;
    border-radius: 0 0 50px 50px;
}

@keyframes borderScan {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

#search {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--fg);
  font-size: 1.3rem; /* Slightly smaller */
  outline: none;
  margin-left: 1.2rem; /* Slightly less margin */
  text-shadow: 0 0 4px rgba(var(--fg-rgb), 0.1); /* Reduced text shadow */
}

#search::placeholder {
  color: var(--dim);
  opacity: 0.65;
  transition: opacity 0.2s ease;
}

#search:focus::placeholder {
  opacity: 0.25;
}

/* Time Display - Optimized */
.time-display {
  text-align: center;
  padding: 4rem; /* Slightly less padding */
}

#time {
  font-size: 6.5rem; /* Slightly smaller time display */
  font-weight: 900;
  margin-bottom: 1.5rem; /* Slightly less margin */
  background: linear-gradient(var(--text-gradient-angle), var(--acc), var(--fg), var(--acc));
  background-size: 500% 500%; /* Reduced gradient area */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 20s ease infinite alternate, pulseText 5s infinite alternate; /* Slower pulse, slower gradient */
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.2); /* Reduced text glow */
  will-change: background-position, text-shadow;
}

/* Optimized pulse for time display */
@keyframes pulseText {
  0% { text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.15), 0 0 10px rgba(var(--fg-rgb), 0.08); }
  50% { text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.35), 0 0 15px rgba(var(--fg-rgb), 0.12); }
  100% { text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.15), 0 0 10px rgba(var(--fg-rgb), 0.08); }
}

#date {
  font-size: 1.8rem; /* Slightly smaller */
  color: var(--dim);
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 4px; /* Slightly less letter spacing */
}

/* Quick Actions - Optimized */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Slightly smaller min width */
  gap: 2.5rem; /* Slightly reduced gap */
  padding: 0 2.5rem; /* Slightly reduced padding */
}

.action-card {
  background: var(--gl);
  border: var(--border-width) solid var(--gb);
  border-radius: var(--r);
  padding: 2.5rem 1.8rem; /* Slightly less padding */
  text-align: center;
  text-decoration: none;
  color: var(--fg);
  transition: border-color var(--t), transform var(--t), box-shadow var(--t), background var(--t);
  position: relative;
  overflow: hidden;
  box-shadow: var(--s), var(--inner-shadow);
  will-change: transform, box-shadow, border-color;
}

.action-card::before { /* Optimized shimmer effect on hover */
  content: '';
  position: absolute;
  top: 0;
  left: -180%; /* Slightly less travel distance */
  width: 50%; /* Slightly thinner shimmer */
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); /* Reduced opacity */
  transition: left var(--t) ease-out;
  z-index: 1;
  transform: skewX(-20deg); /* Slightly less skew */
  pointer-events: none;
  will-change: left;
}

.action-card:hover::before {
  left: 180%; /* Slightly less travel distance */
}

.action-card:hover {
  transform: translateY(-10px) scale(1.03) rotateX(1deg); /* Slightly less intense lift, scale and subtle 3D tilt */
  border-color: var(--acc);
  box-shadow: var(--sh), var(--glow-strength) rgba(var(--acc-rgb), 0.3); /* Reduced glow */
}

.action-card .icon, .action-card .label {
  position: relative;
  z-index: 2;
}

.icon {
  font-size: 4.5rem; /* Slightly smaller icon */
  margin-bottom: 1.5rem; /* Slightly less margin */
  display: block;
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.25); /* Reduced icon glow */
  transition: transform 0.2s ease-out, text-shadow 0.2s ease-out; /* Slightly faster transition */
  will-change: transform;
}

.action-card:hover .icon {
  transform: scale(1.15) rotate(3deg); /* Slightly less intense icon rotation and scale on hover */
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.4); /* Reduced glow on hover */
}

/* Label animation on hover - optimized */
.action-card .label {
  transition: transform 0.2s ease-out, opacity 0.2s ease-out; /* Slightly faster transition */
  will-change: transform, opacity;
}

.action-card:hover .label {
  transform: translateY(-8px); /* Slide up slightly less */
  opacity: 0.98;
}

/* News and Bookmark Sections - Optimized */
.news-section, .bookmark-section {
  padding: 3.5rem; /* Slightly less padding */
}

.news-section h2, .bookmark-section h2 {
  margin-bottom: 2.5rem; /* Slightly less margin */
  font-size: 2.8rem; /* Slightly smaller */
  font-weight: 900;
  text-align: center;
  background: linear-gradient(var(--text-gradient-angle), var(--acc), var(--fg));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.2); /* Reduced heading glow */
}

/* News Section Button Styling - Optimized */
.news-section.button-style {
  font-size: 1.3rem; /* Slightly smaller text */
  padding: 2rem 3rem; /* Adjusted padding */
  text-align: center;
  color: var(--fg);
  text-shadow: 0 0 4px rgba(var(--fg-rgb), 0.1); /* Slightly reduced text shadow */
  transition: border-color var(--t), transform var(--t), box-shadow var(--t), background var(--t);
  display: block;
  margin-top: 1.8rem; /* Slightly less space from heading */
  background: var(--gl);
  border: var(--border-width) solid var(--gb);
  border-radius: var(--r);
  box-shadow: var(--s), var(--inner-shadow);
  text-decoration: none;
  will-change: transform, box-shadow, border-color;
}

.news-section.button-style:hover {
  transform: translateY(-10px) scale(1.02); /* Slightly less stronger lift and scale */
  border-color: var(--acc);
  box-shadow: var(--s), var(--glow-strength) rgba(var(--acc-rgb), 0.2); /* Reduced glow */
}

.news-grid, .bookmark-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); /* Slightly smaller min width for cards */
  gap: 2.5rem; /* Slightly reduced gap */
}

.news-card, .bookmark-card {
  background: var(--gl);
  border: var(--border-width) solid var(--gb);
  border-radius: var(--r);
  padding: 2.5rem; /* Slightly less padding */
  text-decoration: none;
  color: var(--fg);
  transition: border-color var(--t), transform var(--t), box-shadow var(--t), background var(--t);
  position: relative;
  overflow: hidden;
  box-shadow: var(--s), var(--inner-shadow);
  will-change: transform, box-shadow, border-color;
}

.news-card:hover, .bookmark-card:hover {
  transform: translateY(-10px) scale(1.02) rotateX(0.5deg); /* Slightly less intense lift, scale, slight X-axis tilt */
  border-color: var(--acc);
  box-shadow: var(--s), var(--glow-strength) rgba(var(--acc-rgb), 0.2); /* Reduced glow */
}

.news-card h3 {
  margin-bottom: 1.2rem; /* Slightly less margin */
  font-size: 1.7rem; /* Slightly smaller */
  font-weight: 700;
  text-shadow: 0 0 6px rgba(var(--fg-rgb), 0.15); /* Slightly less visible text shadow */
}

.news-card p {
  color: var(--dim);
  margin-bottom: 1.8rem; /* Slightly less margin */
  line-height: 1.6;
  font-size: 1.1rem; /* Slightly smaller */
}

.news-source {
  font-size: 1rem; /* Slightly smaller */
  color: var(--acc);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px; /* Slightly less letter spacing */
}

.bookmark-card {
  display: flex;
  align-items: center;
  gap: 1.8rem; /* Slightly less gap */
  transition: all var(--t);
}

.bookmark-card span:first-child {
  font-size: 2.8rem; /* Slightly smaller */
  text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.25);
  transition: transform 0.2s ease-out, text-shadow 0.2s ease-out; /* Slightly faster transition */
}

.bookmark-card:hover span:first-child {
    transform: scale(1.15) rotate(-3deg); /* Slightly less distinct scale and rotation on hover */
    text-shadow: var(--glow-strength) rgba(var(--acc-rgb), 0.4); /* Reduced glow on hover */
}

.bookmark-card > div > div:first-child {
  font-weight: 700;
  font-size: 1.3rem; /* Slightly smaller */
}

.bookmark-card > div > div:last-child {
  font-size: 1rem; /* Slightly smaller */
  color: var(--dim);
}

/* Scrollbar Styling (Optimized customization) */
::-webkit-scrollbar {
  width: 8px; /* Thinner scrollbar */
  background-color: transparent;
  border-radius: 4px;
}

::-webkit-scrollbar-track {
    background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(var(--acc-rgb), 0.6); /* Slightly less opaque accent */
  border-radius: 4px;
  border: 1px solid rgba(var(--gb-rgb), 0.1); /* Slightly less visible border */
  transition: background-color var(--t);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(var(--ah-rgb), 0.75); /* Slightly less opaque on hover */
}

/* SR-Only class for accessibility - no change */
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

/* Scroll-to-top button styles - Optimized */
.scroll-to-top {
    position: fixed;
    bottom: 30px; /* Slightly lower */
    right: 30px; /* Slightly less right */
    background: var(--acc);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 55px; /* Slightly smaller */
    height: 55px; /* Slightly smaller */
    font-size: 1.8rem; /* Slightly smaller icon */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px); /* Slightly less initial displacement */
    transition: opacity var(--t), transform var(--t), visibility var(--t), background var(--t);
    box-shadow: var(--s), var(--glow-strength) rgba(var(--acc-rgb), 0.15); /* Reduced glow */
    z-index: 1000;
}

.scroll-to-top.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.scroll-to-top:hover {
    background: var(--ah);
    transform: translateY(-8px) rotate(8deg); /* Slightly less pronounced lift and rotation */
    box-shadow: var(--sh), var(--glow-strength) rgba(var(--acc-rgb), 0.3); /* Reduced glow */
}

/* Media Queries for Responsiveness - adjusted to new sizes */
@media (max-width: 1200px) {
  .logo { font-size: 3rem; }
  #time { font-size: 6rem; }
  .quick-actions { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
  .news-grid, .bookmark-grid { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
  .header { padding: 2rem 2.5rem; }
  .search-section, .time-display, .news-section, .bookmark-section { padding: 2.5rem; }
  .glass { backdrop-filter: blur(18px) saturate(var(--saturate-intensity)); }
  .action-card { padding: 2.2rem 1.2rem; }
  .icon { font-size: 4rem; }
  button { padding: 0.9rem 1.8rem; font-size: 0.95rem; }
  .user-avatar { width: 50px; height: 50px; font-size: 1.8rem; }
}

@media (max-width: 992px) {
  .container { padding: 3rem; gap: 3.5rem; }
  .header { flex-direction: column; gap: 1.5rem; padding: 1.8rem; }
  .controls { justify-content: center; gap: 1.2rem; }
  .logo { font-size: 2.8rem; }
  #time { font-size: 5.5rem; }
  #date { font-size: 1.6rem; letter-spacing: 3px; }
  .quick-actions { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); padding: 0 2rem; gap: 2rem;}
  .search-section, .time-display, .news-section, .bookmark-section { padding: 2rem; }
  .news-section h2, .bookmark-section h2 { font-size: 2.5rem; }
  .search-box { padding: 1.5rem 2.2rem; }
  #search { font-size: 1.2rem; }
  .glass { backdrop-filter: blur(15px) saturate(var(--saturate-intensity)); }
  .user-avatar, #user-avatar-toggle { width: 45px; height: 45px; font-size: 1.6rem; }
  .action-card { padding: 2rem 1rem; }
  .icon { font-size: 3.5rem; }
  button { padding: 0.8rem 1.5rem; font-size: 0.9rem; }
}

@media (max-width: 768px) {
  .container { padding: 2.5rem; gap: 3rem; }
  .header { padding: 1.5rem; }
  .logo { font-size: 2.5rem; }
  button { padding: 0.7rem 1.2rem; font-size: 0.85rem; border-radius: 18px; }
  .user-avatar, #user-avatar-toggle { width: 40px; height: 40px; font-size: 1.4rem; }
  .search-section { padding: 1.8rem; }
  .search-engine { padding: 0.9rem 1.8rem; font-size: 0.85rem; border-radius: 35px; }
  .search-box { padding: 1.3rem 1.8rem; border-radius: 35px; }
  #search { font-size: 1.1rem; margin-left: 1rem; }
  #time { font-size: 4.8rem; margin-bottom: 1.2rem;}
  #date { font-size: 1.4rem; letter-spacing: 2.5px; }
  .quick-actions { grid-template-columns: 1fr; padding: 0 1.8rem; gap: 1.8rem; }
  .action-card { padding: 1.8rem 0.8rem; }
  .icon { font-size: 3rem; margin-bottom: 0.9rem; }
  .news-section, .bookmark-section { padding: 1.8rem; }
  .news-section h2, .bookmark-section h2 { font-size: 2.2rem; margin-bottom: 2rem;}
  .news-grid, .bookmark-grid { grid-template-columns: 1fr; gap: 2rem; }
  .news-card, .bookmark-card { padding: 2rem; }
  .news-card h3 { font-size: 1.5rem; }
  .news-card p { font-size: 1.05rem; margin-bottom: 1.3rem;}
  .bookmark-card span:first-child { font-size: 2.5rem; }
  .bookmark-card > div > div:first-child { font-size: 1.2rem; }
  .bookmark-card > div > div:last-child { font-size: 0.95rem; }
  .glass { backdrop-filter: blur(12px) saturate(var(--saturate-intensity)); }
}

@media (max-width: 480px) {
  .container { padding: 2rem; gap: 2.5rem; }
  .header { padding: 1.5rem; gap: 0.8rem; }
  .logo { font-size: 2rem; }
  button { padding: 0.6rem 1rem; font-size: 0.75rem; border-radius: 15px; }
  .user-avatar, #user-avatar-toggle { width: 35px; height: 35px; font-size: 1.2rem; }
  .search-section { padding: 1.5rem; }
  .search-engine { padding: 0.7rem 1.3rem; font-size: 0.75rem; border-radius: 30px; }
  .search-box { padding: 1rem 1.3rem; border-radius: 30px; }
  #search { font-size: 0.95rem; margin-left: 0.8rem; }
  #time { font-size: 3.5rem; margin-bottom: 0.8rem;}
  #date { font-size: 1rem; letter-spacing: 1.5px; }
  .quick-actions { padding: 0 1.2rem; gap: 1.2rem; }
  .action-card { padding: 1.5rem 0.6rem; }
  .icon { font-size: 2.5rem; margin-bottom: 0.7rem; }
  .news-section, .bookmark-section { padding: 1.5rem; }
  .news-section h2, .bookmark-section h2 { font-size: 1.8rem; margin-bottom: 1.8rem;}
  .news-card, .bookmark-card { padding: 1.8rem; }
  .news-card h3 { font-size: 1.3rem; }
  .news-card p { font-size: 0.95rem; margin-bottom: 1rem;}
  .bookmark-card span:first-child { font-size: 2rem; }
  .bookmark-card > div > div:first-child { font-size: 1.1rem; }
  .bookmark-card > div > div:last-child { font-size: 0.9rem; }
  .glass { backdrop-filter: blur(8px) saturate(var(--saturate-intensity)); }
}

/* Fallback for browsers that don't support backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .glass {
    background: rgba(var(--fg-rgb), 0.2); /* Slightly less opaque background without blur for fallback */
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

/* Optional: Class to remove all animations for extreme performance needs - no change */
body.no-animations * {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    will-change: auto !important;
    filter: none !important;
}
