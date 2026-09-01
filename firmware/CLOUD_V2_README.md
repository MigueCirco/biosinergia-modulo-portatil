# Firmware Cloud v2 · Módulo Portátil

Este directorio prepara la migración del firmware real a la arquitectura segura de Firebase sin reemplazar todavía el sketch cargado en campo.

## Perfil físico actual

`fungi_portable_temp_humidity_v1`

- DHT principal: GPIO4, DHT11/DHT22 seleccionable.
- DHT secundario: GPIO32 reservado y deshabilitado por defecto.
- Relay humidificador: GPIO26.
- Relay ventilación: GPIO27.
- Relés de referencia: ACTIVE LOW.
- I2C futuro: SDA GPIO21 / SCL GPIO22.
- CO2: no forma parte de esta puesta en servicio.

## Estrategia de control

- Ventilación: Manual o Timer.
- Humidificador: Manual/Timer y se deja preparado el control automático por humedad como función independiente.
- No debe existir una decisión de ventilación condicionada a CO2 en este perfil.
- Ante boot/reinicio, ambos relés deben comenzar OFF.

## Cloud requerido

El firmware final debe:

1. conectarse a Wi-Fi sin credenciales versionadas;
2. autenticar una cuenta técnica Firebase distinta del usuario humano;
3. publicar `latest`;
4. publicar heartbeat en `presence` cada ~20 s;
5. registrar `history` aproximadamente cada 60 s;
6. registrar `events` ante transiciones relevantes;
7. leer configuración/comandos autorizados;
8. usar epoch UTC como tiempo canónico después de sincronizar NTP;
9. mantener control físico local aun si Internet/Firebase falla;
10. implementar reconexión con backoff y watchdog sin provocar ciclos peligrosos de relés.

## Archivos base

- `include/BoardPins.h`: contrato de GPIO.
- `include/ProjectConfig.h`: identidad no secreta, capacidades e intervalos.
- `include/SystemTypes.h`: tipos del dominio del módulo.
- `secrets.example.h`: contrato de secretos. Copiar localmente como `secrets.h`; nunca versionar valores reales.

## Antes de integrar el sketch principal

El sketch que efectivamente está cargado en la ESP32 debe incorporarse al repositorio como fuente de verdad y compararse contra estos contratos. No reemplazarlo automáticamente por el antiguo `co2_recovery_esp32.ino`.

Cualquier Wi-Fi/password encontrado en sketches históricos debe retirarse antes de versionarlos. Si una contraseña ya fue expuesta en Git, debe rotarse.
