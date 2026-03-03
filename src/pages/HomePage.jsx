import { useAuth } from "../context/AuthContext";
import "./Home.css";

const worlds = [
  {
    id: "math",
    name: "Matemáticas",
    description: "Números, álgebra y geometría",
    icon: "🧮",
    accent: "#ff2d92",
    accentDark: "#c4006e",
    bg: "linear-gradient(135deg, #fff0f7 0%, #ffe4f2 100%)",
  },
  {
    id: "spanish",
    name: "Español",
    description: "Gramática, literatura y vocabulario",
    icon: "📖",
    accent: "#3a7bfe",
    accentDark: "#1a5cde",
    bg: "linear-gradient(135deg, #f0f4ff 0%, #e0eaff 100%)",
  },
  {
    id: "english",
    name: "Inglés",
    description: "English grammar and vocabulary",
    icon: "🌐",
    accent: "#00d652",
    accentDark: "#00a83f",
    bg: "linear-gradient(135deg, #f0fff6 0%, #d6ffe9 100%)",
  },
];

export default function HomePage({ onGoToPanel, onSelectWorld }) {
  const { user } = useAuth();

  return (
    <div className="home-wrapper">
      {/* Fondo decorativo */}
      <div className="home-bg">
        <div className="home-orb home-orb-1" />
        <div className="home-orb home-orb-2" />
        <div className="home-orb home-orb-3" />
        <div className="home-dots" />
      </div>

      <div className="home-content">

        {/* Header con logo + banner usuario */}
        <header className="home-header">
          <div className="home-logo">
            <span className="home-logo-icon">🏆</span>
            <span className="home-logo-text">KnowledgeHero</span>
          </div>
          <button className="user-banner" onClick={onGoToPanel}>
            <div className="user-avatar">🤖</div>
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">Explorador</span>
            </div>
            <div className="user-points-pill">
              <span className="user-points-icon">⭐</span>
              <span>0 pts</span>
            </div>
          </button>
        </header>

        {/* Hero text */}
        <div className="home-hero">
          <h1 className="home-hero-title">
            Elige tu <span className="home-hero-highlight">mundo</span>
          </h1>
          <p className="home-hero-sub">
            3 mundos · 3 dificultades · 20 niveles cada uno
          </p>
        </div>

        {/* Grid de mundos */}
        <div className="worlds-grid">
          {worlds.map((world, i) => (
            <button
              key={world.id}
              className="world-card"
              style={{
                "--accent": world.accent,
                "--accent-dark": world.accentDark,
                "--card-bg": world.bg,
                animationDelay: `${i * 0.1}s`,
              }}
              onClick={() => onSelectWorld(world.id)}
            >
              {/* Icono grande */}
              <div className="world-icon-wrap">
                <div className="world-icon-bg" />
                <span className="world-icon">{world.icon}</span>
              </div>

              {/* Info */}
              <div className="world-info">
                <h3 className="world-name">{world.name}</h3>
                <p className="world-desc">{world.description}</p>
              </div>

              <div className="world-footer">
  <span className="world-arrow">→</span>
</div>

              {/* Barra de color inferior */}
              <div className="world-bar" />
            </button>
          ))}
        </div>


      </div>
    </div>
  );
}
