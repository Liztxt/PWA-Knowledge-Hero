import express from "express";
import { getProgress, saveProgress } from "../controllers/progressController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/",        protect, getProgress);
router.post("/save",   protect, saveProgress);

export default router;