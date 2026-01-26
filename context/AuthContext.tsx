"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { User } from "@/types";
import { 
  authService, 
  LoginCredentials, 
  SignupData, 
  AuthError, 
  UpdateProfileData
} from "@/services/authService";

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: UpdateProfileData) => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// CONTEXTE
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialisation - Récupérer l'utilisateur depuis le token
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Erreur initialisation auth:", err);
        // Token invalide/expiré, nettoyage
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Gestion des erreurs avec timeout auto-clear
   */
  const handleError = useCallback((err: unknown) => {
    const message = err instanceof AuthError 
      ? err.message 
      : "Une erreur inattendue est survenue";
    
    setError(message);

    // Auto-clear après 5 secondes
    setTimeout(() => setError(null), 5000);
  }, []);

  /**
   * Connexion
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (err) {
      handleError(err);
      throw err; // Re-throw pour gestion dans les composants
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Inscription
   */
  const signup = useCallback(async (userData: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.signup(userData);
      setUser(response.user);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Déconnexion
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Erreur déconnexion:", err);
      // Force le nettoyage même en cas d'erreur
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mise à jour du profil
   */
  const updateProfile = useCallback(async (data: Partial<Omit<User, "id" | "email" | "role">>) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Clear manuel de l'erreur
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================================================
  // VALEUR DU CONTEXTE
  // ============================================================================

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// HOOK PERSONNALISÉ
// ============================================================================

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  
  return context;
};