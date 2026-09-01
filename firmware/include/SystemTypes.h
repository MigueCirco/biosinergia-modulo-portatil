#pragma once

#include <Arduino.h>

namespace BioSinergia {

enum class OperationMode : uint8_t {
  Manual = 0,
  Timer = 1,
  AutoHumidity = 2
};

enum class AmbientSensorType : uint8_t {
  DHT11 = 0,
  DHT22 = 1
};

struct AmbientReading {
  float temperatureC = NAN;
  float humidityPct = NAN;
  bool valid = false;
  uint64_t sampledAtUtcMs = 0;
  unsigned long sampledAtUptimeMs = 0;
};

struct ActuatorState {
  bool humidifier = false;
  bool ventilation = false;
  unsigned long humidifierChangedAtMs = 0;
  unsigned long ventilationChangedAtMs = 0;
};

struct TimerCycle {
  bool enabled = false;
  float onMinutes = 0.0f;
  float repeatEveryMinutes = 0.0f;
};

struct TimerConfig {
  bool enabled = false;
  bool mutualExclusion = true;
  float delayBetweenActuatorsMinutes = 0.5f;
  TimerCycle humidifier;
  TimerCycle ventilation;
};

struct RuntimeConfig {
  OperationMode mode = OperationMode::Manual;
  AmbientSensorType ambientSensorType = AmbientSensorType::DHT11;
  float humidityMinPct = 80.0f;
  float humidityMaxPct = 95.0f;
  float temperatureMinC = 16.0f;
  float temperatureMaxC = 21.0f;
  float temperatureCriticalC = 24.0f;
  bool mutualExclusion = true;
  TimerConfig timer;
};

struct PresenceState {
  bool online = true;
  uint64_t lastSeenUtcMs = 0;
  unsigned long uptimeMs = 0;
  int wifiRssiDbm = 0;
};

}  // namespace BioSinergia
