import Question from "../models/Question.js";

// GET /api/questions?world=math&difficulty=primaria&level=1
export const getQuestions = async (req, res) => {
  try {
    const { world, difficulty, level } = req.query;

    // Validar que vengan los 3 parámetros
    if (!world || !difficulty || !level) {
      return res.status(400).json({
        message: "Se requieren los parámetros: world, difficulty y level",
      });
    }

    const questions = await Question.find({
      world,
      difficulty,
      level: Number(level),
    }).select("-answer"); // NO mandamos la respuesta al frontend

    if (questions.length === 0) {
      return res.status(404).json({
        message: "No se encontraron preguntas para este nivel",
      });
    }

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener preguntas", error: error.message });
  }
};

// POST /api/questions/check — verifica si la respuesta es correcta
export const checkAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    if (!questionId || !answer) {
      return res.status(400).json({
        message: "Se requieren questionId y answer",
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }

    const isCorrect = question.answer === answer;

    res.json({
      correct: isCorrect,
      correctAnswer: question.answer, // solo se revela al confirmar
    });
  } catch (error) {
    res.status(500).json({ message: "Error al verificar respuesta", error: error.message });
  }
};
