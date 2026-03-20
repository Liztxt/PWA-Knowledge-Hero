import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function EmailPromptPage({ onDone }) {
  const { updateProfile, user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!email.includes("@")) {
      setError("Ingresa un email válido");
      return;
    }
    setLoading(true);
    try {
      await updateProfile(user.username, user.avatar, email);
      onDone();
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
          <div className="auth-logo">📧</div>
          <h1 className="auth-title">Agrega un email de respaldo</h1>
        </div>
        <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "16px", textAlign: "center" }}>
          Te servirá para recuperar tu cuenta. Puedes omitirlo y agregarlo después desde tu perfil.
        </p>
        <div className="field-group">
          <label className="field-label">Email</label>
          <div className="field-input-wrap">
            <input
              className="field-input"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-btn" onClick={handleSave} disabled={loading}>
          {loading ? <span className="spinner" /> : "Guardar email"}
        </button>
        <div className="auth-footer">
          <button className="link-btn" onClick={onDone}>
            Omitir por ahora →
          </button>
        </div>
      </div>
    </div>
  );
}