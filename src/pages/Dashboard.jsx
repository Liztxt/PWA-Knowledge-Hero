import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dash-wrapper">
      <div className="dash-header">
        <div>
          <div className="dash-title">Panel de usuario</div>
        </div>
        <div className="admin-badge-row">
          <span className="dash-role-badge badge-user">◯ usuario</span>
          <button className="logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="dash-card">
        <h2>Mi cuenta</h2>
        <div className="dash-info">
          <div className="info-item">
            <span className="info-label">Usuario</span>
            <span className="info-value">{user?.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Correo</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Rol</span>
            <span className="info-value">{user?.role}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Estado</span>
            <span className="info-value" style={{ color: "var(--success)" }}>
              Activo
            </span>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <h2>Ruta protegida ✓</h2>
        <p>
          Estás viendo contenido protegido. Solo usuarios autenticados con rol
          <strong style={{ color: "var(--accent2)" }}> user</strong> o
          <strong style={{ color: "var(--accent)" }}> admin</strong> pueden
          acceder aquí. Tu JWT se envía automáticamente en cada petición al
          backend.
        </p>
      </div>
    </div>
  );
}
