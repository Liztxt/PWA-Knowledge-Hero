import "./LevelSelect.css";

const levels = [
  {
    id: "primaria",
    name: "Primaria",
    description: "Nivel básico - Conceptos fundamentales",
    icon: "🌟",
    bg: "#fbbf24",
  },
  {
    id: "secundaria",
    name: "Secundaria",
    description: "Nivel intermedio - Retos moderados",
    icon: "💡",
    bg: "#f3f4f6",
  },
  {
    id: "avanzado",
    name: "Avanzado",
    description: "Nivel experto - Máxima dificultad",
    icon: "🐻",
    bg: "#fb923c",
  },
];

const worldNames = {
  math: "Matemáticas",
  spanish: "Español",
  english: "Inglés",
};

export default function LevelSelectPage({ world, onBack, onSelectLevel }) {
  return (
    <div className="level-wrapper">
      <div className="level-bg">
        <div className="level-orb level-orb-1" />
        <div className="level-orb level-orb-2" />
        <div className="level-dots" />
      </div>

      <div className="level-content">
        <button className="level-back-btn" onClick={onBack}>
          ← Regresar
        </button>

        <h1 className="level-title">{worldNames[world] || world}</h1>
        <p className="level-subtitle">Selecciona tu nivel de dificultad</p>

        <div className="level-list">
          {levels.map((level) => (
            <button
              key={level.id}
              className="level-card"
              onClick={() => onSelectLevel(level.id)}
            >
              <div
                className="level-card-icon"
                style={{ background: level.bg }}
              >
                {level.icon}
              </div>
              <div className="level-card-text">
                <h3 className="level-card-name">{level.name}</h3>
                <p className="level-card-desc">{level.description}</p>
              </div>
              <span className="level-card-arrow">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
