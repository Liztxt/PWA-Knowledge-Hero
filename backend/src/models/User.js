  import mongoose from "mongoose";

  const levelProgressSchema = new mongoose.Schema({
    level: { type: Number, required: true },
    stars: { type: Number, default: 0, min: 0, max: 3 },
    completed: { type: Boolean, default: false },
  }, { _id: false });

  const worldProgressSchema = new mongoose.Schema({
    difficulty: { type: String, enum: ["primaria", "secundaria", "avanzado"] },
    levels: [levelProgressSchema],
  }, { _id: false });

  const userSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio"],
        unique: true,
        trim: true,
        minlength: [3, "El usuario debe tener al menos 3 caracteres"],
      },
      password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
      totalPoints: {
        type: Number,
        default: 0,
      },
      progress: {
        math:    { type: [worldProgressSchema], default: [] },
        spanish: { type: [worldProgressSchema], default: [] },
        english: { type: [worldProgressSchema], default: [] },
      },
      lastActivityDate: {
        type: Date,
        default: null,
      },
      streak: {
        type: Number,
        default: 0,
      },
      avatar: {
        type: String,
        default: "🤖",
      },
      deleteScheduledAt: {
        type: Date,
        default: null,
      },
    },
    { timestamps: true }
  );

  export default mongoose.model("User", userSchema);
