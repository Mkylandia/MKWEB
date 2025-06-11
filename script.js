// Default-Konfiguration und Persistenz
const DEFAULT = {
  theme:'ocean', font:'Inter', blur:20, particles:true,
  sections:{search:true,time:true,bookmarks:true,news:true,stats:true},
  logo:'MKWEB 2.0', placeholder:'Suche im Web...', bookmarks:[]
};
let cfg = JSON.parse(localStorage.getItem('mkweb')) || DEFAULT;
const save = () => localStorage.setItem('mkweb', JSON.stringify(cfg));

// UI-Elemente
const elems = {
  themePicker: document.getElementById('theme-picker-settings'),
  fontPicker: document.getElementById('font-picker'),
  blurSlider: document.getElementById('blur-slider'),
  blurValue: document.getElementById('blur-value'),
  particlesToggle: document.getElementById('particles-toggle'),
  sectionToggles: ['search','time','bookmarks','news','stats'].reduce((o,s)=>{
    o[s] = document.getElementById(`${s}-toggle`); return o;
  },{}),
  logo: document.getElementById('logo'),
  searchInput: document.getElementById('search'),
  bookmarkGrid: document.getElementById('bookmark-grid'),
};

// Änderungen anwenden
function apply() {
  document.body.dataset.theme = cfg.theme;
  document.body.style.setProperty('--font-family', cfg.font);
  elems.blurValue.textContent = cfg.blur + 'px';
  document.documentElement.style.setProperty('--glass-blur', cfg.blur + 'px');
  elems.themePicker.value = cfg.theme;
  elems.fontPicker.value = cfg.font;
  elems.blurSlider.value = cfg.blur;
  elems.particlesToggle.classList.toggle('active', cfg.particles);
  elems.searchInput.placeholder = cfg.placeholder;
  elems.logo.textContent = cfg.logo;
  Object.entries(cfg.sections).forEach(([sec,val]) => {
    document.getElementById(sec + '-section').style.display = val ? 'block' : 'none';
    elems.sectionToggles[sec].checked = val;
  });
  renderBookmarks();
}

// Favoriten rendern
function renderBookmarks(){
  elems.bookmarkGrid.innerHTML = '';
  cfg.bookmarks.forEach((b,i)=>{
    const a = document.createElement('a');
    a.className = 'bookmark-card glass';
    a.href = b.url; a.target = '_blank';
    a.innerHTML = `<span>${b.icon||'🔖'}</span>
                   <div><div>${b.name}</div><small>${b.url}</small></div>
                   <button class="bookmark-remove" data-i="${i}">×</button>`;
    elems.bookmarkGrid.appendChild(a);
  });
  document.querySelectorAll('.bookmark-remove').forEach(btn=>{
    btn.onclick = e => {
      cfg.bookmarks.splice(e.target.dataset.i,1);
      save(); apply();
    };
  });
}

// Event-Listener
document.getElementById('settings-btn').onclick = _=> showSettings();
document.getElementById('settings-close').onclick = _=> { hideSettings(); save(); };
elems.themePicker.onchange = e=> { cfg.theme = e.target.value; apply(); };
elems.fontPicker.onchange = e=> { cfg.font = e.target.value; apply(); };
elems.blurSlider.oninput = e=> { cfg.blur = e.target.value; apply(); };
elems.particlesToggle.onclick = _=> { cfg.particles = !cfg.particles; apply(); };
Object.entries(elems.sectionToggles).forEach(([sec,el])=>{
  el.onchange = e => { cfg.sections[sec] = e.target.checked; apply(); };
});
document.getElementById('add-bookmark').onclick = _=>{
  const n = document.getElementById('bookmark-name').value;
  const u = document.getElementById('bookmark-url').value;
  const i = document.getElementById('bookmark-icon').value;
  if(n && u) { cfg.bookmarks.push({name:n,url:u,icon:i}); save(); apply(); }
};
document.getElementById('logo-text').oninput = e=>{ cfg.logo = e.target.value; apply(); };
document.getElementById('search-placeholder').oninput = e=>{ cfg.placeholder = e.target.value; apply(); };

// Export, Import, Reset
document.getElementById('export-settings').onclick = _=> {
  const blob = new Blob([JSON.stringify(cfg)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download='mkweb-settings.json'; a.click();
};
document.getElementById('import-settings-btn').onclick = _=> document.getElementById('import-settings').click();
document.getElementById('import-settings').onchange = e=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => { cfg = JSON.parse(ev.target.result); apply(); save(); };
  reader.readAsText(file);
};
document.getElementById('reset-settings').onclick = _=> { cfg = DEFAULT; apply(); save(); };

// Keyboard Shortcuts & Zeit-Update
document.addEventListener('keydown', e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==',') showSettings();
  if((e.ctrlKey||e.metaKey)&&e.key=='/') { e.preventDefault(); elems.searchInput.focus(); }
  if(e.key=='Escape') hideSettings();
});
function updateTime(){
  const now = new Date();
  document.getElementById('time').textContent = now.toLocaleTimeString('de-DE');
  document.getElementById('date').textContent = now.toLocaleDateString('de-DE',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
}
setInterval(updateTime,1000); updateTime();

// Hilfsfunktionen
function showSettings(){ document.getElementById('settings-overlay').style.display='flex'; }
function hideSettings(){ document.getElementById('settings-overlay').style.display='none'; }

// Initialisierung
apply();
