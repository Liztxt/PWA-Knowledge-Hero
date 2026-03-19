import { useEffect } from "react";
import confetti from "canvas-confetti";
import { playLevelComplete } from "../utils/sounds.js";
import "./Results.css";

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

export default function ResultsPage({
  world,
  difficulty,
  level,
  points,
  correct,
  incorrect,
  total,
  username,
  stars = 0,
  passed = true,
  onRepeat,
  onNextLevel,
  onHome,
}) {
  const precision = total > 0 ? Math.round((correct / total) * 100) : 0;
  const isLastLevel = level >= 20;

  useEffect(() => {
    if (stars === 3) {
      playLevelComplete();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#a855f7", "#ec4899", "#fbbf24", "#60a5fa", "#34d399"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 120,
          origin: { y: 0.5, x: 0.2 },
          colors: ["#a855f7", "#fbbf24"],
        });
        confetti({
          particleCount: 80,
          spread: 120,
          origin: { y: 0.5, x: 0.8 },
          colors: ["#ec4899", "#60a5fa"],
        });
      }, 500);
    }
  }, [stars]);

  function getPerformance() {
    if (!passed) return { msg: "¡Inténtalo de nuevo!", sub: "Máximo 1 error para pasar el nivel", avatar: "😅" };
    const pct = correct / total;
    if (pct === 1)   return { msg: "¡Perfecto!",  sub: "¡Respondiste todo correcto!", avatar: "🏆" };
    if (pct >= 0.75) return { msg: "¡Muy bien!", sub: "Casi lo tienes perfectamente", avatar: "⭐" };
    return             { msg: "¡Pasaste!", sub: "Sigue practicando para mejorar", avatar: "💪" };
  }

  const { msg, sub, avatar } = getPerformance();

  return (
    <div className="results-wrapper">
      <div className="results-bg">
        <div className="results-orb results-orb-1" />
        <div className="results-orb results-orb-2" />
        <div className="results-dots" />
      </div>

      <div className="results-card">
        <div className="results-top">
          <div className="results-avatar">{avatar}</div>
          <div className="results-title-block">
            <h1 className="results-title">{msg}</h1>
            <p className="results-sub">
              {sub}{username ? `, ${username}` : ""}
            </p>
          </div>
        </div>

        <div className="results-stats">
          <div className="results-stat results-stat--blue">
            <span className="results-stat-num">{incorrect}</span>
            <span className="results-stat-label">Incorrectas</span>
          </div>
          <div className="results-stat results-stat--green">
            <span className="results-stat-num">{correct}</span>
            <span className="results-stat-label">Correctas</span>
          </div>
          <div className="results-stat results-stat--yellow">
            <span className="results-stat-num">{precision}%</span>
            <span className="results-stat-label">Precisión</span>
          </div>
        </div>

        <div className="results-score-banner">
          <span className="results-score-context">
            {worldNames[world]} - {difficultyNames[difficulty]} · Nivel {level}
          </span>
          <div className="results-stars">
            {[1, 2, 3].map((s) => (
              <span key={s} style={{ fontSize: "2rem", color: s <= stars ? "#f5c518" : "#ccc" }}>★</span>
            ))}
          </div>
        </div>

        <div className="results-actions">
          <button className="results-btn results-btn--secondary" onClick={onRepeat}>
            🔄 Repetir nivel
          </button>
          {passed && !isLastLevel && (
            <button className="results-btn results-btn--primary" onClick={onNextLevel}>
              Siguiente nivel →
            </button>
          )}
          <button className="results-btn results-btn--secondary" onClick={onHome}>
            🏠 Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}