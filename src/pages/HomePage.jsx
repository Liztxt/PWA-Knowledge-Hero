import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
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

function countCompleted(worldArr) {
  return worldArr?.reduce((acc, d) => acc + d.levels.filter(l => l.completed).length, 0) ?? 0;
}

export default function HomePage({ onGoToPanel, onSelectWorld }) {
  const { user } = useAuth();
  const { totalPoints, progress } = useProgress();

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12)  return "¡Buenos días";
  if (hour >= 12 && hour < 19) return "¡Buenas tardes";
  return "¡Buenas noches";
};

  return (
    <div className="home-wrapper">
      <div className="home-bg">
        <div className="home-orb home-orb-1" />
        <div className="home-orb home-orb-2" />
        <div className="home-orb home-orb-3" />
        <div className="home-dots" />
      </div>

      <div className="home-content">
        <header className="home-header">
          <div className="home-logo">
            <span className="home-logo-icon">🏆</span>
            <span className="home-logo-text">Knowledge Hero</span>
          </div>
          <button className="user-banner" onClick={onGoToPanel}>
            <div className="user-avatar">{user?.avatar || "🤖"}</div>
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">Explorador</span>
            </div>
            <div className="user-points-pill">
              <span className="user-points-icon">⭐</span>
              <span>{totalPoints} pts</span>
            </div>
          </button>
        </header>

        <div className="home-hero">
  <p className="home-greeting">
    {getGreeting()}, {user?.username}! 👋
  </p>
  <h1 className="home-hero-title">
    Elige tu <span className="home-hero-highlight">mundo</span>
  </h1>
  <p className="home-hero-sub">
    3 mundos · 3 dificultades · 20 niveles cada uno
  </p>
</div>

        <div className="worlds-grid">
          {worlds.map((world, i) => {
            const completed = countCompleted(progress[world.id]);
            const pct = Math.round((completed / 20) * 100);

            return (
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
                <div className="world-icon-wrap">
                  <div className="world-icon-bg" />
                  <span className="world-icon">{world.icon}</span>
                </div>

                <div className="world-info">
                  <h3 className="world-name">{world.name}</h3>
                  <p className="world-desc">{world.description}</p>
                </div>

                {/* Progreso del mundo */}
                <div className="world-progress">
                  <div className="world-progress-track">
                    <div
                      className="world-progress-fill"
                      style={{ width: `${pct}%`, background: world.accent }}
                    />
                  </div>
                 <span className="world-progress-label">{pct}% completado</span>
                </div>

                <div className="world-footer">
                  <span className="world-arrow">→</span>
                </div>

                <div className="world-bar" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}