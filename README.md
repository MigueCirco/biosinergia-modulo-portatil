# BioSinergia · Módulo Portátil IoT

Proyecto web estático para visualizar y controlar un módulo portátil IoT de BioSinergia (ESP32 + sensores + Firebase Realtime Database).

## ¿Qué es este proyecto?

Este repositorio contiene un dashboard web orientado a monitoreo ambiental y control remoto de actuadores para cultivos inteligentes. Está diseñado para desplegarse fácilmente en GitHub Pages.

## Organización del repositorio

- `docs/index.html`: interfaz principal del dashboard.
- `docs/style.css`: estilos responsive con estética institucional BioSinergia.
- `docs/app.js`: integración con Firebase Realtime Database vía REST (`fetch`).
- `docs/manifest.json`: configuración PWA básica.
- `docs/README.md`: guía puntual de la carpeta de publicación.

## Publicar con GitHub Pages desde `/docs`

1. Sube los cambios a la rama principal (por ejemplo `main`).
2. En GitHub, ve a **Settings > Pages**.
3. En **Build and deployment**, selecciona:
   - **Source**: Deploy from a branch.
   - **Branch**: `main` (o tu rama de publicación).
   - **Folder**: `/docs`.
4. Guarda y espera la URL pública de GitHub Pages.

## Cambiar la URL de Firebase

Abre `docs/app.js` y modifica estas constantes:

```js
const FIREBASE_BASE_URL = "https://TU-PROYECTO-default-rtdb.firebaseio.com";
const DEVICE_ID = "tu_dispositivo";
const FIREBASE_AUTH = "";
```

## Advertencia de seguridad

Las reglas abiertas de Firebase Realtime Database (lectura/escritura pública) deben usarse **solo para pruebas**. Para producción, define reglas restringidas, autenticación y validaciones.
