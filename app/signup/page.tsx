"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/form/FormInput";
import { FormSelect } from "@/components/ui/form/FormSelect";
import { MapPinHouse, User, Mail, Lock, Building, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const { signup, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({
        name,
        email,
        role: "client",
        organization
      }, password);
      router.push("/");
    } catch (error) {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-4 rounded-2xl mb-4">
            <MapPinHouse className="text-primary" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Créer un compte</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 text-center">
            Rejoignez la communauté Navigoo et commencez à explorer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jean Dupont"
            icon={<User size={18} />}
            required
          />
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
            label="Organisation"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Nom de votre organisation"
            icon={<Building size={18} />}
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
            className="w-full h-12 text-base font-bold mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Création..." : "S'inscrire"}
            {!isLoading && <ArrowRight size={18} className="ml-2" />}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center text-sm">
          <span className="text-zinc-500">Déjà un compte ?</span>{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
