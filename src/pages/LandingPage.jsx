import "./Landing.css";

const features = [
  { icon: "⭐", title: "Sistema de estrellas",   desc: "Obtén hasta 3 estrellas por nivel según tu precisión. Solo avanzas si demuestras dominio real." },
  { icon: "🔥", title: "Racha de días",          desc: "Mantén una racha jugando cada día. Si pasan más de 4 días sin actividad, tu racha se reinicia." },
  { icon: "🔒", title: "Niveles progresivos",    desc: "Cada nivel se desbloquea al completar el anterior. El progreso es tuyo y se guarda en la nube." },
  { icon: "📖", title: "Teoría integrada",       desc: "Antes de cada bloque de niveles encontrarás una lección de teoría con ejemplos claros y concisos." },
  { icon: "📊", title: "Progreso detallado",     desc: "Consulta tus puntos, niveles completados, precisión global y racha desde tu panel personal." },
  { icon: "🎯", title: "3 niveles de dificultad", desc: "Primaria, Secundaria y Avanzado. Cada uno con 20 niveles diseñados para retarte progresivamente." },
];

const steps = [
  { num: "01", title: "Crea tu cuenta",       desc: "Regístrate en segundos con un nombre de usuario y contraseña. Sin correo obligatorio." },
  { num: "02", title: "Elige un mundo",        desc: "Selecciona entre Matemáticas, Español o Inglés según lo que quieras practicar." },
  { num: "03", title: "Lee la teoría",         desc: "Antes de cada bloque, revisa los conceptos clave que necesitarás para responder correctamente." },
  { num: "04", title: "Completa los niveles",  desc: "Responde las preguntas, gana estrellas y desbloquea el siguiente nivel. Máximo 1 error permitido." },
];

export default function LandingPage({ onLogin, onRegister }) {
  return (
    <div className="land-wrapper">

      <div className="land-bg">
        <div className="land-orb land-orb-1" />
        <div className="land-orb land-orb-2" />
        <div className="land-dots" />
      </div>

      {/* Navbar */}
      <nav className="land-nav">
        <div className="land-nav-logo">
          <span>🏆</span>
          <span>KnowledgeHero</span>
        </div>
        <div className="land-nav-actions">
          <button className="land-btn land-btn--ghost" onClick={onLogin}>
            Iniciar sesión
          </button>
          <button className="land-btn land-btn--primary" onClick={onRegister}>
            Registrarse
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="land-hero">
        <div className="land-hero-badge">📚 Plataforma de aprendizaje adaptativo</div>
        <h1 className="land-hero-title">
          Aprende, practica y<br />
          <span className="land-hero-highlight">domina el conocimiento</span>
        </h1>
        <p className="land-hero-sub">
          KnowledgeHero es una plataforma educativa que combina teoría estructurada
          con práctica progresiva en Matemáticas, Español e Inglés.
          Diseñada para que cada sesión cuente.
        </p>
        <div className="land-hero-actions">
          <button className="land-btn land-btn--primary land-btn--lg" onClick={onRegister}>
            Comenzar ahora — es gratis
          </button>
          <button className="land-btn land-btn--ghost land-btn--lg" onClick={onLogin}>
            Ya tengo una cuenta
          </button>
        </div>
        <div className="land-hero-stats">
          <div className="land-stat">
            <span className="land-stat-num">3</span>
            <span>Materias</span>
          </div>
          <div className="land-stat-div" />
          <div className="land-stat">
            <span className="land-stat-num">60</span>
            <span>Niveles por materia</span>
          </div>
          <div className="land-stat-div" />
          <div className="land-stat">
            <span className="land-stat-num">240+</span>
            <span>Preguntas</span>
          </div>
          <div className="land-stat-div" />
          <div className="land-stat">
            <span className="land-stat-num">3</span>
            <span>Dificultades</span>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="land-section land-section--dark">
        <div className="land-section-inner">
          <h2 className="land-section-title">¿Cómo funciona?</h2>
          <p className="land-section-sub">
            Un proceso simple y efectivo para consolidar tu aprendizaje
          </p>
          <div className="land-steps">
            {steps.map((s) => (
              <div key={s.num} className="land-step">
                <div className="land-step-num">{s.num}</div>
                <h3 className="land-step-title">{s.title}</h3>
                <p className="land-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="land-section">
        <div className="land-section-inner">
          <h2 className="land-section-title">Características de la plataforma</h2>
          <p className="land-section-sub">
            Cada función está diseñada para maximizar tu aprendizaje
          </p>
          <div className="land-features">
            {features.map((f) => (
              <div key={f.title} className="land-feature-card">
                <span className="land-feature-icon">{f.icon}</span>
                <h3 className="land-feature-title">{f.title}</h3>
                <p className="land-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="land-cta">
        <div className="land-cta-inner">
          <h2 className="land-cta-title">Empieza a aprender hoy</h2>
          <p className="land-cta-sub">
            Crea tu cuenta gratuita y accede a todos los contenidos sin restricciones.
          </p>
          <div className="land-cta-actions">
            <button className="land-btn land-btn--white land-btn--lg" onClick={onRegister}>
              Crear cuenta gratuita
            </button>
            <button className="land-btn land-btn--ghost land-btn--lg" onClick={onLogin}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="land-footer">
        <div className="land-footer-logo">
          <span>🏆</span>
          <span>KnowledgeHero</span>
        </div>
        <p className="land-footer-copy">
          Plataforma educativa · Matemáticas · Español · Inglés
        </p>
      </footer>

    </div>
  );
}