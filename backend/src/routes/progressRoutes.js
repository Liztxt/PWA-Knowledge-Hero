import express from "express";
import { getProgress, saveProgress, resetProgress } from "../controllers/progressController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/",        protect, getProgress);
router.post("/save",   protect, saveProgress);
router.delete("/reset", protect, resetProgress);

export default router;