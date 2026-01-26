"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/form/FormInput";
import { MapPinHouse, Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Utilisation exclusive du hook, pas de service direct
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login({ email, password });
      router.push("/");
    } catch (err: any) {
      // Gestion d'erreur locale pour l'UX
      setError(err.message || "Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800 relative">
        
        {/* Bouton Retour (UX Vital) */}
        <button 
          onClick={() => router.back()} 
          className="absolute top-6 left-6 p-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="bg-primary/10 p-4 rounded-2xl mb-4">
            <MapPinHouse className="text-primary" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Bon retour !</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 text-center max-w-[260px]">
            Connectez-vous pour retrouver vos favoris.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Zone d'erreur visuelle */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle size={16} className="shrink-0" /> 
              <span>{error}</span>
            </div>
          )}

          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            icon={<Mail size={18} />}
            required
          />
          <FormInput
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock size={18} />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Se connecter
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center text-sm">
          <span className="text-zinc-500">Pas encore de compte ?</span>{" "}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}