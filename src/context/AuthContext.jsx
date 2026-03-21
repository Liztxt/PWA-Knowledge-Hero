import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const BASE_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const updateProfile = async (username, avatar, email) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, avatar, email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al actualizar");

  localStorage.setItem("user", JSON.stringify(data.user));
  setUser(data.user);
  return data.user;
};
const scheduleDelete = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/auth/schedule-delete`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
const cancelDelete = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/auth/cancel-delete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (username, password, role = "user", email = null) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ username, password, role, email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al registrarse");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile, scheduleDelete, cancelDelete }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
