# PowerSport — tienda de suplementos deportivos

Proyecto full stack con:

- **Frontend:** React 19 + Vite, JavaScript y CSS reutilizado de la versión original.
- **Backend:** Node.js, Express 5 y MongoDB con Mongoose.

El catálogo, el formulario de contacto y el panel de administración consumen una API REST real.

## Estructura

```text
Proyecto-powersport/
├── backend/
│   ├── models/
│   │   ├── Message.js
│   │   └── Product.js
│   ├── products.json       # Productos iniciales para la base de datos
│   ├── server.js           # API REST
│   ├── validators.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/img/         # Logo e imágenes públicas
│   ├── src/
│   │   ├── components/     # Componentes de la tienda y del admin
│   │   ├── api.js          # Todas las llamadas a la API
│   │   ├── App.jsx
│   │   ├── admin-main.jsx
│   │   └── index.css
│   ├── admin.html
│   ├── index.html
│   ├── .env.example
│   └── package.json
├── _vanilla-original/      # Versión anterior en HTML/CSS/JS (solo referencia)
├── CAMBIOS.md
└── README.md
```

## Requisitos

- Node.js 18 o superior.
- npm.
- MongoDB local ejecutándose en `127.0.0.1:27017`.
- La base de datos se llama `powersport`.

## Instalación

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Variables de entorno

No subas los archivos `.env` a Git. Usa los `.env.example` como plantilla.

### `backend/.env`

Copia `backend/.env.example` como `backend/.env` y completa:

| Variable | Uso |
|---|---|
| `MONGODB_URI` | Cadena de conexión local, por ejemplo `mongodb://127.0.0.1:27017/powersport` |
| `PORT` | Puerto del backend, por defecto `3000` |
| `ADMIN_USER` | Usuario del panel de administración |
| `ADMIN_PASSWORD` | Contraseña del panel de administración |
| `JWT_SECRET` | Frase larga para firmar el token de sesión |
| `CORS_ORIGIN` | Origen permitido, por ejemplo `http://localhost:5173` |
| `GEMINI_API_KEY` | Se usará en la fase del chatbot |
| `GEMINI_MODEL` | Modelo de Gemini, por ejemplo `gemini-2.0-flash` |

### `frontend/.env`

Copia `frontend/.env.example` como `frontend/.env`:

```text
VITE_API_URL=http://localhost:3000
```

## Cómo ejecutar el proyecto

Se necesitan **dos terminales**.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Debe aparecer:

```text
MongoDB conectado.
Servidor en http://localhost:3000
```

Para ejecutarlo sin modo de desarrollo:

```bash
npm start
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Abre exactamente:

```text
http://localhost:5173
```

No uses Live Server ni el puerto 5500 para la versión React: Vite sirve el frontend en el puerto 5173.

El panel de administración está en:

```text
http://localhost:5173/admin.html
```

## Versión anterior (vanilla)

La carpeta `_vanilla-original/` conserva la tienda y el admin anteriores en HTML, CSS y JavaScript. No se usa para ejecutar la versión React; queda como referencia. Para probar el proyecto actual usa siempre `frontend/` y `http://localhost:5173`.

## Scripts del frontend

| Comando | Uso |
|---|---|
| `npm run dev` | Servidor de desarrollo con Vite |
| `npm run build` | Compila la versión de producción en `dist/` |
| `npm run lint` | Revisa el código con Oxlint |
| `npm run preview` | Sirve localmente la versión compilada |

## API

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/products` | Lista los productos |
| `POST` | `/api/contact` | Guarda un mensaje de contacto |
| `POST` | `/api/admin/login` | Inicia sesión y devuelve un token |
| `GET` | `/api/admin/messages` | Lista los mensajes (requiere token) |
| `PATCH` | `/api/admin/products/:id/stock` | Actualiza el stock (requiere token) |

Los endpoints del administrador esperan el encabezado:

```text
Authorization: Bearer <token>
```

## Notas

- Al iniciar el backend, si la base de datos está vacía se cargan los 7 productos de `backend/products.json`.
- Las imágenes de los productos están vacías, por eso las tarjetas muestran “Imagen próximamente”.
- La imagen `hero.jpg` no existe en el repositorio; el hero muestra el degradado oscuro.
- El token de administración se guarda en `sessionStorage` con la clave `ps_token`.
- El chatbot y el despliegue en Netlify/Render quedan pendientes.
- La carpeta `_vanilla-original/` no forma parte del build ni del despliegue.
