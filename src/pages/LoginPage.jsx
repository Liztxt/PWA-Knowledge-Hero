import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg">
        <div className="grid-lines" />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🤖</div>
          <h1 className="auth-title">Bienvenido a<br />KnowledgeHero!</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">Nombre de usuario</label>
            <div className="field-input-wrap">
              <input
                className="field-input"
                type="text"
                name="username"
                placeholder="Ingresa tu nombre"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Contraseña</label>
            <div className="field-input-wrap">
              <input
                className="field-input"
                type="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Comenzar"}
          </button>
        </form>

        <div className="auth-footer">
          <button className="link-btn">Olvidaste tu contraseña?</button>
          <button className="link-btn link-btn-right" onClick={onSwitch}>
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
