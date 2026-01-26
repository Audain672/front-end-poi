"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { LogIn, UserPlus, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export const AuthButtons = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Fermeture dropdown au clic extérieur
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  /**
   * Gestion déconnexion
   */
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
  };

  /**
   * État de chargement
   */
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </div>
    );
  }

  /**
   * Utilisateur NON connecté
   */
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => router.push("/login")}
            className="h-9 px-4 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <LogIn size={16} className="mr-2" />
            Connexion
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push("/signup")}
            className="h-9 px-4 text-sm font-semibold shadow-md"
          >
            <UserPlus size={16} className="mr-2" />
            S'inscrire
          </Button>
        </div>

        {/* Mobile - Bouton unique */}
        <div className="md:hidden">
          <Button
            variant="primary"
            onClick={() => router.push("/login")}
            size="sm"
            className="h-9 px-3"
          >
            <LogIn size={18} />
          </Button>
        </div>
      </div>
    );
  }

  /**
   * Utilisateur CONNECTÉ - Avatar + Dropdown
   */
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={clsx(
          "flex items-center gap-2 h-10 px-3 rounded-full transition-all",
          "hover:bg-zinc-100 dark:hover:bg-zinc-800",
          "border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700",
          isDropdownOpen && "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
        )}
      >
        {/* Avatar */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-sm shadow-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* Nom (Desktop uniquement) */}
        <span className="hidden md:block text-sm font-semibold text-zinc-800 dark:text-zinc-100 max-w-[120px] truncate">
          {user.name.split(" ")[0]}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={clsx(
            "hidden md:block text-zinc-400 transition-transform",
            isDropdownOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-lg shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {user.email}
                  </p>
                  {user.role === "admin" && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase">
                      Administrateur
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <DropdownItem
                icon={<User size={18} />}
                label="Mon Profil"
                onClick={() => {
                  router.push("/profile");
                  setIsDropdownOpen(false);
                }}
              />
              <DropdownItem
                icon={<Settings size={18} />}
                label="Paramètres"
                onClick={() => {
                  router.push("/profile#settings");
                  setIsDropdownOpen(false);
                }}
              />
            </div>

            {/* Logout */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 p-2">
              <DropdownItem
                icon={<LogOut size={18} />}
                label="Déconnexion"
                onClick={handleLogout}
                variant="danger"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// DROPDOWN ITEM COMPONENT
// ============================================================================

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

const DropdownItem = ({ icon, label, onClick, variant = "default" }: DropdownItemProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
        variant === "default" && "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800",
        variant === "danger" && "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
      )}
    >
      <span className="opacity-70">{icon}</span>
      <span>{label}</span>
    </button>
  );
};