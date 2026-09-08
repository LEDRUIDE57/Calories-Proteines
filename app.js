const STORAGE_KEY = 'caloriesV1State';

const FOOD_DB = {
  chicken: { name: 'Poulet cuit', kcal100: 165, protein100: 31 },
  steak: { name: 'Steak haché', kcal100: 250, protein100: 26 },
  egg: { name: 'Œuf', kcal100: 143, protein100: 13 },
  ham: { name: 'Jambon blanc', kcal100: 116, protein100: 20 },
  salmon: { name: 'Saumon cuit', kcal100: 206, protein100: 22 },
  tuna: { name: 'Thon au naturel', kcal100: 116, protein100: 26 },
  potato: { name: 'Pommes de terre cuites', kcal100: 87, protein100: 1.9 },
  fries: { name: 'Frites', kcal100: 312, protein100: 3.4 },
  rice: { name: 'Riz cuit', kcal100: 130, protein100: 2.7 },
  pasta: { name: 'Pâtes cuites', kcal100: 158, protein100: 5.8 },
  bread: { name: 'Pain', kcal100: 265, protein100: 9 },
  yogurt: { name: 'Yaourt nature', kcal100: 63, protein100: 4 },
  cheese: { name: 'Fromage type emmental', kcal100: 380, protein100: 28 },
  banana: { name: 'Banane', kcal100: 89, protein100: 1.1 },
  apple: { name: 'Pomme', kcal100: 52, protein100: 0.3 },
  salad: { name: 'Salade verte', kcal100: 15, protein100: 1.4 },
  carrot: { name: 'Carottes', kcal100: 41, protein100: 0.9 },
  watermelon: { name: 'Pastèque', kcal100: 30, protein100: 0.6 }
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
    apiUrl: ''
  },
  meals: [],
  activities: [],
  weights: [{ date: new Date().toISOString(), kg: 74 }]
};

let state = loadState();
let selectedImageData = null;
let currentAnalysis = null;

const $ = (id) => document.getElementById(id);
const round = (n, d = 0) => Number(Number(n).toFixed(d));
const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

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
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
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

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
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

function activitiesForDate(key) {
  return state.activities.filter(a => a.dateKey === key);
}

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
  return {
    calories: food.calories,
    protein: food.protein,
    activity,
    net: food.calories - activity
  };
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
  const greenPct = (greenValue / scaleMax) * 100;
  const redPct = (redValue / scaleMax) * 100;
  const targetPct = (safeTarget / scaleMax) * 100;

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

function updateToday() {
  const key = localDateKey();
  const meals = mealsForDate(key).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const activities = activitiesForDate(key).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const total = energyTotalsForDate(key);
  const targets = calculateTargets();

  $('today-date').textContent = formatDate(new Date());
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
  if (!meals.length) {
    $('today-meals').className = 'meal-list empty-state';
    $('today-meals').textContent = 'Aucun repas enregistré.';
  } else {
    $('today-meals').className = 'meal-list';
    $('today-meals').innerHTML = meals.map(meal => `
      <div class="meal-item">
        <div>
          <div class="meal-name">${escapeHtml(meal.type)} · ${escapeHtml(meal.name || 'Repas')}</div>
          <div class="meal-meta">${new Date(meal.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div class="meal-nutrition">${Math.round(meal.calories)} kcal<br><span class="muted">${round(meal.protein, 1)} g prot.</span></div>
        <button class="meal-delete" data-delete-meal="${meal.id}">Supprimer</button>
      </div>
    `).join('');
  }

  if (!activities.length) {
    $('today-activities').className = 'activity-list empty-state';
    $('today-activities').textContent = 'Aucune activité déduite aujourd’hui.';
  } else {
    $('today-activities').className = 'activity-list';
    $('today-activities').innerHTML = activities.map(activity => `
      <div class="activity-item">
        <div>
          <div class="meal-name">${escapeHtml(activity.name)}</div>
          <div class="meal-meta">${new Date(activity.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div class="activity-kcal">−${Math.round(activity.calories)} kcal</div>
        <button class="meal-delete" data-delete-activity="${activity.id}">Supprimer</button>
      </div>
    `).join('');
  }
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
    id: makeId(),
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

function addActivity(name, calories) {
  const now = new Date();
  state.activities.push({
    id: makeId(),
    timestamp: now.toISOString(),
    dateKey: localDateKey(now),
    name,
    calories: Number(calories)
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
      proteinPerGram: protein / grams
    };
  });
  return {
    ...analysis,
    items,
    total_calories: items.reduce((sum, item) => sum + item.calories, 0),
    total_protein_g: items.reduce((sum, item) => sum + item.protein_g, 0)
  };
}

function needsQuantityConfirmation(name = '') {
  return /(huile|sauce|beurre|mayonnaise|vinaigrette|assaisonnement|crème|creme|matière grasse|matiere grasse|fromage)/i.test(name);
}

function recalcAnalysisTotals() {
  if (!currentAnalysis) return;
  currentAnalysis.total_calories = currentAnalysis.items.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  currentAnalysis.total_protein_g = currentAnalysis.items.reduce((sum, item) => sum + Number(item.protein_g || 0), 0);
  $('analysis-calories').textContent = Math.round(currentAnalysis.total_calories);
  $('analysis-protein').textContent = round(currentAnalysis.total_protein_g, 1);
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
  const items = currentAnalysis.items || [];
  $('analysis-items').innerHTML = items.map((item, index) => `
    <div class="analysis-edit-row" data-analysis-index="${index}">
      <div class="analysis-main">
        <label class="analysis-name-label">Aliment
          <input class="analysis-name-input" data-analysis-name="${index}" type="text" value="${escapeHtml(item.name)}" />
        </label>
        ${needsQuantityConfirmation(item.name) ? '<span class="confirm-chip">Quantité à confirmer</span>' : ''}
        <div class="portion-editor">
          <button type="button" class="portion-btn" data-adjust-grams="${index}" data-delta="-10">−</button>
          <label>Quantité
            <div class="grams-input-wrap"><input data-analysis-grams="${index}" type="number" inputmode="numeric" min="1" step="5" value="${Math.round(item.estimated_grams)}" /><span>g</span></div>
          </label>
          <button type="button" class="portion-btn" data-adjust-grams="${index}" data-delta="10">+</button>
        </div>
      </div>
      <div class="analysis-numbers">
        <strong>${Math.round(item.calories)} kcal</strong>
        <span>${round(item.protein_g, 1)} g prot.</span>
        <button type="button" class="remove-analysis-item" data-remove-analysis="${index}">Retirer</button>
      </div>
    </div>
  `).join('');
  recalcAnalysisTotals();
}

function setupPhoto() {
  const handlePhotoSelection = async (event) => {
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
    } finally {
      event.target.value = '';
    }
  };

  $('camera-input').addEventListener('change', handlePhotoSelection);
  $('gallery-input').addEventListener('change', handlePhotoSelection);
  $('analyze-photo').addEventListener('click', analyzePhoto);

  $('analysis-items').addEventListener('click', (event) => {
    const adjust = event.target.closest('[data-adjust-grams]');
    if (adjust) {
      const index = Number(adjust.dataset.adjustGrams);
      const delta = Number(adjust.dataset.delta || 0);
      const current = Number(currentAnalysis?.items?.[index]?.estimated_grams || 0);
      updateAnalysisItemFromGrams(index, current + delta);
      return;
    }
    const remove = event.target.closest('[data-remove-analysis]');
    if (remove && currentAnalysis) {
      const index = Number(remove.dataset.removeAnalysis);
      currentAnalysis.items.splice(index, 1);
      renderAnalysisEditor();
    }
  });

  $('analysis-items').addEventListener('change', (event) => {
    const gramsInput = event.target.closest('[data-analysis-grams]');
    if (gramsInput) {
      updateAnalysisItemFromGrams(Number(gramsInput.dataset.analysisGrams), Number(gramsInput.value));
      return;
    }
    const nameInput = event.target.closest('[data-analysis-name]');
    if (nameInput && currentAnalysis?.items?.[Number(nameInput.dataset.analysisName)]) {
      currentAnalysis.items[Number(nameInput.dataset.analysisName)].name = nameInput.value.trim() || 'Aliment';
      renderAnalysisEditor();
    }
  });

  $('save-analysis').addEventListener('click', () => {
    if (!currentAnalysis || !currentAnalysis.items?.length) return;
    recalcAnalysisTotals();
    addMeal({
      type: $('analysis-meal-type').value,
      name: currentAnalysis.items.map(i => i.name).slice(0, 3).join(', ') || 'Repas analysé',
      calories: currentAnalysis.total_calories,
      protein: currentAnalysis.total_protein_g,
      items: currentAnalysis.items.map(({ kcalPerGram, proteinPerGram, ...item }) => item),
      source: 'photo-ai'
    });
    currentAnalysis = null;
    $('analysis-panel').hidden = true;
    setStatus('Repas ajouté à votre journée.', 'success');
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
    currentAnalysis = prepareAnalysis(analysis);
    renderAnalysisEditor();
    $('analysis-confidence').textContent = analysis.confidence ? `Confiance ${analysis.confidence}` : 'Estimation';
    $('analysis-note').textContent = analysis.notes || 'Estimation visuelle : corrigez les quantités si nécessaire.';
    $('analysis-status').hidden = true;
    $('analysis-panel').hidden = false;
  } catch (error) {
    if (String(error.message).includes('API_NOT_CONFIGURED') || (!configured && location.hostname.includes('github.io'))) {
      setStatus("L'analyse IA n'est pas reliée sur cette adresse. Vous pouvez utiliser l'ajout manuel.", 'info');
    } else {
      setStatus(`Analyse impossible : ${error.message}. Vous pouvez utiliser l'ajout manuel.`, 'error');
    }
  } finally {
    $('analyze-photo').disabled = false;
  }
}

function setupManualEntry() {
  const updateManualFields = () => {
    const key = $('manual-food').value;
    const isCustom = key === 'custom';
    $('manual-custom-wrap').hidden = !isCustom;

    if (!key || isCustom) {
      $('manual-reference').textContent = isCustom ? 'Pour un aliment personnalisé, saisissez les calories et protéines estimées.' : '';
      if (isCustom) {
        $('manual-calories').value = '';
        $('manual-protein').value = '';
      }
      return;
    }

    const food = FOOD_DB[key];
    if (!food) return;
    const grams = Math.max(1, Number($('manual-grams').value || 100));
    $('manual-grams').value = grams;
    $('manual-calories').value = Math.round(food.kcal100 * grams / 100);
    $('manual-protein').value = round(food.protein100 * grams / 100, 1);
    $('manual-reference').textContent = `Référence utilisée : ${food.kcal100} kcal et ${food.protein100} g de protéines pour 100 g. Valeurs indicatives.`;
  };

  $('manual-food').addEventListener('change', updateManualFields);
  $('manual-grams').addEventListener('input', () => {
    const key = $('manual-food').value;
    if (key && key !== 'custom') updateManualFields();
  });

  $('save-manual').addEventListener('click', () => {
    const key = $('manual-food').value;
    if (!key) return alert('Choisissez un aliment dans le menu.');
    const name = key === 'custom' ? $('manual-name').value.trim() : FOOD_DB[key]?.name;
    if (!name) return alert('Indiquez le nom de l’aliment.');
    const calories = Number($('manual-calories').value);
    const protein = Number($('manual-protein').value || 0);
    if (!Number.isFinite(calories) || calories < 0) return alert('Indiquez les calories à ajouter.');
    addMeal({ type: $('manual-type').value, name, calories, protein, source: 'manual' });
    $('manual-food').value = '';
    $('manual-name').value = '';
    $('manual-grams').value = '';
    $('manual-calories').value = '';
    $('manual-protein').value = '';
    $('manual-custom-wrap').hidden = true;
    $('manual-reference').textContent = '';
    showView('today');
  });
}

function setupActivity() {
  $('activity-type').addEventListener('change', () => {
    $('activity-custom-wrap').hidden = $('activity-type').value !== 'Autre';
  });

  $('save-activity').addEventListener('click', () => {
    const type = $('activity-type').value;
    const custom = $('activity-custom-name').value.trim();
    const name = type === 'Autre' ? custom : type;
    const calories = Number($('activity-calories').value);
    if (!name) return alert('Indiquez le nom de l’activité.');
    if (!Number.isFinite(calories) || calories <= 0) return alert('Indiquez les calories dépensées.');
    addActivity(name, calories);
    $('activity-calories').value = '';
    $('activity-custom-name').value = '';
    $('activity-type').value = 'Vélo';
    $('activity-custom-wrap').hidden = true;
  });
}

function setupDeletion() {
  document.body.addEventListener('click', (event) => {
    const mealId = event.target?.dataset?.deleteMeal;
    if (mealId) {
      if (!confirm('Supprimer cette entrée ?')) return;
      state.meals = state.meals.filter(m => m.id !== mealId);
      saveState();
      updateToday();
      renderHistory();
      return;
    }

    const activityId = event.target?.dataset?.deleteActivity;
    if (activityId) {
      if (!confirm('Supprimer cette activité ?')) return;
      state.activities = state.activities.filter(a => a.id !== activityId);
      saveState();
      updateToday();
      renderHistory();
    }
  });
}

function renderHistory() {
  const targets = calculateTargets();
  const keys = [...new Set([
    ...state.meals.map(m => m.dateKey),
    ...state.activities.map(a => a.dateKey)
  ])].sort().reverse();

  const last7 = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7.push(energyTotalsForDate(localDateKey(d)));
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
    <p class="muted small">Calcul sur les jours comportant une entrée. Objectif actuel : ${targets.target || '—'} kcal nettes et ${targets.protein || '—'} g de protéines.</p>
  `;

  if (!keys.length) {
    $('history-list').innerHTML = '<div class="empty-state">Aucun historique pour le moment.</div>';
    return;
  }

  $('history-list').innerHTML = keys.map(key => {
    const d = new Date(`${key}T12:00:00`);
    const meals = mealsForDate(key).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const activities = activitiesForDate(key).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const total = energyTotalsForDate(key);
    return `
      <div class="history-day">
        <div class="history-day-header">
          <strong>${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)}</strong>
          <span class="history-total">${Math.round(total.calories)} − ${Math.round(total.activity)} = ${Math.round(total.net)} kcal net · ${round(total.protein, 1)} g prot.</span>
        </div>
        <div class="history-day-body">
          ${meals.map(m => `
            <div class="meal-item">
              <div><div class="meal-name">${escapeHtml(m.type)} · ${escapeHtml(m.name)}</div></div>
              <div class="meal-nutrition">${Math.round(m.calories)} kcal<br><span class="muted">${round(m.protein, 1)} g prot.</span></div>
              <button class="meal-delete" data-delete-meal="${m.id}">Supprimer</button>
            </div>
          `).join('')}
          ${activities.map(a => `
            <div class="activity-item history-activity">
              <div><div class="meal-name">Sport · ${escapeHtml(a.name)}</div></div>
              <div class="activity-kcal">−${Math.round(a.calories)} kcal</div>
              <button class="meal-delete" data-delete-activity="${a.id}">Supprimer</button>
            </div>
          `).join('')}
        </div>
      </div>`;
  }).join('');
}

function renderWeight() {
  const weights = [...state.weights].sort((a, b) => a.date.localeCompare(b.date));
  const latest = weights[weights.length - 1]?.kg ?? state.profile.currentWeightKg;
  $('weight-current').textContent = Number(latest).toFixed(1);
  $('weight-start').textContent = `${Number(state.profile.startWeightKg).toFixed(1)} kg`;
  $('weight-goal').textContent = `${Number(state.profile.goalWeightKg).toFixed(1)} kg`;
  renderWeightChart(weights);
  $('weight-log').innerHTML = '<h3>Mesures</h3>' + [...weights].reverse().slice(0, 12).map(w => `
    <div class="weight-log-row"><span>${new Date(w.date).toLocaleDateString('fr-FR')}</span><strong>${Number(w.kg).toFixed(1)} kg</strong></div>
  `).join('');
}

function renderWeightChart(weights) {
  const canvas = $('weight-chart');
  const empty = $('weight-empty');
  if (weights.length < 2) {
    canvas.hidden = true;
    empty.hidden = false;
    return;
  }
  canvas.hidden = false;
  empty.hidden = true;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(320, rect.width) * dpr;
  canvas.height = 210 * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;
  const pad = { l: 42, r: 14, t: 18, b: 32 };
  const vals = weights.map(w => Number(w.kg));
  const goal = Number(state.profile.goalWeightKg);
  let min = Math.min(...vals, goal) - 0.4;
  let max = Math.max(...vals, goal) + 0.4;
  if (max - min < 1) {
    max += 0.5;
    min -= 0.5;
  }
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#dfe6e1';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const y = pad.t + (H - pad.t - pad.b) * i / 3;
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(W - pad.r, y);
    ctx.stroke();
    const v = max - (max - min) * i / 3;
    ctx.fillStyle = '#68756e';
    ctx.font = '11px system-ui';
    ctx.fillText(v.toFixed(1), 4, y + 4);
  }
  const xAt = i => pad.l + (W - pad.l - pad.r) * (weights.length === 1 ? 0 : i / (weights.length - 1));
  const yAt = v => pad.t + (max - v) / (max - min) * (H - pad.t - pad.b);
  ctx.strokeStyle = '#1f6f4a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  weights.forEach((w, i) => {
    const x = xAt(i);
    const y = yAt(Number(w.kg));
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = '#1f6f4a';
  weights.forEach((w, i) => {
    ctx.beginPath();
    ctx.arc(xAt(i), yAt(Number(w.kg)), 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = '#b77712';
  ctx.lineWidth = 1.5;
  const gy = yAt(goal);
  ctx.beginPath();
  ctx.moveTo(pad.l, gy);
  ctx.lineTo(W - pad.r, gy);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#68756e';
  ctx.font = '11px system-ui';
  ctx.fillText('Objectif', W - 58, Math.max(12, gy - 5));
  const first = new Date(weights[0].date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  const last = new Date(weights[weights.length - 1].date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  ctx.fillText(first, pad.l, H - 8);
  ctx.fillText(last, W - pad.r - 38, H - 8);
}

function setupWeight() {
  $('save-weight').addEventListener('click', () => {
    const kg = Number(String($('weight-input').value).replace(',', '.'));
    if (!kg || kg < 30 || kg > 250) return alert('Indiquez un poids valide.');
    state.profile.currentWeightKg = kg;
    state.weights.push({ date: new Date().toISOString(), kg });
    saveState();
    $('weight-input').value = '';
    renderWeight();
    updateToday();
    fillSettings();
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
    ? 'Mode actuel : /api/analyze sur le même site (Vercel).'
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
    updateToday();
    fillSettings();
    alert('Réglages enregistrés.');
  });

  $('export-data').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `calories-${localDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $('reset-data').addEventListener('click', () => {
    if (!confirm('Effacer définitivement toutes les données enregistrées sur cet appareil ?')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = structuredClone(defaultState);
    location.reload();
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
}

function init() {
  setupNavigation();
  setupFirstRun();
  setupPhoto();
  setupManualEntry();
  setupActivity();
  setupDeletion();
  setupWeight();
  setupSettings();
  updateToday();
  fillSettings();
  registerServiceWorker();
  window.addEventListener('resize', () => {
    if ($('view-weight').classList.contains('active')) renderWeight();
  });
}

document.addEventListener('DOMContentLoaded', init);
