// constants/poiConstants.ts

import { POIStatus } from "@/types";

/**
 * Configuration des badges de statut POI
 */
export const POI_STATUS_CONFIG: Record<
  POIStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    darkBgColor: string;
    icon: string;
    description: string;
  }
> = {
  submitted: {
    label: "En attente",
    color: "#D97706", // text-amber-600
    bgColor: "#FEF3C7", // bg-amber-100
    darkBgColor: "#78350F33", // dark:bg-amber-900/20
    icon: "⏳",
    description: "Ce POI est en attente de validation par un administrateur",
  },
  validated: {
    label: "Validé",
    color: "#16A34A", // text-green-600
    bgColor: "#DCFCE7", // bg-green-100
    darkBgColor: "#14532D33", // dark:bg-green-900/20
    icon: "✓",
    description: "Ce POI a été validé et est visible par tous",
  },
  rejected: {
    label: "Refusé",
    color: "#DC2626", // text-red-600
    bgColor: "#FEE2E2", // bg-red-100
    darkBgColor: "#7F1D1D33", // dark:bg-red-900/20
    icon: "✗",
    description: "Ce POI a été refusé",
  },
};

/**
 * Messages de confirmation pour les actions admin
 */
export const POI_ACTION_MESSAGES = {
  validate: {
    confirm: "Êtes-vous sûr de vouloir valider ce point d'intérêt ?",
    success: "Point d'intérêt validé avec succès !",
    error: "Erreur lors de la validation du point d'intérêt",
  },
  reject: {
    confirm: "Êtes-vous sûr de vouloir rejeter ce point d'intérêt ?",
    success: "Point d'intérêt rejeté",
    error: "Erreur lors du rejet du point d'intérêt",
  },
  delete: {
    confirm: "Êtes-vous sûr de vouloir supprimer ce point d'intérêt ?",
    success: "Point d'intérêt supprimé",
    error: "Erreur lors de la suppression du point d'intérêt",
  },
};

/**
 * Délais de soumission (anti-spam)
 */
export const POI_SUBMISSION_LIMITS = {
  minTimeBetweenSubmissions: 5 * 60 * 1000, // 5 minutes en ms
  maxSubmissionsPerDay: 10,
  maxSubmissionsPerHour: 3,
};

/**
 * Règles de validation des données POI
 */
export const POI_VALIDATION_RULES = {
  name: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ÿ0-9\s\-',.()]+$/,
  },
  description: {
    minLength: 10,
    maxLength: 500,
  },
  amenities: {
    max: 15,
  },
  images: {
    max: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  keywords: {
    max: 10,
    minLength: 2,
    maxLength: 30,
  },
};

/**
 * Priorités d'affichage selon le statut
 */
export const POI_STATUS_PRIORITY: Record<POIStatus, number> = {
  validated: 3, // Priorité haute (affichage en premier)
  submitted: 2, // Priorité moyenne
  rejected: 1, // Priorité basse
};