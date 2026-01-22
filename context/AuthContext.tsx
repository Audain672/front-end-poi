"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, "id">, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Omit<User, "id" | "role">>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("navigoo_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulation d'un service d'authentification
    // Pour le test, on accepte n'importe quel email/password
    // et on définit le rôle en fonction de l'email
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: "user_" + Date.now(),
        name: email.split("@")[0],
        email: email,
        role: email.includes("admin") ? "admin" : "client",
        organization: "My Org",
      };

      setUser(mockUser);
      localStorage.setItem("navigoo_user", JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Omit<User, "id">, password: string) => {
    setIsLoading(true);
    try {
      const newUser: User = {
        ...userData,
        id: "user_" + Date.now(),
      };
      setUser(newUser);
      localStorage.setItem("navigoo_user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("navigoo_user");
  };

  const updateProfile = async (data: Partial<Omit<User, "id" | "role">>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("navigoo_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
