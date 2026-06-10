// ==============================
// Configuración rápida de Firebase
// ==============================
// Cambia esta URL si creas otra base de datos en Firebase.
const FIREBASE_BASE_URL = "https://biosinergia-modulo-portatil-default-rtdb.firebaseio.com";
// Cambia el ID si deseas controlar otro dispositivo.
const DEVICE_ID = "biosinergia_001";
// Si usas token, agrégalo aquí. Para pruebas abiertas puede quedar vacío.
const FIREBASE_AUTH = "";

const WEB_VERSION = "BioSinergia Web v1.7.0";

const PAGE = document.body?.dataset?.page || "home";
const noop = () => {};
const missingClassList = { add: noop, remove: noop, toggle: noop, contains: () => false };
function createMissingElement(id) {
  return {
    id,
    dataset: {},
    style: {},
    classList: missingClassList,
    textContent: "",
    innerHTML: "",
    className: "",
    value: "",
    checked: false,
    hidden: false,
    disabled: false,
    addEventListener: noop,
    removeEventListener: noop,
    appendChild: noop,
    replaceChildren: noop,
    querySelector: () => null,
    querySelectorAll: () => [],
    getContext: () => null
  };
}
function $(id) {
  return document.getElementById(id) || createMissingElement(id);
}
function hasElement(id) {
  return document.getElementById(id) !== null;
}
function on(el, eventName, handler) {
  if (el && typeof el.addEventListener === "function" && document.getElementById(el.id)) {
    el.addEventListener(eventName, handler);
  }
}
function runEvery(task, ms) {
  task();
  return setInterval(task, ms);
}

const latestPath = `/devices/${DEVICE_ID}/latest.json`;
const commandsPath = `/devices/${DEVICE_ID}/commands.json`;
const historyPath = `/devices/${DEVICE_ID}/history.json?orderBy=%22$key%22&limitToLast=10`;
const eventsPath = `/devices/${DEVICE_ID}/events.json?orderBy=%22$key%22&limitToLast=10`;
const calibrationPath = `/devices/${DEVICE_ID}/calibration.json`;
const configPath = `/devices/${DEVICE_ID}/config.json`;
const timerConfigPath = `/devices/${DEVICE_ID}/config/timer.json`;
const historyDownloadPath = `/devices/${DEVICE_ID}/history.json`;
const eventsDownloadPath = `/devices/${DEVICE_ID}/events.json`;
const refreshMs = 5000;
const historyRefreshMs = 15000;
const chartsRefreshMs = 60000;
const charts24hLimit = 1500;

const els = {
  connectionStatus: $("connectionStatus"),
  lastRefresh: $("lastRefresh"),
  lastReading: $("lastReading"),
  readingAge: $("readingAge"),
  homeModeChip: $("homeModeChip"),
  homeSensorTypeChip: $("homeSensorTypeChip"),
  homeCo2StatusChip: $("homeCo2StatusChip"),
  homeCalibrationChip: $("homeCalibrationChip"),
  homeLastValidChip: $("homeLastValidChip"),
  overallStatusCard: $("overallStatusCard"),
  overallStatusText: $("overallStatusText"),
  moduleModeMessage: $("moduleModeMessage"),
  homeHumidifierCard: $("homeHumidifierCard"),
  homeHumidifierState: $("homeHumidifierState"),
  homeVentilationCard: $("homeVentilationCard"),
  homeVentilationState: $("homeVentilationState"),
  temperatureMetricStatus: $("temperatureMetricStatus"),
  humidityMetricStatus: $("humidityMetricStatus"),
  co2MetricStatus: $("co2MetricStatus"),
  uptimeMetricStatus: $("uptimeMetricStatus"),
  whatHappeningList: $("whatHappeningList"),
  homeAlertList: $("homeAlertList"),
  temperatura: $("temperatura"),
  humedadAmbiente: $("humedadAmbiente"),
  humedadSuelo: $("humedadSuelo"),
  co2: $("co2"),
  temperatureQualityCard: $("temperatureQualityCard"),
  temperatureQualityState: $("temperatureQualityState"),
  temperatureQualityDetail: $("temperatureQualityDetail"),
  humidityQualityCard: $("humidityQualityCard"),
  humidityQualityState: $("humidityQualityState"),
  humidityQualityDetail: $("humidityQualityDetail"),
  co2QualityCard: $("co2QualityCard"),
  co2QualityState: $("co2QualityState"),
  co2QualityDetail: $("co2QualityDetail"),
  distanciaCm: $("distanciaCm"),
  uptime: $("uptime"),
  relay1State: $("relay1State"),
  relay2State: $("relay2State"),
  historyStatus: $("historyStatus"),
  historyList: $("historyList"),
  eventsStatus: $("eventsStatus"),
  eventsList: $("eventsList"),
  diagDeviceId: $("diagDeviceId"),
  diagLastUrl: $("diagLastUrl"),
  diagGetStatus: $("diagGetStatus"),
  diagPatchStatus: $("diagPatchStatus"),
  downloadStatus: $("downloadStatus"),
  downloadHistoryCsv: $("downloadHistoryCsv"),
  downloadEventsCsv: $("downloadEventsCsv"),
  downloadHistoryJson: $("downloadHistoryJson"),
  downloadEventsJson: $("downloadEventsJson"),
  downloadFullBackup: $("downloadFullBackup"),
  startNewCampaign: $("startNewCampaign"),
  campaignStatus: $("campaignStatus"),
  campaignHistoryCount: $("campaignHistoryCount"),
  campaignEventsCount: $("campaignEventsCount"),
  campaignFirstReading: $("campaignFirstReading"),
  campaignLastReading: $("campaignLastReading"),
  campaignResultList: $("campaignResultList"),
  calibrationStatus: $("calibrationStatus"),
  calibrationModeHint: $("calibrationModeHint"),
  enableCalibration: $("enableCalibration"),
  disableCalibration: $("disableCalibration"),
  temperaturaRaw: $("temperaturaRaw"),
  humedadRaw: $("humedadRaw"),
  co2Raw: $("co2Raw"),
  temperaturaCal: $("temperaturaCal"),
  humedadCal: $("humedadCal"),
  co2Cal: $("co2Cal"),
  temperatureOffsetCurrent: $("temperatureOffsetCurrent"),
  humidityOffsetCurrent: $("humidityOffsetCurrent"),
  co2OffsetCurrent: $("co2OffsetCurrent"),
  temperatureRef: $("temperatureRef"),
  humidityRef: $("humidityRef"),
  co2Ref: $("co2Ref"),
  calculateTemperature: $("calculateTemperature"),
  calculateHumidity: $("calculateHumidity"),
  calculateCo2: $("calculateCo2"),
  saveTemperature: $("saveTemperature"),
  saveHumidity: $("saveHumidity"),
  saveCo2: $("saveCo2"),
  resetTemperature: $("resetTemperature"),
  resetHumidity: $("resetHumidity"),
  resetCo2: $("resetCo2"),
  temperaturePreview: $("temperaturePreview"),
  humidityPreview: $("humidityPreview"),
  co2Preview: $("co2Preview"),
  humidityCalibrationWarning: $("humidityCalibrationWarning"),
  co2CalibrationWarning: $("co2CalibrationWarning"),
  co2LatestStatus: $("co2LatestStatus"),
  co2ResetLatestStatus: $("co2ResetLatestStatus"),
  co2ResetLastAt: $("co2ResetLastAt"),
  co2ResetRequestStatus: $("co2ResetRequestStatus"),
  requestCo2Reset: $("requestCo2Reset"),
  sensorAmbientCalibrationWarning: $("sensorAmbientCalibrationWarning"),
  calibrationSensorType: $("calibrationSensorType"),
  calibrationSensorStatus: $("calibrationSensorStatus"),
  temperatureCalibrationError: $("temperatureCalibrationError"),
  humidityCalibrationError: $("humidityCalibrationError"),
  co2CalibrationError: $("co2CalibrationError"),
  modeStatus: $("modeStatus"),
  currentMode: $("currentMode"),
  sensorAmbientTypeSelect: $("sensorAmbientTypeSelect"),
  sensorAmbientApplied: $("sensorAmbientApplied"),
  sensorAmbientStatus: $("sensorAmbientStatus"),
  sensorAmbientConfigStatus: $("sensorAmbientConfigStatus"),
  saveSensorAmbientType: $("saveSensorAmbientType"),
  modeSelect: $("modeSelect"),
  applyMode: $("applyMode"),
  manualControlHint: $("manualControlHint"),
  autoDecisionStatus: $("autoDecisionStatus"),
  activeSetSummary: $("activeSetSummary"),
  setpointsStatus: $("setpointsStatus"),
  saveSetpoints: $("saveSetpoints"),
  co2Min: $("co2Min"),
  co2Max: $("co2Max"),
  humMin: $("humMin"),
  humMax: $("humMax"),
  tempMin: $("tempMin"),
  tempMax: $("tempMax"),
  tempCritical: $("tempCritical"),
  minHumidifierOnSec: $("minHumidifierOnSec"),
  minHumidifierOffSec: $("minHumidifierOffSec"),
  minVentilationOnSec: $("minVentilationOnSec"),
  minVentilationOffSec: $("minVentilationOffSec"),
  delayAfterVentilationSec: $("delayAfterVentilationSec"),
  mutualExclusion: $("mutualExclusion"),
  crop: $("crop"),
  chartRangeSelect: $("chartRangeSelect"),
  excludeSuspectData: $("excludeSuspectData"),
  refreshCharts: $("refreshCharts"),
  chartsStatus: $("chartsStatus"),
  chartsSummary: $("chartsSummary"),
  tempReference: $("tempReference"),
  humReference: $("humReference"),
  co2Reference: $("co2Reference"),
  tempChart: $("tempChart"),
  humChart: $("humChart"),
  co2Chart: $("co2Chart"),
  humidifierChart: $("humidifierChart"),
  ventilationChart: $("ventilationChart"),
  timerConfigSection: $("timerConfigSection"),
  timerStatus: $("timerStatus"),
  timerEnabled: $("timerEnabled"),
  timerMode: $("timerMode"),
  timerTimezone: $("timerTimezone"),
  timerMutualExclusion: $("timerMutualExclusion"),
  timerDelayBetweenActuatorsSec: $("timerDelayBetweenActuatorsSec"),
  timerMutualNote: $("timerMutualNote"),
  timerCompactSummary: $("timerCompactSummary"),
  timerHumidifierSummary: $("timerHumidifierSummary"),
  timerVentilationSummary: $("timerVentilationSummary"),
  timerDelaySummary: $("timerDelaySummary"),
  timerHumidifierEnabled: $("timerHumidifierEnabled"),
  timerHumidifierDefaultOnSec: $("timerHumidifierDefaultOnSec"),
  timerHumidifierDefaultOffMin: $("timerHumidifierDefaultOffMin"),
  timerHumidifierDayStart: $("timerHumidifierDayStart"),
  timerHumidifierDayEnd: $("timerHumidifierDayEnd"),
  timerHumidifierDayOnSec: $("timerHumidifierDayOnSec"),
  timerHumidifierDayOffMin: $("timerHumidifierDayOffMin"),
  timerHumidifierNightOnSec: $("timerHumidifierNightOnSec"),
  timerHumidifierNightOffMin: $("timerHumidifierNightOffMin"),
  timerVentilationEnabled: $("timerVentilationEnabled"),
  timerVentilationDefaultOnSec: $("timerVentilationDefaultOnSec"),
  timerVentilationDefaultOffMin: $("timerVentilationDefaultOffMin"),
  timerVentilationDayStart: $("timerVentilationDayStart"),
  timerVentilationDayEnd: $("timerVentilationDayEnd"),
  timerVentilationDayOnSec: $("timerVentilationDayOnSec"),
  timerVentilationDayOffMin: $("timerVentilationDayOffMin"),
  timerVentilationNightOnSec: $("timerVentilationNightOnSec"),
  timerVentilationNightOffMin: $("timerVentilationNightOffMin"),
  useTimerTestValues: $("useTimerTestValues"),
  useTimerRecommendedValues: $("useTimerRecommendedValues"),
  saveTimerConfig: $("saveTimerConfig")
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
  calibrationUpdatedAt: "--",
  timerConfigured: "--",
  timerUpdatedAt: "--",
  timerPatchStatus: "--"
};

const state = {
  latest: null,
  calibration: null,
  pendingCalibrationBySensor: {},
  co2ResetWaiting: false,
  config: null,
  recentHistory: [],
  campaignStats: { historyCount: 0, eventsCount: 0, firstReading: null, lastReading: null }
};

function buildUrl(path) {
  const authQuery = FIREBASE_AUTH ? `?auth=${encodeURIComponent(FIREBASE_AUTH)}` : "";
  return `${FIREBASE_BASE_URL}${path}${authQuery}`;
}

function formatValue(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${value}`;
}

function normalizeSensorAmbientType(value) {
  return String(value || "").toUpperCase() === "DHT22" ? "DHT22" : "DHT11";
}

function getSensorAmbientStatus(latest = {}) {
  const status = String(latest.sensorAmbientStatus || "").toLowerCase();
  if (["ok", "invalid", "timeout", "disconnected", "saturated"].includes(status)) return status;
  if (isHumiditySaturated(latest)) return "saturated";
  return latest.humedadAmbiente === null || latest.humedadAmbiente === undefined ? "disconnected" : "ok";
}

function statusMeta(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "ok") return { text: "OK", chip: "chip-ok" };
  if (normalized === "recovering") return { text: "Recuperando", chip: "chip-warning" };
  if (normalized === "invalid_zero") return { text: "Inválido: cero", chip: "chip-error" };
  if (normalized === "stuck_or_saturated") return { text: "Clavado/saturado", chip: "chip-error" };
  if (normalized === "invalid") return { text: "Inválido", chip: "chip-error" };
  if (normalized === "saturated") return { text: "Saturado", chip: "chip-error" };
  if (normalized === "timeout") return { text: "Timeout", chip: "chip-warning" };
  if (normalized === "disconnected") return { text: "Desconectado", chip: "chip-muted" };
  return { text: "No disponible", chip: "chip-muted" };
}

function co2ResetStatusMeta(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "done") return { text: "Completado", chip: "chip-ok" };
  if (normalized === "requested") return { text: "Solicitado", chip: "chip-warning" };
  if (normalized === "recovering") return { text: "Recuperando", chip: "chip-warning" };
  if (normalized === "auto_recovering") return { text: "Auto-recuperando", chip: "chip-warning" };
  if (normalized === "error") return { text: "Error", chip: "chip-error" };
  return { text: status ? String(status) : "Sin reinicio", chip: "chip-muted" };
}

function setChip(el, text, chipClass = "chip-muted") {
  if (!el) return;
  el.textContent = text;
  el.className = `status-chip ${chipClass}`;
}


function toNumberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseMinutesInput(value) {
  const normalized = String(value ?? "").trim().replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function minutesToSeconds(minutes) {
  return Math.round(minutes * 60);
}

function secondsToMinutes(seconds) {
  const parsed = toNumberOrNull(seconds);
  if (parsed === null) return null;
  return Number((parsed / 60).toFixed(4));
}

function formatMinutesValue(minutes) {
  const parsed = toNumberOrNull(minutes);
  if (parsed === null) return "";
  return Number(parsed.toFixed(4)).toLocaleString("es-AR", { maximumFractionDigits: 4 });
}

function formatDurationFromMinutes(minutes) {
  const parsed = toNumberOrNull(minutes);
  if (parsed === null) return "--";
  const totalSeconds = minutesToSeconds(parsed);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const parts = [];
  if (mins > 0) parts.push(`${mins} ${mins === 1 ? "minuto" : "minutos"}`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs} ${secs === 1 ? "segundo" : "segundos"}`);
  return parts.join(" ");
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
  renderCo2RecoveryStatus(latest);

  els.temperatureOffsetCurrent.textContent = formatValue(calibration.temperatureOffset ?? 0);
  els.humidityOffsetCurrent.textContent = formatValue(calibration.humidityOffset ?? 0);
  els.co2OffsetCurrent.textContent = formatValue(calibration.co2Offset ?? 0);

  const humidityOffset = toNumberOrNull(calibration.humidityOffset) ?? 0;
  const co2Offset = toNumberOrNull(calibration.co2Offset) ?? 0;
  const ambientStatus = getSensorAmbientStatus(latest);
  const ambientMeta = statusMeta(ambientStatus);
  const ambientType = normalizeSensorAmbientType(latest.sensorAmbientTypeApplied ?? (state.config || {}).sensorAmbientType);
  els.calibrationSensorType.textContent = ambientType;
  setChip(els.calibrationSensorStatus, ambientMeta.text, ambientMeta.chip);
  setCalibrationWarning(els.humidityCalibrationWarning, Math.abs(humidityOffset) > 10 ? "Offset de humedad alto. Recomendado resetear si se cambió el sensor." : "");
  setCalibrationWarning(els.co2CalibrationWarning, Math.abs(co2Offset) > 500 ? "Offset CO2 alto. Verificar con instrumento patrón." : "");
  setCalibrationWarning(els.sensorAmbientCalibrationWarning, ["invalid", "timeout", "disconnected", "saturated"].includes(ambientStatus) ? "Aviso: el sensor ambiente no está en estado OK. No calibres temperatura/humedad hasta estabilizar o secar el sensor." : "");
  updateDataQualityView();

  if (!hasCalibration) {
    els.calibrationStatus.textContent = "Calibración no configurada";
  } else {
    const enabledText = calibration.enabled === false ? "desactivada" : "activa";
    els.calibrationStatus.textContent = `Calibración ${enabledText} · método: ${calibration.method ?? "--"}`;
  }
  const mode = (state.latest || {}).mode ?? (state.config || {}).mode;
  els.calibrationModeHint.textContent = mode === "manual" ? "" : "Para calibrar, se recomienda dejar el sistema en modo manual y esperar estabilización de las lecturas.";
}


function setCalibrationWarning(el, message) {
  if (!el) return;
  el.textContent = message || "";
  el.hidden = !message;
}

function isHumiditySaturated(record) {
  const humidity = toNumberOrNull(record?.humedadAmbiente);
  const humidityRaw = toNumberOrNull(record?.humedadAmbienteRaw ?? record?.humedadRaw ?? record?.humidityRaw);
  return (humidity !== null && humidity >= 98) || (humidityRaw !== null && humidityRaw >= 98);
}

function isCo2Invalid(value) {
  const co2 = toNumberOrNull(value);
  return co2 === null || co2 === 0 || co2 < 300 || co2 > 10000;
}

function hasFrozenValue(records, getter, minSamples = 5, tolerance = 0.05) {
  const values = records.map(getter).filter((value) => value !== null);
  if (values.length < minSamples) return false;
  const sample = values.slice(0, minSamples);
  return Math.max(...sample) - Math.min(...sample) <= tolerance;
}

function getPreviousNumeric(records, getter) {
  const values = records.map(getter).filter((value) => value !== null);
  return values.length >= 2 ? values[1] : null;
}

function buildQuality(status, level, detail) {
  return { status, level, detail };
}

function assessTemperatureQuality(latest, records) {
  const temp = toNumberOrNull(latest?.temperatura);
  if (temp === null) return buildQuality("Sin lectura", "missing", "Temperatura no numérica o ausente en latest.");
  const previous = getPreviousNumeric(records, (record) => toNumberOrNull(record.temperatura));
  if (previous !== null && Math.abs(temp - previous) >= 5) {
    return buildQuality("Lectura sospechosa", "suspect", `Salto extremo de ${Math.abs(temp - previous).toFixed(1)} °C entre mediciones.`);
  }
  return buildQuality("Lectura estable", "stable", "Temperatura numérica y sin saltos extremos recientes.");
}

function assessHumidityQuality(latest, records, calibration) {
  const humidity = toNumberOrNull(latest?.humedadAmbiente);
  const humidityRaw = toNumberOrNull(latest?.humedadAmbienteRaw ?? latest?.humedadRaw ?? latest?.humidityRaw);
  const humidityOffset = toNumberOrNull(calibration?.humidityOffset) ?? 0;
  if (humidity === null && humidityRaw === null) return buildQuality("Sin lectura", "missing", "No hay humedad calibrada ni raw disponible.");
  if (isHumiditySaturated(latest)) return buildQuality("Posible saturación", "invalid", "Humedad raw o calibrada ≥ 98%; compatible con sensor mojado/saturado.");
  const frozen = hasFrozenValue(records, (record) => toNumberOrNull(record.humedadAmbiente), 5, 0.05);
  if (frozen) return buildQuality("Lectura congelada", "suspect", "La humedad permanece fija durante varias mediciones recientes.");
  if (Math.abs(humidityOffset) > 10) return buildQuality("Requiere calibración", "calibration", "Offset de humedad alto; si se cambió el sensor, conviene resetear y recalibrar.");
  if (humidityOffset !== 0) return buildQuality("Lectura estable", "stable", "Si se cambió de DHT22 a DHT11, revisar o resetear el offset antes de comparar históricos.");
  return buildQuality("Lectura estable", "stable", "Humedad dentro de criterios visuales de confianza.");
}

function assessCo2Quality(latest, records, calibration) {
  const co2 = toNumberOrNull(latest?.co2);
  const co2Raw = toNumberOrNull(latest?.co2Raw);
  const co2Offset = toNumberOrNull(calibration?.co2Offset) ?? 0;
  const co2Status = String(latest?.co2Status || "").toLowerCase();
  if (co2Status === "recovering") return buildQuality("Recuperando", "suspect", "El ESP32 está reiniciando la comunicación UART2 del sensor CO2.");
  if (co2Status === "invalid_zero") return buildQuality("Inválido: cero", "invalid", "El ESP32 detectó CO2 en 0 ppm y marcó la lectura como inválida.");
  if (co2Status === "stuck_or_saturated") return buildQuality("Clavado/saturado", "invalid", "El ESP32 detectó varias lecturas consecutivas en 5000 ppm.");
  if (isCo2Invalid(co2)) return buildQuality("Lectura inválida", "invalid", "CO2 es 0, nulo, menor a 300 ppm o mayor a 10000 ppm.");
  const previous = getPreviousNumeric(records, (record) => toNumberOrNull(record.co2));
  if (previous !== null) {
    const jump = Math.abs(co2 - previous);
    if (jump >= 1000 || jump >= Math.max(500, previous * 0.5)) {
      return buildQuality("Posible falso contacto", "suspect", `Revisar conexión: salto brusco de ${jump.toFixed(0)} ppm entre mediciones.`);
    }
  }
  if ((co2Raw !== null && Math.abs(co2 - co2Raw) > 500) || Math.abs(co2Offset) > 500) {
    return buildQuality("Requiere calibración", "calibration", "Offset alto: verificar con instrumento patrón.");
  }
  return buildQuality("Lectura estable", "stable", "CO2 dentro de rango esperado y sin saltos bruscos recientes.");
}

function renderQualityCard(cardEl, stateEl, detailEl, quality) {
  if (!cardEl || !stateEl || !detailEl) return;
  cardEl.classList.remove("quality-stable", "quality-missing", "quality-suspect", "quality-invalid", "quality-calibration");
  cardEl.classList.add(`quality-${quality.level}`);
  stateEl.textContent = quality.status;
  detailEl.textContent = quality.detail;
}


// Construye textos y estados visuales simples para la página de Inicio sin modificar datos ni comandos.
function modeLabel(mode) {
  const normalized = getTimerMode(mode);
  if (normalized === "manual") return "Manual";
  if (normalized === "timer") return "Timer";
  return "Automático";
}

function modeMessage(mode) {
  return `El módulo está respondiendo al modo ${modeLabel(mode)}`;
}

function relayLabel(value) {
  if (value === true) return "ON";
  if (value === false) return "OFF";
  return "--";
}

function updateHeroActuator(cardEl, stateEl, value) {
  const label = relayLabel(value);
  stateEl.textContent = label;
  cardEl.classList.remove("is-on", "is-off", "is-unknown");
  cardEl.classList.add(value === true ? "is-on" : value === false ? "is-off" : "is-unknown");
}

function metricStatusFromQuality(metric, quality, latest, config) {
  const level = quality?.level || "missing";
  if (level === "missing") return { label: "Sin lectura", kind: "muted" };
  if (level === "invalid") return { label: quality.status === "Posible saturación" ? "Posible saturación" : "Valor sospechoso", kind: "error" };
  if (level === "suspect" || level === "calibration") return { label: "Valor sospechoso", kind: "warning" };
  const valueMap = {
    temperatura: toNumberOrNull(latest?.temperatura),
    humedad: toNumberOrNull(latest?.humedadAmbiente),
    co2: toNumberOrNull(latest?.co2)
  };
  const value = valueMap[metric];
  if (value === null) return { label: "Sin lectura", kind: "muted" };
  if (metric === "temperatura") {
    const min = toNumberOrNull(config?.tempMin) ?? 12;
    const max = toNumberOrNull(config?.tempCritical) ?? toNumberOrNull(config?.tempMax) ?? 30;
    if (value < min) return { label: "Baja", kind: "warning" };
    if (value > max) return { label: "Alta", kind: "warning" };
  }
  if (metric === "humedad") {
    const min = toNumberOrNull(config?.humMin) ?? 80;
    const max = toNumberOrNull(config?.humMax) ?? 95;
    if (value < min) return { label: "Baja", kind: "warning" };
    if (value > max) return { label: "Alta", kind: "warning" };
  }
  if (metric === "co2") {
    const min = toNumberOrNull(config?.co2Min) ?? 400;
    const max = toNumberOrNull(config?.co2Max) ?? 1200;
    if (value < min) return { label: "Baja", kind: "warning" };
    if (value > max) return { label: "Alta", kind: "warning" };
  }
  return { label: "Dentro de rango", kind: "ok" };
}

function setMetricStatus(el, status) {
  el.textContent = status.label;
  el.className = `metric-state-label state-${status.kind}`;
}

function makeStatusItem(text, className, icon) {
  const article = document.createElement("article");
  article.className = className;
  const span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");
  span.textContent = icon;
  const p = document.createElement("p");
  p.textContent = text;
  article.append(span, p);
  return article;
}

function makeAlertCard(title, detail, tone, icon) {
  const article = document.createElement("article");
  article.className = `home-alert-card ${tone}`;
  const span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");
  span.textContent = icon;
  const body = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = title;
  const p = document.createElement("p");
  p.textContent = detail;
  body.append(strong, p);
  article.append(span, body);
  return article;
}

function getHomeInterpretation(latest = {}, config = {}, qualities = {}) {
  const mode = getTimerMode(latest.mode ?? config.mode);
  const statuses = {
    temperatura: metricStatusFromQuality("temperatura", qualities.temperature, latest, config),
    humedad: metricStatusFromQuality("humedad", qualities.humidity, latest, config),
    co2: metricStatusFromQuality("co2", qualities.co2, latest, config)
  };
  const problemCount = Object.values(qualities).filter((quality) => ["invalid", "missing"].includes(quality?.level)).length;
  const warningCount = Object.values(statuses).filter((status) => status.kind === "warning").length + Object.values(qualities).filter((quality) => ["suspect", "calibration"].includes(quality?.level)).length;
  const overall = problemCount > 0 ? { label: "Revisar sensor", tone: "error" } : warningCount > 0 ? { label: "Atención", tone: "warning" } : { label: "Operando normal", tone: "ok" };
  const insights = [
    `El sistema está funcionando en modo ${modeLabel(mode)}`,
    `El humidificador está ${relayLabel(latest.relay1) === "ON" ? "encendido" : relayLabel(latest.relay1) === "OFF" ? "apagado" : "sin estado confirmado"}`,
    `La ventilación está ${relayLabel(latest.relay2) === "ON" ? "encendida" : relayLabel(latest.relay2) === "OFF" ? "apagada" : "sin estado confirmado"}`
  ];
  if (statuses.humedad.label === "Alta") insights.unshift("La humedad está alta en este momento");
  if (statuses.humedad.label === "Baja") insights.unshift("La humedad está baja en este momento");
  if (statuses.temperatura.label === "Alta") insights.unshift("La temperatura está alta en este momento");
  if (statuses.temperatura.label === "Baja") insights.unshift("La temperatura está baja en este momento");
  if (statuses.co2.label === "Alta") insights.unshift("El CO2 está alto en este momento");
  if (qualities.co2?.level && qualities.co2.level !== "stable") insights.push("El sensor de CO2 requiere revisión");

  const alerts = [];
  alerts.push(statuses.temperatura.kind === "ok" ? { title: "Temperatura estable", detail: "La lectura principal de temperatura está dentro del rango esperado.", tone: "ok", icon: "✅" } : { title: `Temperatura ${statuses.temperatura.label.toLowerCase()}`, detail: qualities.temperature?.detail || "Revisar la lectura de temperatura.", tone: statuses.temperatura.kind === "error" ? "error" : "warning", icon: statuses.temperatura.kind === "error" ? "🚨" : "⚠️" });
  alerts.push(statuses.humedad.kind === "ok" ? { title: "Humedad estable", detail: "La humedad ambiente está dentro del rango esperado.", tone: "ok", icon: "✅" } : { title: statuses.humedad.label === "Alta" ? "Humedad muy alta" : `Humedad ${statuses.humedad.label.toLowerCase()}`, detail: qualities.humidity?.detail || "Revisar la lectura de humedad ambiente.", tone: statuses.humedad.kind === "error" ? "error" : "warning", icon: statuses.humedad.kind === "error" ? "🚨" : "⚠️" });
  alerts.push(statuses.co2.kind === "ok" ? { title: "CO2 estable", detail: "La lectura de CO2 está dentro del rango esperado.", tone: "ok", icon: "✅" } : { title: "Revisar sensor de CO2", detail: qualities.co2?.detail || "La lectura de CO2 necesita atención.", tone: statuses.co2.kind === "error" ? "error" : "warning", icon: statuses.co2.kind === "error" ? "🚨" : "⚠️" });
  alerts.push(overall.tone === "ok" ? { title: "Sistema operando correctamente", detail: modeMessage(mode), tone: "ok", icon: "🌱" } : { title: "Atención del módulo", detail: "Hay al menos una lectura o sensor que conviene revisar.", tone: overall.tone, icon: overall.tone === "error" ? "🔴" : "🟡" });
  if (mode === "timer") alerts.push({ title: "Modo Timer activo", detail: "Los ciclos dependen de la configuración de timer guardada.", tone: "info", icon: "⏱️" });

  return { mode, statuses, overall, insights, alerts };
}

function renderHomeOverview() {
  const latest = state.latest || {};
  const config = state.config || {};
  const records = state.recentHistory.length ? state.recentHistory : [latest];
  const calibration = state.calibration || {};
  const qualities = {
    temperature: assessTemperatureQuality(latest, records),
    humidity: assessHumidityQuality(latest, records, calibration),
    co2: assessCo2Quality(latest, records, calibration)
  };
  const view = getHomeInterpretation(latest, config, qualities);

  els.moduleModeMessage.textContent = modeMessage(view.mode);
  els.overallStatusText.textContent = view.overall.label;
  els.overallStatusCard.className = `overall-status tone-${view.overall.tone}`;
  setChip(els.homeModeChip, modeLabel(view.mode), view.mode === "manual" ? "chip-warning" : "chip-ok");
  updateHeroActuator(els.homeHumidifierCard, els.homeHumidifierState, latest.relay1);
  updateHeroActuator(els.homeVentilationCard, els.homeVentilationState, latest.relay2);

  setMetricStatus(els.temperatureMetricStatus, view.statuses.temperatura);
  setMetricStatus(els.humidityMetricStatus, view.statuses.humedad);
  setMetricStatus(els.co2MetricStatus, view.statuses.co2);
  setMetricStatus(els.uptimeMetricStatus, latest.uptimeMs === null || latest.uptimeMs === undefined ? { label: "Sin lectura", kind: "muted" } : { label: "Activo", kind: "ok" });

  els.whatHappeningList.replaceChildren(...view.insights.slice(0, 6).map((text) => makeStatusItem(text, "insight-card info", "ℹ️")));
  els.homeAlertList.replaceChildren(...view.alerts.map((alert) => makeAlertCard(alert.title, alert.detail, alert.tone, alert.icon)));
}

function updateDataQualityView() {
  const latest = state.latest || {};
  const records = state.recentHistory.length ? state.recentHistory : [latest];
  const calibration = state.calibration || {};
  renderQualityCard(els.temperatureQualityCard, els.temperatureQualityState, els.temperatureQualityDetail, assessTemperatureQuality(latest, records));
  renderQualityCard(els.humidityQualityCard, els.humidityQualityState, els.humidityQualityDetail, assessHumidityQuality(latest, records, calibration));
  renderQualityCard(els.co2QualityCard, els.co2QualityState, els.co2QualityDetail, assessCo2Quality(latest, records, calibration));
  renderHomeOverview();
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
  const response = await fetch(buildUrl(path), { cache: "no-store" });
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
  if (!value) return null;
  const parsedDate = typeof value === "string" && Number.isNaN(Number(value)) ? Date.parse(value) : null;
  if (Number.isFinite(parsedDate)) return parsedDate;
  if (Number.isNaN(Number(value))) return null;
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
  els.lastRefresh.textContent = formatTimestamp(Date.now());
}

function getStateClass(metric, value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "state-unavailable";
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
  el.classList.remove("state-good", "state-warn", "state-critical", "state-unavailable");
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
  const chartsLoadEl = $("diagChartsLastLoad");
  const calibrationPatchEl = $("diagCalibrationPatch");
  const calibrationSensorEl = $("diagCalibrationSensor");
  const calibrationAtEl = $("diagCalibrationAt");
  const chartsCountEl = $("diagChartsCount");
  const chartsStateEl = $("diagChartsState");
  const timerConfiguredEl = $("diagTimerConfigured");
  const timerUpdatedAtEl = $("diagTimerUpdatedAt");
  const timerPatchEl = $("diagTimerPatch");
  if (chartsLoadEl) chartsLoadEl.textContent = diag.chartsLastLoad;
  if (chartsCountEl) chartsCountEl.textContent = diag.chartsCount;
  if (chartsStateEl) chartsStateEl.textContent = diag.chartsState;
  if (calibrationPatchEl) calibrationPatchEl.textContent = diag.calibrationPatchStatus;
  if (calibrationSensorEl) calibrationSensorEl.textContent = diag.calibrationSensor;
  if (calibrationAtEl) calibrationAtEl.textContent = diag.calibrationUpdatedAt;
  if (timerConfiguredEl) timerConfiguredEl.textContent = diag.timerConfigured;
  if (timerUpdatedAtEl) timerUpdatedAtEl.textContent = diag.timerUpdatedAt;
  if (timerPatchEl) timerPatchEl.textContent = diag.timerPatchStatus;
}

function renderCo2RecoveryStatus(latest = {}) {
  const statusMetaInfo = statusMeta(latest.co2Status);
  const resetMeta = co2ResetStatusMeta(latest.co2ResetStatus);
  setChip(els.co2LatestStatus, statusMetaInfo.text, statusMetaInfo.chip);
  setChip(els.co2ResetLatestStatus, resetMeta.text, resetMeta.chip);
  els.co2ResetLastAt.textContent = formatTimestamp(latest.co2ResetLastAt);
  if (String(latest.co2ResetStatus || "").toLowerCase() === "done") {
    state.co2ResetWaiting = false;
    els.co2ResetRequestStatus.textContent = "Reinicio CO2 completado por el ESP32.";
    return;
  }
  if (state.co2ResetWaiting) {
    els.co2ResetRequestStatus.textContent = "Solicitud de reinicio CO2 enviada. Esperando respuesta del ESP32…";
    return;
  }
  if (latest.co2InvalidCount !== undefined) {
    els.co2ResetRequestStatus.textContent = `Lecturas inválidas consecutivas informadas por ESP32: ${formatValue(latest.co2InvalidCount)}.`;
  }
}

async function requestCo2Reset() {
  const ok = window.confirm("Esto no calibra el sensor. Solo reinicia la comunicación CO2. ¿Continuar?");
  if (!ok) return;
  const now = new Date().toISOString();
  const payload = {
    co2ResetRequest: true,
    co2ResetRequestedAtWeb: now
  };
  state.co2ResetWaiting = true;
  els.co2ResetRequestStatus.textContent = "Solicitud de reinicio CO2 enviada. Esperando respuesta del ESP32…";
  els.requestCo2Reset.disabled = true;
  try {
    const response = await fetch(buildUrl(commandsPath), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    diag.lastPatchStatus = `commands CO2 reset HTTP ${response.status}`;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    els.co2ResetRequestStatus.textContent = "Solicitud de reinicio CO2 enviada. Esperando respuesta del ESP32…";
    setChip(els.co2ResetLatestStatus, "Solicitado", "chip-warning");
    updateDiagnostics();
    await fetchLatest();
  } catch (error) {
    console.error("Error solicitando reinicio CO2:", error);
    state.co2ResetWaiting = false;
    els.co2ResetRequestStatus.textContent = "Error enviando solicitud de reinicio CO2";
    diag.lastPatchStatus = "commands CO2 reset Error";
    updateDiagnostics();
  } finally {
    els.requestCo2Reset.disabled = false;
  }
}

function renderData(data) {
  if (!data || typeof data !== "object") {
    setStatus("Sin conexión", "status-empty");
    return;
  }

  setStatus("Conectado", "status-ok");

  els.temperatura.textContent = formatValue(data.temperatura);
  els.humedadAmbiente.textContent = formatValue(data.humedadAmbiente);
  els.co2.textContent = formatValue(data.co2);
  renderCo2RecoveryStatus(data);
  els.uptime.textContent = formatUptime(data.uptimeMs);

  updateCompactStatusView();

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
  els.lastReading.textContent = formatTimestamp(data.timestamp);
  updateReadingAge();
  updateDataQualityView();
  renderAutomaticDecision();
  renderHomeOverview();
}

function updateCompactStatusView() {
  const latest = state.latest || {};
  const config = state.config || {};
  const calibration = state.calibration || {};
  const mode = latest.mode ?? config.mode ?? "--";
  const ambientType = normalizeSensorAmbientType(latest.sensorAmbientTypeApplied ?? config.sensorAmbientType);
  const ambientStatus = getSensorAmbientStatus(latest);
  const co2Quality = assessCo2Quality(latest, state.recentHistory.length ? state.recentHistory : [latest], calibration);
  const calibrationEnabled = calibration && typeof calibration === "object" ? calibration.enabled !== false : null;
  const lastValid = latest.sensorAmbientLastValidTs ?? latest.lastValidTs ?? latest.timestamp;
  setChip(els.homeModeChip, mode, mode === "--" ? "chip-muted" : "chip-ok");
  setChip(els.homeSensorTypeChip, ambientType, statusMeta(ambientStatus).chip);
  setChip(els.homeCo2StatusChip, co2Quality.status, co2Quality.level === "stable" ? "chip-ok" : co2Quality.level === "suspect" || co2Quality.level === "calibration" ? "chip-warning" : co2Quality.level === "invalid" ? "chip-error" : "chip-muted");
  setChip(els.homeCalibrationChip, calibrationEnabled === null ? "--" : calibrationEnabled ? "Sí" : "No", calibrationEnabled ? "chip-ok" : "chip-muted");
  setChip(els.homeLastValidChip, formatTimestamp(lastValid), lastValid ? "chip-ok" : "chip-muted");
}

function renderSensorAmbientConfig() {
  const config = state.config || {};
  const latest = state.latest || {};
  const configured = normalizeSensorAmbientType(config.sensorAmbientType);
  const applied = normalizeSensorAmbientType(latest.sensorAmbientTypeApplied ?? configured);
  const status = getSensorAmbientStatus(latest);
  const meta = statusMeta(status);
  els.sensorAmbientTypeSelect.value = configured;
  els.sensorAmbientApplied.value = applied;
  els.sensorAmbientStatus.value = meta.text;
  els.sensorAmbientStatus.className = `input-${meta.chip}`;
  els.sensorAmbientConfigStatus.textContent = `Configurado en Firebase: ${configured} · aplicado por ESP32: ${applied}`;
  updateCompactStatusView();
}

async function saveSensorAmbientType() {
  const sensorAmbientType = normalizeSensorAmbientType(els.sensorAmbientTypeSelect.value);
  try {
    const payload = { sensorAmbientType, updatedAtWeb: new Date().toISOString(), updatedFrom: "dashboard_sensor_ambient_type" };
    const response = await fetch(buildUrl(configPath), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    diag.lastPatchStatus = `HTTP ${response.status}`;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    els.sensorAmbientConfigStatus.textContent = `Tipo de sensor guardado: ${sensorAmbientType}. El ESP32 lo aplicará en la próxima lectura de config.`;
    updateDiagnostics();
    await fetchConfig();
    await fetchLatest();
  } catch (error) {
    console.error("Error guardando sensorAmbientType:", error);
    els.sensorAmbientConfigStatus.textContent = "Error guardando tipo de sensor ambiente";
  }
}

async function fetchLatest() {
  const url = buildUrl(latestPath);
  diag.lastUrl = url;
  try {
    const response = await fetch(url, { cache: "no-store" });
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
    setStatus("Sin conexión", "status-error");
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
      humedadAmbienteRaw: toNumberOrNull(rec.humedadAmbienteRaw ?? rec.humedadRaw ?? rec.humidityRaw),
      co2: toNumberOrNull(rec.co2),
      co2Raw: toNumberOrNull(rec.co2Raw),
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
function shouldExcludeSuspectData(){ return els.excludeSuspectData?.checked === true; }
function prepareChartRecords(records, excludeSuspect) {
  let discarded = 0;
  const prepared = records.map((record) => {
    const copy = { ...record };
    let discardedThisRecord = false;
    if (excludeSuspect && isHumiditySaturated(record)) {
      copy.humedadAmbiente = null;
      discardedThisRecord = true;
    }
    if (excludeSuspect && isCo2Invalid(record.co2)) {
      copy.co2 = null;
      discardedThisRecord = true;
    }
    if (discardedThisRecord) discarded += 1;
    return copy;
  });
  return { prepared, discarded };
}

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
    const excludeSuspect = shouldExcludeSuspectData();
    const { prepared: chartRecords, discarded } = prepareChartRecords(sortedRecords, excludeSuspect);
    const tempVals = chartRecords.filter(r=>r.temperatura!==null).map(r=>r.temperatura);
    const humVals = chartRecords.filter(r=>r.humedadAmbiente!==null).map(r=>r.humedadAmbiente);
    const co2Vals = chartRecords.filter(r=>r.co2!==null).map(r=>r.co2);
    const cfg=state.config||{};
    const tempRange = { yMin: toNumberOrNull(cfg.tempMin), yMax: toNumberOrNull(cfg.tempMax) };
    const humRange = { yMin: toNumberOrNull(cfg.humMin), yMax: toNumberOrNull(cfg.humMax) };
    const co2Range = { yMin: toNumberOrNull(cfg.co2Min), yMax: toNumberOrNull(cfg.co2Max) };
    destroyCharts();
    chartInstances.temp = createLineChart(els.tempChart,"Temperatura (°C)",chartLabels,chartRecords.map(r=>r.temperatura),"#2ca76b",false,tempRange);
    chartInstances.hum = createLineChart(els.humChart,"Humedad (%)",chartLabels,chartRecords.map(r=>r.humedadAmbiente),"#2e8b9f",false,humRange);
    chartInstances.humidifier = createLineChart(els.humidifierChart,"Humidificador",chartLabels,sortedRecords.map(r=>r.relay1),"#3b82f6",true,null,{min:0,max:1,ticks:{stepSize:1,callback:(v)=>v===1?"ON":"OFF"}});
    chartInstances.ventilation = createLineChart(els.ventilationChart,"Ventilación",chartLabels,sortedRecords.map(r=>r.relay2),"#f97316",true,null,{min:0,max:1,ticks:{stepSize:1,callback:(v)=>v===1?"ON":"OFF"}});
    chartInstances.co2 = createLineChart(els.co2Chart,"CO2 (ppm)",chartLabels,chartRecords.map(r=>r.co2),"#0f766e",false,co2Range);
    els.tempReference.textContent = `Rango SET activo: ${formatValue(cfg.tempMin)} – ${formatValue(cfg.tempMax)} °C`;
    els.humReference.textContent = `Rango SET activo: ${formatValue(cfg.humMin)} – ${formatValue(cfg.humMax)} %`;
    els.co2Reference.textContent = `Rango SET activo: ${formatValue(cfg.co2Min)} – ${formatValue(cfg.co2Max)} ppm`;
    const humIn = pctInRange(humVals,toNumberOrNull(cfg.humMin),toNumberOrNull(cfg.humMax));
    const co2In = pctInRange(co2Vals,toNumberOrNull(cfg.co2Min),toNumberOrNull(cfg.co2Max));
    const validMeasurements = excludeSuspect ? sortedRecords.length - discarded : sortedRecords.length;
    els.chartsSummary.innerHTML = `<p>Promedio temperatura: <strong>${summarize(tempVals)?.toFixed(2) ?? "--"}</strong></p><p>Promedio humedad: <strong>${summarize(humVals)?.toFixed(2) ?? "--"}</strong></p><p>Promedio CO2: <strong>${summarize(co2Vals)?.toFixed(2) ?? "--"}</strong></p><p>Máximo CO2: <strong>${co2Vals.length ? Math.max(...co2Vals).toFixed(2) : "--"}</strong></p><p>Mediciones totales: <strong>${sortedRecords.length}</strong></p><p>Mediciones válidas: <strong>${validMeasurements}</strong></p><p>Mediciones descartadas: <strong>${excludeSuspect ? discarded : 0}</strong></p><p>Humedad en rango: <strong>${humIn===null?"--":humIn.toFixed(1)+"%"}</strong></p><p>CO2 en rango: <strong>${co2In===null?"--":co2In.toFixed(1)+"%"}</strong></p>`;
    const filterText = excludeSuspect ? ` · ${discarded} mediciones con puntos filtrados visualmente` : " · mostrando todos los datos";
    setChartsStatus(`Mostrando ${sortedRecords.length} mediciones para gráficos${filterText}.`);
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
    const response = await fetch(buildUrl(historyPath), { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const history = await response.json();
    renderHistory(normalizeFirebaseList(history));
    state.recentHistory = normalizeHistoryRecords(history).slice().reverse();
    updateDataQualityView();
  } catch (error) {
    console.error("Error history:", error);
    els.historyStatus.textContent = "Error cargando historial";
    els.historyStatus.classList.add("section-error");
    els.historyList.innerHTML = "";
  }
}

async function fetchEvents() {
  try {
    const response = await fetch(buildUrl(eventsPath), { cache: "no-store" });
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
    setStatus("Sin conexión", "status-error");
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

function countFirebaseRecords(data) {
  return data && typeof data === "object" ? Object.keys(data).length : 0;
}

function getCampaignName(config) {
  if (!config || typeof config !== "object") return null;
  return config.campaignName || config.campaign || config.crop || config.cultivo || null;
}

function getCampaignBackupFilename(date = new Date()) {
  const stamp = date.toISOString().slice(0, 16).replace("T", "_").replace(":", "-");
  return `backup_biosinergia_campaign_${stamp}.json`;
}

function summarizeConfig(config) {
  if (!config || typeof config !== "object") return null;
  return {
    mode: config.mode ?? config.modo ?? null,
    crop: config.crop ?? config.cultivo ?? null,
    sensorAmbientType: config.sensorAmbientType ?? null,
    co2Min: config.co2Min ?? null,
    co2Max: config.co2Max ?? null,
    humMin: config.humMin ?? null,
    humMax: config.humMax ?? null,
    tempMin: config.tempMin ?? null,
    tempMax: config.tempMax ?? null,
    timerEnabled: config.timer?.enabled ?? null,
    updatedAtWeb: config.updatedAtWeb ?? null,
    updatedFrom: config.updatedFrom ?? null
  };
}

function buildCampaignMetadata({ history, events, config, downloadedAt }) {
  return {
    deviceId: DEVICE_ID,
    downloadedAt,
    suggestedCampaignName: getCampaignName(config),
    historyCount: countFirebaseRecords(history),
    eventsCount: countFirebaseRecords(events),
    webVersion: WEB_VERSION || null
  };
}

function buildCampaignBackup({ latest, history, events, config, calibration, downloadedAt = new Date().toISOString() }) {
  return {
    latest: latest ?? null,
    history: history ?? null,
    events: events ?? null,
    config: config ?? null,
    calibration: calibration ?? null,
    metadata: buildCampaignMetadata({ history, events, config, downloadedAt })
  };
}

async function fetchCampaignBackupData() {
  const [latest, history, events, config, calibration] = await Promise.all([
    fetchCollection(latestPath),
    fetchCollection(historyDownloadPath),
    fetchCollection(eventsDownloadPath),
    fetchCollection(configPath),
    fetchCollection(calibrationPath)
  ]);
  return buildCampaignBackup({ latest, history, events, config, calibration });
}

async function downloadFullCampaignBackup() {
  const backup = await fetchCampaignBackupData();
  downloadContent(getCampaignBackupFilename(new Date(backup.metadata.downloadedAt)), JSON.stringify(backup, null, 2), "application/json;charset=utf-8;");
  els.campaignStatus.textContent = `Backup completo descargado: ${backup.metadata.historyCount} mediciones y ${backup.metadata.eventsCount} eventos.`;
  return backup;
}

function getHistoryDateRange(history) {
  const records = normalizeHistoryRecords(history).filter((record) => record.date instanceof Date && !Number.isNaN(record.date.getTime()));
  if (!records.length) return { first: null, last: null };
  return { first: records[0].date.getTime(), last: records[records.length - 1].date.getTime() };
}

function updateCampaignSummaryView(stats = state.campaignStats) {
  els.campaignHistoryCount.textContent = String(stats.historyCount ?? 0);
  els.campaignEventsCount.textContent = String(stats.eventsCount ?? 0);
  els.campaignFirstReading.textContent = stats.firstReading ? formatTimestamp(stats.firstReading) : "--";
  els.campaignLastReading.textContent = stats.lastReading ? formatTimestamp(stats.lastReading) : "--";
}

async function refreshCampaignSummary() {
  try {
    const [history, events] = await Promise.all([
      fetchCollection(historyDownloadPath),
      fetchCollection(eventsDownloadPath)
    ]);
    const range = getHistoryDateRange(history);
    state.campaignStats = {
      historyCount: countFirebaseRecords(history),
      eventsCount: countFirebaseRecords(events),
      firstReading: range.first,
      lastReading: range.last
    };
    updateCampaignSummaryView();
  } catch (error) {
    console.error("Error resumen campaña:", error);
    els.campaignStatus.textContent = "No se pudo actualizar el contador de campaña.";
  }
}

async function deleteFirebasePath(path) {
  const response = await fetch(buildUrl(path), { method: "DELETE", cache: "no-store" });
  diag.lastPatchStatus = `DELETE HTTP ${response.status}`;
  updateDiagnostics();
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

async function createCampaignStartedEvent(config) {
  const createdAtWeb = new Date().toISOString();
  const event = {
    type: "CAMPAIGN_STARTED",
    source: "dashboard_admin",
    reason: "Inicio manual de nueva campaña desde Admin",
    createdAtWeb,
    timestamp: Date.now(),
    deviceId: DEVICE_ID,
    configSnapshot: summarizeConfig(config)
  };
  const response = await fetch(buildUrl(eventsDownloadPath), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    cache: "no-store"
  });
  diag.lastPatchStatus = `POST HTTP ${response.status}`;
  updateDiagnostics();
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}

async function startNewCampaign() {
  const warning = "Esta acción borra el historial y los eventos guardados en Firebase para comenzar una nueva campaña. La configuración, calibración y comandos se conservarán. Descargá un backup antes de continuar.\n\nEscribí BORRAR para continuar:";
  const confirmation = window.prompt(warning, "");
  if (confirmation !== "BORRAR") {
    els.campaignStatus.textContent = "Operación cancelada: no se escribió BORRAR exactamente.";
    return;
  }

  els.startNewCampaign.disabled = true;
  els.downloadFullBackup.disabled = true;
  els.campaignResultList.hidden = true;
  els.campaignStatus.textContent = "Generando backup completo antes de borrar…";

  try {
    const backup = await downloadFullCampaignBackup();
    els.campaignStatus.textContent = "Backup descargado. Borrando history y events…";
    await deleteFirebasePath(historyDownloadPath);
    await deleteFirebasePath(eventsDownloadPath);
    await createCampaignStartedEvent(backup.config);
    els.campaignStatus.textContent = "Nueva campaña iniciada.";
    els.campaignResultList.hidden = false;
    await Promise.all([fetchHistory(), fetchEvents(), refreshCampaignSummary()]);
  } catch (error) {
    console.error("Error al iniciar nueva campaña:", error);
    els.campaignStatus.textContent = "Advertencia: no se inició la nueva campaña porque falló el backup o el borrado seguro.";
  } finally {
    els.startNewCampaign.disabled = false;
    els.downloadFullBackup.disabled = false;
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


const timerDefaults = {
  enabled: true,
  mode: "cycle",
  timezone: "America/Argentina/Tucuman",
  mutualExclusion: true,
  delayBetweenActuatorsSec: 30,
  fallbackIfSensorsInvalid: true,
  humidifier: {
    enabled: true,
    defaultCycle: { onSec: 45, offMin: 12 },
    windows: [
      { name: "Horas de mayor calor", start: "11:00", end: "18:00", onSec: 45, offMin: 10 },
      { name: "Noche", start: "18:00", end: "11:00", onSec: 30, offMin: 20 }
    ]
  },
  ventilation: {
    enabled: true,
    defaultCycle: { onSec: 60, offMin: 15 },
    windows: [
      { name: "Horas de mayor calor", start: "11:00", end: "18:00", onSec: 60, offMin: 15 },
      { name: "Noche", start: "18:00", end: "11:00", onSec: 45, offMin: 25 }
    ]
  }
};

function setSelectBoolean(el, value) {
  if (el) el.value = value === false ? "false" : "true";
}

function readSelectBoolean(el) {
  return el?.value === "true";
}

function setInputValue(el, value) {
  if (el) el.value = value ?? "";
}

function getTimerMode(configMode) {
  return ["manual", "auto", "timer"].includes(configMode) ? configMode : "manual";
}

function updateTimerVisibility(mode) {
  const visible = mode === "timer" || els.modeSelect?.value === "timer";
  if (els.timerConfigSection) els.timerConfigSection.hidden = !visible;
}

function getDefaultCycleMinutes(cycle = {}, fallback = {}) {
  const onMin = toNumberOrNull(cycle.onMinUi) ?? secondsToMinutes(cycle.onSec) ?? secondsToMinutes(fallback.onSec) ?? 0;
  const offMin = toNumberOrNull(cycle.offMinUi) ?? toNumberOrNull(cycle.offMin) ?? toNumberOrNull(fallback.offMin) ?? 0;
  return { onMin, offMin };
}

function updateTimerMutualNote() {
  const bothEnabled = readSelectBoolean(els.timerHumidifierEnabled) && readSelectBoolean(els.timerVentilationEnabled);
  const mutualEnabled = readSelectBoolean(els.timerMutualExclusion);
  if (!els.timerMutualNote) return;
  els.timerMutualNote.hidden = false;
  els.timerMutualNote.textContent = bothEnabled && !mutualEnabled
    ? "Advertencia: ambos equipos podrían funcionar al mismo tiempo."
    : "Humidificador y ventilación no funcionarán al mismo tiempo.";
}

function updateTimerSummaries() {
  const humidifierOn = parseMinutesInput(els.timerHumidifierDefaultOnSec?.value);
  const humidifierEvery = parseMinutesInput(els.timerHumidifierDefaultOffMin?.value);
  const ventilationOn = parseMinutesInput(els.timerVentilationDefaultOnSec?.value);
  const ventilationEvery = parseMinutesInput(els.timerVentilationDefaultOffMin?.value);
  const delay = parseMinutesInput(els.timerDelayBetweenActuatorsSec?.value);
  const humidifierText = humidifierOn !== null && humidifierEvery !== null
    ? `El humidificador se encenderá ${formatDurationFromMinutes(humidifierOn)} cada ${formatDurationFromMinutes(humidifierEvery)}.`
    : "Ingresá los minutos del humidificador para ver el resumen.";
  const ventilationText = ventilationOn !== null && ventilationEvery !== null
    ? `La ventilación se encenderá ${formatDurationFromMinutes(ventilationOn)} cada ${formatDurationFromMinutes(ventilationEvery)}.`
    : "Ingresá los minutos de ventilación para ver el resumen.";
  const delayText = delay !== null
    ? `Entre un equipo y otro habrá una pausa de ${formatDurationFromMinutes(delay)}.`
    : "Ingresá la pausa entre equipos para ver el resumen.";
  els.timerHumidifierSummary.textContent = humidifierText;
  els.timerVentilationSummary.textContent = ventilationText;
  els.timerDelaySummary.textContent = delayText;
  if (els.timerCompactSummary) {
    const exclusion = readSelectBoolean(els.timerMutualExclusion) ? "activada" : "desactivada";
    els.timerCompactSummary.innerHTML = `
      <p><strong>Humidificador:</strong> ${humidifierOn !== null && humidifierEvery !== null ? `${formatMinutesValue(humidifierOn)} min encendido cada ${formatMinutesValue(humidifierEvery)} min` : "--"}</p>
      <p><strong>Ventilación:</strong> ${ventilationOn !== null && ventilationEvery !== null ? `${formatMinutesValue(ventilationOn)} min encendida cada ${formatMinutesValue(ventilationEvery)} min` : "--"}</p>
      <p><strong>Pausa:</strong> ${delay !== null ? `${formatMinutesValue(delay)} min` : "--"}</p>
      <p><strong>Exclusión mutua:</strong> ${exclusion}</p>
    `;
  }
  updateTimerMutualNote();
}

function hydrateTimerForm(timer = {}) {
  const merged = {
    ...timerDefaults,
    ...timer,
    humidifier: {
      ...timerDefaults.humidifier,
      ...(timer.humidifier || {}),
      defaultCycle: { ...timerDefaults.humidifier.defaultCycle, ...((timer.humidifier || {}).defaultCycle || {}) },
      windows: (timer.humidifier || {}).windows || timerDefaults.humidifier.windows
    },
    ventilation: {
      ...timerDefaults.ventilation,
      ...(timer.ventilation || {}),
      defaultCycle: { ...timerDefaults.ventilation.defaultCycle, ...((timer.ventilation || {}).defaultCycle || {}) },
      windows: (timer.ventilation || {}).windows || timerDefaults.ventilation.windows
    }
  };
  const humidifierDay = merged.humidifier.windows?.[0] || timerDefaults.humidifier.windows[0];
  const humidifierNight = merged.humidifier.windows?.[1] || timerDefaults.humidifier.windows[1];
  const ventilationDay = merged.ventilation.windows?.[0] || timerDefaults.ventilation.windows[0];
  const ventilationNight = merged.ventilation.windows?.[1] || timerDefaults.ventilation.windows[1];
  const humidifierDefault = getDefaultCycleMinutes(merged.humidifier.defaultCycle, timerDefaults.humidifier.defaultCycle);
  const ventilationDefault = getDefaultCycleMinutes(merged.ventilation.defaultCycle, timerDefaults.ventilation.defaultCycle);
  const delayMinutes = toNumberOrNull(merged.delayBetweenActuatorsMinUi) ?? secondsToMinutes(merged.delayBetweenActuatorsSec) ?? secondsToMinutes(timerDefaults.delayBetweenActuatorsSec);

  setSelectBoolean(els.timerEnabled, merged.enabled);
  setInputValue(els.timerMode, merged.mode === "schedule" ? "schedule" : "cycle");
  setInputValue(els.timerTimezone, merged.timezone || timerDefaults.timezone);
  setSelectBoolean(els.timerMutualExclusion, merged.mutualExclusion);
  setInputValue(els.timerDelayBetweenActuatorsSec, formatMinutesValue(delayMinutes));
  setSelectBoolean(els.timerHumidifierEnabled, merged.humidifier.enabled);
  setInputValue(els.timerHumidifierDefaultOnSec, formatMinutesValue(humidifierDefault.onMin));
  setInputValue(els.timerHumidifierDefaultOffMin, formatMinutesValue(humidifierDefault.offMin));
  setInputValue(els.timerHumidifierDayStart, humidifierDay.start);
  setInputValue(els.timerHumidifierDayEnd, humidifierDay.end);
  setInputValue(els.timerHumidifierDayOnSec, humidifierDay.onSec);
  setInputValue(els.timerHumidifierDayOffMin, humidifierDay.offMin);
  setInputValue(els.timerHumidifierNightOnSec, humidifierNight.onSec);
  setInputValue(els.timerHumidifierNightOffMin, humidifierNight.offMin);
  setSelectBoolean(els.timerVentilationEnabled, merged.ventilation.enabled);
  setInputValue(els.timerVentilationDefaultOnSec, formatMinutesValue(ventilationDefault.onMin));
  setInputValue(els.timerVentilationDefaultOffMin, formatMinutesValue(ventilationDefault.offMin));
  setInputValue(els.timerVentilationDayStart, ventilationDay.start);
  setInputValue(els.timerVentilationDayEnd, ventilationDay.end);
  setInputValue(els.timerVentilationDayOnSec, ventilationDay.onSec);
  setInputValue(els.timerVentilationDayOffMin, ventilationDay.offMin);
  setInputValue(els.timerVentilationNightOnSec, ventilationNight.onSec);
  setInputValue(els.timerVentilationNightOffMin, ventilationNight.offMin);
  updateTimerSummaries();
}

function readTimerNumber(id, min, max, label) {
  const value = toNumberOrNull(els[id]?.value);
  if (value === null || value < min || value > max) {
    throw new Error(`${label} debe estar entre ${min} y ${max}.`);
  }
  return value;
}

function readTimerMinutes(id, min, max) {
  const value = parseMinutesInput(els[id]?.value);
  if (value === null || value < min || value > max) {
    throw new Error("Ingresá un tiempo válido en minutos. Podés usar decimales, por ejemplo 0,5.");
  }
  return value;
}

function readTimerTime(id, label) {
  const value = (els[id]?.value || "").trim();
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    throw new Error(`${label} debe tener formato HH:MM.`);
  }
  return value;
}

function applyTimerPreset(preset) {
  setSelectBoolean(els.timerHumidifierEnabled, preset.humidifier.enabled);
  setInputValue(els.timerHumidifierDefaultOnSec, preset.humidifier.onMin);
  setInputValue(els.timerHumidifierDefaultOffMin, preset.humidifier.offMin);
  setSelectBoolean(els.timerVentilationEnabled, preset.ventilation.enabled);
  setInputValue(els.timerVentilationDefaultOnSec, preset.ventilation.onMin);
  setInputValue(els.timerVentilationDefaultOffMin, preset.ventilation.offMin);
  setSelectBoolean(els.timerMutualExclusion, preset.mutualExclusion);
  setInputValue(els.timerDelayBetweenActuatorsSec, preset.delayMin);
  updateTimerSummaries();
  els.timerStatus.textContent = "Valores cargados en pantalla. Revisá y guardá para enviarlos a Firebase.";
}

function useTimerTestValues() {
  applyTimerPreset({
    humidifier: { enabled: true, onMin: "0,5", offMin: "1" },
    ventilation: { enabled: false, onMin: "0,5", offMin: "1" },
    mutualExclusion: true,
    delayMin: "0,5"
  });
}

function useTimerRecommendedValues() {
  applyTimerPreset({
    humidifier: { enabled: true, onMin: "0,75", offMin: "10" },
    ventilation: { enabled: true, onMin: "1", offMin: "15" },
    mutualExclusion: true,
    delayMin: "0,5"
  });
}

function buildTimerPayload() {
  const humidifierOnMin = readTimerMinutes("timerHumidifierDefaultOnSec", 0.1, 10);
  const humidifierOffMin = readTimerMinutes("timerHumidifierDefaultOffMin", 0.5, 240);
  const ventilationOnMin = readTimerMinutes("timerVentilationDefaultOnSec", 0.1, 10);
  const ventilationOffMin = readTimerMinutes("timerVentilationDefaultOffMin", 0.5, 240);
  const delayBetweenActuatorsMin = readTimerMinutes("timerDelayBetweenActuatorsSec", 0, 10);
  const humidifierDayStart = readTimerTime("timerHumidifierDayStart", "Franja día/calor inicio humidificador");
  const humidifierDayEnd = readTimerTime("timerHumidifierDayEnd", "Franja día/calor fin humidificador");
  const ventilationDayStart = readTimerTime("timerVentilationDayStart", "Franja día/calor inicio ventilación");
  const ventilationDayEnd = readTimerTime("timerVentilationDayEnd", "Franja día/calor fin ventilación");
  return {
    enabled: readSelectBoolean(els.timerEnabled),
    mode: els.timerMode?.value === "schedule" ? "schedule" : "cycle",
    timezone: (els.timerTimezone?.value || timerDefaults.timezone).trim() || timerDefaults.timezone,
    mutualExclusion: readSelectBoolean(els.timerMutualExclusion),
    delayBetweenActuatorsSec: minutesToSeconds(delayBetweenActuatorsMin),
    delayBetweenActuatorsMinUi: delayBetweenActuatorsMin,
    fallbackIfSensorsInvalid: true,
    humidifier: {
      enabled: readSelectBoolean(els.timerHumidifierEnabled),
      defaultCycle: {
        onSec: minutesToSeconds(humidifierOnMin),
        offMin: humidifierOffMin,
        onMinUi: humidifierOnMin,
        offMinUi: humidifierOffMin
      },
      windows: [
        {
          name: "Horas de mayor calor",
          start: humidifierDayStart,
          end: humidifierDayEnd,
          onSec: readTimerNumber("timerHumidifierDayOnSec", 5, 600, "Encendido día/calor humidificador"),
          offMin: readTimerNumber("timerHumidifierDayOffMin", 1, 240, "Repetición día/calor humidificador")
        },
        {
          name: "Noche",
          start: humidifierDayEnd,
          end: humidifierDayStart,
          onSec: readTimerNumber("timerHumidifierNightOnSec", 5, 600, "Encendido noche humidificador"),
          offMin: readTimerNumber("timerHumidifierNightOffMin", 1, 240, "Repetición noche humidificador")
        }
      ]
    },
    ventilation: {
      enabled: readSelectBoolean(els.timerVentilationEnabled),
      defaultCycle: {
        onSec: minutesToSeconds(ventilationOnMin),
        offMin: ventilationOffMin,
        onMinUi: ventilationOnMin,
        offMinUi: ventilationOffMin
      },
      windows: [
        {
          name: "Horas de mayor calor",
          start: ventilationDayStart,
          end: ventilationDayEnd,
          onSec: readTimerNumber("timerVentilationDayOnSec", 5, 600, "Encendido día/calor ventilación"),
          offMin: readTimerNumber("timerVentilationDayOffMin", 1, 240, "Repetición día/calor ventilación")
        },
        {
          name: "Noche",
          start: ventilationDayEnd,
          end: ventilationDayStart,
          onSec: readTimerNumber("timerVentilationNightOnSec", 5, 600, "Encendido noche ventilación"),
          offMin: readTimerNumber("timerVentilationNightOffMin", 1, 240, "Repetición noche ventilación")
        }
      ]
    },
    updatedAtWeb: new Date().toISOString(),
    updatedFrom: "dashboard_timer_simple_minutes"
  };
}

async function saveTimerConfig() {
  try {
    const payload = buildTimerPayload();
    const response = await fetch(buildUrl(timerConfigPath), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    diag.timerPatchStatus = `HTTP ${response.status}`;
    diag.lastPatchStatus = `timer HTTP ${response.status}`;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    els.timerStatus.textContent = "Configuración timer guardada correctamente";
    diag.timerConfigured = payload.enabled ? "Sí" : "No";
    diag.timerUpdatedAt = payload.updatedAtWeb;
    updateDiagnostics();
    await fetchConfig();
  } catch (error) {
    console.error("Error guardando timer:", error);
    diag.timerPatchStatus = "Error";
    els.timerStatus.textContent = error.message || "Error guardando configuración timer";
    updateDiagnostics();
  }
}

const setpointFields = ["co2Min","co2Max","humMin","humMax","tempMin","tempMax","tempCritical","minHumidifierOnSec","minHumidifierOffSec","minVentilationOnSec","minVentilationOffSec","delayAfterVentilationSec","mutualExclusion","crop"];

function setManualControlsEnabled(enabled) {
  document.querySelectorAll("button[data-relay]").forEach((button) => {
    button.disabled = !enabled;
    button.classList.toggle("btn-disabled", !enabled);
  });
  const selectedMode = els.modeSelect?.value || (state.config || {}).mode;
  els.manualControlHint.textContent = enabled ? "" : `${selectedMode === "timer" ? "Modo timer" : "Modo automático"} activo: los relés manuales están deshabilitados.`;
}

function renderAutomaticDecision() {
  const latest = state.latest;
  const config = state.config;
  if (!latest || !config) {
    els.autoDecisionStatus.textContent = "Esperando datos suficientes.";
    return;
  }
  const mode = getTimerMode(config.mode);
  if (mode === "manual") {
    els.autoDecisionStatus.textContent = "Modo manual: los relés se controlan desde la web.";
    return;
  }
  if (mode === "timer") {
    els.autoDecisionStatus.textContent = "Modo timer: la web guarda ciclos y franjas para firmware compatible.";
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

function buildTimerCompactLines(timer = {}) {
  const merged = {
    ...timerDefaults,
    ...timer,
    humidifier: {
      ...timerDefaults.humidifier,
      ...(timer.humidifier || {}),
      defaultCycle: { ...timerDefaults.humidifier.defaultCycle, ...((timer.humidifier || {}).defaultCycle || {}) }
    },
    ventilation: {
      ...timerDefaults.ventilation,
      ...(timer.ventilation || {}),
      defaultCycle: { ...timerDefaults.ventilation.defaultCycle, ...((timer.ventilation || {}).defaultCycle || {}) }
    }
  };
  const humidifier = getDefaultCycleMinutes(merged.humidifier.defaultCycle, timerDefaults.humidifier.defaultCycle);
  const ventilation = getDefaultCycleMinutes(merged.ventilation.defaultCycle, timerDefaults.ventilation.defaultCycle);
  const delay = toNumberOrNull(merged.delayBetweenActuatorsMinUi) ?? secondsToMinutes(merged.delayBetweenActuatorsSec) ?? 0;
  return {
    humidifier: `${formatMinutesValue(humidifier.onMin)} min encendido cada ${formatMinutesValue(humidifier.offMin)} min`,
    ventilation: `${formatMinutesValue(ventilation.onMin)} min encendida cada ${formatMinutesValue(ventilation.offMin)} min`,
    delay: `${formatMinutesValue(delay)} min`,
    exclusion: merged.mutualExclusion === true ? "activada" : "desactivada"
  };
}

function renderSetSummary() {
  const config = state.config;
  if (!config) {
    els.activeSetSummary.innerHTML = "<p>Esperando configuración...</p>";
    return;
  }
  if (getTimerMode(config.mode) === "timer") {
    const timerLines = buildTimerCompactLines(config.timer || timerDefaults);
    els.activeSetSummary.innerHTML = `
      <p><strong>Timer:</strong></p>
      <p><strong>Humidificador:</strong> ${timerLines.humidifier}</p>
      <p><strong>Ventilación:</strong> ${timerLines.ventilation}</p>
      <p><strong>Pausa:</strong> ${timerLines.delay}</p>
      <p><strong>Exclusión mutua:</strong> ${timerLines.exclusion}</p>
    `;
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
  const mode = getTimerMode(config.mode);
  els.currentMode.value = mode;
  els.modeSelect.value = mode;
  els.modeStatus.textContent = `Modo actual: ${mode}`;
  setManualControlsEnabled(mode === "manual");
  hydrateTimerForm(config.timer || timerDefaults);
  updateTimerVisibility(mode);
  diag.timerConfigured = mode === "timer" ? "Sí" : "No";
  diag.timerUpdatedAt = config.timer?.updatedAtWeb || "--";
  updateDiagnostics();
  setpointFields.forEach((f) => {
    if (!els[f]) return;
    if (f === "mutualExclusion") {
      els[f].value = String(config[f] === true);
    } else {
      els[f].value = config[f] ?? "";
    }
  });
  els.setpointsStatus.textContent = "SETs listos para edición";
  renderSensorAmbientConfig();
  renderSetSummary();
  renderAutomaticDecision();
  renderHomeOverview();
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
  const mode = getTimerMode(els.modeSelect.value);
  const updatedAtWeb = mode === "timer" ? new Date().toISOString() : Date.now();
  try {
    const configPayload = { mode, updatedAtWeb, updatedFrom: mode === "timer" ? "dashboard_mode_timer" : "dashboard_mode" };
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
    if (PAGE === "graficos") fetchAndRenderCharts();
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
    if (PAGE === "graficos") fetchAndRenderCharts();
  } catch (error) {
    console.error("Error guardando setpoints:", error);
    els.setpointsStatus.textContent = "Error guardando SETs";
  }
}

on(els.downloadHistoryCsv, "click", () => handleDownload(historyDownloadPath, "csv", "history"));
on(els.downloadEventsCsv, "click", () => handleDownload(eventsDownloadPath, "csv", "events"));
on(els.downloadHistoryJson, "click", () => handleDownload(historyDownloadPath, "json", "history"));
on(els.downloadEventsJson, "click", () => handleDownload(eventsDownloadPath, "json", "events"));
on(els.downloadFullBackup, "click", () => downloadFullCampaignBackup().catch((error) => {
  console.error("Error backup completo:", error);
  els.campaignStatus.textContent = "Error al generar backup completo";
}));
on(els.startNewCampaign, "click", startNewCampaign);
on(els.calculateTemperature, "click", () => calculateSensorCalibration("temperature"));
on(els.calculateHumidity, "click", () => calculateSensorCalibration("humidity"));
on(els.calculateCo2, "click", () => calculateSensorCalibration("co2"));
on(els.saveTemperature, "click", () => saveSensorCalibration("temperature"));
on(els.saveHumidity, "click", () => saveSensorCalibration("humidity"));
on(els.saveCo2, "click", () => saveSensorCalibration("co2"));
on(els.resetTemperature, "click", () => resetSensorCalibration("temperature"));
on(els.resetHumidity, "click", () => resetSensorCalibration("humidity"));
on(els.resetCo2, "click", () => resetSensorCalibration("co2"));
on(els.requestCo2Reset, "click", requestCo2Reset);
on(els.enableCalibration, "click", enableCalibration);
on(els.disableCalibration, "click", disableCalibration);
on(els.saveSensorAmbientType, "click", saveSensorAmbientType);
on(els.applyMode, "click", applyMode);
on(els.modeSelect, "change", () => updateTimerVisibility(getTimerMode(els.modeSelect.value)));
on(els.timerMutualExclusion, "change", updateTimerSummaries);
on(els.timerHumidifierEnabled, "change", updateTimerSummaries);
on(els.timerVentilationEnabled, "change", updateTimerSummaries);
on(els.timerDelayBetweenActuatorsSec, "input", updateTimerSummaries);
on(els.timerHumidifierDefaultOnSec, "input", updateTimerSummaries);
on(els.timerHumidifierDefaultOffMin, "input", updateTimerSummaries);
on(els.timerVentilationDefaultOnSec, "input", updateTimerSummaries);
on(els.timerVentilationDefaultOffMin, "input", updateTimerSummaries);
on(els.useTimerTestValues, "click", useTimerTestValues);
on(els.useTimerRecommendedValues, "click", useTimerRecommendedValues);
on(els.saveTimerConfig, "click", saveTimerConfig);
on(els.saveSetpoints, "click", saveSetpoints);
on(els.refreshCharts, "click", fetchAndRenderCharts);
on(els.chartRangeSelect, "change", fetchAndRenderCharts);
on(els.excludeSuspectData, "change", fetchAndRenderCharts);

document.querySelectorAll("button[data-relay]").forEach((button) => {
  button.addEventListener("click", () => {
    const relay = button.dataset.relay;
    const value = button.dataset.value === "true";
    sendRelayCommand(relay, value);
  });
});

window.fetchHistory = fetchHistory;
window.fetchEvents = fetchEvents;
window.downloadHistoryCSV = () => handleDownload(historyDownloadPath, "csv", "history");
window.downloadEventsCSV = () => handleDownload(eventsDownloadPath, "csv", "events");
window.downloadHistoryJSON = () => handleDownload(historyDownloadPath, "json", "history");
window.downloadEventsJSON = () => handleDownload(eventsDownloadPath, "json", "events");

function initPage() {
  updateDiagnostics();
  if (PAGE === "home") {
    runEvery(fetchLatest, refreshMs);
    runEvery(fetchHistory, historyRefreshMs);
    runEvery(fetchConfig, historyRefreshMs);
    runEvery(fetchCalibration, historyRefreshMs);
    setInterval(updateReadingAge, 1000);
    return;
  }
  if (PAGE === "graficos") {
    fetchConfig().then(fetchAndRenderCharts);
    setInterval(fetchConfig, historyRefreshMs);
    setInterval(fetchAndRenderCharts, chartsRefreshMs);
    return;
  }
  if (PAGE === "calibracion") {
    runEvery(fetchLatest, refreshMs);
    runEvery(fetchCalibration, historyRefreshMs);
    runEvery(fetchConfig, historyRefreshMs);
    setInterval(updateReadingAge, 1000);
    return;
  }
  if (PAGE === "configuracion") {
    runEvery(fetchConfig, historyRefreshMs);
    runEvery(fetchLatest, refreshMs);
    return;
  }
  if (PAGE === "admin") {
    runEvery(fetchLatest, refreshMs);
    runEvery(fetchHistory, historyRefreshMs);
    runEvery(fetchEvents, historyRefreshMs);
    runEvery(fetchCalibration, historyRefreshMs);
    runEvery(fetchConfig, historyRefreshMs);
    runEvery(refreshCampaignSummary, historyRefreshMs);
    setInterval(updateReadingAge, 1000);
  }
}

function updateWebVersionLabel() {
  document.querySelectorAll(".site-footer").forEach((footer) => {
    if (!footer.querySelector(".web-version")) {
      const separator = document.createElement("span");
      separator.className = "footer-separator";
      separator.textContent = " · ";
      const version = document.createElement("span");
      version.className = "web-version";
      version.textContent = WEB_VERSION;
      footer.append(separator, version);
    }
  });

  const diagnosticVersion = document.getElementById("diagWebVersion");
  if (diagnosticVersion) {
    diagnosticVersion.textContent = WEB_VERSION;
  }
}

function showUpdateNotice(registration) {
  if (!registration?.waiting || document.getElementById("pwaUpdateNotice")) return;

  const notice = document.createElement("div");
  notice.id = "pwaUpdateNotice";
  notice.className = "pwa-update-notice";
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  notice.innerHTML = `
    <p>Hay una nueva versión de BioSinergia disponible.</p>
    <button id="pwaUpdateNow" class="btn btn-on" type="button">Actualizar ahora</button>
  `;
  document.body.appendChild(notice);

  document.getElementById("pwaUpdateNow")?.addEventListener("click", () => {
    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
  });
}

function initServiceWorkerUpdates() {
  if (!("serviceWorker" in navigator)) return;

  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then((registration) => {
        showUpdateNotice(registration);
        registration.update().catch((error) => {
          console.warn("No se pudo buscar actualización del Service Worker:", error);
        });

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              showUpdateNotice(registration);
            }
          });
        });
      })
      .catch((error) => {
        console.warn("No se pudo registrar Service Worker:", error);
      });
  });
}

initPage();
updateWebVersionLabel();
initServiceWorkerUpdates();
