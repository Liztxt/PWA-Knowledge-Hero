import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "El nombre de usuario es obligatorio"],
      unique: true,
      trim: true,
      minlength: [3, "El usuario debe tener al menos 3 caracteres"],
    },
   email: {
  type: String,
  unique: true,
  sparse: true, // permite múltiples documentos sin email
  lowercase: true,
  trim: true,
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
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  }
);

// Nunca devolver la contraseña en las respuestas JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);
