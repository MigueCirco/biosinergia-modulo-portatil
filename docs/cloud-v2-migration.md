# BioSinergia Módulo Portátil · Cloud Architecture v2

Estado: preparación segura. **No desplegar reglas todavía** hasta autenticar la PWA y la ESP32.

## Objetivo

Mantener la PWA y la lógica de cultivo actuales, incorporando los patrones de seguridad y operación cloud validados en la arquitectura Pisac:

ESP32 → Internet → Firebase Authentication → RTDB protegida → PWA con Email/Password.

## Perfil operativo acordado para esta implementación

Para la entrega inmediata del módulo portátil se simplifica el alcance físico:

- Sensado activo: **temperatura ambiente + humedad ambiente**.
- CO2: **no instalado / no requerido** en esta versión. Los históricos antiguos de CO2 no se eliminan.
- Humidificador: se conserva como actuador disponible si el montaje físico lo utiliza.
- Ventilación: control **Manual** o **Timer**.
- Automático por CO2: fuera del alcance actual.
- El productor decidirá el uso de ventilación a partir de la observación del cultivo y podrá programar ciclos de tiempo desde la PWA.
- La arquitectura mantiene `capabilities.co2=false` para que futuras interfaces sepan ocultar esa variable sin destruir compatibilidad histórica.

Perfil propuesto: `fungi_portable_temp_humidity_v1`.

## Decisiones de compatibilidad

- Se conserva el proyecto Firebase `biosinergia-modulo-portatil`.
- Se conserva temporalmente el árbol `/devices/biosinergia_001/...` para evitar una migración destructiva.
- Se conserva GitHub Pages durante la primera fase.
- Se agrega `/devices/biosinergia_001/presence` para ONLINE/OFFLINE.
- `timestamp` sigue siendo requerido por compatibilidad; el firmware nuevo debe migrarlo progresivamente a UTC epoch real.
- Usuario humano y ESP32 tendrán identidades Firebase distintas.
- Los campos legacy de CO2 pueden seguir existiendo en registros anteriores; no son obligatorios para nuevos registros del perfil actual.

## PWA e identidad visual

La aplicación instalable usa el logo oficial de BioSinergia como icono:

- `icons/icon-192.png`: icono estándar Android/PWA.
- `icons/icon-512.png`: icono de alta resolución.
- `icons/icon-maskable-512.png`: variante segura para launchers que recortan el icono.

`manifest.webmanifest` es la fuente principal para instalación. El Service Worker versiona y cachea estos recursos estáticos, pero nunca cachea respuestas de RTDB ni de Firebase Authentication.

## Orden obligatorio de activación

1. Firebase Console: habilitar Authentication > Email/Password.
2. Crear/usar una Web App del proyecto y copiar su Web API key a `docs/firebase-config.js`.
3. Crear un usuario humano sin compartir su contraseña.
4. Anotar su UID y asociarlo en `/userDevices/{uid}/biosinergia_001` con `active=true` y rol.
5. Crear una cuenta técnica independiente para la ESP32.
6. Anotar el UID técnico y asociarlo en `/devicePrincipals/{uid} = "biosinergia_001"`.
7. Incorporar al repositorio el firmware principal efectivamente cargado en la ESP32.
8. Integrar el firmware con Authentication, timestamps UTC y `presence`.
9. Confirmar que la ESP32 autenticada escribe `latest`, `history`, `events` y `presence` sin necesitar CO2.
10. Confirmar que la PWA autenticada puede leer y que un navegador anónimo no puede leer.
11. Recién entonces desplegar `firebase/database.rules.json`.

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

El esquema no obliga a que exista CO2 en `latest` ni en `history`, por lo que el mismo contrato puede trabajar con el perfil reducido de temperatura/humedad.

## Firmware: bloqueo actual

El repositorio todavía no contiene el firmware principal efectivamente cargado en la ESP32. Antes de adaptar GPIO, Authentication o control definitivo debe incorporarse ese sketch como fuente de verdad. No reconstruir el firmware principal a partir de `co2_recovery_esp32.ino`.

Para esta versión, el firmware objetivo debe priorizar:

- lectura estable de temperatura y humedad;
- modo Manual;
- modo Timer;
- control de ventilación;
- estado real reportado de actuadores;
- NTP/UTC;
- Firebase Authentication de dispositivo;
- heartbeat de presencia;
- reconexión Wi-Fi/Firebase;
- watchdog;
- histórico cada ~60 s mientras este intervalo siga siendo útil para verificar ciclos del timer.

CO2 queda explícitamente fuera del criterio de aceptación de esta instalación.

## Criterio ONLINE/OFFLINE

Firmware recomendado:

- heartbeat en `presence` cada 20 s;
- `lastSeenUtcMs`: epoch UTC en milisegundos;
- `source`: `device`;
- `online`: true durante operación normal.

PWA:

- ONLINE: heartbeat <= 60 s;
- OFFLINE: heartbeat > 60 s o Firebase no accesible.

La PWA no debe confundir “Firebase respondió” con “la ESP32 está online”.

## Criterio mínimo para la próxima puesta en servicio

La versión puede considerarse apta cuando:

- el usuario inicia sesión con Email/Password;
- temperatura y humedad llegan en vivo;
- el estado de humidificador/ventilación refleja el estado físico real;
- ventilación funciona en Manual y Timer;
- históricos se registran con timestamp válido;
- `presence` cambia visualmente a OFFLINE ante pérdida de heartbeat;
- un navegador sin login no accede a los datos;
- el icono instalado es el de BioSinergia;
- no existe dependencia funcional del sensor CO2.

## No copiar desde Pisac

No reutilizar `.firebaserc`, URLs/IDs de `biosinergia-pisac-dev`, UIDs, cuentas, secretos, GPIO, setpoints, datos ni timezone de Pisac.
