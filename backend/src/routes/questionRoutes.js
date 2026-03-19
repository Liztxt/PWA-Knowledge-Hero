import { Router } from "express";
import { getQuestions, checkAnswer } from "../controllers/questionController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, getQuestions);
router.post("/check", protect, checkAnswer);

export default router;
