// --- Theme Toggle & Speicherung ---
const toggle = document.getElementById('theme-toggle');
const current = localStorage.getItem('theme') || 'dark';
document.body.classList.add(current);

toggle.addEventListener('click', ()=>{
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  document.body.classList.replace(current, next);
  localStorage.setItem('theme', next);
});

// --- Dynamischer Gruß & Datum/Zeit ---
const greeting = document.getElementById('greeting');
const dt = document.getElementById('datetime');
function updateInfo() {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 12) greeting.textContent = 'Guten Morgen!';
  else if (hour < 18) greeting.textContent = 'Guten Tag!';
  else greeting.textContent = 'Guten Abend!';
  dt.textContent = now.toLocaleDateString() + ' – ' + now.toLocaleTimeString();
}
setInterval(updateInfo, 1000);
updateInfo();

// --- Schnellstart-Kacheln Navigation ---
document.querySelectorAll('.tile').forEach(tile=>{
  tile.addEventListener('click', ()=> window.open(tile.dataset.url, '_blank'));
});

// --- Autocomplete für Suche (Beispiel hartkodiert) ---
const suggestions = ['Google','YouTube','GitHub','Wikipedia','Reddit'];
const inp = document.getElementById('search'), list = document.getElementById('suggestions');
inp.addEventListener('input', ()=>{
  const val = inp.value.toLowerCase();
  list.innerHTML = '';
  if (!val) return;
  suggestions.filter(s=>s.toLowerCase().includes(val))
             .forEach(s=>{
               const li = document.createElement('li');
               li.textContent = s;
               li.onclick = ()=> window.location.href='https://www.google.com/search?q='+encodeURIComponent(s);
               list.append(li);
             });
});
inp.addEventListener('keydown', e=>{ if (e.key==='Enter') window.location.href='https://www.google.com/search?q='+encodeURIComponent(inp.value); });

// --- Partikel-Hintergrund (Canvas) ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function initCanvas() {
  canvas.width = innerWidth; canvas.height = innerHeight;
  particles = Array.from({length:150}, ()=>{
    return {
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*2+1,
      dx: (Math.random()-0.5)*0.5,
      dy: (Math.random()-0.5)*0.5
    };
  });
}
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = 'rgba(0,255,255,0.7)';
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x<0||p.x>canvas.width) p.dx*=-1;
    if (p.y<0||p.y>canvas.height) p.dy*=-1;
  });
  requestAnimationFrame(draw);
}
window.addEventListener('resize', initCanvas);
initCanvas();
draw();
