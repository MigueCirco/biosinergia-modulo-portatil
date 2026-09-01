#pragma once

#include <Arduino.h>

namespace BioSinergiaConfig {

constexpr char DEVICE_ID[] = "biosinergia_001";
constexpr char DEVICE_PROFILE[] = "fungi_portable_temp_humidity_v1";
constexpr char TIMEZONE_IANA[] = "America/Argentina/Tucuman";

// Telemetría y presencia cloud.
constexpr unsigned long SENSOR_SAMPLE_INTERVAL_MS = 5000UL;
constexpr unsigned long LIVE_PUBLISH_INTERVAL_MS = 10000UL;
constexpr unsigned long HISTORY_INTERVAL_MS = 60000UL;
constexpr unsigned long PRESENCE_INTERVAL_MS = 20000UL;
constexpr unsigned long CLOUD_CONFIG_INTERVAL_MS = 5000UL;
constexpr unsigned long COMMAND_INTERVAL_MS = 3000UL;
constexpr unsigned long NTP_RESYNC_INTERVAL_MS = 6UL * 60UL * 60UL * 1000UL;

// La PWA considera offline cuando el último heartbeat supera este margen.
constexpr unsigned long PRESENCE_OFFLINE_AFTER_MS = 60000UL;

// Capacidades del perfil actual.
constexpr bool HAS_AMBIENT_TEMPERATURE = true;
constexpr bool HAS_AMBIENT_HUMIDITY = true;
constexpr bool HAS_CO2 = false;
constexpr bool HAS_HUMIDIFIER = true;
constexpr bool HAS_VENTILATION = true;
constexpr bool HAS_MANUAL_MODE = true;
constexpr bool HAS_TIMER_MODE = true;
constexpr bool HAS_AUTOMATIC_HUMIDITY_CONTROL = true;
constexpr bool HAS_AUTOMATIC_VENTILATION_BY_CO2 = false;

// Estados seguros: ambos actuadores apagados al iniciar/reiniciar.
constexpr bool SAFE_HUMIDIFIER_STATE = false;
constexpr bool SAFE_VENTILATION_STATE = false;

}  // namespace BioSinergiaConfig
