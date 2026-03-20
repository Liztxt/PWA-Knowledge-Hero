import { useProgress } from "../context/ProgressContext";
import "./LevelSelect.css";

const difficultyNames = {
  primaria: "Primaria",
  secundaria: "Secundaria",
  avanzado: "Avanzado",
};

const worldNames = {
  math: "Matemáticas",
  spanish: "Español",
  english: "Inglés",
};

const THEORY_LEVELS = [1, 6, 11, 16];

function StarRating({ stars }) {
  return (
    <div className="ns-stars">
      {[1, 2, 3].map((s) => (
        <span key={s} className={s <= stars ? "ns-star filled" : "ns-star"}>★</span>
      ))}
    </div>
  );
}

export default function NivelSelectPage({ world, difficulty, onBack, onSelectLevel }) {
  const { getLevelStars, isLevelUnlocked, isLevelCompleted } = useProgress();

  const levels = Array.from({ length: 20 }, (_, i) => {
    const levelNum = i + 1;
    return {
      id: levelNum,
      stars: getLevelStars(world, difficulty, levelNum),
      unlocked: isLevelUnlocked(world, difficulty, levelNum),
      completed: isLevelCompleted(world, difficulty, levelNum),
    };
  });

  return (
    <div className="ns-wrapper">
      <div className="ns-bg">
        <div className="ns-orb ns-orb-1" />
        <div className="ns-orb ns-orb-2" />
        <div className="ns-dots" />
      </div>

      <div className="ns-content">
        <button className="ns-back-btn" onClick={onBack}>← Regresar</button>

        <div className="ns-header">
          <h1 className="ns-title">{worldNames[world] || world}</h1>
          <span className="ns-badge">{difficultyNames[difficulty] || difficulty}</span>
        </div>
        <p className="ns-subtitle">Selecciona un nivel para comenzar</p>

        <div className="ns-grid">
          {levels.map((level) => (
            <button
              key={level.id}
              className={`ns-card 
                ${level.completed ? "ns-card--done" : ""} 
                ${!level.unlocked ? "ns-card--locked" : ""}
              `}
              onClick={() => level.unlocked && onSelectLevel(level.id)}
              disabled={!level.unlocked}
            >
              {level.unlocked ? (
                <>
                  <span className="ns-card-num">{level.id}</span>
                  <span className="ns-card-label">Nivel {level.id}</span>
                  {THEORY_LEVELS.includes(level.id) ? (
                    <span style={{
                      fontSize: "0.75rem",
                      color: level.completed ? "#16a34a" : "#aaa",
                      fontWeight: 700
                    }}>
                      {level.completed ? "✓ Teoría" : "📖 Teoría"}
                    </span>
                  ) : (
                    <StarRating stars={level.stars} />
                  )}
                </>
              ) : (
                <>
                  <span className="ns-card-num">🔒</span>
                  <span className="ns-card-label">Nivel {level.id}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}