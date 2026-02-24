import { useAuth } from "../context/AuthContext";
import "./Home.css";

const worlds = [
  {
    id: "math",
    name: "Matemáticas",
    description: "Números, álgebra y geometría",
    icon: "🧮",
    accent: "#ff2d92",
  },
  {
    id: "spanish",
    name: "Español",
    description: "Gramática, literatura y vocabulario",
    icon: "📖",
    accent: "#3a7bfe",
  },
  {
    id: "english",
    name: "Inglés",
    description: "English grammar and vocabulary",
    icon: "🌐",
    accent: "#00d652",
  },
];

export default function HomePage({ onGoToPanel,onSelectWorld }) {
  const { user } = useAuth();

  const handleWorldSelect = (worldId) => {
  onSelectWorld(worldId);
};
  return (
    <div className="home-wrapper">
      <div className="home-bg">
        <div className="home-orb home-orb-1" />
        <div className="home-orb home-orb-2" />
        <div className="home-dots" />
      </div>

      <div className="home-content">
        {/* Banner de usuario */}
        <button className="user-banner" onClick={onGoToPanel}>
          <div className="user-banner-left">
            <div className="user-avatar">🤖</div>
            <span className="user-greeting">
              Bienvenido, <strong>{user?.username}</strong>
            </span>
          </div>
          <div className="user-points">
            <span>0 pts</span>
          </div>
        </button>

        {/* Tarjetas de mundos */}
        <div className="worlds-grid">
          {worlds.map((world) => (
            <button
              key={world.id}
              className="world-card"
              style={{ "--accent": world.accent }}
              onClick={() => handleWorldSelect(world.id)}
            >
              <div className="world-card-top">
                <div className="world-icon">{world.icon}</div>
              </div>
              <div className="world-card-bottom">
                <h3 className="world-name">{world.name}</h3>
                <p className="world-desc">{world.description}</p>
              </div>
              <div className="world-card-bar" />
            </button>
          ))}
        </div>

        {/* Texto inferior */}
        <div className="home-cta">
          <h1 className="home-cta-title">Elige tu mundo</h1>
          <p className="home-cta-sub">¿Qué tema quieres explorar hoy?</p>
        </div>
      </div>
    </div>
  );
}
