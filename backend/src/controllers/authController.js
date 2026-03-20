import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Filter } from "bad-words";
import User from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};
const filter = new Filter();

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, password, role, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
if (!usernameRegex.test(username)) {
  return res.status(400).json({
    message: "El usuario solo puede tener letras, números y _ (3-20 caracteres)"
  });
}

// Validar contraseña fuerte
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message: "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número"
  });
}
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Este nombre de usuario ya está registrado" });
    }

if (filter.isProfane(username)) {
  return res.status(400).json({
    message: "El nombre de usuario no está permitido"
  });
}
    const hashedPassword = await argon2.hash(password);

    const user = await User.create({
      username,
      password: hashedPassword,
      email: email || null,
      role: "user", 
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

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
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
        avatar: user.avatar, 
    email: user.email,
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
    const { username, avatar, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ message: "Ese nombre de usuario ya está en uso" });
      user.username = username;
    }

    if (avatar) user.avatar = avatar;
    if (email !== undefined) user.email = email || null;

    await user.save();

    return res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        email: user.email, 
      },
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