"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/form/FormInput";
import { User, Mail, Lock, Building, ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);

  const { signup, isLoading } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signup({
        ...formData,
        role: "client", // Rôle par défaut
      });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800 relative">
        
        <button 
          onClick={() => router.back()} 
          className="absolute top-6 left-6 p-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col items-center mb-6 mt-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Créer un compte</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
            Rejoignez la communauté Navigoo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
          )}

          <FormInput
            label="Nom complet"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jean Dupont"
            icon={<User size={18} />}
            required
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            icon={<Mail size={18} />}
            required
          />
          <FormInput
            label="Organisation"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Optionnel"
            icon={<Building size={18} />}
          />
          <FormInput
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={<Lock size={18} />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 text-base font-bold mt-2 shadow-lg shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "S'inscrire"}
            {!isLoading && <ArrowRight size={18} className="ml-2" />}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center text-sm">
          <span className="text-zinc-500">Déjà membre ?</span>{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}