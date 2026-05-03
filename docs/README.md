# Dashboard Web Estático (docs)

Esta carpeta contiene la aplicación web estática para el módulo portátil IoT de BioSinergia.

## Archivos

- `index.html`: estructura del dashboard.
- `style.css`: estilos visuales responsive con la identidad BioSinergia.
- `app.js`: lógica de lectura de métricas (`GET latest`) y control remoto (`PATCH commands`) usando Firebase REST API.
- `manifest.json`: configuración básica PWA para instalación en dispositivos compatibles.

## Endpoints usados

- `GET /devices/biosinergia_001/latest.json`
- `PATCH /devices/biosinergia_001/commands.json`

## Notas

- No se incluyen credenciales sensibles.
- Para cambiar de dispositivo o entorno, edita `FIREBASE_BASE_URL`, `DEVICE_ID` y `FIREBASE_AUTH` en `app.js`.
