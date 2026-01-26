# Navigoo - Plateforme de Navigation et Points d'Intérêt (POI)

Navigoo est une application web moderne permettant de naviguer sur une carte, de découvrir des points d'intérêt (POI), de calculer des itinéraires et de contribuer à enrichir la base de données via un système de soumission et de validation.

## 🚀 Fonctionnalités Clés

### 1. Navigation et Carte
- **Exploration Interactive** : Visualisation des POI sur une carte dynamique utilisant MapLibre GL.
- **Recherche et Filtrage** : Recherche de POI par nom et filtrage par catégories (Restaurants, Hôtels, Culture, etc.).
- **Calcul d'Itinéraires** : Calcul du trajet entre votre position et un POI sélectionné, avec statistiques (distance, durée).

### 2. Système d'Authentification
- **Inscription** : Les utilisateurs peuvent créer un compte en spécifiant leur nom, email, mot de passe et organisation.
- **Connexion** : Accès sécurisé aux fonctionnalités de création et de gestion.
- **Gestion de Session** : Persistance de la session via `localStorage` (simulation de service backend).

### 3. Workflow des Points d'Intérêt (Contribution)
- **Soumission (Clients)** : Seuls les utilisateurs authentifiés peuvent soumettre de nouveaux POI.
- **État "Soumis"** : Un nouveau POI a initialement l'état `submitted`. Il n'est visible que par son auteur et les administrateurs.
- **Validation (Administrateurs)** : Les administrateurs possèdent un bouton spécial "Valider" dans la fiche détails du POI. Une fois validé, le POI passe à l'état `validated` et devient public pour tous les utilisateurs.

### 4. Profil Utilisateur
- **Visualisation** : Consultation des informations personnelles et du rôle (Client ou Admin).
- **Mise à jour** : Possibilité de modifier les informations non sensibles comme le nom et l'organisation.

### 5. Contenus Additionnels (Placeholders)
- **Podcasts et Blocs** : Sections prévues pour de futurs contenus, accessibles uniquement après authentification.

---

## 👥 Rôles Utilisateurs

| Rôle | Capacités |
| :--- | :--- |
| **Visiteur (Anonyme)** | Consulter les POI validés, faire des recherches, calculer des itinéraires. |
| **Client (Connecté)** | Toutes les capacités du visiteur + Soumettre des POI, voir ses propres soumissions en attente, modifier son profil. |
| **Administrateur** | Toutes les capacités du client + Voir TOUS les POI (soumis et validés), Valider les POI soumis par les clients. |

---

## 📂 Hiérarchie du Projet

```text
.
├── app/                    # Routes et pages Next.js (App Router)
│   ├── add-poi/            # Formulaire de création de POI
│   ├── login/              # Page de connexion
│   ├── signup/             # Page d'inscription
│   ├── profile/            # Gestion du profil utilisateur
│   ├── layout.tsx          # Layout principal et AuthProvider
│   └── page.tsx            # Page d'accueil (Carte et Sidebars)
├── components/             # Composants React réutilisables
│   ├── map/                # Composant de carte MapLibre
│   ├── navigation/         # Barre de recherche, barre de catégories
│   ├── sidebar/            # Panneaux latéraux (Détails, Itinéraire, etc.)
│   └── ui/                 # Composants d'interface (Boutons, Inputs)
├── context/                # Contextes React (Authentification)
├── data/                   # Données de test (Mock Data) et catégories
├── hooks/                  # Hooks personnalisés (useAuth, useUserData)
├── public/                 # Assets statiques (Images, SVG)
├── services/               # Services API (Calcul d'itinéraire)
├── types/                  # Définitions de types TypeScript
├── package.json            # Dépendances et scripts
└── tsconfig.json           # Configuration TypeScript
```

---

## 🛠️ Technologies Utilisées

- **Framework** : [Next.js](https://nextjs.org/) (React)
- **Langage** : TypeScript
- **Style** : Tailwind CSS
- **Carte** : MapLibre GL / React Map GL
- **Icônes** : Lucide React
- **Animations** : Framer Motion

---

## ⚙️ Installation et Lancement

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

3. **Accéder à l'application** : Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

4. **Tester les rôles** :
   - Pour être **Admin** : Connectez-vous avec un email contenant le mot "admin" (ex: `admin@navigoo.com`).
   - Pour être **Client** : Utilisez n'importe quel autre email.
