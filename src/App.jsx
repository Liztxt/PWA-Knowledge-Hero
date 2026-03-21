import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useProgress } from "./context/ProgressContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EmailPromptPage from "./pages/EmailPromptPage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import HomePage from "./pages/HomePage";
import DifficultySelectPage from "./pages/DifficultySelectPage";
import NivelSelectPage from "./pages/LevelSelectPage";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import TheoryPage from "./pages/TheoryPage";
import LandingPage from "./pages/LandingPage";
import CompletionPage from "./pages/CompletionPage";
import PageTransition from "./components/PageTransition";

const DIFFICULTIES = ["primaria", "secundaria", "avanzado"];

function AppRouter() {
  const { user } = useAuth();
  const { saveProgress } = useProgress();

  const [page, setPage] = useState("landing");
  const [appPage, setAppPage] = useState("home");
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);

  const THEORY_LEVELS = [1, 6, 11, 16];

 useEffect(() => {
  if (!user) {
    const isPWA = window.matchMedia("(display-mode: standalone)").matches;
    setPage(isPWA ? "login" : "landing");
    setAppPage("home");
    setSelectedWorld(null);
    setSelectedDifficulty(null);
    setSelectedLevel(null);
    setQuizResult(null);
  }
}, [user]);

  if (user) {
    if (user.role === "admin") return <AdminPanel />;

    if (showEmailPrompt) return <PageTransition><EmailPromptPage onDone={() => setShowEmailPrompt(false)} /></PageTransition>;

    if (appPage === "dashboard") {
      return (
        <PageTransition>
          <Dashboard onBack={() => setAppPage("home")} />
        </PageTransition>
      );
    }

    if (appPage === "completion") {
      const currentDiffIndex = DIFFICULTIES.indexOf(selectedDifficulty);
      const isLastDifficulty = currentDiffIndex === DIFFICULTIES.length - 1;
      return (
        <PageTransition>
          <CompletionPage
            world={selectedWorld}
            difficulty={selectedDifficulty}
            totalPoints={quizResult?.points ?? 0}
            isLastDifficulty={isLastDifficulty}
            onNextDifficulty={() => {
              setSelectedDifficulty(DIFFICULTIES[currentDiffIndex + 1]);
              setSelectedLevel(null);
              setAppPage("levels");
            }}
            onHome={() => {
              setSelectedWorld(null);
              setSelectedDifficulty(null);
              setSelectedLevel(null);
              setQuizResult(null);
              setAppPage("home");
            }}
          />
        </PageTransition>
      );
    }

    if (appPage === "difficulty") {
      return (
        <PageTransition>
          <DifficultySelectPage
            world={selectedWorld}
            onBack={() => setAppPage("home")}
            onSelectLevel={(difficulty) => {
              setSelectedDifficulty(difficulty);
              setAppPage("levels");
            }}
          />
        </PageTransition>
      );
    }

    if (appPage === "levels") {
      return (
        <PageTransition>
          <NivelSelectPage
            world={selectedWorld}
            difficulty={selectedDifficulty}
            onBack={() => setAppPage("difficulty")}
            onSelectLevel={(nivelId) => {
              setSelectedLevel(nivelId);
              setAppPage(THEORY_LEVELS.includes(nivelId) ? "theory" : "quiz");
            }}
          />
        </PageTransition>
      );
    }

    if (appPage === "theory") {
      return (
        <PageTransition>
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
        </PageTransition>
      );
    }

    if (appPage === "quiz") {
      return (
        <PageTransition>
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

                if (selectedLevel === 20) {
                  setQuizResult({ ...result, stars, passed });
                  setAppPage("completion");
                  return;
                }
              }

              setQuizResult({ ...result, stars, passed });
              setAppPage("results");
            }}
          />
        </PageTransition>
      );
    }

    if (appPage === "results") {
      return (
        <PageTransition>
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
        </PageTransition>
      );
    }

    return (
      <PageTransition>
        <HomePage
          onGoToPanel={() => setAppPage("dashboard")}
          onSelectWorld={(worldId) => {
            setSelectedWorld(worldId);
            setAppPage("difficulty");
          }}
        />
      </PageTransition>
    );
  }

  if (page === "landing") return <PageTransition><LandingPage onLogin={() => setPage("login")} onRegister={() => setPage("register")} /></PageTransition>;
  if (page === "login") return <PageTransition><LoginPage onSwitch={() => setPage("register")} /></PageTransition>;
  return <PageTransition><RegisterPage onSwitch={() => setPage("login")} onRegistered={() => setShowEmailPrompt(true)} /></PageTransition>;
}

export default function App() {
  return <AppRouter />;
}