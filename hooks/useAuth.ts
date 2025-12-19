import { useState, useEffect } from "react";
import { authAPI, API_URL } from "../api/client";

const AUTH_KEY = "christmas_auth_token";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查 sessionStorage 中是否已登录
    const token = sessionStorage.getItem(AUTH_KEY);
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const login = async (password: string) => {
    try {
      const result = await authAPI.login(password);

      if (result.success && result.token) {
        sessionStorage.setItem(AUTH_KEY, result.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  const getToken = () => {
    return sessionStorage.getItem(AUTH_KEY);
  };

  return { isAuthenticated, isLoading, login, logout, getToken, apiUrl: API_URL };
}
