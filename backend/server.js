import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import questionRoutes from "./src/routes/questionRoutes.js";
import progressRoutes from "./src/routes/progressRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
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