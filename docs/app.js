// ==============================
// Configuración rápida de Firebase
// ==============================
const FIREBASE_BASE_URL = "https://biosinergia-modulo-portatil-default-rtdb.firebaseio.com";
const DEVICE_ID = "biosinergia_001";
const FIREBASE_AUTH = "";

const latestPath = `/devices/${DEVICE_ID}/latest.json`;
const commandsPath = `/devices/${DEVICE_ID}/commands.json`;
const refreshMs = 5000;

const els = {
  lastRefresh: document.getElementById("lastRefresh"),
  moduleSummary: document.getElementById("moduleSummary"),
  chipOnline: document.getElementById("chipOnline"),
  chipMode: document.getElementById("chipMode"),
  chipFirebase: document.getElementById("chipFirebase"),
  errorBanner: document.getElementById("errorBanner"),
  temperatura: document.getElementById("temperatura"),
  humedadAmbiente: document.getElementById("humedadAmbiente"),
  humedadSuelo: document.getElementById("humedadSuelo"),
  co2: document.getElementById("co2"),
  distanciaCm: document.getElementById("distanciaCm"),
  uptime: document.getElementById("uptime"),
  relay1State: document.getElementById("relay1State"),
  relay2State: document.getElementById("relay2State"),
  relay1Badge: document.getElementById("relay1Badge"),
  relay2Badge: document.getElementById("relay2Badge"),
  soilRaw: document.getElementById("soilRaw"),
  uptimeMs: document.getElementById("uptimeMs"),
  timestamp: document.getElementById("timestamp"),
  deviceId: document.getElementById("deviceId")
};

function buildUrl(path) {
  const authQuery = FIREBASE_AUTH ? `?auth=${encodeURIComponent(FIREBASE_AUTH)}` : "";
  return `${FIREBASE_BASE_URL}${path}${authQuery}`;
}

function formatValue(value, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${value}${suffix}`;
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

function setChip(element, cssClass) {
  element.className = `chip ${cssClass}`;
}

function setError(message = "") {
  if (!message) {
    els.errorBanner.hidden = true;
    els.errorBanner.textContent = "";
    return;
  }

  els.errorBanner.hidden = false;
  els.errorBanner.textContent = message;
}

function animateUpdatedData() {
  document.querySelectorAll("[data-animate-target]").forEach((target) => {
    target.classList.remove("data-updated");
    // Reinicia la animación para cada refresh de datos.
    void target.offsetWidth;
    target.classList.add("data-updated");
  });
}

function setRelayUi(relayName, value) {
  const stateEl = relayName === "relay1" ? els.relay1State : els.relay2State;
  const badgeEl = relayName === "relay1" ? els.relay1Badge : els.relay2Badge;
  const cardEl = document.querySelector(`[data-relay-card="${relayName}"]`);

  const stateText = value === true ? "ON" : value === false ? "OFF" : "--";
  stateEl.textContent = `Estado: ${stateText}`;

  badgeEl.textContent = stateText;
  badgeEl.className = `relay-badge ${value === true ? "relay-on" : value === false ? "relay-off" : "relay-unknown"}`;

  cardEl.querySelectorAll("button[data-relay]").forEach((btn) => {
    const isActive = btn.dataset.value === String(value);
    btn.classList.toggle("btn-active", isActive);
  });
}

function updateRefreshTime() {
  const now = new Date();
  els.lastRefresh.textContent = `Última actualización web: ${now.toLocaleString()}`;
}

function renderData(data) {
  if (!data || typeof data !== "object") {
    setChip(els.chipOnline, "chip-off");
    els.moduleSummary.textContent = "Sin datos de telemetría disponibles.";
    return;
  }

  setError("");
  setChip(els.chipOnline, "chip-ok");
  setChip(els.chipFirebase, "chip-ok");
  setChip(els.chipMode, data.modo === "manual" ? "chip-ok" : "chip-pending");

  els.temperatura.textContent = formatValue(data.temperatura);
  els.humedadAmbiente.textContent = formatValue(data.humedadAmbiente);
  els.humedadSuelo.textContent = formatValue(data.humedadSuelo);
  els.co2.textContent = formatValue(data.co2);
  els.distanciaCm.textContent = formatDistance(data.distanciaCm);
  els.uptime.textContent = formatUptime(data.uptimeMs);

  setRelayUi("relay1", data.relay1);
  setRelayUi("relay2", data.relay2);

  els.soilRaw.textContent = formatValue(data.soilRaw);
  els.uptimeMs.textContent = formatValue(data.uptimeMs);
  els.timestamp.textContent = data.timestamp || "--";
  els.deviceId.textContent = data.deviceId || DEVICE_ID;

  els.moduleSummary.textContent = `Temp ${formatValue(data.temperatura, "°C")} · Humedad suelo ${formatValue(data.humedadSuelo, "%")} · CO₂ ${formatValue(data.co2, " ppm")}`;
  animateUpdatedData();
}

async function fetchLatest() {
  try {
    const response = await fetch(buildUrl(latestPath));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const latest = await response.json();
    renderData(latest);
    updateRefreshTime();
  } catch (error) {
    console.error("Error al consultar latest:", error);
    setChip(els.chipOnline, "chip-error");
    setChip(els.chipFirebase, "chip-error");
    setError("No se pudo actualizar la telemetría. Verificá conexión, reglas de Firebase y disponibilidad del módulo.");
    updateRefreshTime();
  }
}

async function sendRelayCommand(relayName, relayValue) {
  const payload = { modo: "manual", [relayName]: relayValue };

  try {
    const response = await fetch(buildUrl(commandsPath), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await fetchLatest();
  } catch (error) {
    console.error("Error al enviar comando:", error);
    setError("Error al enviar comando manual al actuador.");
  }
}

document.querySelectorAll("button[data-relay]").forEach((button) => {
  button.addEventListener("click", () => {
    const relay = button.dataset.relay;
    const value = button.dataset.value === "true";
    sendRelayCommand(relay, value);
  });
});

setChip(els.chipFirebase, "chip-pending");
fetchLatest();
setInterval(fetchLatest, refreshMs);
