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

// Mensaje y avatar según desempeño
function getPerformance(correct, total) {
  const pct = correct / total;
  if (pct === 1)   return { msg: "¡Perfecto!", sub: "¡Respondiste todo correcto!", avatar: "🏆" };
  if (pct >= 0.75) return { msg: "¡Muy bien!", sub: "Casi lo tienes perfectamente", avatar: "⭐" };
  if (pct >= 0.5)  return { msg: "¡Buen intento!", sub: "Sigue practicando y lo lograrás", avatar: "💪" };
  return           { msg: "¡Sigue practicando!", sub: "La práctica hace al maestro", avatar: "📚" };
}

export default function ResultsPage({
  world,
  difficulty,
  level,
  points,
  correct,
  incorrect,
  total,
  username,
  onRepeat,
  onNextLevel,
  onHome,
}) {
  const precision = total > 0 ? Math.round((correct / total) * 100) : 0;
  const { msg, sub, avatar } = getPerformance(correct, total);
  const isLastLevel = level >= 20;

  return (
    <div className="results-wrapper">
      <div className="results-bg">
        <div className="results-orb results-orb-1" />
        <div className="results-orb results-orb-2" />
        <div className="results-dots" />
      </div>

      <div className="results-card">
        {/* Avatar y título */}
        <div className="results-top">
          <div className="results-avatar">{avatar}</div>
          <div className="results-title-block">
            <h1 className="results-title">{msg}</h1>
            <p className="results-sub">
              {sub}{username ? `, ${username}` : ""}
            </p>
          </div>
        </div>

        {/* Stats */}
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

        {/* Puntuación */}
        <div className="results-score-banner">
          <span className="results-score-context">
            {worldNames[world]} - {difficultyNames[difficulty]} · Nivel {level}
          </span>
          <span className="results-score-total">Puntuación total: {points} pts</span>
        </div>

        {/* Botones */}
        <div className="results-actions">
          <button className="results-btn results-btn--secondary" onClick={onRepeat}>
            🔄 Repetir nivel
          </button>
          {!isLastLevel && (
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
