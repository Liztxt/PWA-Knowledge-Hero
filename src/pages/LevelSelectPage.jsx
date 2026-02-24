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

// 20 niveles, cada uno agrupa 3-5 preguntas
const levels = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Nivel ${i + 1}`,
  questions: Math.floor(Math.random() * 3) + 3, // 3, 4 o 5 preguntas
  completed: false, // puedes manejar esto desde contexto/props después
  stars: 0, // 0-3 estrellas según desempeño
}));

function StarRating({ stars }) {
  return (
    <div className="ns-stars">
      {[1, 2, 3].map((s) => (
        <span key={s} className={s <= stars ? "ns-star filled" : "ns-star"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function NivelSelectPage({ world, difficulty, onBack, onSelectLevel }) {
  return (
    <div className="ns-wrapper">
      <div className="ns-bg">
        <div className="ns-orb ns-orb-1" />
        <div className="ns-orb ns-orb-2" />
        <div className="ns-dots" />
      </div>

      <div className="ns-content">
        <button className="ns-back-btn" onClick={onBack}>
          ← Regresar
        </button>

        <div className="ns-header">
          <h1 className="ns-title">{worldNames[world] || world}</h1>
          <span className="ns-badge">{difficultyNames[difficulty] || difficulty}</span>
        </div>
        <p className="ns-subtitle">Selecciona un nivel para comenzar</p>

        <div className="ns-grid">
          {levels.map((level) => (
            <button
              key={level.id}
              className={`ns-card ${level.completed ? "ns-card--done" : ""}`}
              onClick={() => onSelectLevel(level.id)}
            >
              <span className="ns-card-num">{level.id}</span>
              <span className="ns-card-label">{level.name}</span>
              <span className="ns-card-questions">{level.questions} preguntas</span>
              <StarRating stars={level.stars} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
