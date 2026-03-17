import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import "./Dashboard.css";

const AVATARS = ["🤖", "🦊", "🐉", "🦁", "🐼", "🦅", "🐺", "🦋", "🐸", "🌟", "🎯", "🔥"];

function countCompleted(worldArr) {
  return worldArr?.reduce((acc, d) => acc + d.levels.filter(l => l.completed).length, 0) ?? 0;
}

export default function Dashboard({ onBack }) {
  const { user, logout, updateProfile, scheduleDelete, cancelDelete } = useAuth();
  const { totalPoints, progress, streak } = useProgress();

  const [activeTab, setActiveTab] = useState("perfil");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "🤖");
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteScheduled, setDeleteScheduled] = useState(false);

  const totalCompleted = countCompleted(progress.math) + countCompleted(progress.spanish) + countCompleted(progress.english);
  const allLevels = [
    ...(progress.math?.flatMap(d => d.levels) ?? []),
    ...(progress.spanish?.flatMap(d => d.levels) ?? []),
    ...(progress.english?.flatMap(d => d.levels) ?? []),
  ];
  const precision = allLevels.length > 0
    ? Math.round(allLevels.reduce((acc, l) => acc + (l.stars / 3) * 100, 0) / allLevels.length)
    : 0;

  const worlds = [
    { name: "Matemáticas", icon: "🧮", color: "#ff2d92", key: "math"    },
    { name: "Español",     icon: "📖", color: "#3a7bfe", key: "spanish" },
    { name: "Inglés",      icon: "🌐", color: "#00d652", key: "english" },
  ];

  const handleSave = async () => {
    try {
      setSaveError("");
      await updateProfile(newUsername, selectedAvatar);
      setSaveMsg("¡Cambios guardados!");
      setTimeout(() => setSaveMsg(""), 2500);
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await scheduleDelete();
      setDeleteScheduled(true);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelDelete = async () => {
    try {
      await cancelDelete();
      setDeleteScheduled(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dp-wrapper">
      <div className="dp-bg">
        <div className="dp-orb dp-orb-1" />
        <div className="dp-orb dp-orb-2" />
        <div className="dp-dots" />
      </div>

      <div className="dp-content">
        <div className="dp-topbar">
          <button className="dp-back" onClick={onBack}>← Volver</button>
          <button className="dp-logout" onClick={logout}>Cerrar sesión</button>
        </div>

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

        <div className="dp-stats">
          {[
            { num: totalPoints,     label: "Puntos"              },
            { num: totalCompleted,  label: "Niveles completados" },
            { num: `${precision}%`, label: "Precisión global"    },
            { num: streak,          label: "Racha de días"       },
          ].map((s, i) => (
            <div key={i} className="dp-stat">
              <span className="dp-stat-num">{s.num}</span>
              <span className="dp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="dp-tabs">
          <button className={`dp-tab ${activeTab === "perfil" ? "dp-tab--on" : ""}`} onClick={() => setActiveTab("perfil")}>
            👤 Mi perfil
          </button>
          <button className={`dp-tab ${activeTab === "config" ? "dp-tab--on" : ""}`} onClick={() => setActiveTab("config")}>
            ⚙️ Configuración
          </button>
        </div>

        {activeTab === "perfil" && (
          <div className="dp-panel">
            <div className="dp-section">
              <h2 className="dp-section-title">Información de la cuenta</h2>
              <div className="dp-info-grid">
                {[
                  { label: "👤 Usuario",        value: user?.username },
                  { label: "🎭 Rol",            value: user?.role },
                  { label: "⭐ Puntos totales", value: `${totalPoints} pts`, accent: true },
                  { label: "🔐 Autenticación",  value: "JWT activo" },
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
                {worlds.map((w) => {
                  const completed = countCompleted(progress[w.key]);
                  const pct = Math.round((completed / 20) * 100);
                  return (
                    <div key={w.name} className="dp-progress-row">
                      <span className="dp-progress-icon">{w.icon}</span>
                      <div className="dp-progress-info">
                        <div className="dp-progress-header">
                          <span className="dp-progress-name">{w.name}</span>
                          <span className="dp-progress-frac">{completed}/20</span>
                        </div>
                        <div className="dp-progress-track">
                          <div className="dp-progress-fill" style={{ width: `${pct}%`, background: w.color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "config" && (
          <div className="dp-panel">

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
              {saveError && <p style={{ color: "red", fontSize: "0.85rem" }}>❌ {saveError}</p>}
            </div>

            <div className="dp-section dp-section--danger">
              <h2 className="dp-section-title dp-section-title--danger">⚠️ Zona de peligro</h2>
              <p className="dp-danger-desc">Estas acciones son permanentes e irreversibles.</p>

              {deleteScheduled ? (
                <div className="dp-confirm-box">
                  <p className="dp-confirm-text">
                    ⏳ Tu cuenta será eliminada en 20 días. Puedes cancelarlo iniciando sesión antes de que se cumpla el plazo.
                  </p>
                  <button className="dp-btn dp-btn--ghost" onClick={handleCancelDelete}>
                    Cancelar eliminación
                  </button>
                </div>
              ) : !showDeleteConfirm ? (
                <button className="dp-btn dp-btn--danger" onClick={() => setShowDeleteConfirm(true)}>
                  🗑️ Eliminar mi cuenta
                </button>
              ) : (
                <div className="dp-confirm-box">
                  <p className="dp-confirm-text">
                    Tu cuenta se eliminará en 20 días. Puedes cancelarlo iniciando sesión antes de que se cumpla el plazo.
                  </p>
                  <div className="dp-confirm-row">
                    <button className="dp-btn dp-btn--danger" onClick={handleDelete}>
                      Sí, programar eliminación
                    </button>
                    <button className="dp-btn dp-btn--ghost" onClick={() => setShowDeleteConfirm(false)}>
                      Cancelar
                    </button>
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