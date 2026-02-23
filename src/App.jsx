import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import HomePage from "./pages/HomePage";
import LevelSelectPage from "./pages/LevelSelectPage";

function AppRouter() {
  const { user } = useAuth();
  const [page, setPage] = useState("login");
  const [appPage, setAppPage] = useState("home");
  const [selectedWorld, setSelectedWorld] = useState(null);

  if (user) {
    if (user.role === "admin") return <AdminPanel />;

    if (appPage === "dashboard") {
      return <Dashboard onBack={() => setAppPage("home")} />;
    }

    if (appPage === "levels") {
      return (
        <LevelSelectPage
          world={selectedWorld}
          onBack={() => setAppPage("home")}
          onSelectLevel={(level) => {
            // TODO: navegar a preguntas
            console.log("Nivel seleccionado:", level);
          }}
        />
      );
    }

    return (
      <HomePage
        onGoToPanel={() => setAppPage("dashboard")}
        onSelectWorld={(worldId) => {
          setSelectedWorld(worldId);
          setAppPage("levels");
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
