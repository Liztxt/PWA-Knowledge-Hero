import { Router } from "express";
import { getQuestions, checkAnswer } from "../controllers/questionController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Rutas protegidas — solo usuarios autenticados
router.get("/", protect, getQuestions);
router.post("/check", protect, checkAnswer);

export default router;
