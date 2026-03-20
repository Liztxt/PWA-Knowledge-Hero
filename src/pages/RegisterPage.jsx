import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function RegisterPage({ onSwitch, onRegistered }) {
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

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasLength = pwd.length >= 8;
    const hasSpecial = /[!@#$%^&*]/.test(pwd);
    const score = [hasUpper, hasNumber, hasLength, hasSpecial].filter(Boolean).length;
    if (score <= 1) return { label: "Muy débil", color: "#ef4444", width: "25%" };
    if (score === 2) return { label: "Débil",     color: "#f97316", width: "50%" };
    if (score === 3) return { label: "Buena",     color: "#eab308", width: "75%" };
    return               { label: "Fuerte",      color: "#22c55e", width: "100%" };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
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
      await register(form.username, form.password, "user", null);
  onRegistered(); // ← agregar aquí
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
            {/* Indicador de fortaleza */}
            {form.password && strength && (
              <div style={{ marginTop: "6px" }}>
                <div style={{
                  height: "5px", background: "#e8e8f0",
                  borderRadius: "999px", overflow: "hidden", marginBottom: "4px"
                }}>
                  <div style={{
                    height: "100%", width: strength.width,
                    background: strength.color, borderRadius: "999px",
                    transition: "width 0.3s, background 0.3s"
                  }} />
                </div>
                <span style={{ fontSize: "0.78rem", fontWeight: "700", color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
            {/* Requisitos */}
            {form.password && (
              <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginTop: "6px" }}>
                {[
                  { ok: form.password.length >= 8,   text: "Mínimo 8 caracteres" },
                  { ok: /[A-Z]/.test(form.password), text: "Una mayúscula" },
                  { ok: /\d/.test(form.password),    text: "Un número" },
                ].map((req) => (
                  <span key={req.text} style={{
                    fontSize: "0.75rem", fontWeight: "600",
                    color: req.ok ? "#22c55e" : "#aaa",
                    display: "flex", alignItems: "center", gap: "5px"
                  }}>
                    {req.ok ? "✓" : "○"} {req.text}
                  </span>
                ))}
              </div>
            )}
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

          <div className="terms-row">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              checked={form.terms}
              onChange={handleChange}
            />
            <label htmlFor="terms" className="terms-text">
              Acepta los términos y condiciones
              <span>Description</span>
            </label>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Registrarse"}
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