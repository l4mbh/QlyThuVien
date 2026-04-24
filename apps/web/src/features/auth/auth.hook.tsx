import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type User } from "@/types/auth/user.entity";
import { authService } from "./auth.service";
import { type LoginRequest, type RegisterRequest } from "@/types/auth/auth.type";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return null;
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("AuthHook: Failed to parse stored user", e);
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken || storedToken === "undefined" || storedToken === "null") return null;
    return storedToken;
  });
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    console.log("AuthHook: Logging out...");
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const login = async (data: LoginRequest) => {
    console.log("AuthHook: Attempting login for", data.email);
    const response = await authService.login(data);
    console.log("AuthHook: Login successful, setting state for", response.user.email);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      console.log("AuthHook: Initializing auth state...", { 
        hasToken: !!storedToken, 
        hasUser: !!storedUser,
        tokenPrefix: storedToken ? `${storedToken.substring(0, 10)}...` : null
      });

      if (storedToken) {
        try {
          // If we have a user in storage, it's already set by useState initializer
          // but we verify with backend anyway to get fresh data
          const freshUser = await authService.getMe();
          console.log("AuthHook: Session verified, user is", freshUser.role);
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        } catch (error) {
          console.error("AuthHook: Failed to restore session:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

