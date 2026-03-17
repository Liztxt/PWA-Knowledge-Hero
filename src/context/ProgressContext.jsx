import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ProgressContext = createContext(null);

const API = "http://localhost:5000";

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState({ math: [], spanish: [], english: [] });
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar progreso cuando el usuario inicia sesión
  useEffect(() => {
    if (user) fetchProgress();
    else {
      setProgress({ math: [], spanish: [], english: [] });
      setTotalPoints(0);
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setProgress(data.progress);
        setTotalPoints(data.totalPoints);
      }
    } catch (error) {
      console.error("Error cargando progreso:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async ({ world, difficulty, level, stars, pointsEarned }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/progress/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ world, difficulty, level, stars, pointsEarned }),
      });
      const data = await res.json();
      if (res.ok) {
        setTotalPoints(data.totalPoints);
        setProgress(prev => ({ ...prev, [world]: data.progress }));
      }
      return data;
    } catch (error) {
      console.error("Error guardando progreso:", error);
    }
  };

  // Obtener estrellas de un nivel específico
  const getLevelStars = (world, difficulty, level) => {
    const worldProgress = progress[world]?.find(w => w.difficulty === difficulty);
    if (!worldProgress) return 0;
    const levelData = worldProgress.levels.find(l => l.level === level);
    return levelData?.stars || 0;
  };

  // Saber si un nivel está desbloqueado
  // Nivel 1 siempre desbloqueado, el resto requiere completar el anterior
  const isLevelUnlocked = (world, difficulty, level) => {
    if (level === 1) return true;
    const worldProgress = progress[world]?.find(w => w.difficulty === difficulty);
    if (!worldProgress) return false;
    const prevLevel = worldProgress.levels.find(l => l.level === level - 1);
    return prevLevel?.completed === true;
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      totalPoints,
      loading,
      saveProgress,
      getLevelStars,
      isLevelUnlocked,
      fetchProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}