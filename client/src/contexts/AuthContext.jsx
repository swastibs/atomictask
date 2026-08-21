import { createContext, useState, useEffect, useCallback } from "react";
import {
  getToken,
  setToken,
  removeToken,
  getUserFromToken,
  isTokenValid,
} from "../utils/token";
import axiosInstance from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isTokenValid()) {
      setUser(getUserFromToken());
    } else {
      removeToken();
    }
    setLoading(false);
  }, []);

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
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
