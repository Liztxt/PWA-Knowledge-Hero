import User from "../models/User.js";

function updateStreak(user) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!user.lastActivityDate) {
    user.streak = 1;
    user.lastActivityDate = today;
    return;
  }

  const last = new Date(user.lastActivityDate);
  const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
  const diffDays = Math.round((today - lastDay) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return;
  if (diffDays === 1) user.streak += 1;
  else if (diffDays > 4) user.streak = 0;

  user.lastActivityDate = today;
}

// GET /api/progress
export const getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("totalPoints progress username streak lastActivityDate");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (user.lastActivityDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const last = new Date(user.lastActivityDate);
      last.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
      if (diffDays > 4 && user.streak > 0) {
        user.streak = 0;
        await user.save();
      }
    }

    res.json({
      totalPoints: user.totalPoints,
      progress: user.progress,
      username: user.username,
      streak: user.streak,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener progreso", error: error.message });
  }
};

// POST /api/progress/save
export const saveProgress = async (req, res) => {
  try {
    console.log("Body recibido:", req.body);
    const { world, difficulty, level, stars, pointsEarned, isTheory } = req.body;

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
      // Nivel ya existe — actualizar
      if (isTheory && !existingLevel.completed) {
        existingLevel.completed = true;
      } else if (stars > existingLevel.stars) {
        const extraPoints = (stars - existingLevel.stars) * 10;
        existingLevel.stars = stars;
        existingLevel.completed = true;
        user.totalPoints += extraPoints;
      }
    } else {
      // ← Este bloque faltaba — nivel nuevo
      worldProgress.levels.push({
        level,
        stars,
        completed: stars > 0 || isTheory,
      });
      if (!isTheory) {
        user.totalPoints += (pointsEarned || stars * 10);
      }
    }

    updateStreak(user);
    user.markModified("progress");
    await user.save();

    res.json({
      message: "Progreso guardado",
      totalPoints: user.totalPoints,
      streak: user.streak,
      progress: user.progress[world],
    });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar progreso", error: error.message });
  }
};

export const resetProgress = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        totalPoints: 0,
        streak: 0,
        "progress.math": [],
        "progress.spanish": [],
        "progress.english": [],
      }
    });
    res.json({ message: "Progreso reseteado" });
  } catch (error) {
    res.status(500).json({ message: "Error al resetear", error: error.message });
  }
};