# Cambios y observaciones

Registro de diferencias, decisiones y problemas detectados durante la migración a React.

## Fase 3: componentes de la página

- **Imagen de fondo del hero:** `frontend/src/index.css` referencia `/img/hero.jpg`, pero ese archivo no existe en el repositorio. Tampoco existía en la versión original, que apuntaba a `assets/img/hero.jpg`. El sitio muestra el degradado oscuro. No se inventó ni se reemplazó la imagen.
- **Imágenes de productos:** el campo `image` de los productos está vacío en `backend/products.json`. Las tarjetas muestran el texto "Imagen próximamente". Cuando se agreguen imágenes, conviene usar rutas públicas como `/img/productos/nombre.jpg`.
- **Logo:** la versión original apuntaba a `assets/img/logo-powersport.png`, pero el archivo disponible es `imagen logo-powersport.jpeg`. En React se copió como `public/img/logo-powersport.jpeg` y se actualizó la ruta.
- **Datos de prueba:** en esta fase los productos y mensajes vienen de `frontend/src/data/`, no de la API. Se conectarán en la Fase 5.
- **Interactividad:** esta fase solo convierte el HTML en componentes. El menú móvil, el formulario de contacto, el botón "Ver producto" y el login del admin todavía no tienen eventos; se implementan en la Fase 4.
