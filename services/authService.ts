import { User, UserRole } from "@/types";

// ============================================================================
// 1. CONFIGURATION & CONSTANTES
// ============================================================================

// Basculez ceci via .env.local : NEXT_PUBLIC_USE_MOCK=true
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const TOKEN_KEY = "navigoo_auth_token";
const REFRESH_TOKEN_KEY = "navigoo_refresh_token";
const USER_KEY = "navigoo_user";
const MOCK_DELAY = 800; // Latence simulée pour l'UX

// ============================================================================
// 2. TYPES & INTERFACES
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  organization?: string;
  role?: UserRole;
  avatar?: string; // URL de l'avatar
}

export interface UpdateProfileData {
  name?: string;
  organization?: string;
  avatar?: string; // URL de l'avatar
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn?: number;
}

// ============================================================================
// 3. MOCK DATA (Pour le développement)
// ============================================================================

const MOCK_USERS: User[] = [
  { id: "admin-1", name: "Super Admin", email: "admin@navigoo.com", role: "admin", organization: "Navigoo HQ", avatar: "https://i.pravatar.cc/150?u=admin" },
  { id: "client-1", name: "Jean Client", email: "jean@test.com", role: "client", organization: "Freelance", avatar: "https://i.pravatar.cc/150?u=jean" }
];

// ============================================================================
// 4. HELPERS INTERNES
// ============================================================================

/**
 * Gestionnaire d'erreurs API centralisé
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Helper pour simuler une requête asynchrone (Mock)
 */
async function mockRequest<T>(callback: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = callback();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, MOCK_DELAY);
  });
}

/**
 * Wrapper fetch réel avec gestion d'erreurs
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthError(
        errorData.message || "Une erreur est survenue",
        response.status,
        errorData.code
      );
    }
    return response.json();
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Impossible de contacter le serveur.", 0, "NETWORK_ERROR");
  }
}

/**
 * Gestion du stockage local
 */
function storeAuthData(data: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  if (data.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

  // Auto-refresh logic (simplifiée pour la démo)
  if (data.expiresIn && !USE_MOCK_API) {
    const refreshTime = (data.expiresIn - 300) * 1000;
    setTimeout(() => authService.refreshToken().catch(console.error), refreshTime);
  }
}

function clearAuthData(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ============================================================================
// 5. SERVICE D'AUTHENTIFICATION (HYBRIDE)
// ============================================================================

export const authService = {
  
  /**
   * Login : Hybride Mock/Réel
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // --- MODE MOCK ---
    if (USE_MOCK_API) {
      return mockRequest(() => {
        if (credentials.password.length < 4) {
          throw new AuthError("Mot de passe trop court (min 4 caractères)", 400);
        }

        let user = MOCK_USERS.find(u => u.email === credentials.email);
        
        // Auto-creation pour faciliter les tests si l'user n'existe pas dans le mock
        if (!user) {
          const role = credentials.email.includes("admin") ? "admin" : "client";
          user = {
            id: `mock-${Date.now()}`,
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: role as UserRole,
            organization: "Nouvel Utilisateur Mock"
          };
          MOCK_USERS.push(user); // On l'ajoute temporairement en mémoire
        }

        const response: AuthResponse = {
          user,
          token: `mock-jwt-token-${user.id}`,
          refreshToken: `mock-refresh-${user.id}`,
          expiresIn: 3600
        };
        
        storeAuthData(response);
        return response;
      });
    }

    // --- MODE RÉEL ---
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    storeAuthData(response);
    return response;
  },

  /**
   * Inscription : Hybride Mock/Réel
   */
  async signup(userData: SignupData): Promise<AuthResponse> {
    // --- MODE MOCK ---
    if (USE_MOCK_API) {
      return mockRequest(() => {
        if (MOCK_USERS.some(u => u.email === userData.email)) {
          throw new AuthError("Cet email est déjà utilisé", 409);
        }

        const newUser: User = {
          id: `mock-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.role || "client",
          organization: userData.organization || "Ma Société",
          avatar: userData.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`
        };
        
        MOCK_USERS.push(newUser);

        const response: AuthResponse = {
          user: newUser,
          token: `mock-jwt-token-${newUser.id}`,
          refreshToken: `mock-refresh-${newUser.id}`,
          expiresIn: 3600
        };

        storeAuthData(response);
        return response;
      });
    }

    // --- MODE RÉEL ---
    const response = await apiRequest<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    storeAuthData(response);
    return response;
  },

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    try {
      if (!USE_MOCK_API) {
        await apiRequest("/auth/logout", { method: "POST" });
      }
      // En mock, on ne fait rien côté serveur, juste le cleanup local
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      clearAuthData();
    }
  },

  /**
   * Mise à jour du profil utilisateur
   */
  async updateProfile(userData: UpdateProfileData): Promise<User> {
    // 1. MODE MOCK
    if (USE_MOCK_API) {
      return mockRequest(() => {
        const storedString = localStorage.getItem(USER_KEY);
        if (!storedString) throw new AuthError("Utilisateur non connecté", 401);

        const currentUser = JSON.parse(storedString) as User;
        
        // Fusion des données
        const updatedUser = { ...currentUser, ...userData };
        
        // Mise à jour du Mock Array (pour persistance session mock)
        const index = MOCK_USERS.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            MOCK_USERS[index] = { ...MOCK_USERS[index], ...userData };
        }

        // Mise à jour du stockage local
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        
        return updatedUser;
      });
    }

    // 2. MODE API RÉEL
    const updatedUser = await apiRequest<User>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });

    // Mise à jour du cache local avec la réponse 'fraîche' du serveur
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  },

  /**
   * Rafraîchir le token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new AuthError("No refresh token", 401);

    // --- MODE MOCK ---
    if (USE_MOCK_API) {
      return mockRequest(() => {
        const newToken = `mock-new-token-${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, newToken);
        return newToken;
      });
    }

    // --- MODE RÉEL ---
    const response = await apiRequest<RefreshTokenResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    localStorage.setItem(TOKEN_KEY, response.token);
    return response.token;
  },

  /**
   * Récupérer l'utilisateur courant (Persistance au refresh)
   */
  async getCurrentUser(): Promise<User | null> {
    const cachedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) return null;

    // Stratégie "Cache First" pour performance immédiate
    if (cachedUser) {
      // Optionnel: Background validation si nécessaire
      return JSON.parse(cachedUser);
    }

    try {
      // Si pas de cache mais un token, on tente de récupérer le profil
      
      // --- MODE MOCK ---
      if (USE_MOCK_API) {
        // En mock, on "décode" faussement le token ou on renvoie le premier mock
        return mockRequest(() => MOCK_USERS[0]); 
      }

      // --- MODE RÉEL ---
      const user = await apiRequest<User>("/auth/me");
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      clearAuthData();
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
};