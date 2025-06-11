// — Theme Picker mit localStorage —
const picker = document.getElementById('theme-picker');
const body   = document.body;
const saved  = localStorage.getItem('mkweb-theme') || 'ocean';
picker.value = saved;
body.dataset.theme = saved;

picker.addEventListener('change', () => {
  const t = picker.value;
  body.dataset.theme = t;
  localStorage.setItem('mkweb-theme', t);
});

// — Live-Uhr & Datum —
const timeEl = document.getElementById('time');
function updateClock() {
  const now = new Date();
  timeEl.textContent = now.toLocaleDateString('de-DE', {
    weekday:'short', day:'2-digit', month:'short'
  }) + ' • ' + now.toLocaleTimeString('de-DE');
}
setInterval(updateClock, 1000);
updateClock();

// — Autocomplete-Suche —
const searchBox = document.getElementById('search');
const suggList  = document.getElementById('suggestions');
const terms = ['Google','YouTube','GitHub','Wikipedia','Reddit','StackOverflow'];
searchBox.addEventListener('input', () => {
  const v = searchBox.value.trim().toLowerCase();
  suggList.innerHTML = '';
  if (!v) return suggList.classList.remove('visible');
  terms.filter(t => t.toLowerCase().includes(v))
       .forEach(t => {
         const li = document.createElement('li');
         li.textContent = t;
         li.onclick = () => window.location.href = `https://www.google.com/search?q=${encodeURIComponent(t)}`;
         suggList.append(li);
       });
  suggList.classList.toggle('visible', suggList.childElementCount > 0);
});
searchBox.addEventListener('keydown', e => {
  if (e.key === 'Enter' && searchBox.value.trim()) {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchBox.value)}`;
  }
});

// — Hintergrund-Partikel (Canvas) —
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];
function initParticles() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  particles = Array.from({length:120}, () => ({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*2+1,
    dx: (Math.random()-0.5)*0.4,
    dy: (Math.random()-0.5)*0.4
  }));
}
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,0.2)`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x<0||p.x>canvas.width)  p.dx*=-1;
    if (p.y<0||p.y>canvas.height) p.dy*=-1;
  });
  requestAnimationFrame(draw);
}
window.addEventListener('resize', initParticles);
initParticles();
draw();
