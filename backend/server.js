import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import questionRoutes from "./src/routes/questionRoutes.js";
import progressRoutes from "./src/routes/progressRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Seguridad básica
app.use(helmet());

// Rate limiting general — 100 requests por 15 minutos por IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Demasiadas peticiones, intenta más tarde" },
});

// Rate limiting estricto para login/register — 10 intentos por 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Demasiados intentos, espera 15 minutos" },
});

app.use(generalLimiter);

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "10kb" })); // limita el tamaño del body

// Rutas
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/progress", progressRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Backend KnowledgeHero funcionando ✓" });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});

