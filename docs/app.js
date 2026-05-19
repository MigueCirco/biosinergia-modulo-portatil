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
const refreshMs = 5000;
const historyRefreshMs = 15000;

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
  diagPatchStatus: document.getElementById("diagPatchStatus")
};

const diag = {
  lastReadingDate: null,
  lastUrl: "--",
  lastGetStatus: "--",
  lastPatchStatus: "--"
};

function buildUrl(path) {
  const authQuery = FIREBASE_AUTH ? `?auth=${encodeURIComponent(FIREBASE_AUTH)}` : "";
  return `${FIREBASE_BASE_URL}${path}${authQuery}`;
}

function formatValue(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${value}`;
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

function formatDate(value) {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString();
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
  const now = new Date();
  els.lastRefresh.textContent = `Última actualización web: ${now.toLocaleString()}`;
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
  if (!diag.lastReadingDate) {
    els.readingAge.textContent = "Hace -- segundos";
    return;
  }
  const seconds = Math.max(0, Math.floor((Date.now() - diag.lastReadingDate.getTime()) / 1000));
  els.readingAge.textContent = `Hace ${seconds} segundos`;
}

function updateDiagnostics() {
  els.diagDeviceId.textContent = DEVICE_ID;
  els.diagLastUrl.textContent = diag.lastUrl;
  els.diagGetStatus.textContent = diag.lastGetStatus;
  els.diagPatchStatus.textContent = diag.lastPatchStatus;
}

function renderData(data) {
  if (!data || typeof data !== "object") {
    setStatus("Sin datos", "status-empty");
    return;
  }

  setStatus("Conectado", "status-ok");

  els.temperatura.textContent = formatValue(data.temperatura);
  els.humedadAmbiente.textContent = formatValue(data.humedadAmbiente);
  els.humedadSuelo.textContent = formatValue(data.humedadSuelo);
  els.co2.textContent = formatValue(data.co2);
  els.distanciaCm.textContent = formatDistance(data.distanciaCm);
  els.uptime.textContent = formatUptime(data.uptimeMs);

  paintMetricState(els.temperatura, "temperatura", data.temperatura);
  paintMetricState(els.humedadAmbiente, "humedadAmbiente", data.humedadAmbiente);
  paintMetricState(els.humedadSuelo, "humedadSuelo", data.humedadSuelo);
  paintMetricState(els.co2, "co2", data.co2);
  paintMetricState(els.distanciaCm, "distanciaCm", data.distanciaCm);

  const relay1On = data.relay1 === true;
  const relay2On = data.relay2 === true;
  els.relay1State.textContent = `Estado: ${relay1On ? "ON" : data.relay1 === false ? "OFF" : "--"}`;
  els.relay2State.textContent = `Estado: ${relay2On ? "ON" : data.relay2 === false ? "OFF" : "--"}`;

  document.querySelectorAll('[data-relay="relay1"]').forEach((b) => b.classList.toggle("active", b.dataset.value === String(relay1On)));
  document.querySelectorAll('[data-relay="relay2"]').forEach((b) => b.classList.toggle("active", b.dataset.value === String(relay2On)));

  diag.lastReadingDate = data.timestamp ? new Date(data.timestamp) : new Date();
  els.lastReading.textContent = `Última lectura recibida: ${diag.lastReadingDate.toLocaleString()}`;
  updateReadingAge();
}

async function fetchLatest() {
  const url = buildUrl(latestPath);
  diag.lastUrl = url;
  try {
    const response = await fetch(url);
    diag.lastGetStatus = `HTTP ${response.status}`;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const latest = await response.json();
    renderData(latest);
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
        <span class="record-time">${formatDate(item.timestamp || item.ts)}</span>
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
  const text = `${event.tipoEvento || ""} ${event.motivo || ""}`.toLowerCase();
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
  els.eventsList.innerHTML = list.map((event) => `
    <article class="record-item${getEventTone(event)}">
      <div class="record-top">
        <span class="record-title">${event.tipoEvento || "Evento"}</span>
        <span class="record-time">${formatDate(event.timestamp || event.ts)}${!event.timestamp && !event.ts && event.uptimeMs ? ` · uptime ${formatUptime(event.uptimeMs)}` : ""}</span>
      </div>
      <div class="record-grid">
        <p><strong>Actuador:</strong> ${event.actuador || "--"}</p>
        <p><strong>Estado:</strong> ${event.estadoAnterior ?? "--"} → ${event.nuevoEstado ?? "--"}</p>
        <p><strong>Motivo:</strong> ${event.motivo ?? "--"}</p>
        <p><strong>Duración:</strong> ${event.durationSec !== undefined ? `${event.durationSec} s` : "--"}</p>
        <p><strong>Temp snapshot:</strong> ${formatValue(event.temperatura ?? event.snapshotTemperatura)} °C</p>
        <p><strong>Hum snapshot:</strong> ${formatValue(event.humedadAmbiente ?? event.snapshotHumedadAmbiente)} %</p>
        <p><strong>CO2 snapshot:</strong> ${formatValue(event.co2 ?? event.snapshotCo2)} ppm</p>
      </div>
    </article>
  `).join("");
}

async function fetchHistory() {
  try {
    const response = await fetch(buildUrl(historyPath));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const history = await response.json();
    console.log("History recibida:", history);
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
    console.log("Events recibidos:", events);
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
setInterval(fetchLatest, refreshMs);
setInterval(fetchHistory, historyRefreshMs);
setInterval(fetchEvents, historyRefreshMs);
setInterval(updateReadingAge, 1000);
