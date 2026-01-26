export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  organization?: string;
  role: UserRole;
  avatar?: string; // URL de l'avatar
}

export interface OperationTimePlan {
  [day: string]: { open: string; close: string; closed?: boolean };
}

export interface RouteStats {
  distance: number; // en mètres
  duration: number; // en secondes
  geometry: any; // GeoJSON geometry
}

export interface Trip {
  id: string;
  departName: string;
  arriveName: string;
  date: string; // ISO String
  distance: number;
  duration: number;
}

export type MapStyle = "streets-v2" | "hybrid";

export interface Trip {

}

export interface Location {
  latitude: number;
  longitude: number;
}

export type TransportMode = 'driving' | 'walking' | 'cycling' | 'transit';

/**
 * Statut d'un Point d'Intérêt
 * - submitted: En attente de validation par un admin
 * - validated: Approuvé et visible publiquement
 * - rejected: Refusé par un admin
 */
export type POIStatus = "submitted" | "validated" | "rejected";

export interface POI {
  // ============================================================================
  // IDENTIFICATION
  // ============================================================================
  poi_id: string; // UUID unique
  poi_name: string;
  poi_category: string; // Ex: "Tourne-dos", "Kiosque", "Restaurant"
  poi_description: string;
  poi_amenities: string[]; // Ex: ["WiFi", "Parking", "Climatisé"]
  
  // ============================================================================
  // GÉOGRAPHIE
  // ============================================================================
  location: Location;

  // Adresses
  address_informal?: string; // Ex: "Mvog-Betsi, face station Total"
  address_city: string; // Ex: "Yaoundé"
  address_country?: string; // Ex: "Cameroun"

  // ============================================================================
  // STATISTIQUES & POPULARITÉ
  // ============================================================================
  rating: number; // Note moyenne (0-5)
  review_count: number; // Nombre d'avis
  poi_images_urls: string[]; // URLs des images
  popularity_score: number; // Score de popularité (algorithme interne)
  poi_keywords?: string[]; // Mots-clés pour recherche (ex: ["africain", "grillades"])
  
  // ============================================================================
  // CONTACTS
  // ============================================================================
  poi_contacts?: {
    phone?: string;
    website?: string;
    email?: string;
  };

  // ============================================================================
  // HORAIRES
  // ============================================================================
  operation_time_plan?: OperationTimePlan;

  // ============================================================================
  // WORKFLOW & VALIDATION
  // ============================================================================
  
  /**
   * Statut du POI dans le workflow de validation
   */
  status: POIStatus;
  
  /**
   * ID de l'utilisateur qui a soumis le POI
   * Utilisé pour la visibilité : un client peut voir ses propres soumissions
   */
  submitted_by?: string;
  
  /**
   * Nom de l'utilisateur soumetteur (pour affichage)
   */
  submitted_by_name?: string;
  
  /**
   * Organisation de l'utilisateur soumetteur
   */
  organization?: string;
  
  /**
   * Date de soumission (ISO 8601)
   */
  submitted_at?: string;
  
  /**
   * Date de validation (ISO 8601)
   * Définie uniquement si status === "validated"
   */
  validated_at?: string;
  
  /**
   * ID de l'admin qui a validé le POI
   */
  validated_by?: string;
  
  /**
   * Nom de l'admin validateur (pour audit)
   */
  validated_by_name?: string;
  
  /**
   * Date de rejet (ISO 8601)
   * Définie uniquement si status === "rejected"
   */
  rejected_at?: string;
  
  /**
   * ID de l'admin qui a rejeté le POI
   */
  rejected_by?: string;
  
  /**
   * Raison du rejet (optionnelle)
   */
  rejection_reason?: string;
}