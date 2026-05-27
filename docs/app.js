// ==============================
// Configuración rápida de Firebase
// ==============================
// Cambia esta URL si creas otra base de datos en Firebase.
const FIREBASE_BASE_URL = "https://biosinergia-modulo-portatil-default-rtdb.firebaseio.com";
// Cambia el ID si deseas controlar otro dispositivo.
const DEVICE_ID = "biosinergia_001";
// Si usas token, agrégalo aquí. Para pruebas abiertas puede quedar vacío.
const FIREBASE_AUTH = "";

const latestPath = `/devices/${DEVICE_ID}/latest.json`;
const commandsPath = `/devices/${DEVICE_ID}/commands.json`;
const historyPath = `/devices/${DEVICE_ID}/history.json?orderBy=%22$key%22&limitToLast=10`;
const eventsPath = `/devices/${DEVICE_ID}/events.json?orderBy=%22$key%22&limitToLast=10`;
const calibrationPath = `/devices/${DEVICE_ID}/calibration.json`;
const configPath = `/devices/${DEVICE_ID}/config.json`;
const historyDownloadPath = `/devices/${DEVICE_ID}/history.json`;
const eventsDownloadPath = `/devices/${DEVICE_ID}/events.json`;
const refreshMs = 5000;
const historyRefreshMs = 15000;
const chartsRefreshMs = 60000;
const charts24hLimit = 1500;

const els = {
  connectionStatus: document.getElementById("connectionStatus"),
  lastRefresh: document.getElementById("lastRefresh"),
  lastReading: document.getElementById("lastReading"),
  readingAge: document.getElementById("readingAge"),
  temperatura: document.getElementById("temperatura"),
  humedadAmbiente: document.getElementById("humedadAmbiente"),
  humedadSuelo: document.getElementById("humedadSuelo"),
  co2: document.getElementById("co2"),
  distanciaCm: document.getElementById("distanciaCm"),
  uptime: document.getElementById("uptime"),
  relay1State: document.getElementById("relay1State"),
  relay2State: document.getElementById("relay2State"),
  historyStatus: document.getElementById("historyStatus"),
  historyList: document.getElementById("historyList"),
  eventsStatus: document.getElementById("eventsStatus"),
  eventsList: document.getElementById("eventsList"),
  diagDeviceId: document.getElementById("diagDeviceId"),
  diagLastUrl: document.getElementById("diagLastUrl"),
  diagGetStatus: document.getElementById("diagGetStatus"),
  diagPatchStatus: document.getElementById("diagPatchStatus"),
  downloadStatus: document.getElementById("downloadStatus"),
  downloadHistoryCsv: document.getElementById("downloadHistoryCsv"),
  downloadEventsCsv: document.getElementById("downloadEventsCsv"),
  downloadHistoryJson: document.getElementById("downloadHistoryJson"),
  downloadEventsJson: document.getElementById("downloadEventsJson"),
  calibrationStatus: document.getElementById("calibrationStatus"),
  calibrationModeHint: document.getElementById("calibrationModeHint"),
  enableCalibration: document.getElementById("enableCalibration"),
  disableCalibration: document.getElementById("disableCalibration"),
  temperaturaRaw: document.getElementById("temperaturaRaw"),
  humedadRaw: document.getElementById("humedadRaw"),
  co2Raw: document.getElementById("co2Raw"),
  temperaturaCal: document.getElementById("temperaturaCal"),
  humedadCal: document.getElementById("humedadCal"),
  co2Cal: document.getElementById("co2Cal"),
  temperatureOffsetCurrent: document.getElementById("temperatureOffsetCurrent"),
  humidityOffsetCurrent: document.getElementById("humidityOffsetCurrent"),
  co2OffsetCurrent: document.getElementById("co2OffsetCurrent"),
  temperatureRef: document.getElementById("temperatureRef"),
  humidityRef: document.getElementById("humidityRef"),
  co2Ref: document.getElementById("co2Ref"),
  calculateTemperature: document.getElementById("calculateTemperature"),
  calculateHumidity: document.getElementById("calculateHumidity"),
  calculateCo2: document.getElementById("calculateCo2"),
  saveTemperature: document.getElementById("saveTemperature"),
  saveHumidity: document.getElementById("saveHumidity"),
  saveCo2: document.getElementById("saveCo2"),
  resetTemperature: document.getElementById("resetTemperature"),
  resetHumidity: document.getElementById("resetHumidity"),
  resetCo2: document.getElementById("resetCo2"),
  temperaturePreview: document.getElementById("temperaturePreview"),
  humidityPreview: document.getElementById("humidityPreview"),
  co2Preview: document.getElementById("co2Preview"),
  temperatureCalibrationError: document.getElementById("temperatureCalibrationError"),
  humidityCalibrationError: document.getElementById("humidityCalibrationError"),
  co2CalibrationError: document.getElementById("co2CalibrationError"),
  modeStatus: document.getElementById("modeStatus"),
  currentMode: document.getElementById("currentMode"),
  modeSelect: document.getElementById("modeSelect"),
  applyMode: document.getElementById("applyMode"),
  manualControlHint: document.getElementById("manualControlHint"),
  autoDecisionStatus: document.getElementById("autoDecisionStatus"),
  activeSetSummary: document.getElementById("activeSetSummary"),
  setpointsStatus: document.getElementById("setpointsStatus"),
  saveSetpoints: document.getElementById("saveSetpoints"),
  co2Min: document.getElementById("co2Min"),
  co2Max: document.getElementById("co2Max"),
  humMin: document.getElementById("humMin"),
  humMax: document.getElementById("humMax"),
  tempMin: document.getElementById("tempMin"),
  tempMax: document.getElementById("tempMax"),
  tempCritical: document.getElementById("tempCritical"),
  minHumidifierOnSec: document.getElementById("minHumidifierOnSec"),
  minHumidifierOffSec: document.getElementById("minHumidifierOffSec"),
  minVentilationOnSec: document.getElementById("minVentilationOnSec"),
  minVentilationOffSec: document.getElementById("minVentilationOffSec"),
  delayAfterVentilationSec: document.getElementById("delayAfterVentilationSec"),
  mutualExclusion: document.getElementById("mutualExclusion"),
  crop: document.getElementById("crop"),
  chartRangeSelect: document.getElementById("chartRangeSelect"),
  refreshCharts: document.getElementById("refreshCharts"),
  chartsStatus: document.getElementById("chartsStatus"),
  chartsSummary: document.getElementById("chartsSummary"),
  tempReference: document.getElementById("tempReference"),
  humReference: document.getElementById("humReference"),
  co2Reference: document.getElementById("co2Reference"),
  tempChart: document.getElementById("tempChart"),
  humChart: document.getElementById("humChart"),
  co2Chart: document.getElementById("co2Chart"),
  humidifierChart: document.getElementById("humidifierChart"),
  ventilationChart: document.getElementById("ventilationChart")
};

const diag = {
  lastReadingTimestamp: null,
  lastUrl: "--",
  lastGetStatus: "--",
  lastPatchStatus: "--",
  chartsLastLoad: "--",
  chartsCount: "--",
  chartsState: "--",
  calibrationPatchStatus: "--",
  calibrationSensor: "--",
  calibrationUpdatedAt: "--"
};

const state = {
  latest: null,
  calibration: null,
  pendingCalibrationBySensor: {},
  config: null
};

function buildUrl(path) {
  const authQuery = FIREBASE_AUTH ? `?auth=${encodeURIComponent(FIREBASE_AUTH)}` : "";
  return `${FIREBASE_BASE_URL}${path}${authQuery}`;
}

function formatValue(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${value}`;
}


function toNumberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function updateCalibrationView() {
  const latest = state.latest || {};
  const calibration = state.calibration || {};
  const hasCalibration = calibration && typeof calibration === "object";

  const temperatureRaw = latest.temperaturaRaw ?? latest.temperatura;
  const humidityRaw = latest.humedadAmbienteRaw ?? latest.humedadAmbiente;
  const co2Raw = latest.co2Raw ?? latest.co2;

  els.temperaturaRaw.textContent = formatValue(temperatureRaw);
  els.humedadRaw.textContent = formatValue(humidityRaw);
  els.co2Raw.textContent = formatValue(co2Raw);
  els.temperaturaCal.textContent = formatValue(latest.temperatura);
  els.humedadCal.textContent = formatValue(latest.humedadAmbiente);
  els.co2Cal.textContent = formatValue(latest.co2);

  els.temperatureOffsetCurrent.textContent = formatValue(calibration.temperatureOffset ?? 0);
  els.humidityOffsetCurrent.textContent = formatValue(calibration.humidityOffset ?? 0);
  els.co2OffsetCurrent.textContent = formatValue(calibration.co2Offset ?? 0);
  if (!hasCalibration) {
    els.calibrationStatus.textContent = "Calibración no configurada";
  } else {
    const enabledText = calibration.enabled === false ? "desactivada" : "activa";
    els.calibrationStatus.textContent = `Calibración ${enabledText} · método: ${calibration.method ?? "--"}`;
  }
  const mode = (state.latest || {}).mode ?? (state.config || {}).mode;
  els.calibrationModeHint.textContent = mode === "manual" ? "" : "Para calibrar, se recomienda dejar el sistema en modo manual y esperar estabilización de las lecturas.";
}

function jsonToCsv(list) {
  if (!list.length) return "";
  const keys = Array.from(list.reduce((acc, item) => {
    Object.keys(item || {}).forEach((k) => acc.add(k));
    return acc;
  }, new Set()));
  const escape = (value) => {
    const s = value === null || value === undefined ? "" : String(value);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [keys.join(",")];
  list.forEach((item) => rows.push(keys.map((k) => escape(item[k])).join(",")));
  return rows.join("\n");
}

function downloadContent(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function fetchCollection(path) {
  const response = await fetch(buildUrl(path));
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}

function formatDistance(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "Sin lectura";
  return `${value} cm`;
}

function formatUptime(ms) {
  if (ms === null || ms === undefined || Number.isNaN(ms)) return "--";
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function normalizeTimestamp(value) {
  if (!value || Number.isNaN(Number(value))) return null;
  const n = Number(value);
  return n < 1000000000000 ? n * 1000 : n;
}

function formatTimestamp(value) {
  const normalized = normalizeTimestamp(value);
  if (!normalized) return "--";
  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date(normalized));
}

function secondsSinceTimestamp(value) {
  const normalized = normalizeTimestamp(value);
  if (!normalized) return null;
  return Math.max(0, Math.floor((Date.now() - normalized) / 1000));
}

function boolBadge(value) {
  if (value === true) return '<span class="badge badge-on">ON</span>';
  if (value === false) return '<span class="badge badge-off">OFF</span>';
  return "--";
}

function setStatus(text, cssClass) {
  els.connectionStatus.textContent = text;
  els.connectionStatus.className = `status-pill ${cssClass}`;
}

function updateRefreshTime() {
  els.lastRefresh.textContent = `Última consulta de la web: ${formatTimestamp(Date.now())}`;
}

function getStateClass(metric, value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  if (metric === "temperatura") {
    if (value > 34 || value < 8) return "state-critical";
    if (value > 30 || value < 12) return "state-warn";
    return "state-good";
  }
  if (metric === "humedadAmbiente" || metric === "humedadSuelo") {
    if (value < 20 || value > 90) return "state-critical";
    if (value < 30 || value > 80) return "state-warn";
    return "state-good";
  }
  if (metric === "co2") {
    if (value > 1500) return "state-critical";
    if (value > 900) return "state-warn";
    return "state-good";
  }
  if (metric === "distanciaCm") {
    if (value <= 5 || value >= 60) return "state-critical";
    if (value <= 10 || value >= 45) return "state-warn";
    return "state-good";
  }
  return "state-good";
}

function paintMetricState(el, metric, value) {
  el.classList.remove("state-good", "state-warn", "state-critical");
  const stateClass = getStateClass(metric, Number(value));
  if (stateClass) el.classList.add(stateClass);
}

function updateReadingAge() {
  if (!diag.lastReadingTimestamp) {
    els.readingAge.textContent = "Hace -- segundos";
    return;
  }
  const seconds = secondsSinceTimestamp(diag.lastReadingTimestamp);
  if (seconds === null) {
    els.readingAge.textContent = "Hace -- segundos";
    return;
  }
  els.readingAge.textContent = `Hace ${seconds} segundos`;
}

function updateDiagnostics() {
  els.diagDeviceId.textContent = DEVICE_ID;
  els.diagLastUrl.textContent = diag.lastUrl;
  els.diagGetStatus.textContent = diag.lastGetStatus;
  els.diagPatchStatus.textContent = diag.lastPatchStatus;
  const chartsLoadEl = document.getElementById("diagChartsLastLoad");
  const calibrationPatchEl = document.getElementById("diagCalibrationPatch");
  const calibrationSensorEl = document.getElementById("diagCalibrationSensor");
  const calibrationAtEl = document.getElementById("diagCalibrationAt");
  const chartsCountEl = document.getElementById("diagChartsCount");
  const chartsStateEl = document.getElementById("diagChartsState");
  if (chartsLoadEl) chartsLoadEl.textContent = diag.chartsLastLoad;
  if (chartsCountEl) chartsCountEl.textContent = diag.chartsCount;
  if (chartsStateEl) chartsStateEl.textContent = diag.chartsState;
  if (calibrationPatchEl) calibrationPatchEl.textContent = diag.calibrationPatchStatus;
  if (calibrationSensorEl) calibrationSensorEl.textContent = diag.calibrationSensor;
  if (calibrationAtEl) calibrationAtEl.textContent = diag.calibrationUpdatedAt;
}

function renderData(data) {
  if (!data || typeof data !== "object") {
    setStatus("Sin datos", "status-empty");
    return;
  }

  setStatus("Conectado", "status-ok");

  els.temperatura.textContent = formatValue(data.temperatura);
  els.humedadAmbiente.textContent = formatValue(data.humedadAmbiente);
  els.co2.textContent = formatValue(data.co2);
  els.uptime.textContent = formatUptime(data.uptimeMs);

  paintMetricState(els.temperatura, "temperatura", data.temperatura);
  paintMetricState(els.humedadAmbiente, "humedadAmbiente", data.humedadAmbiente);
  paintMetricState(els.co2, "co2", data.co2);

  const relay1On = data.relay1 === true;
  const relay2On = data.relay2 === true;
  els.relay1State.textContent = `Estado: ${relay1On ? "ON" : data.relay1 === false ? "OFF" : "--"}`;
  els.relay2State.textContent = `Estado: ${relay2On ? "ON" : data.relay2 === false ? "OFF" : "--"}`;

  document.querySelectorAll('[data-relay="relay1"]').forEach((b) => b.classList.toggle("active", b.dataset.value === String(relay1On)));
  document.querySelectorAll('[data-relay="relay2"]').forEach((b) => b.classList.toggle("active", b.dataset.value === String(relay2On)));

  diag.lastReadingTimestamp = data.timestamp ?? null;
  els.lastReading.textContent = `Última medición del ESP32: ${formatTimestamp(data.timestamp)}`;
  updateReadingAge();
  renderAutomaticDecision();
}

async function fetchLatest() {
  const url = buildUrl(latestPath);
  diag.lastUrl = url;
  try {
    const response = await fetch(url);
    diag.lastGetStatus = `HTTP ${response.status}`;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const latest = await response.json();
    state.latest = latest;
    renderData(latest);
    updateCalibrationView();
    updateRefreshTime();
    updateDiagnostics();
  } catch (error) {
    console.error("Error al consultar latest:", error);
    setStatus("Error", "status-error");
    updateRefreshTime();
    updateDiagnostics();
  }
}

function normalizeFirebaseList(data) {
  if (!data || typeof data !== "object") return [];
  return Object.entries(data)
    .map(([key, value]) => ({ key, ...(value || {}) }))
    .sort((a, b) => String(b.key).localeCompare(String(a.key)));
}

function renderHistory(list) {
  els.historyStatus.classList.remove("section-error");
  if (!list.length) {
    els.historyStatus.textContent = "Sin registros todavía";
    els.historyList.innerHTML = "";
    return;
  }
  els.historyStatus.textContent = `Mostrando ${list.length} mediciones recientes`;
  els.historyList.innerHTML = list.map((item) => `
    <article class="record-item">
      <div class="record-top">
        <span class="record-title">Registro ${item.key}</span>
        <span class="record-time">${formatTimestamp(item.timestamp || item.ts)}</span>
      </div>
      <div class="record-grid">
        <p><strong>Temp:</strong> ${formatValue(item.temperatura)} °C</p>
        <p><strong>Hum. amb:</strong> ${formatValue(item.humedadAmbiente)} %</p>
        <p><strong>CO2:</strong> ${formatValue(item.co2)} ppm</p>
        <p><strong>Relay 1:</strong> ${boolBadge(item.relay1)}</p>
        <p><strong>Relay 2:</strong> ${boolBadge(item.relay2)}</p>
        <p><strong>Modo:</strong> ${item.modo ?? "--"}</p>
      </div>
    </article>
  `).join("");
}

function getEventTone(event) {
  const text = `${event.type || event.tipoEvento || ""} ${event.reason || event.motivo || ""}`.toLowerCase();
  return /(alert|alarma|crit|warn|error)/.test(text) ? " event-alert" : "";
}

function renderEvents(list) {
  els.eventsStatus.classList.remove("section-error");
  if (!list.length) {
    els.eventsStatus.textContent = "Sin registros todavía";
    els.eventsList.innerHTML = "";
    return;
  }
  els.eventsStatus.textContent = `Mostrando ${list.length} eventos recientes`;
  els.eventsList.innerHTML = list.map((event) => {
    const actuatorLabel = event.actuatorName || event.actuator || event.actuador || "--";
    const fromValue = event.from;
    const toValue = event.to;
    const fromText = fromValue === true ? "ON" : fromValue === false ? "OFF" : "--";
    const toText = toValue === true ? "ON" : toValue === false ? "OFF" : "--";
    const snapshot = event.snapshot || {};
    const snapshotTemp = snapshot.temperatura ?? "--";
    const snapshotHum = snapshot.humedadAmbiente ?? "--";
    const snapshotCo2 = snapshot.co2 ?? "--";
    const eventType = event.type || event.tipoEvento || "Evento";
    const eventReason = event.reason ?? event.motivo ?? "--";
    const eventMode = event.mode ?? event.modo ?? "--";
    return `
    <article class="record-item${getEventTone(event)}">
      <div class="record-top">
        <span class="record-title">${eventType}</span>
        <span class="record-time">${formatTimestamp(event.timestamp || event.ts)}</span>
      </div>
      <div class="record-grid">
        <p><strong>Actuador:</strong> ${actuatorLabel}</p>
        <p><strong>Relay:</strong> ${event.relay ?? "--"}</p>
        <p><strong>Estado:</strong> ${fromText} → ${toText}</p>
        <p><strong>Motivo:</strong> ${eventReason}</p>
        <p><strong>Duración:</strong> ${event.durationSec !== undefined ? `${event.durationSec} s` : "--"}</p>
        <p><strong>Temp snapshot:</strong> ${snapshotTemp} °C</p>
        <p><strong>Hum snapshot:</strong> ${snapshotHum} %</p>
        <p><strong>CO2 snapshot:</strong> ${snapshotCo2} ppm</p>
        <p><strong>Modo:</strong> ${eventMode}</p>
      </div>
    </article>
  `;
  }).join("");
}


const chartInstances = { temp: null, hum: null, co2: null, humidifier: null, ventilation: null };
const optimalRangePlugin = {
  id: "optimalRangePlugin",
  beforeDatasetsDraw(chart, _args, pluginOptions) {
    const range = pluginOptions?.optimalRange;
    if (!range || !Number.isFinite(range.yMin) || !Number.isFinite(range.yMax)) return;
    const yScale = chart.scales.y;
    const xScale = chart.scales.x;
    if (!yScale || !xScale) return;
    const top = yScale.getPixelForValue(range.yMax);
    const bottom = yScale.getPixelForValue(range.yMin);
    const ctx = chart.ctx;
    ctx.save();
    ctx.fillStyle = "rgba(44, 167, 107, 0.13)";
    ctx.fillRect(xScale.left, top, xScale.right - xScale.left, bottom - top);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(22, 101, 59, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(xScale.left, top); ctx.lineTo(xScale.right, top); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xScale.left, bottom); ctx.lineTo(xScale.right, bottom); ctx.stroke();
    ctx.restore();
  }
};

function normalizeHistoryRecords(data) {
  if (!data || typeof data !== "object") return [];
  return Object.entries(data).map(([id, value]) => {
    const rec = value || {};
    const tsRaw = Number(rec.timestamp ?? rec.ts);
    const timestamp = Number.isFinite(tsRaw) && tsRaw > 100000 ? tsRaw : null;
    return {
      id,
      timestamp,
      date: timestamp ? new Date(normalizeTimestamp(timestamp)) : null,
      temperatura: toNumberOrNull(rec.temperatura),
      humedadAmbiente: toNumberOrNull(rec.humedadAmbiente),
      co2: toNumberOrNull(rec.co2),
      relay1: rec.relay1 === true ? 1 : rec.relay1 === false ? 0 : null,
      relay2: rec.relay2 === true ? 1 : rec.relay2 === false ? 0 : null,
      mode: rec.mode ?? rec.modo ?? null,
      uptimeMs: toNumberOrNull(rec.uptimeMs)
    };
  }).sort((a,b)=> (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0));
}

function destroyCharts(){ Object.keys(chartInstances).forEach(k=>{ if(chartInstances[k]){ chartInstances[k].destroy(); chartInstances[k]=null; } }); }
function createLineChart(canvas, label, labels, values, color, stepped=false, optimalRange=null, yAxisConfig={}){
  if (!canvas || typeof Chart === "undefined") return null;
  return new Chart(canvas.getContext("2d"), { type:"line", data:{labels,datasets:[{label,data:values,borderColor:color,backgroundColor:color,tension:0.25,stepped,pointRadius:0,borderWidth:2}]}, options:{responsive:true,maintainAspectRatio:false,plugins:{optimalRangePlugin:{optimalRange}},scales:{x:{ticks:{maxTicksLimit:8,maxRotation:0,callback:(_v, i)=> String(labels[i] || "").split(", ").pop()}},y:{beginAtZero:false,...yAxisConfig}}}, plugins:[optimalRangePlugin] });
}
function buildSharedTimeAxis(records){
  const sortedRecords = [...records];
  const chartTimes = sortedRecords.map((r) => normalizeTimestamp(r.timestamp));
  const chartLabels = sortedRecords.map((r, index) => {
    if (chartTimes[index]) return formatTimestamp(chartTimes[index]);
    if (Number.isFinite(r.uptimeMs)) return `Uptime ${formatUptime(r.uptimeMs)}`;
    return `Registro ${r.id}`;
  });
  return { sortedRecords, chartTimes, chartLabels };
}
function getChartRangeSelection(){ return els.chartRangeSelect?.value || "300"; }
function buildHistoryChartPath(range){
  const limit = range === "24h" ? charts24hLimit : Number(range || 300);
  return `/devices/${DEVICE_ID}/history.json?orderBy=%22$key%22&limitToLast=${limit}`;
}
function summarize(values){ if(!values.length) return null; return values.reduce((a,b)=>a+b,0)/values.length; }
function pctInRange(values,min,max){ if(!values.length||min===null||max===null) return null; const ok=values.filter(v=>v>=min&&v<=max).length; return (ok*100)/values.length; }
function setChartsStatus(text,isError=false){ els.chartsStatus.textContent=text; els.chartsStatus.classList.toggle("section-error",isError); }

async function fetchAndRenderCharts(){
  const range = getChartRangeSelection();
  if (typeof Chart === "undefined") { setChartsStatus("No se pudo cargar Chart.js. El resto del dashboard sigue disponible.", true); destroyCharts(); diag.chartsState = "Error"; updateDiagnostics(); return; }
  setChartsStatus("Cargando datos históricos…");
  try {
    const path = buildHistoryChartPath(range);
    const data = await fetchCollection(path);
    let records = normalizeHistoryRecords(data);
    if (range === "24h") { const cutoff = Date.now() - 24*60*60*1000; records = records.filter(r=>r.date && r.date.getTime()>=cutoff); }
    if (!records.length) { setChartsStatus("No hay datos suficientes para graficar."); destroyCharts(); diag.chartsCount = "0"; diag.chartsState = "Sin datos"; diag.chartsLastLoad = formatTimestamp(Date.now()); updateDiagnostics(); return; }
    const { sortedRecords, chartLabels } = buildSharedTimeAxis(records);
    const tempVals = sortedRecords.filter(r=>r.temperatura!==null).map(r=>r.temperatura);
    const humVals = sortedRecords.filter(r=>r.humedadAmbiente!==null).map(r=>r.humedadAmbiente);
    const co2Vals = sortedRecords.filter(r=>r.co2!==null).map(r=>r.co2);
    const cfg=state.config||{};
    const tempRange = { yMin: toNumberOrNull(cfg.tempMin), yMax: toNumberOrNull(cfg.tempMax) };
    const humRange = { yMin: toNumberOrNull(cfg.humMin), yMax: toNumberOrNull(cfg.humMax) };
    const co2Range = { yMin: toNumberOrNull(cfg.co2Min), yMax: toNumberOrNull(cfg.co2Max) };
    destroyCharts();
    chartInstances.temp = createLineChart(els.tempChart,"Temperatura (°C)",chartLabels,sortedRecords.map(r=>r.temperatura),"#2ca76b",false,tempRange);
    chartInstances.hum = createLineChart(els.humChart,"Humedad (%)",chartLabels,sortedRecords.map(r=>r.humedadAmbiente),"#2e8b9f",false,humRange);
    chartInstances.humidifier = createLineChart(els.humidifierChart,"Humidificador",chartLabels,sortedRecords.map(r=>r.relay1),"#3b82f6",true,null,{min:0,max:1,ticks:{stepSize:1,callback:(v)=>v===1?"ON":"OFF"}});
    chartInstances.ventilation = createLineChart(els.ventilationChart,"Ventilación",chartLabels,sortedRecords.map(r=>r.relay2),"#f97316",true,null,{min:0,max:1,ticks:{stepSize:1,callback:(v)=>v===1?"ON":"OFF"}});
    chartInstances.co2 = createLineChart(els.co2Chart,"CO2 (ppm)",chartLabels,sortedRecords.map(r=>r.co2),"#0f766e",false,co2Range);
    els.tempReference.textContent = `Rango SET activo: ${formatValue(cfg.tempMin)} – ${formatValue(cfg.tempMax)} °C`;
    els.humReference.textContent = `Rango SET activo: ${formatValue(cfg.humMin)} – ${formatValue(cfg.humMax)} %`;
    els.co2Reference.textContent = `Rango SET activo: ${formatValue(cfg.co2Min)} – ${formatValue(cfg.co2Max)} ppm`;
    const humIn = pctInRange(humVals,toNumberOrNull(cfg.humMin),toNumberOrNull(cfg.humMax));
    const co2In = pctInRange(co2Vals,toNumberOrNull(cfg.co2Min),toNumberOrNull(cfg.co2Max));
    els.chartsSummary.innerHTML = `<p>Promedio temperatura: <strong>${summarize(tempVals)?.toFixed(2) ?? "--"}</strong></p><p>Promedio humedad: <strong>${summarize(humVals)?.toFixed(2) ?? "--"}</strong></p><p>Promedio CO2: <strong>${summarize(co2Vals)?.toFixed(2) ?? "--"}</strong></p><p>Máximo CO2: <strong>${co2Vals.length ? Math.max(...co2Vals).toFixed(2) : "--"}</strong></p><p>Mediciones: <strong>${sortedRecords.length}</strong></p><p>Humedad en rango: <strong>${humIn===null?"--":humIn.toFixed(1)+"%"}</strong></p><p>CO2 en rango: <strong>${co2In===null?"--":co2In.toFixed(1)+"%"}</strong></p>`;
    setChartsStatus(`Mostrando ${sortedRecords.length} mediciones para gráficos.`);
    diag.chartsLastLoad = formatTimestamp(Date.now()); diag.chartsCount = String(sortedRecords.length); diag.chartsState = "OK"; updateDiagnostics();
  } catch (error) { console.error("Error charts:", error); setChartsStatus("Error al cargar historial.", true); diag.chartsState = "Error"; updateDiagnostics(); }
}

async function fetchCalibration() {
  try {
    const calibration = await fetchCollection(calibrationPath);
    state.calibration = calibration;
    updateCalibrationView();
  } catch (error) {
    console.error("Error calibration:", error);
    els.calibrationStatus.textContent = "Error cargando calibración";
  }
}

async function fetchHistory() {
  try {
    const response = await fetch(buildUrl(historyPath));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const history = await response.json();
    renderHistory(normalizeFirebaseList(history));
  } catch (error) {
    console.error("Error history:", error);
    els.historyStatus.textContent = "Error cargando historial";
    els.historyStatus.classList.add("section-error");
    els.historyList.innerHTML = "";
  }
}

async function fetchEvents() {
  try {
    const response = await fetch(buildUrl(eventsPath));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const events = await response.json();
    renderEvents(normalizeFirebaseList(events));
  } catch (error) {
    console.error("Error events:", error);
    els.eventsStatus.textContent = "Error cargando eventos";
    els.eventsStatus.classList.add("section-error");
    els.eventsList.innerHTML = "";
  }
}

async function sendRelayCommand(relayName, relayValue) {
  const payload = { modo: "manual", [relayName]: relayValue };
  const url = buildUrl(commandsPath);
  diag.lastUrl = url;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    diag.lastPatchStatus = `HTTP ${response.status}`;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    updateDiagnostics();
    await fetchLatest();
  } catch (error) {
    console.error("Error al enviar comando:", error);
    setStatus("Error", "status-error");
    updateDiagnostics();
  }
}



async function handleDownload(path, format, baseName) {
  try {
    const data = await fetchCollection(path);
    const normalized = normalizeFirebaseList(data);
    if (!normalized.length) {
      els.downloadStatus.textContent = "Sin registros todavía";
      return;
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    if (format === "csv") {
      const csv = jsonToCsv(normalized);
      downloadContent(`${baseName}-${stamp}.csv`, csv, "text/csv;charset=utf-8;");
    } else {
      downloadContent(`${baseName}-${stamp}.json`, JSON.stringify(normalized, null, 2), "application/json;charset=utf-8;");
    }
    els.downloadStatus.textContent = `Descarga generada: ${baseName.toUpperCase()} ${format.toUpperCase()}`;
  } catch (error) {
    console.error("Error de descarga:", error);
    els.downloadStatus.textContent = "Error al generar descarga";
  }
}

function getSensorCalibrationMeta(sensorKey) {
  const map = {
    temperature: { raw: toNumberOrNull((state.latest || {}).temperaturaRaw ?? (state.latest || {}).temperatura), calibrated: toNumberOrNull((state.latest || {}).temperatura), ref: toNumberOrNull(els.temperatureRef.value), min: -10, max: 60, offsetField: "temperatureOffset", previewEl: els.temperaturePreview, errorEl: els.temperatureCalibrationError, unit: "°C" },
    humidity: { raw: toNumberOrNull((state.latest || {}).humedadAmbienteRaw ?? (state.latest || {}).humedadAmbiente), calibrated: toNumberOrNull((state.latest || {}).humedadAmbiente), ref: toNumberOrNull(els.humidityRef.value), min: 0, max: 100, offsetField: "humidityOffset", previewEl: els.humidityPreview, errorEl: els.humidityCalibrationError, unit: "%" },
    co2: { raw: toNumberOrNull((state.latest || {}).co2Raw ?? (state.latest || {}).co2), calibrated: toNumberOrNull((state.latest || {}).co2), ref: toNumberOrNull(els.co2Ref.value), min: 300, max: 10000, offsetField: "co2Offset", previewEl: els.co2Preview, errorEl: els.co2CalibrationError, unit: "ppm" }
  };
  return map[sensorKey];
}
function calculateSensorCalibration(sensorKey){
  const meta=getSensorCalibrationMeta(sensorKey); if(!meta) return;
  meta.errorEl.textContent="";
  if(meta.raw===null){ meta.errorEl.textContent="No hay lectura válida para calibrar este sensor."; meta.previewEl.textContent="Sin cálculo."; return; }
  if(meta.ref===null){ meta.errorEl.textContent="Ingresa un valor de referencia válido."; return; }
  if(meta.ref<meta.min||meta.ref>meta.max){ meta.errorEl.textContent=`Referencia fuera de rango (${meta.min} a ${meta.max} ${meta.unit}).`; return; }
  const offset=Number((meta.ref-meta.raw).toFixed(3));
  if(!Number.isFinite(offset)){ meta.errorEl.textContent="No se pudo calcular un offset válido."; return; }
  state.pendingCalibrationBySensor[sensorKey]={raw:meta.raw,reference:meta.ref,offset,expectedCalibrated:Number((meta.raw+offset).toFixed(3))};
  const p=state.pendingCalibrationBySensor[sensorKey];
  meta.previewEl.textContent=`Raw: ${p.raw} ${meta.unit} · Referencia: ${p.reference} ${meta.unit} · Offset calculado: ${p.offset} · ${sensorKey==="co2"?"CO2":"Valor"} calibrado esperado: ${p.expectedCalibrated} ${meta.unit}`;
}
async function patchCalibration(payload, label){
  const response = await fetch(buildUrl(calibrationPath), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  diag.lastPatchStatus=`HTTP ${response.status}`; diag.calibrationPatchStatus=`${label}: HTTP ${response.status}`;
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
}
async function saveSensorCalibration(sensorKey){
  const meta=getSensorCalibrationMeta(sensorKey); const pending=state.pendingCalibrationBySensor[sensorKey];
  if(!pending){ meta.errorEl.textContent="Primero calcula el offset."; return; }
  const now=new Date().toISOString();
  const fromMap={temperature:"dashboard_calibration_temperature",humidity:"dashboard_calibration_humidity",co2:"dashboard_calibration_co2"};
  const payload={enabled:true,method:"software_offset",[meta.offsetField]:pending.offset,updatedAtWeb:now,updatedFrom:fromMap[sensorKey]};
  try{ await patchCalibration(payload,`calibración ${sensorKey}`); diag.calibrationSensor=sensorKey; diag.calibrationUpdatedAt=now; els.calibrationStatus.textContent=`Calibración de ${sensorKey} guardada`; updateDiagnostics(); await fetchCalibration(); }
  catch(e){ console.error(e); meta.errorEl.textContent="Error guardando calibración."; }
}
async function resetSensorCalibration(sensorKey){
  const meta=getSensorCalibrationMeta(sensorKey); const now=new Date().toISOString();
  const fromMap={temperature:"dashboard_reset_temperature",humidity:"dashboard_reset_humidity",co2:"dashboard_reset_co2"};
  try{ await patchCalibration({[meta.offsetField]:0,updatedAtWeb:now,updatedFrom:fromMap[sensorKey]},`reset ${sensorKey}`); diag.calibrationSensor=`reset_${sensorKey}`; diag.calibrationUpdatedAt=now; els.calibrationStatus.textContent=`Offset de ${sensorKey} reseteado`; updateDiagnostics(); await fetchCalibration(); }
  catch(e){ console.error(e); meta.errorEl.textContent="Error reseteando calibración."; }
}
async function enableCalibration(){ try{ await patchCalibration({enabled:true,method:"software_offset"},"activar calibración"); els.calibrationStatus.textContent="Calibración activada"; updateDiagnostics(); await fetchCalibration(); } catch(e){ els.calibrationStatus.textContent="Error activando calibración"; }}
async function disableCalibration() {
  try {
    await patchCalibration({ enabled: false },"desactivar calibración");
    els.calibrationStatus.textContent = "Calibración desactivada";
    updateDiagnostics();
    await fetchCalibration();
  } catch (error) {
    console.error("Error desactivando calibración:", error);
    els.calibrationStatus.textContent = "Error al desactivar calibración";
  }
}

const setpointFields = ["co2Min","co2Max","humMin","humMax","tempMin","tempMax","tempCritical","minHumidifierOnSec","minHumidifierOffSec","minVentilationOnSec","minVentilationOffSec","delayAfterVentilationSec","mutualExclusion","crop"];

function setManualControlsEnabled(enabled) {
  document.querySelectorAll("button[data-relay]").forEach((button) => {
    button.disabled = !enabled;
    button.classList.toggle("btn-disabled", !enabled);
  });
  els.manualControlHint.textContent = enabled ? "" : "Modo automático activo: los relés manuales están deshabilitados.";
}

function renderAutomaticDecision() {
  const latest = state.latest;
  const config = state.config;
  if (!latest || !config) {
    els.autoDecisionStatus.textContent = "Esperando datos suficientes.";
    return;
  }
  const mode = config.mode === "auto" ? "auto" : "manual";
  if (mode === "manual") {
    els.autoDecisionStatus.textContent = "Modo manual: los relés se controlan desde la web.";
    return;
  }
  const co2 = toNumberOrNull(latest.co2);
  const co2Max = toNumberOrNull(config.co2Max);
  const hum = toNumberOrNull(latest.humedadAmbiente);
  const humMin = toNumberOrNull(config.humMin);
  if (co2 !== null && co2Max !== null && co2 >= co2Max) {
    els.autoDecisionStatus.textContent = "Automático: ventilando por CO2 alto.";
    return;
  }
  if (latest.relay2 === true) {
    els.autoDecisionStatus.textContent = "Automático: ventilación activa.";
    return;
  }
  if (hum !== null && humMin !== null && hum < humMin && latest.relay1 === true) {
    els.autoDecisionStatus.textContent = "Automático: humidificando por humedad baja.";
    return;
  }
  if (latest.relay1 === false && latest.relay2 === false) {
    els.autoDecisionStatus.textContent = "Automático: sistema en reposo.";
    return;
  }
  els.autoDecisionStatus.textContent = "Esperando datos suficientes.";
}

function renderSetSummary() {
  const config = state.config;
  if (!config) {
    els.activeSetSummary.innerHTML = "<p>Esperando configuración...</p>";
    return;
  }
  const co2Min = formatValue(config.co2Min);
  const co2Max = formatValue(config.co2Max);
  const humMin = formatValue(config.humMin);
  const humMax = formatValue(config.humMax);
  const tempCritical = formatValue(config.tempCritical);
  const exclusion = config.mutualExclusion === true ? "Activada" : "Desactivada";
  els.activeSetSummary.innerHTML = `
    <p><strong>CO2:</strong> ${co2Min} – ${co2Max} ppm</p>
    <p><strong>Humedad:</strong> ${humMin} – ${humMax} %</p>
    <p><strong>Temperatura crítica:</strong> ${tempCritical} °C</p>
    <p><strong>Exclusión mutua:</strong> ${exclusion}</p>
  `;
}

function renderConfig(config) {
  if (!config || typeof config !== "object") {
    els.modeStatus.textContent = "Advertencia: no se pudo cargar config.json";
    els.setpointsStatus.textContent = "Advertencia: no se pudo cargar config.json";
    return;
  }
  const mode = config.mode === "auto" ? "auto" : "manual";
  els.currentMode.value = mode;
  els.modeSelect.value = mode;
  els.modeStatus.textContent = `Modo actual: ${mode}`;
  setManualControlsEnabled(mode === "manual");
  setpointFields.forEach((f) => {
    if (!els[f]) return;
    if (f === "mutualExclusion") {
      els[f].value = String(config[f] === true);
    } else {
      els[f].value = config[f] ?? "";
    }
  });
  els.setpointsStatus.textContent = "SETs listos para edición";
  renderSetSummary();
  renderAutomaticDecision();
}

async function fetchConfig() {
  try {
    const config = await fetchCollection(configPath);
    state.config = config;
    renderConfig(config);
  } catch (error) {
    console.error("Error config:", error);
    els.modeStatus.textContent = "Advertencia: config no disponible";
    els.setpointsStatus.textContent = "Advertencia: config no disponible";
  }
}

async function applyMode() {
  const mode = els.modeSelect.value === "auto" ? "auto" : "manual";
  const now = Date.now();
  try {
    const configPayload = { mode, updatedAtWeb: now, updatedFrom: "dashboard_mode" };
    const commandsPayload = { modo: mode };
    const [r1, r2] = await Promise.all([
      fetch(buildUrl(configPath), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(configPayload) }),
      fetch(buildUrl(commandsPath), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(commandsPayload) })
    ]);
    diag.lastPatchStatus = `config HTTP ${r1.status} · commands HTTP ${r2.status}`;
    if (!r1.ok || !r2.ok) throw new Error("Error actualizando modo");
    els.modeStatus.textContent = "Modo aplicado correctamente";
    updateDiagnostics();
    await fetchConfig();
fetchAndRenderCharts();
  } catch (error) {
    console.error("Error aplicando modo:", error);
    els.modeStatus.textContent = "Error al aplicar modo";
  }
}

async function saveSetpoints() {
  const payload = { updatedAtWeb: Date.now(), updatedFrom: "dashboard_setpoints" };
  setpointFields.forEach((f) => {
    if (f === "crop") payload[f] = els[f].value.trim();
    else if (f === "mutualExclusion") payload[f] = els[f].value === "true";
    else payload[f] = toNumberOrNull(els[f].value);
  });
  try {
    const response = await fetch(buildUrl(configPath), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    diag.lastPatchStatus = `HTTP ${response.status}`;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    els.setpointsStatus.textContent = "SETs guardados correctamente";
    updateDiagnostics();
    await fetchConfig();
fetchAndRenderCharts();
  } catch (error) {
    console.error("Error guardando setpoints:", error);
    els.setpointsStatus.textContent = "Error guardando SETs";
  }
}

els.downloadHistoryCsv.addEventListener("click", () => handleDownload(historyDownloadPath, "csv", "history"));
els.downloadEventsCsv.addEventListener("click", () => handleDownload(eventsDownloadPath, "csv", "events"));
els.downloadHistoryJson.addEventListener("click", () => handleDownload(historyDownloadPath, "json", "history"));
els.downloadEventsJson.addEventListener("click", () => handleDownload(eventsDownloadPath, "json", "events"));
els.calculateTemperature.addEventListener("click", () => calculateSensorCalibration("temperature"));
els.calculateHumidity.addEventListener("click", () => calculateSensorCalibration("humidity"));
els.calculateCo2.addEventListener("click", () => calculateSensorCalibration("co2"));
els.saveTemperature.addEventListener("click", () => saveSensorCalibration("temperature"));
els.saveHumidity.addEventListener("click", () => saveSensorCalibration("humidity"));
els.saveCo2.addEventListener("click", () => saveSensorCalibration("co2"));
els.resetTemperature.addEventListener("click", () => resetSensorCalibration("temperature"));
els.resetHumidity.addEventListener("click", () => resetSensorCalibration("humidity"));
els.resetCo2.addEventListener("click", () => resetSensorCalibration("co2"));
els.enableCalibration.addEventListener("click", enableCalibration);
els.disableCalibration.addEventListener("click", disableCalibration);
els.applyMode.addEventListener("click", applyMode);
els.saveSetpoints.addEventListener("click", saveSetpoints);
els.refreshCharts?.addEventListener("click", fetchAndRenderCharts);
els.chartRangeSelect?.addEventListener("change", fetchAndRenderCharts);

document.querySelectorAll("button[data-relay]").forEach((button) => {
  button.addEventListener("click", () => {
    const relay = button.dataset.relay;
    const value = button.dataset.value === "true";
    sendRelayCommand(relay, value);
  });
});

updateDiagnostics();
fetchLatest();
fetchHistory();
fetchEvents();
fetchCalibration();
fetchConfig();
fetchAndRenderCharts();
setInterval(fetchLatest, refreshMs);
setInterval(fetchHistory, historyRefreshMs);
setInterval(fetchEvents, historyRefreshMs);
setInterval(fetchCalibration, historyRefreshMs);
setInterval(fetchConfig, historyRefreshMs);
setInterval(fetchAndRenderCharts, chartsRefreshMs);
setInterval(updateReadingAge, 1000);


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then((registration) => {
      })
      .catch((error) => {
        console.warn("No se pudo registrar Service Worker:", error);
      });
  });
}
