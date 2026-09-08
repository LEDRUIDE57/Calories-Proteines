const STORAGE_KEY = 'caloriesV1State';
const defaultState = {
  profile: {
    setupDone: false,
    age: 73,
    sex: 'male',
    heightCm: null,
    currentWeightKg: 74,
    startWeightKg: 74,
    goalWeightKg: 72.5,
    activityFactor: 1.375,
    deficitKcal: 225,
    proteinFactor: 1.0,
    apiUrl: ''
  },
  meals: [],
  weights: [{ date: new Date().toISOString(), kg: 74 }]
};

let state = loadState();
let selectedImageData = null;
let currentAnalysis = null;

const $ = (id) => document.getElementById(id);
const round = (n, d = 0) => Number(Number(n).toFixed(d));

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      profile: { ...structuredClone(defaultState.profile), ...(parsed.profile || {}) },
      meals: Array.isArray(parsed.meals) ? parsed.meals : [],
      weights: Array.isArray(parsed.weights) && parsed.weights.length ? parsed.weights : structuredClone(defaultState.weights)
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
}

function calculateTargets() {
  const p = state.profile;
  if (!p.heightCm || !p.currentWeightKg) return { maintenance: null, target: null, protein: null };
  const sexConstant = p.sex === 'female' ? -161 : 5;
  const bmr = 10 * p.currentWeightKg + 6.25 * p.heightCm - 5 * p.age + sexConstant;
  const maintenance = Math.round(bmr * Number(p.activityFactor));
  const target = Math.max(1200, maintenance - Number(p.deficitKcal || 0));
  const protein = Math.round(p.currentWeightKg * Number(p.proteinFactor || 1));
  return { maintenance, target, protein };
}

function mealsForDate(key) {
  return state.meals.filter(m => m.dateKey === key);
}

function totalsForDate(key) {
  return mealsForDate(key).reduce((acc, meal) => {
    acc.calories += Number(meal.calories || 0);
    acc.protein += Number(meal.protein || 0);
    return acc;
  }, { calories: 0, protein: 0 });
}

function progressClass(ratio) {
  if (ratio > 1) return 'over';
  if (ratio >= .9) return 'warn';
  return '';
}

function updateToday() {
  const key = localDateKey();
  const meals = mealsForDate(key).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const total = totalsForDate(key);
  const targets = calculateTargets();

  $('today-date').textContent = formatDate(new Date());
  $('cal-consumed').textContent = Math.round(total.calories);
  $('protein-consumed').textContent = round(total.protein, 1);

  if (!targets.target) {
    $('cal-target').textContent = 'à définir';
    $('cal-remaining').textContent = '—';
    $('maintenance-cal').textContent = '—';
    $('maintenance-gap').textContent = '—';
    $('protein-target').textContent = '—';
    $('protein-remaining').textContent = '—';
    return;
  }

  $('cal-target').textContent = `${targets.target} kcal`;
  const remaining = targets.target - total.calories;
  $('cal-remaining').textContent = remaining >= 0 ? `${Math.round(remaining)} kcal` : `+${Math.abs(Math.round(remaining))} kcal`;
  $('maintenance-cal').textContent = targets.maintenance;
  const maintGap = total.calories - targets.maintenance;
  $('maintenance-gap').textContent = `${maintGap > 0 ? '+' : ''}${Math.round(maintGap)}`;

  const calRatio = total.calories / targets.target;
  $('cal-progress').style.width = `${Math.min(calRatio * 100, 100)}%`;
  $('cal-progress').className = `progress-bar ${progressClass(calRatio)}`;

  $('protein-target').textContent = targets.protein;
  const proteinRemaining = targets.protein - total.protein;
  $('protein-remaining').textContent = proteinRemaining > 0 ? `${round(proteinRemaining, 1)} g` : 'Objectif atteint';
  const proteinRatio = targets.protein ? total.protein / targets.protein : 0;
  $('protein-percent').textContent = `${Math.round(proteinRatio * 100)} %`;
  $('protein-progress').style.width = `${Math.min(proteinRatio * 100, 100)}%`;

  $('meal-count').textContent = `${meals.length} ${meals.length > 1 ? 'entrées' : 'entrée'}`;
  if (!meals.length) {
    $('today-meals').className = 'meal-list empty-state';
    $('today-meals').textContent = 'Aucun repas enregistré.';
  } else {
    $('today-meals').className = 'meal-list';
    $('today-meals').innerHTML = meals.map(meal => `
      <div class="meal-item">
        <div>
          <div class="meal-name">${escapeHtml(meal.type)} · ${escapeHtml(meal.name || 'Repas')}</div>
          <div class="meal-meta">${new Date(meal.timestamp).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}</div>
        </div>
        <div class="meal-nutrition">${Math.round(meal.calories)} kcal<br><span class="muted">${round(meal.protein,1)} g prot.</span></div>
        <button class="meal-delete" data-delete-meal="${meal.id}">Supprimer</button>
      </div>
    `).join('');
  }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `view-${name}`));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  if (name === 'today') updateToday();
  if (name === 'history') renderHistory();
  if (name === 'weight') renderWeight();
  if (name === 'settings') fillSettings();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addMeal({ type, name, calories, protein, items = [], source = 'manual' }) {
  const now = new Date();
  state.meals.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    timestamp: now.toISOString(),
    dateKey: localDateKey(now),
    type,
    name,
    calories: Number(calories),
    protein: Number(protein),
    items,
    source
  });
  saveState();
  updateToday();
}

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.view)));
  $('quick-add').addEventListener('click', () => showView('photo'));
}

function setupFirstRun() {
  if (!state.profile.setupDone) $('setup-dialog').showModal();
  $('setup-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const height = Number($('setup-height').value);
    if (!height) return;
    state.profile.sex = $('setup-sex').value;
    state.profile.heightCm = height;
    state.profile.activityFactor = Number($('setup-activity').value);
    state.profile.setupDone = true;
    saveState();
    $('setup-dialog').close();
    updateToday();
    fillSettings();
  });
}

async function resizeImage(file, maxSide = 1280, quality = .82) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

function setStatus(message, type = '') {
  const el = $('analysis-status');
  el.hidden = false;
  el.className = `notice ${type}`.trim();
  el.textContent = message;
}

function setupPhoto() {
  $('photo-input').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      selectedImageData = await resizeImage(file);
      $('photo-preview').src = selectedImageData;
      $('photo-preview').hidden = false;
      $('photo-placeholder').hidden = true;
      $('analyze-photo').disabled = false;
      $('analysis-panel').hidden = true;
      $('analysis-status').hidden = true;
    } catch {
      setStatus("Impossible de lire cette image. Essayez une autre photo.", 'error');
    }
  });

  $('analyze-photo').addEventListener('click', analyzePhoto);
  $('save-analysis').addEventListener('click', () => {
    if (!currentAnalysis) return;
    addMeal({
      type: $('analysis-meal-type').value,
      name: currentAnalysis.items?.map(i => i.name).slice(0, 3).join(', ') || 'Repas analysé',
      calories: currentAnalysis.total_calories,
      protein: currentAnalysis.total_protein_g,
      items: currentAnalysis.items || [],
      source: 'photo-ai'
    });
    currentAnalysis = null;
    $('analysis-panel').hidden = true;
    setStatus('Repas ajouté à votre journée.', 'success');
    showView('today');
  });

  $('save-manual').addEventListener('click', () => {
    const name = $('manual-name').value.trim() || 'Ajout manuel';
    const calories = Number($('manual-calories').value);
    const protein = Number($('manual-protein').value || 0);
    if (!Number.isFinite(calories) || calories < 0) {
      alert('Indiquez les calories à ajouter.');
      return;
    }
    addMeal({ type: $('manual-type').value, name, calories, protein, source: 'manual' });
    $('manual-name').value = '';
    $('manual-calories').value = '';
    $('manual-protein').value = '';
    showView('today');
  });
}

async function analyzePhoto() {
  if (!selectedImageData) return;
  const configured = state.profile.apiUrl?.trim();
  const endpoint = configured || '/api/analyze';
  $('analyze-photo').disabled = true;
  $('analysis-panel').hidden = true;
  setStatus('Analyse de la photo en cours…');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData: selectedImageData })
    });
    if (!response.ok) {
      let msg = '';
      try { msg = (await response.json()).error || ''; } catch {}
      if (response.status === 404) throw new Error('API_NOT_CONFIGURED');
      throw new Error(msg || `Erreur ${response.status}`);
    }
    const analysis = await response.json();
    currentAnalysis = analysis;
    renderAnalysis(analysis);
    $('analysis-status').hidden = true;
    $('analysis-panel').hidden = false;
  } catch (error) {
    if (String(error.message).includes('API_NOT_CONFIGURED') || (!configured && location.hostname.includes('github.io'))) {
      setStatus("L'analyse IA n'est pas encore reliée sur cette adresse. Vous pouvez déjà tester toute l'application avec l'ajout manuel. L'activation de l'analyse photo se fera via le service sécurisé fourni dans la V1.", 'info');
    } else {
      setStatus(`Analyse impossible : ${error.message}. Vous pouvez utiliser l'ajout manuel.`, 'error');
    }
  } finally {
    $('analyze-photo').disabled = false;
  }
}

function renderAnalysis(analysis) {
  const items = Array.isArray(analysis.items) ? analysis.items : [];
  $('analysis-items').innerHTML = items.map(item => `
    <div class="analysis-row">
      <div>
        <div class="name">${escapeHtml(item.name)}</div>
        <div class="portion">≈ ${round(item.estimated_grams,0)} g</div>
      </div>
      <div class="numbers">${Math.round(item.calories)} kcal<br><span class="muted">${round(item.protein_g,1)} g prot.</span></div>
    </div>
  `).join('');
  $('analysis-calories').textContent = Math.round(analysis.total_calories || 0);
  $('analysis-protein').textContent = round(analysis.total_protein_g || 0, 1);
  $('analysis-confidence').textContent = analysis.confidence ? `Confiance ${analysis.confidence}` : 'Estimation';
  $('analysis-note').textContent = analysis.notes || 'Estimation visuelle : corrigez manuellement si une portion semble incorrecte.';
}

function setupMealDeletion() {
  document.body.addEventListener('click', (event) => {
    const id = event.target?.dataset?.deleteMeal;
    if (!id) return;
    if (!confirm('Supprimer cette entrée ?')) return;
    state.meals = state.meals.filter(m => m.id !== id);
    saveState();
    updateToday();
    renderHistory();
  });
}

function renderHistory() {
  const targets = calculateTargets();
  const grouped = state.meals.reduce((acc, meal) => {
    (acc[meal.dateKey] ||= []).push(meal);
    return acc;
  }, {});
  const keys = Object.keys(grouped).sort().reverse();
  const last7 = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    last7.push(totalsForDate(localDateKey(d)));
  }
  const activeDays = last7.filter(t => t.calories > 0);
  const avgCal = activeDays.length ? Math.round(activeDays.reduce((s,t)=>s+t.calories,0)/activeDays.length) : 0;
  const avgProtein = activeDays.length ? round(activeDays.reduce((s,t)=>s+t.protein,0)/activeDays.length,1) : 0;
  $('history-summary').innerHTML = `
    <h3>7 derniers jours</h3>
    <div class="grid-two">
      <div><span class="stat-label">Moyenne calories</span><strong>${avgCal || '—'}</strong> <span class="muted">kcal/j</span></div>
      <div><span class="stat-label">Moyenne protéines</span><strong>${avgProtein || '—'}</strong> <span class="muted">g/j</span></div>
    </div>
    <p class="muted small">Calcul sur les jours comportant au moins une entrée. Objectif actuel : ${targets.target || '—'} kcal et ${targets.protein || '—'} g de protéines.</p>
  `;

  if (!keys.length) {
    $('history-list').innerHTML = '<div class="empty-state">Aucun historique pour le moment.</div>';
    return;
  }
  $('history-list').innerHTML = keys.map(key => {
    const d = new Date(`${key}T12:00:00`);
    const meals = grouped[key].sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
    const total = meals.reduce((a,m)=>({calories:a.calories+Number(m.calories),protein:a.protein+Number(m.protein)}),{calories:0,protein:0});
    return `
      <div class="history-day">
        <div class="history-day-header">
          <strong>${new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric'}).format(d)}</strong>
          <span class="history-total">${Math.round(total.calories)} kcal · ${round(total.protein,1)} g</span>
        </div>
        <div class="history-day-body">
          ${meals.map(m=>`<div class="meal-item"><div><div class="meal-name">${escapeHtml(m.type)} · ${escapeHtml(m.name)}</div></div><div class="meal-nutrition">${Math.round(m.calories)} kcal<br><span class="muted">${round(m.protein,1)} g prot.</span></div><button class="meal-delete" data-delete-meal="${m.id}">Supprimer</button></div>`).join('')}
        </div>
      </div>`;
  }).join('');
}

function renderWeight() {
  const weights = [...state.weights].sort((a,b)=>a.date.localeCompare(b.date));
  const latest = weights[weights.length - 1]?.kg ?? state.profile.currentWeightKg;
  $('weight-current').textContent = Number(latest).toFixed(1);
  $('weight-start').textContent = `${Number(state.profile.startWeightKg).toFixed(1)} kg`;
  $('weight-goal').textContent = `${Number(state.profile.goalWeightKg).toFixed(1)} kg`;
  renderWeightChart(weights);
  $('weight-log').innerHTML = '<h3>Mesures</h3>' + [...weights].reverse().slice(0,12).map(w => `
    <div class="weight-log-row"><span>${new Date(w.date).toLocaleDateString('fr-FR')}</span><strong>${Number(w.kg).toFixed(1)} kg</strong></div>
  `).join('');
}

function renderWeightChart(weights) {
  const canvas = $('weight-chart');
  const empty = $('weight-empty');
  if (weights.length < 2) { canvas.hidden = true; empty.hidden = false; return; }
  canvas.hidden = false; empty.hidden = true;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(320, rect.width) * dpr;
  canvas.height = 210 * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  const W = canvas.width/dpr, H = canvas.height/dpr;
  const pad = {l:42,r:14,t:18,b:32};
  const vals = weights.map(w=>Number(w.kg));
  const goal = Number(state.profile.goalWeightKg);
  let min = Math.min(...vals,goal)-.4, max = Math.max(...vals,goal)+.4;
  if (max-min < 1) { max += .5; min -= .5; }
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = '#dfe6e1'; ctx.lineWidth=1;
  for(let i=0;i<4;i++){
    const y=pad.t+(H-pad.t-pad.b)*i/3; ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
    const v=max-(max-min)*i/3;ctx.fillStyle='#68756e';ctx.font='11px system-ui';ctx.fillText(v.toFixed(1),4,y+4);
  }
  const xAt=i=>pad.l+(W-pad.l-pad.r)*(weights.length===1?0:i/(weights.length-1));
  const yAt=v=>pad.t+(max-v)/(max-min)*(H-pad.t-pad.b);
  ctx.strokeStyle='#1f6f4a';ctx.lineWidth=3;ctx.beginPath();weights.forEach((w,i)=>{const x=xAt(i),y=yAt(Number(w.kg));i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();
  ctx.fillStyle='#1f6f4a';weights.forEach((w,i)=>{ctx.beginPath();ctx.arc(xAt(i),yAt(Number(w.kg)),4,0,Math.PI*2);ctx.fill()});
  ctx.setLineDash([5,5]);ctx.strokeStyle='#b77712';ctx.lineWidth=1.5;const gy=yAt(goal);ctx.beginPath();ctx.moveTo(pad.l,gy);ctx.lineTo(W-pad.r,gy);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#68756e';ctx.font='11px system-ui';ctx.fillText('Objectif',W-58,Math.max(12,gy-5));
  const first = new Date(weights[0].date).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'}), last = new Date(weights[weights.length-1].date).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'});
  ctx.fillText(first,pad.l,H-8);ctx.fillText(last,W-pad.r-38,H-8);
}

function setupWeight() {
  $('save-weight').addEventListener('click', () => {
    const kg = Number(String($('weight-input').value).replace(',','.'));
    if (!kg || kg < 30 || kg > 250) return alert('Indiquez un poids valide.');
    state.profile.currentWeightKg = kg;
    state.weights.push({date:new Date().toISOString(),kg});
    saveState();
    $('weight-input').value='';
    renderWeight(); updateToday(); fillSettings();
  });
}

function fillSettings() {
  const p = state.profile;
  $('set-age').value = p.age;
  $('set-sex').value = p.sex;
  $('set-height').value = p.heightCm || '';
  $('set-weight').value = p.currentWeightKg;
  $('set-goal-weight').value = p.goalWeightKg;
  $('set-activity').value = String(p.activityFactor);
  $('set-deficit').value = p.deficitKcal;
  $('set-protein-factor').value = p.proteinFactor;
  $('set-api-url').value = p.apiUrl || '';
  const sameDomain = !p.apiUrl;
  $('api-mode').textContent = sameDomain
    ? "Mode actuel : /api/analyze sur le même site (idéal avec Vercel)."
    : `Mode actuel : service externe ${p.apiUrl}`;
}

function setupSettings() {
  $('save-settings').addEventListener('click', () => {
    const p = state.profile;
    p.age = Number($('set-age').value);
    p.sex = $('set-sex').value;
    p.heightCm = Number($('set-height').value);
    p.currentWeightKg = Number($('set-weight').value);
    p.goalWeightKg = Number($('set-goal-weight').value);
    p.activityFactor = Number($('set-activity').value);
    p.deficitKcal = Number($('set-deficit').value);
    p.proteinFactor = Number($('set-protein-factor').value);
    p.apiUrl = $('set-api-url').value.trim();
    p.setupDone = Boolean(p.heightCm);
    saveState();
    updateToday(); fillSettings();
    alert('Réglages enregistrés.');
  });
  $('export-data').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`calories-${localDateKey()}.json`; a.click(); URL.revokeObjectURL(a.href);
  });
  $('reset-data').addEventListener('click', () => {
    if (!confirm('Effacer définitivement toutes les données enregistrées sur cet appareil ?')) return;
    localStorage.removeItem(STORAGE_KEY); state = structuredClone(defaultState); location.reload();
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  }
}

function init() {
  setupNavigation(); setupFirstRun(); setupPhoto(); setupMealDeletion(); setupWeight(); setupSettings();
  updateToday(); fillSettings(); registerServiceWorker();
  window.addEventListener('resize', () => { if ($('view-weight').classList.contains('active')) renderWeight(); });
}

document.addEventListener('DOMContentLoaded', init);
