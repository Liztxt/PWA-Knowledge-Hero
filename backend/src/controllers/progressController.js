import User from "../models/User.js";

// GET /api/progress — obtener progreso completo del usuario
export const getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("totalPoints progress username");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener progreso", error: error.message });
  }
};

// POST /api/progress/save — guardar resultado de un nivel
// Body: { world, difficulty, level, stars, pointsEarned }
export const saveProgress = async (req, res) => {
  try {
    const { world, difficulty, level, stars, pointsEarned } = req.body;

    if (!world || !difficulty || !level || stars === undefined) {
      return res.status(400).json({ message: "Faltan campos: world, difficulty, level, stars" });
    }
    if (!["math", "spanish", "english"].includes(world)) {
      return res.status(400).json({ message: "world inválido" });
    }
    if (!["primaria", "secundaria", "avanzado"].includes(difficulty)) {
      return res.status(400).json({ message: "difficulty inválida" });
    }
    if (stars < 0 || stars > 3) {
      return res.status(400).json({ message: "stars debe ser entre 0 y 3" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    let worldProgress = user.progress[world].find(w => w.difficulty === difficulty);

    if (!worldProgress) {
      user.progress[world].push({ difficulty, levels: [] });
      worldProgress = user.progress[world].find(w => w.difficulty === difficulty);
    }

    const existingLevel = worldProgress.levels.find(l => l.level === level);

    if (existingLevel) {
      if (stars > existingLevel.stars) {
        const extraPoints = (stars - existingLevel.stars) * 10;
        existingLevel.stars = stars;
        existingLevel.completed = true;
        user.totalPoints += extraPoints;
      }
    } else {
      worldProgress.levels.push({ level, stars, completed: stars > 0 });
      user.totalPoints += (pointsEarned || stars * 10);
    }

    user.markModified("progress"); 
    await user.save();

    res.json({
      message: "Progreso guardado",
      totalPoints: user.totalPoints,
      progress: user.progress[world],
    });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar progreso", error: error.message });
  }
};