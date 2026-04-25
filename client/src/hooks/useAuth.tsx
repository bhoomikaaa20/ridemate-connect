import { createContext, useContext, useEffect, useState } from "react";

export type AppRole = "user" | "rider" | "admin";

interface AuthCtx {
  user: any;
  role: AppRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include"
      });
      const data = await res.json();
      setUser(data);
      setRole(data?.role);
    } catch {
      setUser(null);
      setRole(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signOut = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    setUser(null);
    setRole(null);
  };

  return (
    <Ctx.Provider value={{ user, role, loading, signOut, refreshUser: fetchUser }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}