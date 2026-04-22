import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, AppRole } from "@/hooks/useAuth";

export default function RoleRoute({
  role,
  children,
}: {
  role: AppRole;
  children: ReactNode;
}) {
  const { user, role: current, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (current !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}
