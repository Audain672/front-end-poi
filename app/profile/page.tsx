"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/form/FormInput";
import { User, Mail, Building, ArrowLeft, Save, LogOut, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setOrganization(user.organization || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ name, email, organization });
      alert("Profil mis à jour !");
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <ArrowLeft size={24} className="text-zinc-600 dark:text-zinc-400" />
            </button>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Mon Profil</h1>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50">
            <LogOut size={18} className="mr-2" /> Déconnexion
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-8 bg-primary/5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold border-4 border-white dark:border-zinc-900 shadow-sm">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{user?.name}</h2>
              <p className="text-zinc-500 flex items-center gap-2 mt-1">
                <Shield size={14} className="text-primary" />
                Rôle : <span className="font-semibold uppercase text-xs tracking-wider">{user?.role}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User size={18} />}
                required
              />
              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                required
              />
              <FormInput
                label="Organisation"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                icon={<Building size={18} />}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                className="px-8 h-12 font-bold shadow-lg shadow-primary/20"
                disabled={isSaving}
              >
                {isSaving ? "Enregistrement..." : (
                  <>
                    <Save size={18} className="mr-2" /> Enregistrer les modifications
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
