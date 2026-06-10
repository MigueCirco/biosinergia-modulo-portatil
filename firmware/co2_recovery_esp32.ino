/*
  Recuperación por software del sensor CO2 para ESP32/BioSinergia.

  Integrar este bloque en el sketch principal existente sin cambiar:
  - FIREBASE_BASE_URL
  - DEVICE_ID
  - pines UART2: RX GPIO16, TX GPIO17
  - offsets de calibración, relés ni modos manual/auto/timer

  Requisitos del sketch principal:
  - WiFi ya conectado.
  - ArduinoJson instalado.
  - Llamar co2RecoverySetup() en setup().
  - Llamar handleCo2RecoveryCommand() periódicamente después de consultar commands.
  - Llamar updateCo2Diagnostics(raw, calibrated) en cada lectura CO2 antes de publicar latest.
  - Incorporar appendCo2LatestFields(payload) al PATCH de latest.
*/

#include <Arduino.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

#ifndef CO2_RX_PIN
#define CO2_RX_PIN 16
#endif
#ifndef CO2_TX_PIN
#define CO2_TX_PIN 17
#endif
#ifndef CO2_BAUDRATE
#define CO2_BAUDRATE 9600
#endif

HardwareSerial co2Serial(2);

static const uint8_t CO2_DISCARD_READS_AFTER_RESET = 5;
static const uint8_t CO2_INVALID_LIMIT = 5;
static const uint8_t CO2_STUCK_5000_LIMIT = 5;
static const unsigned long CO2_ACCEPT_AFTER_RESET_MS = 5000UL;
static const unsigned long CO2_AUTO_RECOVER_COOLDOWN_MS = 300000UL;

String co2Status = "unknown";
String co2ResetStatus = "idle";
String co2ResetLastAt = "";
String co2LastValidTimestamp = "";
unsigned long co2LastValidUptimeMs = 0;
unsigned long co2LastRecoverMs = 0;
unsigned long co2AcceptAfterMs = 0;
uint8_t co2InvalidCount = 0;
uint8_t co2Stuck5000Count = 0;
uint8_t co2DiscardReadsRemaining = 0;
int co2Raw = 0;
int co2BeforeRecovery = 0;

// Mantener estas constantes definidas en el firmware principal con sus valores actuales.
extern const char *FIREBASE_BASE_URL;
extern const char *DEVICE_ID;
extern String currentMode;

String firebaseUrl(const String &pathWithJson) {
  String base = String(FIREBASE_BASE_URL);
  while (base.endsWith("/")) base.remove(base.length() - 1);
  return base + pathWithJson;
}

String nowIsoLike() {
  // Si el sketch ya tiene hora NTP/RTC, reemplazar por su timestamp ISO local.
  return String(millis());
}

bool firebasePatch(const String &pathWithJson, const JsonDocument &doc) {
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  if (!http.begin(client, firebaseUrl(pathWithJson))) return false;
  http.addHeader("Content-Type", "application/json");
  String body;
  serializeJson(doc, body);
  int code = http.PATCH(body);
  http.end();
  return code >= 200 && code < 300;
}

bool firebasePush(const String &pathWithJson, const JsonDocument &doc) {
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  if (!http.begin(client, firebaseUrl(pathWithJson))) return false;
  http.addHeader("Content-Type", "application/json");
  String body;
  serializeJson(doc, body);
  int code = http.POST(body);
  http.end();
  return code >= 200 && code < 300;
}

bool firebaseGetJson(const String &pathWithJson, JsonDocument &doc) {
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  if (!http.begin(client, firebaseUrl(pathWithJson))) return false;
  int code = http.GET();
  if (code < 200 || code >= 300) {
    http.end();
    return false;
  }
  DeserializationError error = deserializeJson(doc, http.getString());
  http.end();
  return !error;
}

void flushCo2Uart() {
  while (co2Serial.available() > 0) co2Serial.read();
}

void reinitCo2LibraryIfNeeded() {
  // Si el sketch usa una librería específica para MH-Z19/SenseAir/etc., reinicializarla aquí.
  // No ejecutar calibración cero desde esta rutina.
}

void patchCo2LatestStatus(const String &status, const String &resetStatus) {
  StaticJsonDocument<256> latest;
  latest["co2Status"] = status;
  latest["co2ResetStatus"] = resetStatus;
  latest["co2ResetLastAt"] = co2ResetLastAt;
  latest["co2InvalidCount"] = co2InvalidCount;
  firebasePatch(String("/devices/") + DEVICE_ID + "/latest.json", latest);
}

void clearCo2ResetCommand() {
  StaticJsonDocument<128> commands;
  commands["co2ResetRequest"] = false;
  firebasePatch(String("/devices/") + DEVICE_ID + "/commands.json", commands);
}

void pushCo2ResetEvent(const String &createdAtWeb, const String &reason) {
  StaticJsonDocument<512> event;
  event["type"] = "CO2_SOFT_RESET";
  event["sensor"] = "co2";
  event["reason"] = reason;
  event["co2Before"] = co2BeforeRecovery;
  event["mode"] = currentMode;
  event["timestamp"] = co2ResetLastAt;
  event["uptimeMs"] = millis();
  if (createdAtWeb.length() > 0) event["createdAtWeb"] = createdAtWeb;
  event["createdAtDevice"] = co2ResetLastAt;
  firebasePush(String("/devices/") + DEVICE_ID + "/events.json", event);
}

void recoverCo2Sensor(const String &createdAtWeb = "", const String &reason = "Solicitud manual desde dashboard") {
  co2BeforeRecovery = co2Raw;
  co2Status = "recovering";
  co2ResetStatus = "recovering";
  co2ResetLastAt = nowIsoLike();
  co2LastRecoverMs = millis();
  co2AcceptAfterMs = millis() + CO2_ACCEPT_AFTER_RESET_MS;
  co2DiscardReadsRemaining = CO2_DISCARD_READS_AFTER_RESET;
  patchCo2LatestStatus(co2Status, co2ResetStatus);

  flushCo2Uart();
  co2Serial.end();
  delay(200);
  co2Serial.begin(CO2_BAUDRATE, SERIAL_8N1, CO2_RX_PIN, CO2_TX_PIN);
  flushCo2Uart();
  reinitCo2LibraryIfNeeded();

  clearCo2ResetCommand();
  co2ResetStatus = "done";
  patchCo2LatestStatus(co2Status, co2ResetStatus);
  pushCo2ResetEvent(createdAtWeb, reason);
}

void co2RecoverySetup() {
  co2Serial.begin(CO2_BAUDRATE, SERIAL_8N1, CO2_RX_PIN, CO2_TX_PIN);
  flushCo2Uart();
}

void handleCo2RecoveryCommand() {
  StaticJsonDocument<256> commands;
  if (!firebaseGetJson(String("/devices/") + DEVICE_ID + "/commands.json", commands)) return;
  if (commands["co2ResetRequest"] == true) {
    String createdAtWeb = commands["co2ResetRequestedAtWeb"] | "";
    recoverCo2Sensor(createdAtWeb, "Solicitud manual desde dashboard");
  }
}

void updateCo2Diagnostics(int raw, int calibrated) {
  co2Raw = raw;

  if (co2DiscardReadsRemaining > 0 || millis() < co2AcceptAfterMs) {
    if (co2DiscardReadsRemaining > 0) co2DiscardReadsRemaining--;
    co2Status = "recovering";
    return;
  }

  if (raw == 0 || calibrated == 0) {
    co2InvalidCount++;
    co2Status = "invalid_zero";
  } else if (raw == 5000 || calibrated == 5000) {
    co2InvalidCount++;
    co2Stuck5000Count++;
    co2Status = co2Stuck5000Count >= CO2_STUCK_5000_LIMIT ? "stuck_or_saturated" : "ok";
  } else if (raw < 300 || calibrated < 300 || raw > 10000 || calibrated > 10000) {
    co2InvalidCount++;
    co2Status = "invalid";
  } else {
    co2InvalidCount = 0;
    co2Stuck5000Count = 0;
    co2Status = "ok";
    co2LastValidTimestamp = nowIsoLike();
    co2LastValidUptimeMs = millis();
  }

  if (co2InvalidCount > CO2_INVALID_LIMIT && millis() - co2LastRecoverMs >= CO2_AUTO_RECOVER_COOLDOWN_MS) {
    recoverCo2Sensor("", "Recuperación automática por lecturas CO2 inválidas consecutivas");
  }
}

void appendCo2LatestFields(JsonDocument &latest, int calibratedCo2) {
  latest["co2Raw"] = co2Raw;
  latest["co2"] = calibratedCo2;
  latest["co2Status"] = co2Status;
  latest["co2InvalidCount"] = co2InvalidCount;
  latest["co2ResetStatus"] = co2ResetStatus;
  latest["co2ResetLastAt"] = co2ResetLastAt;
  latest["co2LastValidTimestamp"] = co2LastValidTimestamp;
  latest["co2LastValidUptimeMs"] = co2LastValidUptimeMs;
}
