import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);

// Ruta protegida — cualquier usuario autenticado
router.get("/me", protect, getMe);

// Ruta protegida — solo admin
router.get("/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: `Hola admin ${req.user.username}, acceso concedido ✓` });
});

export default router;
