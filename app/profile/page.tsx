"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/form/FormInput";
import { User, Mail, Building, ArrowLeft, Save, LogOut, Shield, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();
  const router = useRouter();

  // Ajout du champ avatar dans le state local
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    avatar: "", // Nouveau champ
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        organization: user.organization || "",
        avatar: user.avatar || "", // Chargement de l'avatar existant
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(false);

    try {
      // Envoi de l'avatar à la mise à jour
      await updateProfile({ 
        name: formData.name, 
        organization: formData.organization,
        avatar: formData.avatar 
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-zinc-600 dark:text-zinc-400" />
            </button>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Mon Profil</h1>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="text-red-600 bg-red-50 hover:bg-red-100">
            <LogOut size={18} className="mr-2" /> <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          
          {/* Header avec Prévisualisation en direct */}
          <div className="p-8 bg-gradient-to-br from-primary/5 via-transparent to-transparent border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-6">
            <div className="relative group">
              {/* Si une URL d'avatar valide est entrée, on l'affiche, sinon initiales */}
              {formData.avatar ? (
                <img 
                  src={formData.avatar} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-white"
                  onError={(e) => {
                    // Fallback si l'image ne charge pas (lien cassé)
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-primary text-3xl font-bold border border-zinc-100 shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{formData.name || user.name}</h2>
              <p className="text-zinc-500 text-sm mt-1">Gérez vos informations personnelles</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Ligne 1 : Nom et Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Nom complet"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<User size={18} />}
                  required
                />
                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="opacity-60 bg-zinc-50"
                  icon={<Mail size={18} />}
                />
              </div>

              {/* Ligne 2 : Organisation */}
              <FormInput
                label="Organisation"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                icon={<Building size={18} />}
              />

              {/* Ligne 3 : URL Avatar */}
              <FormInput
                label="URL de l'avatar (Photo)"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/ma-photo.jpg"
                icon={<ImageIcon size={18} />}
                // Petit helper text
              />
              <p className="-mt-4 text-xs text-zinc-400 ml-1">
                Collez un lien vers une image (ex: Gravatar, LinkedIn profile pic URL, etc.)
              </p>
            </div>

            <div className="pt-4 flex items-center justify-end gap-4">
              {successMsg && (
                <span className="text-green-600 text-sm font-medium flex items-center animate-in fade-in">
                  <CheckCircle2 size={16} className="mr-1" /> Profil mis à jour !
                </span>
              )}
              
              <Button
                type="submit"
                variant="primary"
                className="px-8 h-12 font-bold shadow-lg shadow-primary/20"
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Enregistrer</>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}