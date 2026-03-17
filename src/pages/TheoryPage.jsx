import "./Theory.css";
import { mathTheory } from "../data/mathTheory.js";
import { spanishTheory } from "../data/spanishTheory.js";
import { englishTheory } from "../data/englishTheory.js";

export default function TheoryPage({ world, difficulty, level, onContinue, onBack }) {
  const theoryData = getTheoryData(world, difficulty, level);

  if (!theoryData) return null;

  return (
    <div className="theory-wrapper">
      <div className="theory-bg">
        <div className="theory-orb theory-orb-1" />
        <div className="theory-orb theory-orb-2" />
        <div className="theory-dots" />
      </div>

      <div className="theory-content">
        <button className="theory-back" onClick={onBack}>← Regresar</button>

        <div className="theory-header">
          <span className="theory-badge">📖 Teoría · Nivel {level}</span>
          <h1 className="theory-title">{theoryData.title}</h1>
          <p className="theory-subtitle">{theoryData.subtitle}</p>
        </div>

        <div className="theory-sections">
          {theoryData.sections.map((section, i) => (
            <div key={i} className="theory-card">
              <div className="theory-card-header">
                <span className="theory-card-icon">{section.icon}</span>
                <h2 className="theory-card-title">{section.title}</h2>
              </div>
              <p className="theory-card-content">{section.content}</p>
              <div className="theory-examples">
                {section.examples.map((ex, j) => (
                  <div key={j} className="theory-example">
                    <span className="theory-example-dot">▸</span>
                    <span>{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="theory-continue" onClick={onContinue}>
          ¡Entendido, a practicar! →
        </button>
      </div>
    </div>
  );
}

function getTheoryData(world, difficulty, level) {
  const data = world === "math" ? mathTheory 
             : world === "spanish" ? spanishTheory 
             : world === "english" ? englishTheory 
             : null;
  if (!data) return null;
  return data[difficulty]?.[level] ?? null;
}