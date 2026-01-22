import { motion } from "framer-motion";
import Image from "next/image";
import { POI } from "@/types";
import { X, Navigation, Bookmark, Share2, Smartphone, Globe, Clock, MapPin, Star, MessageSquare, Edit, CheckCircle } from "lucide-react";
import { getCategoryConfig } from "@/data/categories";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData"; // Pour vérifier propriété
import { useAuth } from "@/hooks/useAuth";

interface PoiDetailsProps {
  poi: POI;
  onClose: () => void;
  isOpen: boolean;
  onOpenDirections: () => void;
}

export const PoiDetailsSidebar = ({ poi, onClose, isOpen, onOpenDirections }: PoiDetailsProps) => {
  const categoryConfig = getCategoryConfig(poi.poi_category);
  const router = useRouter();
  const { myPois, validatePoi } = useUserData();
  const { user } = useAuth();

  // Vérifier si le POI appartient à l'utilisateur
  const isOwner = myPois.some(p => p.poi_id === poi.poi_id);
  const isAdmin = user?.role === "admin";
  const canValidate = isAdmin && poi.status === "submitted";

  const handleEdit = () => {
    router.push(`/add-poi?id=${poi.poi_id}`);
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? "0%" : "-100%" }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 md:left-[72px] h-full w-full md:w-[400px] bg-white dark:bg-zinc-900 shadow-2xl z-[55] flex flex-col border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto"
    >
      {/* HEADER IMAGE HERO */}
      <div className="relative w-full h-56 shrink-0 bg-zinc-200">
        {poi.poi_images_urls && poi.poi_images_urls[0] ? (
            <Image src={poi.poi_images_urls[0]} alt={poi.poi_name} fill className="object-cover"/>
        ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-100">Aucune image</div>
        )}
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors z-20">
          <X size={20} />
        </button>

        {/* OWNER EDIT BUTTON */}
        {isOwner && (
            <button 
                onClick={handleEdit}
                className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
            >
                <Edit size={16} /> Modifier Infos
            </button>
        )}
      </div>

      {/* CONTENU */}
      <div className="p-6 space-y-6 pb-20">
        
        {/* STATUS BADGE */}
        {poi.status === "submitted" && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">
            En attente de validation
          </div>
        )}

        {/* TITRE & REVIEW */}
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight flex-1">{poi.poi_name}</h1>
          {canValidate && (
             <button
                onClick={() => { validatePoi(poi.poi_id); onClose(); }}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl shadow-lg transition-colors flex items-center gap-2"
                title="Valider ce point d&apos;intérêt"
             >
                <CheckCircle size={20} />
                <span className="text-xs font-bold pr-1">Valider</span>
             </button>
          )}
        </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="font-black text-sm bg-green-600 text-white px-1.5 rounded">{poi.rating || "N/A"}</span>
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} fill={star <= Math.round(poi.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-zinc-500 text-sm underline">({poi.review_count} avis)</span>
            <span className="text-zinc-300">•</span>
            <span className="text-primary text-sm font-semibold flex items-center gap-1">
                {categoryConfig.icon} {categoryConfig.label}
            </span>
          </div>

        {/* ACTIONS CIRCULAIRES */}
        <div className="flex justify-between px-2 py-2">
          <ActionButton icon={<Navigation size={22} className="-rotate-45 ml-1 mt-1" />} label="Y aller" active onClick={onOpenDirections} />
          <ActionButton icon={<Bookmark size={22} />} label="Sauver" onClick={() => {}}/>
          <ActionButton icon={<Share2 size={22} />} label="Partager" onClick={() => {}}/>
          <ActionButton icon={<Globe size={22} />} label="Site web" onClick={() => {}} disabled={!poi.poi_contacts?.website} />
        </div>

        <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />

        {/* DESCRIPTION */}
        <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>{poi.poi_description || "Aucune description disponible."}</p>
        </div>

        {/* SUBMITTER INFO */}
        {(poi.submitted_by_name || poi.organization) && (
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
             <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Soumis par</h4>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                   {poi.submitted_by_name?.charAt(0) || "O"}
                </div>
                <div>
                   <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{poi.submitted_by_name || "Explorateur anonyme"}</p>
                   {poi.organization && <p className="text-[11px] text-zinc-500">{poi.organization}</p>}
                </div>
             </div>
          </div>
        )}

        {/* AMENITIES */}
        {poi.poi_amenities && poi.poi_amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {poi.poi_amenities.map(am => (
                    <span key={am} className="text-xs px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full font-medium border border-zinc-200 dark:border-zinc-700">
                        {am}
                    </span>
                ))}
            </div>
        )}

        <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />

        {/* INFO PRATIQUES */}
        <div className="space-y-4">
          <InfoRow icon={<MapPin className="text-zinc-400" size={20} />} text={poi.address_informal || `${poi.address_city}, ${poi.address_country || "Cameroun"}`} />
          <InfoRow icon={<Clock className="text-zinc-400" size={20} />} text="Ouvert maintenant (ferme à 22h)" isActive />
          <InfoRow icon={<Smartphone className="text-zinc-400" size={20} />} text={poi.poi_contacts?.phone || "Non renseigné"} />
        </div>

        <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />

        {/* SECTION AVIS / COMMENTAIRES */}
        <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MessageSquare size={18} /> Avis et commentaires
            </h3>
            
            <div className="space-y-4">
                {/* Simulation Commentaire 1 */}
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm">JM</div>
                    <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-r-xl rounded-bl-xl text-sm flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold">Jean-Marc</span>
                            <div className="flex text-yellow-500"><Star size={10} fill="currentColor"/> 5.0</div>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300">Très bel endroit, je recommande pour les soirées entre amis !</p>
                    </div>
                </div>

                {/* Simulation Commentaire 2 */}
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600 text-sm">AL</div>
                    <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-r-xl rounded-bl-xl text-sm flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold">Alice L.</span>
                            <div className="flex text-yellow-500"><Star size={10} fill="currentColor"/> 4.0</div>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300">Le service est un peu lent mais la nourriture est excellente.</p>
                    </div>
                </div>
            </div>

            <button className="w-full mt-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-500 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors">
                Voir les 45 avis
            </button>
        </div>

      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon, label, active, onClick, disabled }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center gap-2 group ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
      active ? "bg-primary text-white border-primary shadow-md" : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-primary hover:border-primary/30"
    }`}>
      {icon}
    </div>
    <span className={`text-[10px] font-medium uppercase tracking-wide ${active ? "text-primary" : "text-zinc-500"}`}>{label}</span>
  </button>
);

const InfoRow = ({ icon, text, isActive }: any) => (
  <div className="flex items-start gap-4">
    <div className="mt-0.5 min-w-[20px]">{icon}</div>
    <span className={`text-sm ${isActive ? "text-green-600 font-bold" : "text-zinc-700 dark:text-zinc-300"}`}>{text}</span>
  </div>
);