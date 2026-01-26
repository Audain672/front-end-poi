"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchInput } from "./SearchInput";
import { CategoryBar } from "./CategoryBar";
import { POI } from "@/types";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth"; 
import { LogIn, Loader2, LayoutGrid, Grip } from "lucide-react";

interface TopLayoutProps {
  onToggleSidebar: () => void;
  allPois: POI[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSearch: (query: string) => void;
  onSelectResult: (poi: POI) => void;
  onLocateMe: () => void;
  recentSearches: string[];
  recentPois: POI[];
}

export const TopLayout = ({
  onToggleSidebar,
  allPois,
  selectedCategory,
  onSelectCategory,
  onSearch,
  onLocateMe,
  onSelectResult,
  recentSearches,
  recentPois
}: TopLayoutProps) => {

  const { user, isLoading } = useAuth();
  const router = useRouter();

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="absolute top-0 left-0 w-full z-40 bg-transparent py-3 pl-[88px] pr-4 pointer-events-none flex items-start gap-3">
      
      {/* --- BLOC 1 : RECHERCHE (Priorité visuelle haute) --- */}
      {/* shrink-0 empêche la barre de recherche d'être écrasée */}
      <div className="pointer-events-auto min-w-[260px] max-w-[420px] md:min-w-[260px] shrink-0">
        <SearchInput 
          onMenuClick={onToggleSidebar}
          pois={allPois}
          onSearch={onSearch}
          onSelectResult={onSelectResult}
          onLocateMe={onLocateMe}
          recentSearches={recentSearches}
          recentPois={recentPois}
        />
      </div>

      {/* --- BLOC 2 : CATÉGORIES + AUTH --- */}
      {/* min-w-0 permet au flex container de rétrécir sans casser le layout */}
      <div className="flex-1 flex items-center justify-between min-w-0 pointer-events-auto">
        
        {/* Catégories - Disparaît intelligemment si l'écran est trop petit (lg requis maintenant pour éviter le conflit) */}
        <div className="flex-1 min-w-0 overflow-hidden mx-2 hidden md:block">
           <CategoryBar 
             selected={selectedCategory} 
             onSelect={onSelectCategory} 
           />
        </div>

        {/* --- ZONE D'ACTION UTILISATEUR --- */}
        <div className="flex items-center gap-3 shrink-0 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-1.5 rounded-full border border-white/20 shadow-sm">
          
          {/* Bouton App Launcher (Caché sur mobile) */}
          <button className="hidden xl:flex items-center justify-center w-10 h-10 bg-white dark:bg-zinc-800 rounded-full shadow-md text-zinc-600 hover:bg-gray-50 transition-colors">
            <LayoutGrid size={20} />
          </button>

          {/* LOGIQUE AUTH */}
          {isLoading ? (
            <div className="h-10 w-10 md:w-28 bg-white dark:bg-zinc-800 rounded-full shadow-md flex items-center justify-center">
               <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
            </div>
          ) : user ? (
            // CONNECTÉ -> AVATAR
            <button 
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 pr-3 pl-1 py-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all group"
            >
              {/* IMAGE OU INITIALES */}
              {user.avatar ? (
                 <img 
                   src={user.avatar} 
                   alt={user.name} 
                   className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-sm"
                 />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold border-2 border-white dark:border-zinc-700 shadow-sm">
                   {getInitials(user.name)}
                </div>
              )}
              
              {/* Nom (Desktop uniquement) */}
              <div className="hidden md:flex flex-col items-start mr-1">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-none max-w-[80px] truncate">
                  {user.name}
                </span>
              </div>
            </button>
          ) : (
            // NON CONNECTÉ -> BOUTON ACTION
            <Link href="/login">
              <div className="h-10 w-10 md:w-auto md:px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95">
                <LogIn size={18} strokeWidth={2.5} />
                {/* Texte caché sur mobile pour sauver l'espace */}
                <span className="hidden md:inline font-semibold text-sm">
                  Connexion
                </span>
              </div>
            </Link>
          )}

        </div>
      </div>
    </div>
  );
};