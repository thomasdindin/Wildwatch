import { useState, useEffect, useCallback } from 'react';
import { Observation } from '@/types/Observation';
import { ObservationService } from '@/services/ObservationService';
import { logger } from '@/utils/logger';
import { globalEventEmitter, OBSERVATION_EVENTS } from '@/utils/eventEmitter';

interface UseObservationsReturn {
  observations: Observation[];
  isLoading: boolean;
  error: string | null;
  refreshObservations: () => Promise<void>;
  addObservation: (observation: Observation) => Promise<void>;
  updateObservation: (observation: Observation) => Promise<void>;
  deleteObservation: (id: string) => Promise<void>;
}

/**
 * Custom hook for managing observations state and operations
 */
export const useObservations = (): UseObservationsReturn => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to remove duplicate observations by ID
  const deduplicateObservations = (observations: Observation[]): Observation[] => {
    const seen = new Set<string>();
    return observations.filter(obs => {
      if (seen.has(obs.id)) {
        logger.warn('Duplicate observation ID detected and removed', { id: obs.id });
        return false;
      }
      seen.add(obs.id);
      return true;
    });
  };

  const refreshObservations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ObservationService.getObservations();
      const uniqueData = deduplicateObservations(data);
      setObservations(uniqueData);

    } catch (err) {
      const errorMessage = 'Failed to load observations';
      setError(errorMessage);
      logger.error(errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addObservation = useCallback(async (observation: Observation) => {
    try {
      await ObservationService.saveObservation(observation);
      // Recharger toutes les données depuis AsyncStorage pour être sûr
      await refreshObservations();
      // Émettre un événement simple pour dire aux autres écrans de recharger
      globalEventEmitter.emit(OBSERVATION_EVENTS.REFRESHED, null);
    } catch (err) {
      const errorMessage = 'Failed to save observation';
      setError(errorMessage);
      logger.error(errorMessage, err);
      throw err;
    }
  }, [refreshObservations]);

  const updateObservation = useCallback(async (updatedObservation: Observation) => {
    try {
      await ObservationService.updateObservation(updatedObservation);
      // Recharger toutes les données depuis AsyncStorage
      await refreshObservations();
      // Émettre un événement simple pour dire aux autres écrans de recharger
      globalEventEmitter.emit(OBSERVATION_EVENTS.REFRESHED, null);
    } catch (err) {
      const errorMessage = 'Failed to update observation';
      setError(errorMessage);
      logger.error(errorMessage, err);
      throw err;
    }
  }, [refreshObservations]);

  const deleteObservation = useCallback(async (id: string) => {
    try {
      await ObservationService.deleteObservation(id);
      // Recharger toutes les données depuis AsyncStorage
      await refreshObservations();
      // Émettre un événement simple pour dire aux autres écrans de recharger
      globalEventEmitter.emit(OBSERVATION_EVENTS.REFRESHED, null);
    } catch (err) {
      const errorMessage = 'Failed to delete observation';
      setError(errorMessage);
      logger.error(errorMessage, err);
      throw err;
    }
  }, [refreshObservations]);

  // Écouter les événements d'autres instances pour recharger les données
  useEffect(() => {
    const unsubscribeRefresh = globalEventEmitter.on(OBSERVATION_EVENTS.REFRESHED, () => {
      // Recharger les données depuis AsyncStorage quand un autre écran signale un changement
      refreshObservations();
    });

    // Cleanup
    return () => {
      unsubscribeRefresh();
    };
  }, [refreshObservations]);

  useEffect(() => {
    refreshObservations();
  }, [refreshObservations]);

  return {
    observations,
    isLoading,
    error,
    refreshObservations,
    addObservation,
    updateObservation,
    deleteObservation,
  };
};