import { useState, useCallback } from "react";
import {
  setToken,
  removeToken,
  getUserFromToken,
  isTokenValid,
} from "../utils/token";
import axiosInstance from "../api/axios";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (!isTokenValid()) {
      removeToken();
      return null;
    }
    return getUserFromToken();
  });

  const login = useCallback(async (email, password) => {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    const { user, token } = response.data.data;
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const response = await axiosInstance.post("/auth/signup", {
      name,
      email,
      password,
    });
    return response.data.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      removeToken();
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading: false,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
