import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function AdminPanel() {
  const { user, logout } = useAuth();

  return (
    <div className="dash-wrapper">
      <div className="dash-header">
        <div>
          <div className="dash-title">Panel de administración</div>
        </div>
        <div className="admin-badge-row">
          <span className="dash-role-badge badge-admin">⬟ admin</span>
          <button className="logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="dash-card">
        <h2>Administrador</h2>
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
            <span className="info-value" style={{ color: "var(--accent)" }}>
              {user?.role}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Permisos</span>
            <span className="info-value" style={{ color: "var(--success)" }}>
              Acceso total
            </span>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <h2>Zona exclusiva admin</h2>
        <p>
          Esta vista solo es accesible para usuarios con rol{" "}
          <strong style={{ color: "var(--accent)" }}>admin</strong>. Aquí
          podrías gestionar usuarios, ver logs, administrar permisos o cualquier
          acción privilegiada. El middleware del backend también valida el rol
          antes de responder a rutas protegidas.
        </p>
      </div>

      <div className="dash-card">
        <h2>Próximas integraciones</h2>
        <p>
          Conecta este panel al backend para: listar usuarios de MongoDB,
          cambiar roles, suspender cuentas, y ver métricas del sistema. Todas
          las rutas admin requieren verificar el JWT y que{" "}
          <code style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
            role === 'admin'
          </code>
          .
        </p>
      </div>
    </div>
  );
}
