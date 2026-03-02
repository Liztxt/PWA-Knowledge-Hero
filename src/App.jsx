import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import HomePage from "./pages/HomePage";
import DifficultySelectPage from "./pages/DifficultySelectPage";
import NivelSelectPage from "./pages/LevelSelectPage";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";

function AppRouter() {
  const { user } = useAuth();

  const [page, setPage] = useState("login");
  const [appPage, setAppPage] = useState("home");

  const [selectedWorld, setSelectedWorld] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const [quizResult, setQuizResult] = useState(null);
  

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
          onFinish={(result) => {
            console.log("onFinish llamado", result); 
            setQuizResult(result);
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

  return page === "login" ? (
    <LoginPage onSwitch={() => setPage("register")} />
  ) : (
    <RegisterPage onSwitch={() => setPage("login")} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
