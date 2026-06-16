import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRegister, useLogin, useGetMe } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("imperial_token"));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const { data: meData } = useGetMe({
    query: { enabled: !!token, staleTime: 5 * 60 * 1000, queryKey: ["me"] },
  });

  useEffect(() => {
    if (meData) {
      setUser(meData as unknown as User);
    }
    setIsLoading(false);
  }, [meData]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginMutation.mutateAsync({ data: { email, password } });
      const t = result.token;
      setToken(t);
      setUser(result.user);
      localStorage.setItem("imperial_token", t);
      queryClient.invalidateQueries({ queryKey: ["getMe"] });
    },
    [loginMutation, queryClient]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await registerMutation.mutateAsync({ data: { name, email, password } });
      const t = result.token;
      setToken(t);
      setUser(result.user);
      localStorage.setItem("imperial_token", t);
      queryClient.invalidateQueries({ queryKey: ["getMe"] });
    },
    [registerMutation, queryClient]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("imperial_token");
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
