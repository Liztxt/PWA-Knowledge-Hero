import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import HomePage from "./pages/HomePage";
import DifficultySelectPage from "./pages/DifficultySelectPage";
import NivelSelectPage from "./pages/LevelSelectPage";

function AppRouter() {
  const { user } = useAuth();
  const [page, setPage] = useState("login");
  const [appPage, setAppPage] = useState("home");
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

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
            console.log("Nivel seleccionado:", nivelId);
            // setAppPage("results"); // descomentar cuando tengas ResultsPage
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
