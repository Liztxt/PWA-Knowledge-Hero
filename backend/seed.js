import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

// Para poder usar __dirname con ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el JSON de preguntas
const questions = JSON.parse(
  readFileSync(path.join(__dirname, "math_questions.json"), "utf-8")
);

// Schema de pregunta
const questionSchema = new mongoose.Schema({
  world:      { type: String, required: true },
  difficulty: { type: String, required: true },
  level:      { type: Number, required: true },
  question:   { type: String, required: true },
  options:    { type: [String], required: true },
  answer:     { type: String, required: true },
});

const Question = mongoose.model("Question", questionSchema);

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado ✓");

    // Borra solo las preguntas de math para evitar duplicados
    await Question.deleteMany({ world: "math" });
    console.log("Preguntas anteriores de math eliminadas ✓");

    await Question.insertMany(questions);
    console.log(`✅ ${questions.length} preguntas importadas correctamente`);

  } catch (error) {
    console.error("❌ Error al importar preguntas:", error.message);
  } finally {
    mongoose.disconnect();
    console.log("Conexión cerrada ✓");
  }
};

seed();
