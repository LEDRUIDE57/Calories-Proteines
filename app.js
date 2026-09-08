const STORAGE_KEY = 'caloriesV1State';

const ACTIVITY_TYPES = ['Course', 'Gym', 'Machine musculation', 'Marche', 'Natation', 'Randonnée', 'Vélo', 'Vélo appart'];
const DEFAULT_ACTIVITY_SOURCES = {
  'Course': '',
  'Gym': '',
  'Machine musculation': '',
  'Marche': 'Samsung Health',
  'Natation': '',
  'Randonnée': '',
  'Vélo': 'eFlow',
  'Vélo appart': 'David Douillet'
};


const FOOD_DB = {
  apple: { name: 'Pomme', kcal100: 52, protein100: 0.3 },
  banana: { name: 'Banane', kcal100: 89, protein100: 1.1 },
  bread: { name: 'Pain', kcal100: 265, protein100: 9 },
  carrot: { name: 'Carottes', kcal100: 41, protein100: 0.9 },
  cheese: { name: 'Fromage type emmental', kcal100: 380, protein100: 28 },
  chicken: { name: 'Poulet cuit', kcal100: 165, protein100: 31 },
  egg: { name: 'Œuf', kcal100: 143, protein100: 13 },
  fries: { name: 'Frites', kcal100: 312, protein100: 3.4 },
  ham: { name: 'Jambon blanc', kcal100: 116, protein100: 20 },
  pasta: { name: 'Pâtes cuites', kcal100: 158, protein100: 5.8 },
  potato: { name: 'Pommes de terre cuites', kcal100: 87, protein100: 1.9 },
  rice: { name: 'Riz cuit', kcal100: 130, protein100: 2.7 },
  salad: { name: 'Salade verte', kcal100: 15, protein100: 1.4 },
  salmon: { name: 'Saumon cuit', kcal100: 206, protein100: 22 },
  steak: { name: 'Steak haché', kcal100: 250, protein100: 26 },
  tuna: { name: 'Thon au naturel', kcal100: 116, protein100: 26 },
  watermelon: { name: 'Pastèque', kcal100: 30, protein100: 0.6 },
  yogurt: { name: 'Yaourt nature', kcal100: 63, protein100: 4 }
};

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
    apiUrl: '',
    activitySources: { ...DEFAULT_ACTIVITY_SOURCES }
  },
  meals: [],
  activities: [],
  weights: [{ id: 'initial-weight', date: new Date().toISOString(), dateKey: localDateKey(), kg: 74 }]
};

let state = loadState();
let selectedImageData = null;
let currentAnalysis = null;
let selectedDateKey = localDateKey();
let editingMealId = null;

const $ = id => document.getElementById(id);
const round = (n, d = 0) => Number(Number(n).toFixed(d));
function makeId() { return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`; }

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dateFromKey(key) {
  return new Date(`${key}T12:00:00`);
}

function timestampForDateKey(key) {
  const d = dateFromKey(key);
  const now = new Date();
  d.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
  return d.toISOString();
}

function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function formatShortDateKey(key) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(dateFromKey(key));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    const weights = Array.isArray(parsed.weights) && parsed.weights.length ? parsed.weights : structuredClone(defaultState.weights);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      profile: {
        ...structuredClone(defaultState.profile),
        ...(parsed.profile || {}),
        activitySources: { ...DEFAULT_ACTIVITY_SOURCES, ...((parsed.profile || {}).activitySources || {}) }
      },
      meals: Array.isArray(parsed.meals) ? parsed.meals : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
      weights: weights.map(w => {
        const date = w.date || new Date().toISOString();
        return { ...w, id: w.id || makeId(), date, dateKey: w.dateKey || localDateKey(new Date(date)) };
      })
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

function mealsForDate(key) { return state.meals.filter(m => m.dateKey === key); }
function activitiesForDate(key) { return state.activities.filter(a => a.dateKey === key); }
function weightsForDate(key) { return state.weights.filter(w => (w.dateKey || localDateKey(new Date(w.date))) === key); }

function foodTotalsForDate(key) {
  return mealsForDate(key).reduce((acc, meal) => {
    acc.calories += Number(meal.calories || 0);
    acc.protein += Number(meal.protein || 0);
    return acc;
  }, { calories: 0, protein: 0 });
}

function activityTotalsForDate(key) {
  return activitiesForDate(key).reduce((sum, activity) => sum + Number(activity.calories || 0), 0);
}

function energyTotalsForDate(key) {
  const food = foodTotalsForDate(key);
  const activity = activityTotalsForDate(key);
  return { calories: food.calories, protein: food.protein, activity, net: food.calories - activity };
}

function hasDataForDate(key) {
  return mealsForDate(key).length || activitiesForDate(key).length || weightsForDate(key).length;
}

function progressClass(ratio) {
  if (ratio > 1) return 'over';
  if (ratio >= 0.9) return 'warn';
  return '';
}

function renderEnergyChart(net, target, food, activity) {
  const safeNet = Math.max(0, Number(net || 0));
  const safeTarget = Math.max(1, Number(target || 1));
  const scaleMax = Math.max(safeTarget, safeNet, 1);
  const greenValue = Math.min(safeNet, safeTarget);
  const redValue = Math.max(0, safeNet - safeTarget);
  const greenPct = greenValue / scaleMax * 100;
  const redPct = redValue / scaleMax * 100;
  const targetPct = safeTarget / scaleMax * 100;

  $('chart-food-calories').textContent = `${Math.round(food)} kcal`;
  $('chart-activity-calories').textContent = `−${Math.round(activity)} kcal`;
  $('chart-net-calories').textContent = `${Math.round(net)} kcal`;
  $('energy-green').style.height = `${greenPct}%`;
  $('energy-red').style.height = `${redPct}%`;
  $('energy-red').style.bottom = `${greenPct}%`;
  $('energy-target-line').style.bottom = `${Math.min(100, targetPct)}%`;
  $('energy-target-label').textContent = `Objectif ${Math.round(target)} kcal`;
  $('energy-scale-max').textContent = `${Math.round(scaleMax)} kcal`;
}

function updateSelectedDateControls() {
  const today = localDateKey();
  const isToday = selectedDateKey === today;
  $('dashboard-date').value = selectedDateKey;
  $('dashboard-date').max = today;
  $('day-next').disabled = isToday;
  $('day-today').disabled = isToday;
  $('delete-day').disabled = !hasDataForDate(selectedDateKey);
  $('today-title').textContent = isToday ? 'Aujourd’hui' : 'Journée';
  $('today-date').textContent = formatDate(dateFromKey(selectedDateKey));
}

function updateToday() {
  const key = selectedDateKey;
  const meals = mealsForDate(key).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const activities = activitiesForDate(key).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const total = energyTotalsForDate(key);
  const targets = calculateTargets();
  updateSelectedDateControls();

  $('cal-consumed').textContent = Math.round(total.calories);
  $('protein-consumed').textContent = round(total.protein, 1);
  $('activity-deducted').textContent = `−${Math.round(total.activity)} kcal`;
  $('net-calories').textContent = `${Math.round(total.net)} kcal`;

  if (!targets.target) {
    $('cal-target').textContent = 'à définir';
    $('cal-remaining').textContent = '—';
    $('maintenance-cal').textContent = '—';
    $('maintenance-gap').textContent = '—';
    $('protein-target').textContent = '—';
    $('protein-remaining').textContent = '—';
    renderEnergyChart(total.net, 1, total.calories, total.activity);
  } else {
    $('cal-target').textContent = `${targets.target} kcal`;
    const remaining = targets.target - total.net;
    $('cal-remaining').textContent = remaining >= 0 ? `${Math.round(remaining)} kcal` : `+${Math.abs(Math.round(remaining))} kcal`;
    $('maintenance-cal').textContent = targets.maintenance;
    const maintGap = total.net - targets.maintenance;
    $('maintenance-gap').textContent = `${maintGap > 0 ? '+' : ''}${Math.round(maintGap)}`;

    const calRatio = Math.max(0, total.net) / targets.target;
    $('cal-progress').style.width = `${Math.min(calRatio * 100, 100)}%`;
    $('cal-progress').className = `progress-bar ${progressClass(calRatio)}`;

    $('protein-target').textContent = targets.protein;
    const proteinRemaining = targets.protein - total.protein;
    $('protein-remaining').textContent = proteinRemaining > 0 ? `${round(proteinRemaining, 1)} g` : 'Objectif atteint';
    const proteinRatio = targets.protein ? total.protein / targets.protein : 0;
    $('protein-percent').textContent = `${Math.round(proteinRatio * 100)} %`;
    $('protein-progress').style.width = `${Math.min(proteinRatio * 100, 100)}%`;
    renderEnergyChart(total.net, targets.target, total.calories, total.activity);
  }

  $('meal-count').textContent = `${meals.length} ${meals.length > 1 ? 'entrées' : 'entrée'}`;
  $('today-meals').className = meals.length ? 'meal-list' : 'meal-list empty-state';
  $('today-meals').innerHTML = meals.length ? meals.map(meal => `
    <div class="meal-item">
      <div>
        <div class="meal-name">${escapeHtml(meal.type)} · ${escapeHtml(meal.name || 'Repas')}</div>
        <div class="meal-meta">${new Date(meal.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div class="meal-nutrition">${Math.round(meal.calories)} kcal<br><span class="muted">${round(meal.protein, 1)} g prot.</span></div>
      <div class="meal-actions">
        <button class="meal-edit" data-edit-meal="${meal.id}">Modifier</button>
        <button class="meal-delete" data-delete-meal="${meal.id}">Supprimer</button>
      </div>
    </div>`).join('') : 'Aucun repas enregistré.';

  $('today-activities').className = activities.length ? 'activity-list' : 'activity-list empty-state';
  $('today-activities').innerHTML = activities.length ? activities.map(activity => `
    <div class="activity-item">
      <div>
        <div class="meal-name">${escapeHtml(activity.name)}</div>
        <div class="meal-meta">${new Date(activity.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}${activity.source ? ` · Source : ${escapeHtml(activity.source)}` : ''}</div>
      </div>
      <div class="activity-kcal">−${Math.round(activity.calories)} kcal</div>
      <button class="meal-delete" data-delete-activity="${activity.id}">Supprimer</button>
    </div>`).join('') : 'Aucune activité déduite pour cette journée.';
}

function setEntryDates(key = selectedDateKey) {
  const today = localDateKey();
  ['photo-date', 'manual-date', 'activity-date', 'weight-date'].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.max = today;
    el.value = key <= today ? key : today;
  });
}

function selectDate(key) {
  const today = localDateKey();
  if (!key || key > today) key = today;
  selectedDateKey = key;
  setEntryDates(key);
  updateToday();
}

function shiftSelectedDate(days) {
  const d = dateFromKey(selectedDateKey);
  d.setDate(d.getDate() + days);
  const next = localDateKey(d);
  selectDate(next > localDateKey() ? localDateKey() : next);
}

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `view-${name}`));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  if (name === 'today') updateToday();
  if (name === 'photo') setEntryDates(selectedDateKey);
  if (name === 'history') renderHistory();
  if (name === 'weight') { setEntryDates(selectedDateKey); renderWeight(); }
  if (name === 'settings') fillSettings();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addMeal({ type, name, calories, protein, items = [], source = 'manual', dateKey = selectedDateKey }) {
  const timestamp = timestampForDateKey(dateKey);
  state.meals.push({ id: makeId(), timestamp, dateKey, type, name, calories: Number(calories), protein: Number(protein), items, source });
  saveState();
  if (dateKey === selectedDateKey) updateToday();
}

function addActivity(name, calories, dateKey = selectedDateKey, source = '') {
  const timestamp = timestampForDateKey(dateKey);
  state.activities.push({ id: makeId(), timestamp, dateKey, name, calories: Number(calories), source: String(source || '').trim() });
  saveState();
  if (dateKey === selectedDateKey) updateToday();
}

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.view)));
  $('quick-add').addEventListener('click', () => { $('photo-date').value = selectedDateKey; $('manual-date').value = selectedDateKey; showView('photo'); });
  $('day-prev').addEventListener('click', () => shiftSelectedDate(-1));
  $('day-next').addEventListener('click', () => shiftSelectedDate(1));
  $('day-today').addEventListener('click', () => selectDate(localDateKey()));
  $('dashboard-date').addEventListener('change', () => selectDate($('dashboard-date').value));
}

function setupFirstRun() {
  if (!state.profile.setupDone) $('setup-dialog').showModal();
  $('setup-form').addEventListener('submit', event => {
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

async function resizeImage(file, maxSide = 1280, quality = 0.82) {
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

function normalizeFoodName(value = '') {
  return String(value)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9œæ]+/g, ' ').trim();
}

function findLocalFoodReference(name) {
  const wanted = normalizeFoodName(name);
  if (!wanted) return null;
  const aliases = {
    apple: ['pomme'], banana: ['banane'], bread: ['pain'], carrot: ['carotte', 'carottes'],
    cheese: ['fromage type emmental', 'emmental'], chicken: ['poulet', 'poulet cuit'], egg: ['oeuf', 'œuf'],
    fries: ['frite', 'frites'], ham: ['jambon blanc'], pasta: ['pates', 'pâtes', 'pates cuites', 'pâtes cuites'],
    potato: ['pomme de terre', 'pommes de terre', 'pommes de terre cuites'], rice: ['riz', 'riz cuit'],
    salad: ['salade', 'salade verte'], salmon: ['saumon', 'saumon cuit'], steak: ['steak hache', 'steak haché'],
    tuna: ['thon', 'thon au naturel'], watermelon: ['pasteque', 'pastèque'], yogurt: ['yaourt', 'yaourt nature']
  };
  for (const [key, food] of Object.entries(FOOD_DB)) {
    const candidates = [food.name, ...(aliases[key] || [])].map(normalizeFoodName);
    if (candidates.includes(wanted)) return { ...food, key };
  }
  return null;
}

function prepareAnalysis(analysis) {
  const items = (Array.isArray(analysis.items) ? analysis.items : []).map(item => {
    const grams = Math.max(1, Number(item.estimated_grams || 1));
    const calories = Math.max(0, Number(item.calories || 0));
    const protein = Math.max(0, Number(item.protein_g || 0));
    return {
      name: String(item.name || 'Aliment'),
      estimated_grams: grams,
      calories,
      protein_g: protein,
      kcalPerGram: calories / grams,
      proteinPerGram: protein / grams,
      nutritionSource: 'photo-ai',
      nutritionStatus: '',
      nutritionNote: '',
      nutritionError: false,
      nutritionRequestId: 0
    };
  });
  return { ...analysis, items, total_calories: items.reduce((s, i) => s + i.calories, 0), total_protein_g: items.reduce((s, i) => s + i.protein_g, 0) };
}

function needsQuantityConfirmation(name = '') {
  return /(huile|sauce|beurre|mayonnaise|vinaigrette|assaisonnement|crème|creme|matière grasse|matiere grasse|fromage)/i.test(name);
}

function recalcAnalysisTotals() {
  if (!currentAnalysis) return;
  currentAnalysis.total_calories = currentAnalysis.items.reduce((s, i) => s + Number(i.calories || 0), 0);
  currentAnalysis.total_protein_g = currentAnalysis.items.reduce((s, i) => s + Number(i.protein_g || 0), 0);
  $('analysis-calories').textContent = Math.round(currentAnalysis.total_calories);
  $('analysis-protein').textContent = round(currentAnalysis.total_protein_g, 1);
  const pending = currentAnalysis.items.some(i => i.nutritionStatus === 'loading');
  const invalid = currentAnalysis.items.some(i => i.nutritionError);
  $('save-analysis').disabled = pending || invalid || !currentAnalysis.items.length;
}

function applyNutritionReference(index, kcal100, protein100, source, note = '') {
  if (!currentAnalysis?.items?.[index]) return;
  const item = currentAnalysis.items[index];
  const grams = Math.max(1, Number(item.estimated_grams || 1));
  item.kcalPerGram = Math.max(0, Number(kcal100 || 0)) / 100;
  item.proteinPerGram = Math.max(0, Number(protein100 || 0)) / 100;
  item.calories = item.kcalPerGram * grams;
  item.protein_g = item.proteinPerGram * grams;
  item.nutritionSource = source;
  item.nutritionStatus = source === 'local-db' ? 'Recalculé avec la base alimentaire.' : 'Recalculé pour le nouvel aliment.';
  item.nutritionNote = String(note || '');
  item.nutritionError = false;
}

async function recalculateNutritionForName(index) {
  if (!currentAnalysis?.items?.[index]) return;
  const item = currentAnalysis.items[index];
  const foodName = String(item.name || '').trim();
  if (!foodName) return;
  const requestId = Number(item.nutritionRequestId || 0) + 1;
  item.nutritionRequestId = requestId;

  const local = findLocalFoodReference(foodName);
  if (local) {
    applyNutritionReference(index, local.kcal100, local.protein100, 'local-db', `Référence locale : ${local.kcal100} kcal et ${local.protein100} g protéines / 100 g.`);
    renderAnalysisEditor();
    return;
  }

  item.nutritionStatus = 'loading';
  item.nutritionNote = '';
  item.nutritionError = false;
  renderAnalysisEditor();

  const configured = state.profile.apiUrl?.trim();
  const endpoint = configured || '/api/analyze';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodName })
    });
    let data = {};
    try { data = await response.json(); } catch {}
    if (!response.ok) throw new Error(data.error || `Erreur ${response.status}`);
    if (!currentAnalysis?.items?.[index] || currentAnalysis.items[index].nutritionRequestId !== requestId) return;
    applyNutritionReference(index, data.kcal_per_100g, data.protein_per_100g, 'text-ai', data.notes || 'Valeurs moyennes estimées pour 100 g.');
  } catch (error) {
    if (!currentAnalysis?.items?.[index] || currentAnalysis.items[index].nutritionRequestId !== requestId) return;
    const current = currentAnalysis.items[index];
    current.nutritionStatus = 'error';
    current.nutritionError = true;
    current.nutritionNote = `Recalcul impossible : ${error.message}. Corrigez le nom ou appuyez sur « Recalculer nutrition ».`;
  }
  renderAnalysisEditor();
}

function updateAnalysisItemFromGrams(index, grams) {
  if (!currentAnalysis?.items?.[index]) return;
  const item = currentAnalysis.items[index];
  const safeGrams = Math.max(1, Number(grams || 1));
  item.estimated_grams = safeGrams;
  item.calories = item.kcalPerGram * safeGrams;
  item.protein_g = item.proteinPerGram * safeGrams;
  renderAnalysisEditor();
}

function renderAnalysisEditor() {
  if (!currentAnalysis) return;
  $('analysis-items').innerHTML = (currentAnalysis.items || []).map((item, index) => `
    <div class="analysis-edit-row" data-analysis-index="${index}">
      <div class="analysis-main">
        <label class="analysis-name-label">Aliment
          <input class="analysis-name-input" data-analysis-name="${index}" type="text" value="${escapeHtml(item.name)}" />
        </label>
        <div class="analysis-flags">
          ${needsQuantityConfirmation(item.name) ? '<span class="confirm-chip">Quantité à confirmer</span>' : ''}
          ${item.nutritionSource === 'text-ai' ? '<span class="nutrition-chip">Nutrition recalculée</span>' : ''}
          ${item.nutritionSource === 'local-db' ? '<span class="nutrition-chip local">Base alimentaire</span>' : ''}
        </div>
        ${item.nutritionStatus === 'loading' ? '<div class="nutrition-message loading">Recalcul des calories et protéines…</div>' : ''}
        ${item.nutritionNote ? `<div class="nutrition-message ${item.nutritionError ? 'error' : ''}">${escapeHtml(item.nutritionNote)}</div>` : ''}
        <button type="button" class="recalc-nutrition" data-recalc-nutrition="${index}" ${item.nutritionStatus === 'loading' ? 'disabled' : ''}>↻ Recalculer nutrition</button>
        <div class="portion-editor">
          <button type="button" class="portion-btn" data-adjust-grams="${index}" data-delta="-10">−</button>
          <label>Quantité<div class="grams-input-wrap"><input data-analysis-grams="${index}" type="number" inputmode="numeric" min="1" step="5" value="${Math.round(item.estimated_grams)}" /><span>g</span></div></label>
          <button type="button" class="portion-btn" data-adjust-grams="${index}" data-delta="10">+</button>
        </div>
      </div>
      <div class="analysis-numbers">
        <strong>${Math.round(item.calories)} kcal</strong>
        <span>${round(item.protein_g, 1)} g prot.</span>
        <button type="button" class="remove-analysis-item" data-remove-analysis="${index}">Retirer</button>
      </div>
    </div>`).join('');
  recalcAnalysisTotals();
}

function setupPhoto() {
  const handlePhotoSelection = async event => {
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
      setStatus('Impossible de lire cette image. Essayez une autre photo.', 'error');
    } finally { event.target.value = ''; }
  };

  $('camera-input').addEventListener('change', handlePhotoSelection);
  $('gallery-input').addEventListener('change', handlePhotoSelection);
  $('analyze-photo').addEventListener('click', analyzePhoto);

  $('analysis-items').addEventListener('click', event => {
    const adjust = event.target.closest('[data-adjust-grams]');
    if (adjust) {
      const index = Number(adjust.dataset.adjustGrams);
      const delta = Number(adjust.dataset.delta || 0);
      const current = Number(currentAnalysis?.items?.[index]?.estimated_grams || 0);
      updateAnalysisItemFromGrams(index, current + delta);
      return;
    }
    const recalc = event.target.closest('[data-recalc-nutrition]');
    if (recalc) {
      recalculateNutritionForName(Number(recalc.dataset.recalcNutrition));
      return;
    }
    const remove = event.target.closest('[data-remove-analysis]');
    if (remove && currentAnalysis) {
      currentAnalysis.items.splice(Number(remove.dataset.removeAnalysis), 1);
      renderAnalysisEditor();
    }
  });

  $('analysis-items').addEventListener('change', event => {
    const gramsInput = event.target.closest('[data-analysis-grams]');
    if (gramsInput) return updateAnalysisItemFromGrams(Number(gramsInput.dataset.analysisGrams), Number(gramsInput.value));
    const nameInput = event.target.closest('[data-analysis-name]');
    if (nameInput && currentAnalysis?.items?.[Number(nameInput.dataset.analysisName)]) {
      const index = Number(nameInput.dataset.analysisName);
      const item = currentAnalysis.items[index];
      const nextName = nameInput.value.trim() || 'Aliment';
      const changed = normalizeFoodName(nextName) !== normalizeFoodName(item.name);
      item.name = nextName;
      if (changed) recalculateNutritionForName(index);
      else renderAnalysisEditor();
    }
  });

  $('save-analysis').addEventListener('click', () => {
    if (!currentAnalysis || !currentAnalysis.items?.length) return;
    recalcAnalysisTotals();
    const dateKey = $('photo-date').value || selectedDateKey;
    addMeal({
      type: $('analysis-meal-type').value,
      name: currentAnalysis.items.map(i => i.name).slice(0, 3).join(', ') || 'Repas analysé',
      calories: currentAnalysis.total_calories,
      protein: currentAnalysis.total_protein_g,
      items: currentAnalysis.items.map(({ kcalPerGram, proteinPerGram, nutritionStatus, nutritionError, nutritionRequestId, ...item }) => item),
      source: 'photo-ai',
      dateKey
    });
    currentAnalysis = null;
    $('analysis-panel').hidden = true;
    selectedDateKey = dateKey;
    setStatus(`Repas ajouté au ${formatShortDateKey(dateKey)}.`, 'success');
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
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageData: selectedImageData }) });
    if (!response.ok) {
      let msg = '';
      try { msg = (await response.json()).error || ''; } catch {}
      if (response.status === 404) throw new Error('API_NOT_CONFIGURED');
      throw new Error(msg || `Erreur ${response.status}`);
    }
    const analysis = await response.json();
    currentAnalysis = prepareAnalysis(analysis);
    renderAnalysisEditor();
    $('analysis-confidence').textContent = analysis.confidence ? `Confiance ${analysis.confidence}` : 'Estimation';
    $('analysis-note').textContent = analysis.notes || 'Estimation visuelle : corrigez les quantités si nécessaire.';
    $('analysis-status').hidden = true;
    $('analysis-panel').hidden = false;
  } catch (error) {
    if (String(error.message).includes('API_NOT_CONFIGURED') || (!configured && location.hostname.includes('github.io'))) setStatus("L'analyse IA n'est pas reliée sur cette adresse. Vous pouvez utiliser l'ajout manuel.", 'info');
    else setStatus(`Analyse impossible : ${error.message}. Vous pouvez utiliser l'ajout manuel.`, 'error');
  } finally { $('analyze-photo').disabled = false; }
}

function setupManualEntry() {
  const updateManualFields = () => {
    const key = $('manual-food').value;
    const isCustom = key === 'custom';
    $('manual-custom-wrap').hidden = !isCustom;
    if (!key || isCustom) {
      $('manual-reference').textContent = isCustom ? 'Pour un aliment personnalisé, saisissez les calories et protéines estimées.' : '';
      if (isCustom) { $('manual-calories').value = ''; $('manual-protein').value = ''; }
      return;
    }
    const food = FOOD_DB[key];
    if (!food) return;
    const grams = Math.max(1, Number($('manual-grams').value || 100));
    $('manual-grams').value = grams;
    $('manual-calories').value = Math.round(food.kcal100 * grams / 100);
    $('manual-protein').value = round(food.protein100 * grams / 100, 1);
    $('manual-reference').textContent = `Référence : ${food.kcal100} kcal et ${food.protein100} g protéines / 100 g. Valeurs indicatives.`;
  };
  $('manual-food').addEventListener('change', updateManualFields);
  $('manual-grams').addEventListener('input', () => { const key = $('manual-food').value; if (key && key !== 'custom') updateManualFields(); });
  $('save-manual').addEventListener('click', () => {
    const key = $('manual-food').value;
    if (!key) return alert('Choisissez un aliment dans le menu.');
    const name = key === 'custom' ? $('manual-name').value.trim() : FOOD_DB[key]?.name;
    if (!name) return alert('Indiquez le nom de l’aliment.');
    const calories = Number($('manual-calories').value);
    const protein = Number($('manual-protein').value || 0);
    const dateKey = $('manual-date').value || selectedDateKey;
    if (!Number.isFinite(calories) || calories < 0) return alert('Indiquez les calories à ajouter.');
    addMeal({ type: $('manual-type').value, name, calories, protein, source: 'manual', dateKey });
    $('manual-food').value = ''; $('manual-name').value = ''; $('manual-grams').value = ''; $('manual-calories').value = ''; $('manual-protein').value = '';
    $('manual-custom-wrap').hidden = true; $('manual-reference').textContent = '';
    selectedDateKey = dateKey;
    showView('today');
  });
}

function activitySourceMap() {
  if (!state.profile.activitySources || typeof state.profile.activitySources !== 'object') {
    state.profile.activitySources = { ...DEFAULT_ACTIVITY_SOURCES };
  }
  return state.profile.activitySources;
}

function allKnownActivitySources() {
  const configured = Object.values(activitySourceMap()).map(v => String(v || '').trim()).filter(Boolean);
  const historic = state.activities.map(a => String(a.source || '').trim()).filter(Boolean);
  return [...new Set([...configured, ...historic])].sort((a, b) => a.localeCompare(b, 'fr'));
}

function populateActivitySourceSelect(activityName, preferredSource = '') {
  const select = $('activity-source');
  if (!select) return;
  const mapping = activitySourceMap();
  const defaultSource = String(mapping[activityName] || '').trim();
  const sources = allKnownActivitySources();
  select.innerHTML = '';
  const none = document.createElement('option');
  none.value = '';
  none.textContent = 'Source non précisée';
  select.appendChild(none);
  sources.forEach(source => {
    const opt = document.createElement('option');
    opt.value = source;
    opt.textContent = source;
    select.appendChild(opt);
  });
  const other = document.createElement('option');
  other.value = '__other__';
  other.textContent = 'Autre…';
  select.appendChild(other);
  const wanted = preferredSource || defaultSource;
  if (wanted && !sources.includes(wanted)) {
    const opt = document.createElement('option');
    opt.value = wanted;
    opt.textContent = wanted;
    select.insertBefore(opt, other);
  }
  select.value = wanted || '';
  $('activity-source-custom-wrap').hidden = select.value !== '__other__';
}

function currentActivityName() {
  const type = $('activity-type').value;
  return type === 'Autre' ? $('activity-custom-name').value.trim() : type;
}

function setupActivity() {
  const syncActivitySource = () => {
    $('activity-custom-wrap').hidden = $('activity-type').value !== 'Autre';
    const name = currentActivityName();
    populateActivitySourceSelect(name);
  };

  $('activity-type').addEventListener('change', syncActivitySource);
  $('activity-custom-name').addEventListener('input', () => {
    if ($('activity-type').value === 'Autre') populateActivitySourceSelect($('activity-custom-name').value.trim());
  });
  $('activity-source').addEventListener('change', () => {
    $('activity-source-custom-wrap').hidden = $('activity-source').value !== '__other__';
    if ($('activity-source').value !== '__other__') $('activity-source-custom').value = '';
  });

  populateActivitySourceSelect('Vélo');

  $('save-activity').addEventListener('click', () => {
    const type = $('activity-type').value;
    const custom = $('activity-custom-name').value.trim();
    const name = type === 'Autre' ? custom : type;
    const calories = Number($('activity-calories').value);
    const sourceChoice = $('activity-source').value;
    const source = sourceChoice === '__other__' ? $('activity-source-custom').value.trim() : sourceChoice;
    const dateKey = $('activity-date').value || selectedDateKey;
    if (!name) return alert('Indiquez le nom de l’activité.');
    if (!Number.isFinite(calories) || calories <= 0) return alert('Indiquez les calories dépensées.');
    if (sourceChoice === '__other__' && !source) return alert('Indiquez le nom de la source.');
    addActivity(name, calories, dateKey, source);
    $('activity-calories').value = '';
    $('activity-custom-name').value = '';
    $('activity-source-custom').value = '';
    $('activity-type').value = 'Vélo';
    $('activity-custom-wrap').hidden = true;
    $('activity-source-custom-wrap').hidden = true;
    populateActivitySourceSelect('Vélo');
    selectedDateKey = dateKey;
    updateToday();
  });
}

function refreshCurrentWeightFromLog() {
  if (!state.weights.length) {
    state.profile.currentWeightKg = Number(state.profile.startWeightKg || 74);
    return;
  }
  const latest = [...state.weights].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  state.profile.currentWeightKg = Number(latest.kg);
}

function timestampWithDateKey(existingTimestamp, dateKey) {
  const base = dateFromKey(dateKey);
  const previous = existingTimestamp ? new Date(existingTimestamp) : new Date();
  base.setHours(previous.getHours(), previous.getMinutes(), previous.getSeconds(), previous.getMilliseconds());
  return base.toISOString();
}

function openMealEditor(mealId) {
  const meal = state.meals.find(m => m.id === mealId);
  if (!meal) return;
  editingMealId = mealId;
  $('meal-edit-name').textContent = meal.name || 'Repas';
  $('meal-edit-type').value = meal.type || 'Autre';
  $('meal-edit-date').value = meal.dateKey || localDateKey(new Date(meal.timestamp));
  $('meal-edit-date').max = localDateKey();
  $('meal-edit-dialog').showModal();
}

function saveMealEditor() {
  const meal = state.meals.find(m => m.id === editingMealId);
  if (!meal) { $('meal-edit-dialog').close(); editingMealId = null; return; }
  const newType = $('meal-edit-type').value;
  const newDateKey = $('meal-edit-date').value || meal.dateKey || selectedDateKey;
  if (newDateKey > localDateKey()) return alert('La date du repas ne peut pas être dans le futur.');
  meal.type = newType;
  if (newDateKey !== meal.dateKey) {
    meal.dateKey = newDateKey;
    meal.timestamp = timestampWithDateKey(meal.timestamp, newDateKey);
  }
  saveState();
  $('meal-edit-dialog').close();
  editingMealId = null;
  updateToday();
  renderHistory();
}

function setupMealEditing() {
  $('meal-edit-cancel').addEventListener('click', () => { editingMealId = null; $('meal-edit-dialog').close(); });
  $('meal-edit-save').addEventListener('click', saveMealEditor);
  $('meal-edit-dialog').addEventListener('cancel', () => { editingMealId = null; });
}

function renderLocalFoodDb() {
  const el = $('food-db-list');
  if (!el) return;
  const foods = Object.values(FOOD_DB).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  el.innerHTML = `<div class="food-db-head"><span>Aliment</span><span>kcal/100 g</span><span>Prot./100 g</span></div>` + foods.map(food => `
    <div class="food-db-row">
      <span>${escapeHtml(food.name)}</span>
      <strong>${round(food.kcal100, 1)}</strong>
      <strong>${round(food.protein100, 1)} g</strong>
    </div>`).join('');
}

function deleteWholeDay(key) {
  if (!confirm(`Supprimer toutes les données du ${formatShortDateKey(key)} ?\n\nRepas, activités et pesées de cette date seront supprimés.`)) return;
  state.meals = state.meals.filter(m => m.dateKey !== key);
  state.activities = state.activities.filter(a => a.dateKey !== key);
  state.weights = state.weights.filter(w => (w.dateKey || localDateKey(new Date(w.date))) !== key);
  refreshCurrentWeightFromLog();
  saveState();
  updateToday();
  renderHistory();
  renderWeight();
  fillSettings();
}

function setupDeletion() {
  $('delete-day').addEventListener('click', () => deleteWholeDay(selectedDateKey));
  document.body.addEventListener('click', event => {
    const editMealId = event.target?.dataset?.editMeal;
    if (editMealId) { openMealEditor(editMealId); return; }
    const mealId = event.target?.dataset?.deleteMeal;
    if (mealId) {
      if (!confirm('Supprimer ce repas ?')) return;
      state.meals = state.meals.filter(m => m.id !== mealId);
      saveState(); updateToday(); renderHistory(); return;
    }
    const activityId = event.target?.dataset?.deleteActivity;
    if (activityId) {
      if (!confirm('Supprimer cette activité ?')) return;
      state.activities = state.activities.filter(a => a.id !== activityId);
      saveState(); updateToday(); renderHistory(); return;
    }
    const weightId = event.target?.dataset?.deleteWeight;
    if (weightId) {
      if (!confirm('Supprimer cette pesée ?')) return;
      state.weights = state.weights.filter(w => w.id !== weightId);
      refreshCurrentWeightFromLog();
      saveState(); renderWeight(); updateToday(); renderHistory(); fillSettings(); return;
    }
    const dayKey = event.target?.dataset?.deleteDay;
    if (dayKey) deleteWholeDay(dayKey);
  });
}

function renderHistory() {
  const targets = calculateTargets();
  const keys = [...new Set([
    ...state.meals.map(m => m.dateKey),
    ...state.activities.map(a => a.dateKey),
    ...state.weights.map(w => w.dateKey || localDateKey(new Date(w.date)))
  ])].sort().reverse();

  const last7 = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i); last7.push(energyTotalsForDate(localDateKey(d)));
  }
  const activeDays = last7.filter(t => t.calories > 0 || t.activity > 0);
  const avgFood = activeDays.length ? Math.round(activeDays.reduce((s, t) => s + t.calories, 0) / activeDays.length) : 0;
  const avgNet = activeDays.length ? Math.round(activeDays.reduce((s, t) => s + t.net, 0) / activeDays.length) : 0;
  const avgProtein = activeDays.length ? round(activeDays.reduce((s, t) => s + t.protein, 0) / activeDays.length, 1) : 0;
  $('history-summary').innerHTML = `
    <h3>7 derniers jours</h3>
    <div class="history-metrics">
      <div><span class="stat-label">Moy. alimentaire</span><strong>${avgFood || '—'}</strong> <span class="muted">kcal/j</span></div>
      <div><span class="stat-label">Moy. nette</span><strong>${avgNet || '—'}</strong> <span class="muted">kcal/j</span></div>
      <div><span class="stat-label">Moy. protéines</span><strong>${avgProtein || '—'}</strong> <span class="muted">g/j</span></div>
    </div>
    <p class="muted small">Calcul sur les jours comportant une entrée. Objectif actuel : ${targets.target || '—'} kcal nettes et ${targets.protein || '—'} g de protéines.</p>`;

  const recentActivities = [...state.activities].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 30);
  $('activity-history-list').innerHTML = recentActivities.length ? recentActivities.map(a => `
    <div class="activity-history-row">
      <div>
        <strong>${escapeHtml(a.name)}</strong>
        <span>${formatShortDateKey(a.dateKey)}${a.source ? ` · ${escapeHtml(a.source)}` : ' · source non précisée'}</span>
      </div>
      <strong>−${Math.round(a.calories)} kcal</strong>
    </div>`).join('') : '<div class="empty-state">Aucune activité enregistrée.</div>';

  if (!keys.length) { $('history-list').innerHTML = '<div class="empty-state">Aucun historique pour le moment.</div>'; return; }
  $('history-list').innerHTML = keys.map(key => {
    const meals = mealsForDate(key).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const activities = activitiesForDate(key).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const weights = weightsForDate(key).sort((a, b) => a.date.localeCompare(b.date));
    const total = energyTotalsForDate(key);
    return `<div class="history-day">
      <div class="history-day-header">
        <div><strong>${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(dateFromKey(key))}</strong><div class="history-total">${Math.round(total.calories)} − ${Math.round(total.activity)} = ${Math.round(total.net)} kcal net · ${round(total.protein, 1)} g prot.</div></div>
        <button class="button danger compact history-delete-day" data-delete-day="${key}">Supprimer la journée</button>
      </div>
      <div class="history-day-body">
        ${meals.map(m => `<div class="meal-item"><div><div class="meal-name">${escapeHtml(m.type)} · ${escapeHtml(m.name)}</div></div><div class="meal-nutrition">${Math.round(m.calories)} kcal<br><span class="muted">${round(m.protein, 1)} g prot.</span></div><div class="meal-actions"><button class="meal-edit" data-edit-meal="${m.id}">Modifier</button><button class="meal-delete" data-delete-meal="${m.id}">Supprimer</button></div></div>`).join('')}
        ${activities.map(a => `<div class="activity-item history-activity"><div><div class="meal-name">Sport · ${escapeHtml(a.name)}</div><div class="meal-meta">${a.source ? `Source : ${escapeHtml(a.source)}` : ''}</div></div><div class="activity-kcal">−${Math.round(a.calories)} kcal</div><button class="meal-delete" data-delete-activity="${a.id}">Supprimer</button></div>`).join('')}
        ${weights.map(w => `<div class="weight-log-row"><span>Poids</span><strong>${Number(w.kg).toFixed(1)} kg</strong><button class="meal-delete inline-delete" data-delete-weight="${w.id}">Supprimer</button></div>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function renderWeight() {
  const weights = [...state.weights].sort((a, b) => a.date.localeCompare(b.date));
  const latest = weights.at(-1)?.kg ?? state.profile.currentWeightKg;
  $('weight-current').textContent = Number(latest).toFixed(1);
  $('weight-start').textContent = `${Number(state.profile.startWeightKg).toFixed(1)} kg`;
  $('weight-goal').textContent = `${Number(state.profile.goalWeightKg).toFixed(1)} kg`;
  renderWeightChart(weights);
  $('weight-log').innerHTML = '<h3>Mesures</h3>' + ([...weights].reverse().slice(0, 20).map(w => `
    <div class="weight-log-row"><span>${dateFromKey(w.dateKey || localDateKey(new Date(w.date))).toLocaleDateString('fr-FR')}</span><strong>${Number(w.kg).toFixed(1)} kg</strong><button class="meal-delete inline-delete" data-delete-weight="${w.id}">Supprimer</button></div>`).join('') || '<div class="empty-state">Aucune pesée.</div>');
}

function renderWeightChart(weights) {
  const canvas = $('weight-chart');
  const empty = $('weight-empty');
  if (weights.length < 2) { canvas.hidden = true; empty.hidden = false; return; }
  canvas.hidden = false; empty.hidden = true;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(320, rect.width) * dpr; canvas.height = 210 * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  const W = canvas.width / dpr, H = canvas.height / dpr, pad = { l: 42, r: 14, t: 18, b: 32 };
  const vals = weights.map(w => Number(w.kg)), goal = Number(state.profile.goalWeightKg);
  let min = Math.min(...vals, goal) - 0.4, max = Math.max(...vals, goal) + 0.4;
  if (max - min < 1) { max += 0.5; min -= 0.5; }
  ctx.clearRect(0, 0, W, H); ctx.strokeStyle = '#dfe6e1'; ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const y = pad.t + (H - pad.t - pad.b) * i / 3;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
    const v = max - (max - min) * i / 3; ctx.fillStyle = '#68756e'; ctx.font = '11px system-ui'; ctx.fillText(v.toFixed(1), 4, y + 4);
  }
  const xAt = i => pad.l + (W - pad.l - pad.r) * (weights.length === 1 ? 0 : i / (weights.length - 1));
  const yAt = v => pad.t + (max - v) / (max - min) * (H - pad.t - pad.b);
  ctx.strokeStyle = '#1f6f4a'; ctx.lineWidth = 3; ctx.beginPath();
  weights.forEach((w, i) => { const x = xAt(i), y = yAt(Number(w.kg)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
  ctx.fillStyle = '#1f6f4a'; weights.forEach((w, i) => { ctx.beginPath(); ctx.arc(xAt(i), yAt(Number(w.kg)), 4, 0, Math.PI * 2); ctx.fill(); });
  ctx.setLineDash([5, 5]); ctx.strokeStyle = '#b77712'; ctx.lineWidth = 1.5; const gy = yAt(goal); ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(W - pad.r, gy); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#68756e'; ctx.font = '11px system-ui'; ctx.fillText('Objectif', W - 58, Math.max(12, gy - 5));
  const first = dateFromKey(weights[0].dateKey || localDateKey(new Date(weights[0].date))).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  const last = dateFromKey(weights.at(-1).dateKey || localDateKey(new Date(weights.at(-1).date))).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  ctx.fillText(first, pad.l, H - 8); ctx.fillText(last, W - pad.r - 38, H - 8);
}

function setupWeight() {
  $('save-weight').addEventListener('click', () => {
    const kg = Number(String($('weight-input').value).replace(',', '.'));
    const dateKey = $('weight-date').value || selectedDateKey;
    if (!kg || kg < 30 || kg > 250) return alert('Indiquez un poids valide.');
    const timestamp = timestampForDateKey(dateKey);
    state.weights.push({ id: makeId(), date: timestamp, dateKey, kg });
    refreshCurrentWeightFromLog();
    saveState(); $('weight-input').value = ''; selectedDateKey = dateKey;
    renderWeight(); updateToday(); fillSettings();
  });
}

function fillSettings() {
  const p = state.profile;
  $('set-age').value = p.age; $('set-sex').value = p.sex; $('set-height').value = p.heightCm || ''; $('set-weight').value = p.currentWeightKg;
  $('set-goal-weight').value = p.goalWeightKg; $('set-activity').value = String(p.activityFactor); $('set-deficit').value = p.deficitKcal; $('set-protein-factor').value = p.proteinFactor; $('set-api-url').value = p.apiUrl || '';
  const sources = activitySourceMap();
  $('source-course').value = sources['Course'] || '';
  $('source-gym').value = sources['Gym'] || '';
  $('source-machine-musculation').value = sources['Machine musculation'] || '';
  $('source-marche').value = sources['Marche'] || '';
  $('source-natation').value = sources['Natation'] || '';
  $('source-randonnee').value = sources['Randonnée'] || '';
  $('source-velo').value = sources['Vélo'] || '';
  $('source-velo-appart').value = sources['Vélo appart'] || '';
  $('api-mode').textContent = !p.apiUrl ? 'Mode actuel : /api/analyze sur le même site (Vercel).' : `Mode actuel : service externe ${p.apiUrl}`;
}

function setupSettings() {
  $('save-activity-sources').addEventListener('click', () => {
    state.profile.activitySources = {
      'Course': $('source-course').value.trim(),
      'Gym': $('source-gym').value.trim(),
      'Machine musculation': $('source-machine-musculation').value.trim(),
      'Marche': $('source-marche').value.trim(),
      'Natation': $('source-natation').value.trim(),
      'Randonnée': $('source-randonnee').value.trim(),
      'Vélo': $('source-velo').value.trim(),
      'Vélo appart': $('source-velo-appart').value.trim()
    };
    saveState();
    populateActivitySourceSelect(currentActivityName() || 'Vélo');
    alert('Sources des activités enregistrées.');
  });

  $('save-settings').addEventListener('click', () => {
    const p = state.profile;
    p.age = Number($('set-age').value); p.sex = $('set-sex').value; p.heightCm = Number($('set-height').value); p.currentWeightKg = Number($('set-weight').value); p.goalWeightKg = Number($('set-goal-weight').value);
    p.activityFactor = Number($('set-activity').value); p.deficitKcal = Number($('set-deficit').value); p.proteinFactor = Number($('set-protein-factor').value); p.apiUrl = $('set-api-url').value.trim(); p.setupDone = Boolean(p.heightCm);
    saveState(); updateToday(); fillSettings(); alert('Réglages enregistrés.');
  });
  $('export-data').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `calories-${localDateKey()}.json`; a.click(); URL.revokeObjectURL(a.href);
  });
  $('reset-data').addEventListener('click', () => {
    if (!confirm('Effacer définitivement toutes les données enregistrées sur cet appareil ?')) return;
    localStorage.removeItem(STORAGE_KEY); state = structuredClone(defaultState); location.reload();
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}

function init() {
  setupNavigation(); setupFirstRun(); setupPhoto(); setupManualEntry(); setupActivity(); setupDeletion(); setupMealEditing(); setupWeight(); setupSettings();
  setEntryDates(selectedDateKey); updateToday(); fillSettings(); renderLocalFoodDb(); registerServiceWorker();
  window.addEventListener('resize', () => { if ($('view-weight').classList.contains('active')) renderWeight(); });
}

document.addEventListener('DOMContentLoaded', init);
