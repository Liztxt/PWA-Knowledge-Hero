import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    world: {
      type: String,
      required: [true, "El mundo es obligatorio"],
      enum: ["math", "spanish", "english"],
    },
    difficulty: {
      type: String,
      required: [true, "La dificultad es obligatoria"],
      enum: ["primaria", "secundaria", "avanzado"],
    },
    level: {
      type: Number,
      required: [true, "El nivel es obligatorio"],
      min: 1,
      max: 20,
    },
    question: {
      type: String,
      required: [true, "La pregunta es obligatoria"],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, "Las opciones son obligatorias"],
      validate: {
        validator: (arr) => arr.length === 4,
        message: "Debe haber exactamente 4 opciones",
      },
    },
    answer: {
      type: String,
      required: [true, "La respuesta es obligatoria"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Question", questionSchema);
