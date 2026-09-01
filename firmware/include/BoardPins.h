#pragma once

#include <Arduino.h>

// BioSinergia Módulo Portátil - perfil fungi_portable_temp_humidity_v1
// Fuente de referencia: firmware estable previo del módulo portátil.
// Verificar físicamente antes del próximo upload/commissioning.

namespace BioSinergiaPins {

// Sensor ambiental principal DHT11/DHT22 seleccionable por configuración.
constexpr uint8_t DHT_MAIN = 4;

// Reserva para segundo DHT. Deshabilitado por defecto.
constexpr uint8_t DHT_SECONDARY = 32;

// Actuadores ACTIVE LOW según el montaje actual de referencia.
constexpr uint8_t HUMIDIFIER_RELAY = 26;
constexpr uint8_t VENTILATION_RELAY = 27;

constexpr uint8_t RELAY_ON_LEVEL = LOW;
constexpr uint8_t RELAY_OFF_LEVEL = HIGH;

// Bus I2C reservado para expansiones futuras. No hay sensor CO2 activo
// en este perfil de puesta en servicio.
constexpr uint8_t I2C_SDA = 21;
constexpr uint8_t I2C_SCL = 22;

}  // namespace BioSinergiaPins
