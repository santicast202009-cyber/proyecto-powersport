# PowerSport — tienda de suplementos deportivos

Proyecto académico dividido en **frontend (HTML, CSS y JavaScript)** y **backend (API REST con Express)**. El frontend conserva el diseño mobile-first y obtiene el catálogo desde el backend.

## Estructura

```text
proyecto-powersport/
├── index.html                 # Estructura de la interfaz
├── styles.css                 # Estilos responsive mobile-first
├── js/
│   └── main.js                # Menú móvil y consumo de la API
├── assets/img/                # Logo, banner e imágenes de productos
└── backend/
    ├── package.json
    └── src/
        ├── server.js          # Endpoints REST
        └── products.js        # Datos iniciales de demostración
```

---

# Parte 1 — Frontend: HTML, CSS y JavaScript

### HTML
`index.html` contiene el encabezado, hero, categorías, espacios para las tarjetas de productos, sección informativa y footer. Usa etiquetas semánticas como `header`, `nav`, `main`, `section`, `article` y `footer`.

### CSS
`styles.css` mantiene la paleta negra, roja y gris y el enfoque **mobile-first**: primero aplica reglas para móvil y después usa media queries para pantallas más anchas.

### JavaScript del navegador
`js/main.js`:
- Abre y cierra el menú móvil.
- Consulta `GET http://localhost:3000/api/products`.
- Renderiza las tarjetas de acuerdo con su categoría.
- Formatea los precios en pesos colombianos.
- Muestra un mensaje claro si la API no está disponible.

### Imágenes pendientes
El ZIP original no incluía imágenes de productos y el nombre del logo puede variar. Agrega las imágenes en estas rutas para que coincidan con los datos de ejemplo:

```text
assets/img/logo-powersport.png
assets/img/hero.jpg
assets/img/productos/bipro.jpg
assets/img/productos/megaplex.jpg
assets/img/productos/nitrotech.jpg
assets/img/productos/healthy-creatina.jpg
assets/img/productos/platinum-creatine.jpg
assets/img/productos/cellucor-creatine.jpg
assets/img/productos/c4.jpg
assets/img/productos/vaporx5.jpg
assets/img/productos/no-xplode.jpg
```

Si no están las imágenes, la página muestra un texto de reemplazo en las tarjetas. Los precios y el stock de ejemplo **no son cotizaciones reales**: actualízalos antes de publicar una tienda real.

---

# Parte 2 — Backend: API REST con Express

La API está en la carpeta `backend/`. Los productos de ejemplo están en `backend/src/products.js`. Por ahora se almacenan en memoria, no en una base de datos; por eso, cambios de alta, edición o eliminación se pierden al reiniciar el servidor.

## Requisitos
- Node.js 18 o superior
- npm

## Instalar y ejecutar
Abre una terminal dentro de `backend/` y ejecuta:

```bash
npm install
npm run dev
```

Si `npm run dev` no está disponible, ejecuta `npm start`. La API quedará en `http://localhost:3000`.

## Endpoints

| Método | Ruta | Uso |
|---|---|---|
| GET | `/api/products` | Lista todos los productos |
| GET | `/api/products?category=proteina` | Filtra por categoría (`proteina`, `creatina`, `preentreno`) |
| GET | `/api/products?search=bipro` | Busca por nombre, marca o descripción |
| GET | `/api/products/:id` | Obtiene un producto por ID |
| POST | `/api/products` | Crea un producto y devuelve HTTP 201 |
| PUT | `/api/products/:id` | Actualiza un producto existente |
| DELETE | `/api/products/:id` | Elimina un producto |

### Ejemplo de producto para POST

```json
{
  "id": "protein-demo",
  "name": "Proteína de demostración",
  "brand": "Marca ejemplo",
  "category": "proteina",
  "description": "Producto de prueba para el proyecto.",
  "price": 100000,
  "stock": 5,
  "image": "assets/img/productos/protein-demo.jpg"
}
```

Prueba primero `GET http://localhost:3000/api/products` en el navegador. Para crear, editar o eliminar puedes usar Postman, Thunder Client o `curl`.

## Abrir el frontend
Con el backend ejecutándose, abre la carpeta raíz del proyecto en VS Code y ejecuta `index.html` con Live Server. Live Server normalmente utiliza el puerto 5500 y la API el 3000. CORS está habilitado para facilitar el desarrollo local.

## Antes de usarlo en producción
- Persistir productos en una base de datos.
- Añadir autenticación y autorización para las operaciones POST, PUT y DELETE.
- Validar y limitar las entradas con más rigor.
- Configurar CORS con el dominio real del frontend.
- Usar precios, stock, imágenes y datos comerciales verificados.
- Implementar carrito, pedidos y pagos como módulos separados; todavía no están implementados.
