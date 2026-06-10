# Firmware ESP32 · recuperación CO2 por software

Este repositorio todavía no contiene el sketch principal completo (`.ino`, `.cpp` o PlatformIO) que maneja WiFi, Firebase, relés, modos y sensores. Por eso se agregó un bloque de integración seguro y aislado en `co2_recovery_esp32.ino`, pensado para copiarse o incluirse en el firmware real sin cambiar constantes críticas existentes.

## Qué agrega el bloque

- Lee `devices/biosinergia_001/commands/co2ResetRequest` desde Firebase REST.
- Si la solicitud es `true`, ejecuta `recoverCo2Sensor()`.
- `recoverCo2Sensor()` no calibra el sensor y no modifica `co2Offset`.
- La recuperación hace:
  - `co2Status = "recovering"`.
  - limpieza del buffer UART2.
  - `co2Serial.end()`.
  - espera de 200 ms.
  - `co2Serial.begin(9600, SERIAL_8N1, 16, 17)` con los mismos pines actuales.
  - punto de extensión para reinicializar la librería CO2 si el sketch principal usa una.
  - descarte de lecturas iniciales y ventana de espera antes de aceptar valores.
  - `commands/co2ResetRequest = false`.
  - publicación de `co2ResetStatus`, `co2ResetLastAt`, `co2Status` y contadores en `latest`.
  - registro de evento `CO2_SOFT_RESET` en `events`.
- Diagnóstico agregado para:
  - `co2Status = "invalid_zero"` si CO2 queda en 0.
  - `co2Status = "stuck_or_saturated"` si CO2 queda en 5000 durante varias lecturas consecutivas.
  - recuperación automática tras más de 5 lecturas inválidas consecutivas, con enfriamiento de 5 minutos para evitar bucles.

## Puntos de integración mínimos

1. Mantener los valores actuales de `FIREBASE_BASE_URL` y `DEVICE_ID` en el firmware principal.
2. Llamar `co2RecoverySetup()` desde `setup()` después de iniciar WiFi/seriales necesarios.
3. Llamar `handleCo2RecoveryCommand()` periódicamente en `loop()` o en la tarea que ya lee `commands`.
4. En cada lectura CO2, llamar `updateCo2Diagnostics(co2Raw, co2Calibrado)` antes de publicar `latest`.
5. Al construir el JSON que se envía a `latest`, llamar `appendCo2LatestFields(latestJson, co2Calibrado)`.
6. Si se usa una librería CO2 específica, completar `reinitCo2LibraryIfNeeded()` con su reinicialización. No agregar calibración cero ahí.

## Campos esperados en Firebase

### `commands`

```json
{
  "co2ResetRequest": true,
  "co2ResetRequestedAtWeb": "2026-06-10T00:00:00.000Z"
}
```

### `latest`

```json
{
  "co2Raw": 5000,
  "co2": 5000,
  "co2Status": "stuck_or_saturated",
  "co2InvalidCount": 6,
  "co2ResetStatus": "done",
  "co2ResetLastAt": "1234567",
  "co2LastValidTimestamp": "1230000",
  "co2LastValidUptimeMs": 1230000
}
```

### `events`

```json
{
  "type": "CO2_SOFT_RESET",
  "sensor": "co2",
  "reason": "Solicitud manual desde dashboard",
  "co2Before": 5000,
  "mode": "manual",
  "timestamp": "1234567",
  "uptimeMs": 1234567,
  "createdAtWeb": "2026-06-10T00:00:00.000Z",
  "createdAtDevice": "1234567"
}
```

## Notas de seguridad

- No se toca ningún relé por la recuperación CO2.
- No se cambia modo manual/auto/timer.
- No se ejecuta calibración cero.
- No se cambia `co2Offset`.
- Las rutas terminan en `.json` exactamente una vez para evitar `.json.json`.

# Contrato previo para sensor ambiente configurable

La web también queda preparada para guardar y mostrar estos campos compatibles con el esquema actual:

- `devices/biosinergia_001/config/sensorAmbientType`: `"DHT11"` o `"DHT22"`.
- `devices/biosinergia_001/latest/sensorAmbientTypeApplied`: tipo aplicado por el ESP32.
- `devices/biosinergia_001/latest/sensorAmbientStatus`: `ok`, `invalid`, `timeout`, `disconnected` o `saturated`.
- `devices/biosinergia_001/latest/sensorAmbientRawOk`: booleano opcional.
- `devices/biosinergia_001/latest/sensorAmbientLastValidTs`: timestamp opcional de la última lectura ambiente válida.

Cuando se agregue o actualice el firmware real, la integración segura del sensor ambiente debe hacerse sobre el pin DHT existente, manteniendo `FIREBASE_BASE_URL`, `DEVICE_ID`, relés y rutas actuales. Una implementación típica con la librería `DHT` consiste en crear dos instancias sobre el mismo pin existente (`DHT11` y `DHT22`), seleccionar la activa según `config.sensorAmbientType`, llamar `begin()` al cambiar el tipo y publicar en `latest` los campos anteriores sin enviar lecturas `NaN`.
