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

      // Émettre l'événement pour synchroniser les autres instances
      globalEventEmitter.emit(OBSERVATION_EVENTS.REFRESHED, uniqueData);
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
      setObservations(prev => {
        // Check if observation already exists to prevent duplicates
        if (prev.some(obs => obs.id === observation.id)) {
          logger.warn('Observation already exists, not adding duplicate', { id: observation.id });
          return prev;
        }
        return [...prev, observation];
      });

      // Émettre l'événement pour synchroniser les autres instances
      globalEventEmitter.emit(OBSERVATION_EVENTS.ADDED, observation);
    } catch (err) {
      const errorMessage = 'Failed to save observation';
      setError(errorMessage);
      logger.error(errorMessage, err);
      throw err;
    }
  }, []);

  const updateObservation = useCallback(async (updatedObservation: Observation) => {
    try {
      await ObservationService.updateObservation(updatedObservation);
      setObservations(prev =>
        prev.map(obs => (obs.id === updatedObservation.id ? updatedObservation : obs))
      );

      // Émettre l'événement pour synchroniser les autres instances
      globalEventEmitter.emit(OBSERVATION_EVENTS.UPDATED, updatedObservation);
    } catch (err) {
      const errorMessage = 'Failed to update observation';
      setError(errorMessage);
      logger.error(errorMessage, err);
      throw err;
    }
  }, []);

  const deleteObservation = useCallback(async (id: string) => {
    try {
      await ObservationService.deleteObservation(id);
      setObservations(prev => prev.filter(obs => obs.id !== id));

      // Émettre l'événement pour synchroniser les autres instances
      globalEventEmitter.emit(OBSERVATION_EVENTS.DELETED, id);
    } catch (err) {
      const errorMessage = 'Failed to delete observation';
      setError(errorMessage);
      logger.error(errorMessage, err);
      throw err;
    }
  }, []);

  // Écouter les événements d'autres instances
  useEffect(() => {
    const unsubscribeRefresh = globalEventEmitter.on(OBSERVATION_EVENTS.REFRESHED, (data: Observation[]) => {
      setObservations(data);
    });

    const unsubscribeAdded = globalEventEmitter.on(OBSERVATION_EVENTS.ADDED, (observation: Observation) => {
      setObservations(prev => {
        // Éviter les doublons
        if (prev.some(obs => obs.id === observation.id)) {
          return prev;
        }
        return [...prev, observation];
      });
    });

    const unsubscribeUpdated = globalEventEmitter.on(OBSERVATION_EVENTS.UPDATED, (observation: Observation) => {
      setObservations(prev =>
        prev.map(obs => (obs.id === observation.id ? observation : obs))
      );
    });

    const unsubscribeDeleted = globalEventEmitter.on(OBSERVATION_EVENTS.DELETED, (observationId: string) => {
      setObservations(prev => prev.filter(obs => obs.id !== observationId));
    });

    // Cleanup
    return () => {
      unsubscribeRefresh();
      unsubscribeAdded();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, []);

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