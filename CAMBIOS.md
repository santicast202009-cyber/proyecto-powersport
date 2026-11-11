# Cambios y observaciones

Registro de diferencias, decisiones y problemas detectados durante la migración a React.

## Tabla general: antes (vanilla) → ahora (React)

| Antes (vanilla) | Ahora (React) | Qué cambió |
|---|---|---|
| `index.html` | `frontend/index.html` + `src/App.jsx` | El HTML se dividió en componentes dentro de `src/components/`. |
| `admin.html` | `frontend/admin.html` + `src/admin-main.jsx` | El admin es una segunda página de Vite, sin React Router. |
| `styles.css` | `frontend/src/index.css` | Se reutilizó el CSS; solo cambiaron las rutas de imágenes a `/img/...`. |
| `js/config.js` | `frontend/src/api.js` + `VITE_API_URL` | La URL de la API ya no está fija en el código. |
| `js/main.js` — menú móvil | `Header.jsx` | El menú usa `useState` y eventos `onClick`. |
| `js/main.js` — tarjetas | `Products.jsx` + `ProductCard.jsx` | Los productos se cargan con `useEffect` y se pintan con `.map()`. |
| `js/main.js` — contacto | `ContactForm.jsx` | Formulario controlado que envía los datos a la API. |
| `js/admin.js` — login | `AdminApp.jsx` + `AdminLogin.jsx` | Login con token guardado en `sessionStorage`. |
| `js/admin.js` — panel | `AdminPanel.jsx` | Carga mensajes y productos con `useEffect`. |
| `js/admin.js` — mensajes | `MessageList.jsx` | Los mensajes se pintan con `.map()` y una `key` real. |
| `js/admin.js` — stock | `StockList.jsx` + `StockItem.jsx` | Input controlado y guardado con `PATCH`. |
| `assets/img/...` | `frontend/public/img/...` | Las imágenes públicas se sirven desde `/img/...`. |
| `document.querySelector`, `innerHTML`, `addEventListener` | JSX, `useState`, `onClick`, `onSubmit` | Se eliminó la manipulación directa del DOM. |
| `fetch` repartidos por el código | `src/api.js` | Todas las llamadas a la API están en un solo archivo. |
| No existía | `Chatbot.jsx` + `POST /api/chat` | Asistente flotante con Gemini; el backend le pasa el catálogo actual como contexto. |

## Fase 3: componentes de la página

- **Imagen de fondo del hero:** `frontend/src/index.css` referencia `/img/hero.jpg`, pero ese archivo no existe en el repositorio. Tampoco existía en la versión original, que apuntaba a `assets/img/hero.jpg`. El sitio muestra el degradado oscuro. No se inventó ni se reemplazó la imagen.
- **Imágenes de productos:** el campo `image` de los productos está vacío en `backend/products.json`. Las tarjetas muestran el texto "Imagen próximamente". Cuando se agreguen imágenes, conviene usar rutas públicas como `/img/productos/nombre.jpg`.
- **Logo:** la versión original apuntaba a `assets/img/logo-powersport.png`, pero el archivo disponible es `imagen logo-powersport.jpeg`. En React se copió como `public/img/logo-powersport.jpeg` y se actualizó la ruta.
- **Datos de prueba:** en esta fase los productos y mensajes vienen de `frontend/src/data/`, no de la API. Se conectarán en la Fase 5.
- **Interactividad:** esta fase solo convierte el HTML en componentes. El menú móvil, el formulario de contacto, el botón "Ver producto" y el login del admin todavía no tienen eventos; se implementan en la Fase 4.

## Fase 4: interactividad con useState

- **Menú móvil:** funciona con estado de React (`menuAbierto`) y se cierra al elegir un enlace.
- **Botón "Ver producto":** mantiene el mismo `window.alert` de la versión original.
- **Formulario de contacto:** los campos son controlados y tienen validación local (nombre, correo y mensaje). El envío real a la API se conecta en la Fase 5.
- **Login del admin:** los campos son controlados y validan que no estén vacíos. El inicio de sesión real y el manejo del token se conectan en la Fase 5.
- **Stock del admin:** el campo numérico es controlado. El botón "Guardar" todavía no llama a la API; eso se conecta en la Fase 5.

## Fase 5: conexión con la API

- **`src/api.js`:** concentra las llamadas a la API con `VITE_API_URL`: productos, contacto, login, mensajes y stock. Si la respuesta no es correcta, lanza un error con el mensaje del backend.
- **Catálogo:** `Products.jsx` carga los productos con `useEffect`, muestra "Cargando productos..." y un mensaje de error si la API no responde.
- **Contacto:** el formulario envía los datos a `POST /api/contact`, muestra el mensaje del backend y limpia los campos al terminar.
- **Administración:** el login usa `POST /api/admin/login`, guarda el token en `sessionStorage` con la clave `ps_token` y el panel carga mensajes y productos desde la API. El cierre de sesión borra el token.
- **Stock:** el botón "Guardar" usa `PATCH /api/admin/products/:id/stock` con el token.
- **Datos de prueba:** se eliminaron `src/data/productos.js` y `src/data/mensajes.js`.
- **Mensaje de error del catálogo:** ya no escribe `http://localhost:3000` fijo dentro del componente; ahora es un texto genérico que funciona en local y en producción.

## Fase 6: limpieza y documentación

- **`.gitignore` raíz:** ignora `node_modules/`, `dist/`, `.env` y `.env.*`, pero conserva los `.env.example`.
- **README raíz:** explica requisitos, instalación, variables de entorno, cómo ejecutar las dos terminales y los endpoints.
- **CAMBIOS.md:** incluye la tabla comparativa entre la versión vanilla y React, además de los bugs y dudas.
- **Versión vanilla:** se movió a `_vanilla-original/` con `git mv` para conservarla como referencia.

## Fase 7: chatbot con Gemini

- **Backend:** `POST /api/chat` valida el mensaje, arma el historial reciente y consulta el catálogo actual para responder con precios y stock reales.
- **Seguridad:** `GEMINI_API_KEY` se lee solo en el backend; React nunca la recibe. Si falta, el endpoint responde 503 con un mensaje claro.
- **Frontend:** `Chatbot.jsx` es un botón flotante con panel, mensajes, input controlado, estado de "Escribiendo..." y errores. La llamada está en `api.js` como `enviarMensajeChat`.
- **Historial:** se envían como máximo los últimos 8 mensajes para que el asistente recuerde el contexto sin hacer peticiones gigantes.
- **Modelo:** se configura con `GEMINI_MODEL`; por defecto `gemini-2.0-flash`.
- **Sin SDK:** se usa `fetch` nativo de Node para no agregar dependencias al backend.

## Bugs y dudas encontrados

- **Imagen del hero:** `hero.jpg` no existe en el proyecto original ni en el nuevo. El hero muestra el degradado oscuro y Vite avisa durante el build. No se inventó una imagen.
- **Imágenes de productos:** el campo `image` está vacío en `backend/products.json`; las tarjetas muestran “Imagen próximamente”.
- **Logo:** el HTML original apuntaba a `assets/img/logo-powersport.png`, pero el archivo disponible es `imagen logo-powersport.jpeg`. En React se usa la copia `frontend/public/img/logo-powersport.jpeg`.
- **Backend sin carpeta `src/`:** el servidor quedó en `backend/server.js` porque así estaba el proyecto. Se mantuvo para no cambiar la lógica ni las rutas.
- **Sin React Router:** la tienda y el admin son dos entradas de Vite (`index.html` y `admin.html`). El enlace “Admin” hace una carga completa de página, no navegación interna de React.
- **Botón “Ver producto”:** conserva el `window.alert` original. Se puede cambiar por un modal en una mejora futura, pero no se cambió la lógica.
- **Live Server:** la carpeta `_vanilla-original/` conserva la versión anterior y no forma parte de la app React. Para probar la migración usa `http://localhost:5173`.
- **CORS:** en desarrollo el backend acepta `http://localhost:5173`. Si abres la app como `127.0.0.1`, el navegador puede bloquear las peticiones.
- **Token del admin:** dura 2 horas. Si vence, el panel vuelve al login y muestra “Tu sesión terminó. Ingresa de nuevo.”.
- **Versión vanilla:** los archivos antiguos se movieron a `_vanilla-original/` con `git mv` para conservarlos como referencia. La app React no los importa ni los incluye en el build.
- **Chatbot sin clave:** si `GEMINI_API_KEY` está vacía, el backend responde 503 y el chat muestra “El chatbot no está configurado...”. El resto de la tienda sigue funcionando.
- **Prueba real pendiente:** en el entorno de desarrollo no había `GEMINI_API_KEY`, así que se verificó el endpoint sin clave y la compilación del frontend, pero falta probar una respuesta real de Gemini.
- **Modelo de Gemini:** si Google retira `gemini-2.0-flash`, hay que cambiar `GEMINI_MODEL` en `backend/.env` por un modelo disponible.
- **Límite de peticiones:** el endpoint del chat no tiene rate limit. Para producción se puede agregar un límite por IP.
- **Secretos:** los archivos `.env` están ignorados por Git y no se muestran en la documentación. La clave de Gemini nunca se envía al navegador.
