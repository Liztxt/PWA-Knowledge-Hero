import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const AVATARS = ["🤖", "🦊", "🐉", "🦁", "🐼", "🦅", "🐺", "🦋", "🐸", "🌟", "🎯", "🔥"];

export default function Dashboard({ onBack }) {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab]           = useState("perfil");
  const [selectedAvatar, setSelectedAvatar] = useState("🤖");
  const [newUsername, setNewUsername]       = useState(user?.username || "");
  const [saveMsg, setSaveMsg]               = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    // TODO: llamar a PUT /api/auth/me con el nuevo username
    setSaveMsg("¡Cambios guardados!");
    setTimeout(() => setSaveMsg(""), 2500);
  };

  const handleDelete = () => {
    // TODO: llamar a DELETE /api/auth/me y luego logout
    logout();
  };

  return (
    <div className="dp-wrapper">
      {/* Fondo decorativo igual al proyecto */}
      <div className="dp-bg">
        <div className="dp-orb dp-orb-1" />
        <div className="dp-orb dp-orb-2" />
        <div className="dp-dots" />
      </div>

      <div className="dp-content">

        {/* ── Top bar ── */}
        <div className="dp-topbar">
          <button className="dp-back" onClick={onBack}>← Volver</button>
          <button className="dp-logout" onClick={logout}>Cerrar sesión</button>
        </div>

        {/* ── Hero ── */}
        <div className="dp-hero">
          <div className="dp-avatar-ring">
            <span className="dp-avatar">{selectedAvatar}</span>
          </div>
          <div className="dp-hero-info">
            <h1 className="dp-hero-name">{user?.username}</h1>
            <div className="dp-hero-badges">
              <span className="dp-pill dp-pill--role">
                {user?.role === "admin" ? "👑 Admin" : "🎮 Explorador"}
              </span>
              <span className="dp-pill dp-pill--active">✅ Activo</span>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="dp-stats">
          {[
            { num: "0",   label: "Puntos"              },
            { num: "0",   label: "Niveles completados" },
            { num: "0%",  label: "Precisión global"    },
            { num: "0",   label: "Racha de días"       },
          ].map((s, i) => (
            <div key={i} className="dp-stat">
              <span className="dp-stat-num">{s.num}</span>
              <span className="dp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="dp-tabs">
          <button
            className={`dp-tab ${activeTab === "perfil" ? "dp-tab--on" : ""}`}
            onClick={() => setActiveTab("perfil")}
          >👤 Mi perfil</button>
          <button
            className={`dp-tab ${activeTab === "config" ? "dp-tab--on" : ""}`}
            onClick={() => setActiveTab("config")}
          >⚙️ Configuración</button>
        </div>

        {/* ── Panel: Perfil ── */}
        {activeTab === "perfil" && (
          <div className="dp-panel">

            <div className="dp-section">
              <h2 className="dp-section-title">Información de la cuenta</h2>
              <div className="dp-info-grid">
                {[
                  { label: "👤 Usuario",        value: user?.username },
                  { label: "🎭 Rol",            value: user?.role     },
                  { label: "⭐ Puntos totales", value: "0 pts", accent: true },
                  { label: "🔐 Autenticación",  value: "JWT activo"   },
                ].map((item) => (
                  <div key={item.label} className="dp-info-item">
                    <span className="dp-info-label">{item.label}</span>
                    <span className={`dp-info-value ${item.accent ? "dp-info-value--accent" : ""}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dp-section">
              <h2 className="dp-section-title">Progreso por mundo</h2>
              <div className="dp-progress-list">
                {[
                  { name: "Matemáticas", icon: "🧮", color: "#ff2d92" },
                  { name: "Español",     icon: "📖", color: "#3a7bfe" },
                  { name: "Inglés",      icon: "🌐", color: "#00d652" },
                ].map((w) => (
                  <div key={w.name} className="dp-progress-row">
                    <span className="dp-progress-icon">{w.icon}</span>
                    <div className="dp-progress-info">
                      <div className="dp-progress-header">
                        <span className="dp-progress-name">{w.name}</span>
                        <span className="dp-progress-frac">0/20</span>
                      </div>
                      <div className="dp-progress-track">
                        <div className="dp-progress-fill" style={{ width: "0%", background: w.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── Panel: Configuración ── */}
        {activeTab === "config" && (
          <div className="dp-panel">

            {/* Elegir avatar */}
            <div className="dp-section">
              <h2 className="dp-section-title">Elige tu avatar</h2>
              <div className="dp-avatar-grid">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    className={`dp-av-opt ${selectedAvatar === av ? "dp-av-opt--on" : ""}`}
                    onClick={() => setSelectedAvatar(av)}
                  >{av}</button>
                ))}
              </div>
            </div>

            {/* Cambiar nombre */}
            <div className="dp-section">
              <h2 className="dp-section-title">Cambiar nombre de usuario</h2>
              <div className="dp-field-row">
                <input
                  className="dp-input"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Nuevo nombre de usuario"
                />
                <button className="dp-btn dp-btn--primary" onClick={handleSave}>
                  Guardar
                </button>
              </div>
              {saveMsg && <p className="dp-save-msg">✅ {saveMsg}</p>}
            </div>

            {/* Zona de peligro */}
            <div className="dp-section dp-section--danger">
              <h2 className="dp-section-title dp-section-title--danger">⚠️ Zona de peligro</h2>
              <p className="dp-danger-desc">Estas acciones son permanentes e irreversibles.</p>

              {!showDeleteConfirm ? (
                <button className="dp-btn dp-btn--danger" onClick={() => setShowDeleteConfirm(true)}>
                  🗑️ Eliminar mi cuenta
                </button>
              ) : (
                <div className="dp-confirm-box">
                  <p className="dp-confirm-text">¿Estás seguro? Esta acción no se puede deshacer.</p>
                  <div className="dp-confirm-row">
                    <button className="dp-btn dp-btn--danger" onClick={handleDelete}>Sí, eliminar</button>
                    <button className="dp-btn dp-btn--ghost" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
