import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import questionRoutes from "./src/routes/questionRoutes.js";
import progressRoutes from "./src/routes/progressRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Origen no permitido por CORS"));
  },
  credentials: true,
}));

app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Demasiados intentos, espera 15 minutos" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rutas
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/progress", progressRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Backend KnowledgeHero funcionando ✓" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});