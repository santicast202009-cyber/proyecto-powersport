# Cambios y observaciones

Registro de diferencias, decisiones y problemas detectados durante la migración a React.

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
