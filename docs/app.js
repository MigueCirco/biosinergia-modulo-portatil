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
const refreshMs = 5000;

const els = {
  connectionStatus: document.getElementById("connectionStatus"),
  lastRefresh: document.getElementById("lastRefresh"),
  temperatura: document.getElementById("temperatura"),
  humedadAmbiente: document.getElementById("humedadAmbiente"),
  humedadSuelo: document.getElementById("humedadSuelo"),
  co2: document.getElementById("co2"),
  distanciaCm: document.getElementById("distanciaCm"),
  uptime: document.getElementById("uptime"),
  relay1State: document.getElementById("relay1State"),
  relay2State: document.getElementById("relay2State")
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

function setStatus(text, cssClass) {
  els.connectionStatus.textContent = text;
  els.connectionStatus.className = `status-pill ${cssClass}`;
}

function updateRefreshTime() {
  const now = new Date();
  els.lastRefresh.textContent = `Última actualización web: ${now.toLocaleString()}`;
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

  els.relay1State.textContent = `Estado: ${data.relay1 === true ? "ON" : data.relay1 === false ? "OFF" : "--"}`;
  els.relay2State.textContent = `Estado: ${data.relay2 === true ? "ON" : data.relay2 === false ? "OFF" : "--"}`;
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
    setStatus("Error", "status-error");
    updateRefreshTime();
  }
}

async function sendRelayCommand(relayName, relayValue) {
  const payload = {
    modo: "manual",
    [relayName]: relayValue
  };

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
    setStatus("Error", "status-error");
  }
}

document.querySelectorAll("button[data-relay]").forEach((button) => {
  button.addEventListener("click", () => {
    const relay = button.dataset.relay;
    const value = button.dataset.value === "true";
    sendRelayCommand(relay, value);
  });
});

fetchLatest();
setInterval(fetchLatest, refreshMs);
