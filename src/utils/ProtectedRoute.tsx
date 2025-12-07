import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
