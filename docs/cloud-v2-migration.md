# BioSinergia Módulo Portátil · Cloud Architecture v2

Estado: preparación segura. **No desplegar reglas todavía** hasta autenticar la PWA y la ESP32.

## Objetivo

Mantener la PWA y la lógica de cultivo actuales, incorporando los patrones de seguridad y operación cloud validados en la arquitectura Pisac:

ESP32 → Internet → Firebase Authentication → RTDB protegida → PWA con Email/Password.

## Decisiones de compatibilidad

- Se conserva el proyecto Firebase `biosinergia-modulo-portatil`.
- Se conserva temporalmente el árbol `/devices/biosinergia_001/...` para evitar una migración destructiva.
- Se conserva GitHub Pages durante la primera fase.
- Se agrega `/devices/biosinergia_001/presence` para ONLINE/OFFLINE.
- `timestamp` sigue siendo requerido por compatibilidad; el firmware nuevo debe migrarlo progresivamente a UTC epoch real.
- Usuario humano y ESP32 tendrán identidades Firebase distintas.

## Orden obligatorio de activación

1. Firebase Console: habilitar Authentication > Email/Password.
2. Crear/usar una Web App del proyecto y copiar su Web API key a `docs/firebase-config.js`.
3. Crear un usuario humano sin compartir su contraseña.
4. Anotar su UID y asociarlo en `/userDevices/{uid}/biosinergia_001` con `active=true` y rol.
5. Crear una cuenta técnica independiente para la ESP32.
6. Anotar el UID técnico y asociarlo en `/devicePrincipals/{uid} = "biosinergia_001"`.
7. Integrar el firmware principal real con Authentication y secrets locales.
8. Confirmar que la ESP32 autenticada escribe `latest`, `history`, `events` y `presence`.
9. Confirmar que la PWA autenticada puede leer y que un navegador anónimo no puede leer.
10. Recién entonces desplegar `firebase/database.rules.json`.

## Estado de la PWA Auth

Esta rama contiene:

- `firebase-config.js`: configuración pública del proyecto (API key pendiente).
- `auth.js`: Email/Password vía APIs oficiales de Firebase Identity Toolkit y renovación de ID token.
- `auth-guard.js`: redirección a `login.html` cuando no existe sesión.
- `login.html`: login y restablecimiento de contraseña.

Todavía no se conectaron estos scripts a las páginas operativas porque eso debe hacerse en el mismo paso en que se complete la API key y se pruebe una cuenta real. Dejar el guard activo con una configuración incompleta bloquearía la interfaz existente.

## Reglas RTDB propuestas

`firebase/database.rules.json` parte de deny-by-default y separa:

- humanos autorizados: lectura del dispositivo;
- `admin` / `technician`: `config`, `calibration`, `commands`;
- identidad técnica: `latest`, `presence`, `history`, `events`.

El árbol `userDevices` y `devicePrincipals` debe ser aprovisionado por un administrador confiable, no por la PWA.

## Firmware: bloqueo actual

El repositorio todavía no contiene el firmware principal efectivamente cargado en la ESP32. Antes de adaptar sensores, GPIO o Firebase Auth debe incorporarse ese sketch como fuente de verdad. No reconstruir el firmware principal a partir de `co2_recovery_esp32.ino`.

## Criterio ONLINE/OFFLINE

Firmware recomendado:

- heartbeat en `presence` cada 20 s;
- `lastSeenUtcMs`: epoch UTC en milisegundos;
- `source`: `device`;
- `online`: true durante operación normal.

PWA:

- ONLINE: heartbeat <= 60 s;
- OFFLINE: heartbeat > 60 s o Firebase no accesible.

## No copiar desde Pisac

No reutilizar `.firebaserc`, URLs/IDs de `biosinergia-pisac-dev`, UIDs, cuentas, secretos, GPIO, setpoints, datos ni timezone de Pisac.
