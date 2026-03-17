import { Router } from "express";
import { register, login, getMe, updateMe, scheduleDelete, cancelDelete } from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", (req, res, next) => {
  console.log("Ruta login alcanzada:", req.body);
  next();
}, login);

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);               
router.delete("/me", protect, scheduleDelete);       
router.post("/cancel-delete", protect, cancelDelete); 

router.get("/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: `Hola admin ${req.user.username}, acceso concedido ✓` });
});

export default router;
