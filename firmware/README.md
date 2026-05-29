# Firmware ESP32 · contrato para sensor ambiente configurable

Este repositorio no incluye aún el archivo fuente del firmware (`.ino`, `.cpp` o PlatformIO). Para no inventar pines ni cambiar constantes críticas, no se agregó un firmware nuevo con pines supuestos.

La web queda preparada para guardar y mostrar estos campos compatibles con el esquema actual:

- `devices/biosinergia_001/config/sensorAmbientType`: `"DHT11"` o `"DHT22"`.
- `devices/biosinergia_001/latest/sensorAmbientTypeApplied`: tipo aplicado por el ESP32.
- `devices/biosinergia_001/latest/sensorAmbientStatus`: `ok`, `invalid`, `timeout`, `disconnected` o `saturated`.
- `devices/biosinergia_001/latest/sensorAmbientRawOk`: booleano opcional.
- `devices/biosinergia_001/latest/sensorAmbientLastValidTs`: timestamp opcional de la última lectura ambiente válida.

Cuando se agregue el firmware real al repositorio, la integración segura debe hacerse sobre el pin DHT existente, manteniendo `FIREBASE_BASE_URL`, `DEVICE_ID`, relés y rutas actuales. Una implementación típica con la librería `DHT` consiste en crear dos instancias sobre el mismo pin existente (`DHT11` y `DHT22`), seleccionar la activa según `config.sensorAmbientType`, llamar `begin()` al cambiar el tipo y publicar en `latest` los campos anteriores sin enviar lecturas `NaN`.
