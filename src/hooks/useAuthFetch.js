// Hook utilitario: hace fetch con el JWT incluido automáticamente
// Uso: const { authFetch } = useAuthFetch();
//      const data = await authFetch("/api/protected-route");

import { useAuth } from "../context/AuthContext";

export function useAuthFetch() {
  const { logout } = useAuth();
  const BASE_URL = "http://localhost:5000";

  const authFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    // Si el token expiró, cierra sesión automáticamente
    if (res.status === 401) {
      logout();
      throw new Error("Sesión expirada");
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error en la petición");
    return data;
  };

  return { authFetch };
}
