import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Este nombre de usuario ya está registrado" });
    }

    const hashedPassword = hashPassword(password);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en register:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const hashedPassword = hashPassword(password);
    console.log("Hash recibido:", hashedPassword);
console.log("Hash en BD:", user.password);
console.log("Son iguales:", hashedPassword === user.password);
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    if (user.deleteScheduledAt && new Date() >= user.deleteScheduledAt) {
      await User.findByIdAndDelete(user._id);
      return res.status(401).json({ message: "Tu cuenta fue eliminada por inactividad" });
    }
    
    const token = generateToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  return res.status(200).json({ user: req.user });
};
// PUT /api/auth/me — actualizar username y avatar
export const updateMe = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ message: "Ese nombre de usuario ya está en uso" });
      user.username = username;
    }

    if (avatar) user.avatar = avatar;

    await user.save();

    return res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar perfil", error: error.message });
  }
};

// DELETE /api/auth/me — programar eliminación en 20 días
export const scheduleDelete = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() + 20);
    user.deleteScheduledAt = deleteDate;
    await user.save();

    return res.json({
      message: "Cuenta programada para eliminación",
      deleteScheduledAt: user.deleteScheduledAt,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al programar eliminación", error: error.message });
  }
};

// POST /api/auth/cancel-delete — cancelar eliminación
export const cancelDelete = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.deleteScheduledAt = null;
    await user.save();

    return res.json({ message: "Eliminación cancelada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al cancelar eliminación", error: error.message });
  }
};