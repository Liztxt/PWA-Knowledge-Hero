import { useState, useEffect, useRef } from "react";
import { playCorrect, playIncorrect } from "../utils/sounds.js";
import "./Quiz.css";

const API = import.meta.env.VITE_API_URL;

const worldNames = {
  math: "Matemáticas",
  spanish: "Español",
  english: "Inglés",
};

const difficultyNames = {
  primaria: "Primaria",
  secundaria: "Secundaria",
  avanzado: "Avanzado",
};

export default function QuizPage({ world, difficulty, level, onFinish, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [points, setPoints] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false); // ← nuevo

  const pointsRef    = useRef(0);
  const correctRef   = useRef(0);
  const incorrectRef = useRef(0);
  const [timeLeft, setTimeLeft] = useState(20);
const timerRef = useRef(null);

const resetTimer = () => {
  clearInterval(timerRef.current);
  setTimeLeft(45);
  timerRef.current = setInterval(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        clearInterval(timerRef.current);
        handleTimeOut();
        return 0;
      }
      return t - 1;
    });
  }, 1000);
};
const handleTimeOut = () => {
  if (feedback) return;
  playIncorrect();
  setFeedback("incorrect");
  setIncorrect((i) => { incorrectRef.current = i + 1; return i + 1; });

  setTimeout(() => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setFeedback(null);
      setCorrectAnswer(null);
      resetTimer();
    } else {
      onFinish({
        points:    pointsRef.current,
        correct:   correctRef.current,
        incorrect: incorrectRef.current,
        total:     questions.length,
      });
    }
  }, 1500);
};
useEffect(() => {
  if (questions.length > 0 && !loading) {
    resetTimer();
  }
  return () => clearInterval(timerRef.current);
}, [questions, current]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API}/api/questions?world=${world}&difficulty=${difficulty}&level=${level}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("No se pudieron cargar las preguntas");
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [world, difficulty, level]);

  const handleSelect = (option) => {
    if (feedback) return;
    setSelected(option);
  };

  const handleConfirm = async () => {
    if (!selected || feedback) return;
    clearInterval(timerRef.current);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/questions/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: questions[current]._id,
          answer: selected,
        }),
      });

      const data = await res.json();
      setCorrectAnswer(data.correctAnswer);

      if (data.correct) {
        setFeedback("correct");
        playCorrect();
        setPoints((p) => { pointsRef.current = p + 10; return p + 10; });
        setCorrect((c) => { correctRef.current = c + 1; return c + 1; });
      } else {
        setFeedback("incorrect");
        playIncorrect(); 
        setIncorrect((i) => { incorrectRef.current = i + 1; return i + 1; });
      }

      setTimeout(() => {
        if (current + 1 < questions.length) {
          setCurrent((c) => c + 1);
          setSelected(null);
          setFeedback(null);
          setCorrectAnswer(null);
        } else {
          onFinish({
            points:    pointsRef.current,
            correct:   correctRef.current,
            incorrect: incorrectRef.current,
            total:     questions.length,
          });
        }
      }, 1500);
    } catch (err) {
      console.error("Error al verificar respuesta:", err);
    }
  };

  if (loading) {
    return (
      <div className="quiz-wrapper">
        <div className="quiz-loading">Cargando preguntas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-wrapper">
        <div className="quiz-error">
          <p>{error}</p>
          <button onClick={onBack}>← Regresar</button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  const getOptionClass = (option) => {
    if (!feedback) {
      return selected === option ? "quiz-option selected" : "quiz-option";
    }
    if (option === correctAnswer) return "quiz-option correct";
    if (option === selected && feedback === "incorrect") return "quiz-option incorrect";
    return "quiz-option";
  };

  return (
    <div className="quiz-wrapper">
      <div className="quiz-bg">
        <div className="quiz-orb quiz-orb-1" />
        <div className="quiz-orb quiz-orb-2" />
        <div className="quiz-dots" />
      </div>

      {/* Modal de confirmación de salida */}
      {showExitConfirm && (
        <div className="quiz-exit-overlay">
          <div className="quiz-exit-modal">
            <p className="quiz-exit-icon">⚠️</p>
            <h3 className="quiz-exit-title">¿Salir del nivel?</h3>
            <p className="quiz-exit-desc">
              Si sales ahora perderás tu progreso en este intento y tendrás que empezar de nuevo.
            </p>
            <div className="quiz-exit-actions">
              <button className="quiz-exit-btn quiz-exit-btn--cancel" onClick={() => setShowExitConfirm(false)}>
                Seguir jugando
              </button>
              <button className="quiz-exit-btn quiz-exit-btn--confirm" onClick={onBack}>
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="quiz-content">
        <div className="quiz-breadcrumb">
          <button className="quiz-back" onClick={() => setShowExitConfirm(true)}>←</button>
          <span>{worldNames[world]} &gt; {difficultyNames[difficulty]} &gt; Nivel {level}</span>
        </div>

        <div className="quiz-header">
  <div className="quiz-header-inner">
    <div className="quiz-points-badge">{points} pts</div>
    <div className={`quiz-timer ${timeLeft <= 5 ? "quiz-timer--urgent" : ""}`}>
      ⏱ {timeLeft}s
    </div>
    <div className="quiz-trophy">🏆</div>
  </div>
</div>

        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="quiz-card">
          <p className="quiz-counter">{current + 1} / {questions.length}</p>
          <h2 className="quiz-question">{q.question}</h2>

          <div className="quiz-options">
            {q.options.map((option) => (
              <button
                key={option}
                className={getOptionClass(option)}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          className={`quiz-confirm ${!selected || feedback ? "quiz-confirm--disabled" : ""}`}
          onClick={handleConfirm}
          disabled={!selected || !!feedback}
        >
          {feedback === "correct"
            ? "✓ ¡Correcto!"
            : feedback === "incorrect"
            ? "✗ Incorrecto"
            : "Confirmar respuesta"}
        </button>
      </div>
    </div>
  );
}