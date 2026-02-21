import { useAuth } from "../context/AuthContext";

// Uso: <ProtectedRoute allowedRoles={["admin"]}> <AdminPanel /> </ProtectedRoute>
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return null;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080b12",
        color: "#fc8181",
        fontFamily: "monospace"
      }}>
        403 — No tienes permiso para ver esta página.
      </div>
    );
  }

  return children;
}
