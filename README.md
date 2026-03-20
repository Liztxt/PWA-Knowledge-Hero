# 🏆 KnowledgeHero

Plataforma educativa interactiva tipo juego para reforzar conocimientos en **Matemáticas**, **Español** e **Inglés**. Diseñada para estudiantes de primaria a preparatoria, funciona como PWA y está alineada con los ODS 4 y ODS 10 de la ONU.

---

## ✨ Características principales

- 3 mundos · 3 dificultades · 20 niveles cada uno
- Páginas de teoría antes de cada bloque de niveles
- Sistema de estrellas (1-3) según desempeño
- Niveles progresivos — se desbloquean al completar el anterior
- Racha de días consecutivos jugando
- Contador de tiempo por pregunta (45 segundos)
- Progreso guardado en la nube
- Perfil personalizable con avatar
- Modo oscuro/claro
- Diseño responsive (móvil, tablet, escritorio)

---

## 🛠️ Tecnologías

| Frontend | Backend | Base de datos |
|----------|---------|---------------|
| React 18 + Vite | Node.js + Express | MongoDB Atlas |
| Framer Motion | JWT + Argon2 | Mongoose |
| Canvas Confetti | Helmet + Rate Limit | |

---

## 🎮 Cómo funciona

1. Regístrate con usuario y contraseña
2. Elige un mundo: Matemáticas, Español o Inglés
3. Selecciona dificultad: Primaria, Secundaria o Avanzado
4. Lee la teoría en los niveles 1, 6, 11 y 16
5. Responde las preguntas — máximo 1 error para pasar
6. Gana estrellas y desbloquea el siguiente nivel

---

## 🚀 Cómo usarlo

```bash
# 1. Instalar dependencias del backend
cd backend && npm install

# 2. Crear archivo backend/.env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=tu_secreto
FRONTEND_URL=http://localhost:3000

# 3. Cargar preguntas
node seed.js

# 4. Iniciar backend
npm run dev

# 5. Instalar dependencias del frontend
cd .. && npm install

# 6. Crear archivo .env en la raíz
VITE_API_URL=http://localhost:5000

# 7. Iniciar frontend
npm run dev
```

App disponible en `http://localhost:3000`

---

Desarrollado por **Lisett Bracamontes** 
