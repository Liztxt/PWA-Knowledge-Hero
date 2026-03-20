import "./Completion.css";

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

export default function CompletionPage({ world, difficulty, totalPoints, onHome, onNextDifficulty, isLastDifficulty }) {
  return (
    <div className="comp-wrapper">
      <div className="comp-bg">
        <div className="comp-orb comp-orb-1" />
        <div className="comp-orb comp-orb-2" />
        <div className="comp-dots" />
      </div>

      <div className="comp-card">
        <div className="comp-trophy">🏆</div>
        <h1 className="comp-title">¡Felicitaciones!</h1>
        <p className="comp-sub">
          Completaste todos los niveles de
        </p>
        <div className="comp-badge">
          {worldNames[world]} — {difficultyNames[difficulty]}
        </div>

        <div className="comp-stats">
          <div className="comp-stat">
            <span className="comp-stat-num">20</span>
            <span className="comp-stat-label">Niveles completados</span>
          </div>
          <div className="comp-stat-div" />
          <div className="comp-stat">
            <span className="comp-stat-num">{totalPoints}</span>
            <span className="comp-stat-label">Puntos totales</span>
          </div>
        </div>

        <div className="comp-actions">
          {!isLastDifficulty && (
            <button className="comp-btn comp-btn--primary" onClick={onNextDifficulty}>
              Siguiente dificultad →
            </button>
          )}
          <button className="comp-btn comp-btn--secondary" onClick={onHome}>
            🏠 Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}