import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import AuthContext from "@/context/auth-context";
import { registerAuthClear, setAccessToken } from "@/lib/axios";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessTokenState, setAccessTokenState] = useState(null);

  const clear = useCallback(() => {
    setAccessToken(null);
    setAccessTokenState(null);
    setUser(null);
  }, []);

  const authenticate = useCallback((token, nextUser) => {
    setAccessToken(token);
    setAccessTokenState(token);
    setUser(nextUser);
  }, []);

  useEffect(() => {
    registerAuthClear(clear);
    return () => registerAuthClear(() => {});
  }, [clear]);

  const bootstrap = useQuery({
    queryKey: ["auth", "bootstrap"],
    queryFn: async () => {
      try {
        const refreshed = await authApi.refresh();
        const token = refreshed?.data?.accessToken;
        if (!token) throw new Error(refreshed?.message || "Could not restore your session.");
        setAccessToken(token);
        const current = await authApi.me();
        if (!current?.data) throw new Error(current?.message || "Could not load your profile.");
        authenticate(token, current.data);
        return current.data;
      } catch (error) {
        clear();
        throw error;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  const login = useCallback((tokens) => {
    authenticate(tokens.accessToken, tokens.user);
  }, [authenticate]);

  const value = useMemo(() => ({
    user,
    accessToken: accessTokenState,
    status: user && accessTokenState ? "authenticated" : bootstrap.isPending ? "loading" : "anonymous",
    isBootstrapping: bootstrap.isPending,
    login,
    clear,
    setUser,
  }), [user, accessTokenState, bootstrap.isPending, login, clear]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
