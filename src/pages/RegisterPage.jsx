import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function RegisterPage({ onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!form.terms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    setLoading(true);
    try {
      await register(form.username, form.password, form.role);
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
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">Nombre de usuario</label>
            <div className="field-input-wrap">
              <input
                className="field-input"
                type="text"
                name="username"
                placeholder="Usuario"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Crea una contraseña</label>
            <div className="field-input-wrap">
              <input
                className="field-input"
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Confirme contraseña</label>
            <div className="field-input-wrap">
              <input
                className="field-input"
                type="password"
                name="confirmPassword"
                placeholder="Contraseña"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Selector de rol — ocultarlo proximamente */}
          <div className="field-group">
            <label className="field-label">Rol</label>
            <div className="role-selector">
              {["user", "admin"].map((r) => (
                <label
                  key={r}
                  className={`role-option ${form.role === r ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role === r}
                    onChange={handleChange}
                  />
                  <span className="role-icon">{r === "admin" ? "⬟" : "◯"}</span>
                  <span>{r === "admin" ? "Admin" : "Usuario"}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="terms-row">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              checked={form.terms}
              onChange={handleChange}
            />
            <label htmlFor="terms" className="terms-text">
              Acepta los terminos y condiciones
              <span>Description</span>
            </label>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <button className="link-btn" onClick={onSwitch}>
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}
