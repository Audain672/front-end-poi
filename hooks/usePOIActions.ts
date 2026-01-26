// hooks/usePOIActions.ts

import { useState, useCallback } from "react";
import { POI, POIValidationData, POIRejectionData } from "@/types";
import { useAuthContext } from "@/context/AuthContext";

interface UsePOIActionsOptions {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

/**
 * Hook pour gérer les actions sur les POI (validation, rejet, suppression)
 */
export const usePOIActions = (options: UsePOIActionsOptions = {}) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Valider un POI (Admin uniquement)
   */
  const validatePOI = useCallback(
    async (poi: POI): Promise<boolean> => {
      if (!user || user.role !== "admin") {
        const errorMsg = "Seuls les administrateurs peuvent valider des POI";
        setError(errorMsg);
        options.onError?.(errorMsg);
        return false;
      }

      if (poi.status !== "submitted") {
        const errorMsg = "Ce POI n'est pas en attente de validation";
        setError(errorMsg);
        options.onError?.(errorMsg);
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const validationData: POIValidationData = {
          poi_id: poi.poi_id,
          validated_by: user.id,
          validated_by_name: user.name,
          validated_at: new Date().toISOString(),
        };

        // TODO: Appel API réel
        const response = await fetch(`/api/pois/${poi.poi_id}/validate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validationData),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la validation");
        }

        options.onSuccess?.("Point d'intérêt validé avec succès !");
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMsg);
        options.onError?.(errorMsg);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user, options]
  );

  /**
   * Rejeter un POI (Admin uniquement)
   */
  const rejectPOI = useCallback(
    async (poi: POI, reason?: string): Promise<boolean> => {
      if (!user || user.role !== "admin") {
        const errorMsg = "Seuls les administrateurs peuvent rejeter des POI";
        setError(errorMsg);
        options.onError?.(errorMsg);
        return false;
      }

      if (poi.status !== "submitted") {
        const errorMsg = "Ce POI n'est pas en attente de validation";
        setError(errorMsg);
        options.onError?.(errorMsg);
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const rejectionData: POIRejectionData = {
          poi_id: poi.poi_id,
          rejected_by: user.id,
          rejected_at: new Date().toISOString(),
          rejection_reason: reason,
        };

        // TODO: Appel API réel
        const response = await fetch(`/api/pois/${poi.poi_id}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rejectionData),
        });

        if (!response.ok) {
          throw new Error("Erreur lors du rejet");
        }

        options.onSuccess?.("Point d'intérêt rejeté");
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMsg);
        options.onError?.(errorMsg);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user, options]
  );

  /**
   * Supprimer un POI
   */
  const deletePOI = useCallback(
    async (poi: POI): Promise<boolean> => {
      if (!user) {
        const errorMsg = "Vous devez être connecté pour supprimer un POI";
        setError(errorMsg);
        options.onError?.(errorMsg);
        return false;
      }

      // Vérifier les permissions
      const canDelete =
        user.role === "admin" ||
        (poi.submitted_by === user.id && poi.status === "submitted");

      if (!canDelete) {
        const errorMsg = "Vous n'avez pas les permissions pour supprimer ce POI";
        setError(errorMsg);
        options.onError?.(errorMsg);
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Appel API réel
        const response = await fetch(`/api/pois/${poi.poi_id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression");
        }

        options.onSuccess?.("Point d'intérêt supprimé");
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMsg);
        options.onError?.(errorMsg);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user, options]
  );

  return {
    validatePOI,
    rejectPOI,
    deletePOI,
    isLoading,
    error,
  };
};