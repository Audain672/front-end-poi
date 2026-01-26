import { Search, Menu, X, History, MapPin, Navigation2 } from "lucide-react";
import { useState, useRef } from "react";
import clsx from "clsx";
import { POI } from "@/types";

interface SearchInputProps {
  onMenuClick: () => void;
  className?: string;
  pois: POI[];
  onSearch: (query: string) => void;
  onSelectResult: (poi: POI) => void;
  onLocateMe: () => void;
  recentSearches: string[];
  recentPois: POI[];
}

export const SearchInput = ({
  onMenuClick,
  className,
  pois,
  onLocateMe,
  onSearch,
  onSelectResult,
  recentSearches,
  recentPois
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = query.length > 0 
    ? pois.filter(p => p.poi_name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch(query);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleSelectPoi = (poi: POI) => {
    setQuery(poi.poi_name);
    onSelectResult(poi);
    setIsFocused(false);
  };

  return (
    <div className={clsx("relative group", className)}>
      {/* Ombre portée améliorée pour détacher du fond de carte */}
      <div className={clsx(
          "absolute inset-0 bg-white/80 dark:bg-zinc-900/90 rounded-3xl transition-all duration-300",
          isFocused ? "shadow-2xl scale-[1.02]" : "shadow-md hover:shadow-lg"
      )} />

      <form 
        onSubmit={handleSearchSubmit}
        className={clsx(
          "relative flex items-center h-12 px-1 z-10 transition-all border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-md rounded-3xl",
          isFocused ? "bg-white dark:bg-zinc-900 rounded-b-none border-b-0" : "bg-white/90 dark:bg-zinc-900/90"
        )}
      >
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2.5 ml-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        >
          {isFocused ? <Search size={20} className="text-primary"/> : <Menu size={20} />}
        </button>

        <input
          ref={inputRef}
          type="text" 
          placeholder="Rechercher un lieu, un restaurant..."
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-zinc-800 dark:text-zinc-100 px-3 placeholder:text-zinc-400 font-medium"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === "") onSearch("");
          }}
        />

        <div className="flex items-center pr-1.5 gap-1">
          {query && (
            <button 
              type="button" 
              onClick={() => { setQuery(""); onSearch(""); inputRef.current?.focus(); }} 
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X size={18} />
            </button>
          )}
          
          {/* Séparateur */}
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700 mx-1"></div>
          
          <button 
            type="button" 
            onClick={onLocateMe}
            className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
            title="Me localiser"
          >
             <Navigation2 size={18} className="-rotate-45 fill-primary/20" />
          </button>
        </div>
      </form>

      {/* --- MENU DÉROULANT --- */}
      {isFocused && (
        <>
          <div className="fixed inset-0 z-0" onClick={() => setIsFocused(false)} />
          
          <div className="absolute top-full left-0 w-full bg-white dark:bg-zinc-900 rounded-b-3xl shadow-2xl border-x border-b border-zinc-200 dark:border-zinc-800 overflow-hidden z-20 pb-2 animate-in slide-in-from-top-2 duration-200">
             
             {/* Ligne de séparation visuelle */}
             <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent mb-2"></div>

             {/* RÉSULTATS ACTIFS */}
             {query.length > 0 && (
                <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                  {suggestions.length > 0 ? (
                    suggestions.map(poi => (
                      <SuggestionItem
                        key={poi.poi_id}
                        icon={<MapPin size={18} className="text-red-500" />} 
                        title={poi.poi_name} 
                        subtitle={poi.address_city} 
                        onClick={() => handleSelectPoi(poi)}
                        highlight
                      />
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-zinc-400">
                        <p className="text-sm">Aucun résultat pour &quot;{query}&quot;</p>
                    </div>
                  )}
                </div>
             )}

             {/* HISTORIQUE (Si vide) */}
             {query.length === 0 && (
                <div className="py-2">
                  <div className="px-5 py-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Récemment consultés</span>
                  </div>
                  
                  {recentPois.length > 0 ? recentPois.map((poi) => (
                    <SuggestionItem 
                      key={`recent-${poi.poi_id}`}
                      icon={<History size={18} className="text-primary/60" />} 
                      title={poi.poi_name} 
                      subtitle={poi.poi_category}
                      onClick={() => handleSelectPoi(poi)}
                    />
                  )) : (
                    <div className="px-5 py-4 text-sm text-zinc-400 italic">
                        Votre historique de recherche apparaîtra ici.
                    </div>
                  )}
                </div>
             )}
          </div>
        </>
      )}
    </div>
  );
};

const SuggestionItem = ({ icon, title, subtitle, onClick, highlight }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center gap-4 py-3 px-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group border-l-2 border-transparent hover:border-primary"
  >
    <div className={clsx(
      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
      highlight ? "bg-red-50 dark:bg-red-900/20" : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-700"
    )}>
      {icon}
    </div>
    <div className="flex flex-col min-w-0">
      <span className={clsx(
          "text-sm font-semibold truncate", 
          highlight ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-200"
      )}>
        {title}
      </span>
      {subtitle && <span className="text-xs text-zinc-500 truncate">{subtitle}</span>}
    </div>
  </div>
);