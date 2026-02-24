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

La app corre en `http://localhost:3000`