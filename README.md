# Auth App — React + Vite + JWT + Roles

Frontend de autenticación con roles `user` y `admin`, listo para conectar a un backend Node.js + Express + MongoDB.

## Estructura

```
src/
├── context/
│   └── AuthContext.jsx      # Estado global de autenticación + JWT
├── components/
│   └── ProtectedRoute.jsx   # Wrapper para rutas con verificación de rol
├── hooks/
│   └── useAuthFetch.js      # Hook para llamadas autenticadas al backend
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── Dashboard.jsx        # Vista para rol "user"
│   ├── AdminPanel.jsx       # Vista para rol "admin"
│   └── Auth.css
├── App.jsx
├── main.jsx
└── index.css
```

## Instalación

```bash
npm install
npm run dev
```

La app corre en `http://localhost:3000`

## Conectar al backend

El `AuthContext` ya apunta a `http://localhost:5000/api/auth/login` y `/register`.

Tu backend debe responder con este formato:

```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "...",
    "username": "juan",
    "email": "juan@correo.com",
    "role": "user"
  }
}
```

## Hacer llamadas autenticadas

```jsx
import { useAuthFetch } from "../hooks/useAuthFetch";

function MiComponente() {
  const { authFetch } = useAuthFetch();

  const getData = async () => {
    const data = await authFetch("/api/protected");
    console.log(data);
  };
}
```

El hook agrega el header `Authorization: Bearer <token>` automáticamente y
cierra sesión si el token expira (401).

## Agregar PWA (al final del proyecto)

```bash
npm install -D vite-plugin-pwa
```

En `vite.config.js`:
```js
import { VitePWA } from "vite-plugin-pwa";

plugins: [
  react(),
  VitePWA({
    registerType: "autoUpdate",
    manifest: {
      name: "Auth App",
      short_name: "AuthApp",
      theme_color: "#080b12",
      icons: [/* tus iconos */]
    }
  })
]
```
