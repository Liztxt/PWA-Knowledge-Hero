import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL;

export function useAuthFetch() {
  const { logout } = useAuth();
 

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
