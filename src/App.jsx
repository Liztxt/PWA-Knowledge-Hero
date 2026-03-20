import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useProgress } from "./context/ProgressContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import HomePage from "./pages/HomePage";
import DifficultySelectPage from "./pages/DifficultySelectPage";
import NivelSelectPage from "./pages/LevelSelectPage";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import TheoryPage from "./pages/TheoryPage";
import LandingPage from "./pages/LandingPage";

function AppRouter() {
  const { user } = useAuth();
  const { saveProgress } = useProgress();

  const [page, setPage] = useState("landing");
  const [appPage, setAppPage] = useState("home");
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const THEORY_LEVELS = [1, 6, 11, 16];

  useEffect(() => {
    if (!user) {
      setPage("landing");
      setAppPage("home");
      setSelectedWorld(null);
      setSelectedDifficulty(null);
      setSelectedLevel(null);
      setQuizResult(null);
    }
  }, [user]);

  if (user) {
    if (user.role === "admin") return <AdminPanel />;

    if (appPage === "dashboard") {
      return <Dashboard onBack={() => setAppPage("home")} />;
    }

    if (appPage === "difficulty") {
      return (
        <DifficultySelectPage
          world={selectedWorld}
          onBack={() => setAppPage("home")}
          onSelectLevel={(difficulty) => {
            setSelectedDifficulty(difficulty);
            setAppPage("levels");
          }}
        />
      );
    }

    if (appPage === "levels") {
      return (
        <NivelSelectPage
          world={selectedWorld}
          difficulty={selectedDifficulty}
          onBack={() => setAppPage("difficulty")}
          onSelectLevel={(nivelId) => {
            setSelectedLevel(nivelId);
            setAppPage(THEORY_LEVELS.includes(nivelId) ? "theory" : "quiz");
          }}
        />
      );
    }

   if (appPage === "theory") {
  return (
    <TheoryPage
      world={selectedWorld}
      difficulty={selectedDifficulty}
      level={selectedLevel}
      onBack={() => setAppPage("levels")}
      onContinue={async () => {
        await saveProgress({
          world: selectedWorld,
          difficulty: selectedDifficulty,
          level: selectedLevel,
          stars: 0,
          pointsEarned: 0,
          isTheory: true, 
        });
        setSelectedLevel(selectedLevel + 1);
        setAppPage("quiz");
      }}
    />
  );
}

    if (appPage === "quiz") {
      return (
        <QuizPage
          world={selectedWorld}
          difficulty={selectedDifficulty}
          level={selectedLevel}
          onBack={() => setAppPage("levels")}
          onFinish={async (result) => {
            const pct = result.correct / result.total;
            const stars = pct === 1 ? 3 : pct >= 0.75 ? 2 : pct >= 0.5 ? 1 : 0;
            const passed = result.incorrect <= 1;

            if (passed) {
              await saveProgress({
                world: selectedWorld,
                difficulty: selectedDifficulty,
                level: selectedLevel,
                stars,
                pointsEarned: result.points,
              });
            }

            setQuizResult({ ...result, stars, passed });
            setAppPage("results");
          }}
        />
      );
    }

    if (appPage === "results") {
      return (
        <ResultsPage
          world={selectedWorld}
          difficulty={selectedDifficulty}
          level={selectedLevel}
          username={user.username}
          points={quizResult?.points ?? 0}
          correct={quizResult?.correct ?? 0}
          incorrect={quizResult?.incorrect ?? 0}
          total={quizResult?.total ?? 0}
          stars={quizResult?.stars ?? 0}
          passed={quizResult?.passed ?? true}
          onRepeat={() => setAppPage("quiz")}
          onNextLevel={() => {
            setSelectedLevel((prev) => prev + 1);
            setAppPage("quiz");
          }}
          onHome={() => {
            setSelectedWorld(null);
            setSelectedDifficulty(null);
            setSelectedLevel(null);
            setQuizResult(null);
            setAppPage("home");
          }}
        />
      );
    }

    return (
      <HomePage
        onGoToPanel={() => setAppPage("dashboard")}
        onSelectWorld={(worldId) => {
          setSelectedWorld(worldId);
          setAppPage("difficulty");
        }}
      />
    );
  }

  if (page === "landing") return <LandingPage onLogin={() => setPage("login")} onRegister={() => setPage("register")} />;
  if (page === "login") return <LoginPage onSwitch={() => setPage("register")} />;
  return <RegisterPage onSwitch={() => setPage("login")} />;
}

export default function App() {
  return <AppRouter />;
}