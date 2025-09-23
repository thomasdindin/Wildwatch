import { useState, useEffect, useCallback } from 'react';
import { Observation } from '@/types/Observation';
import { ObservationService } from '@/services/ObservationService';
import { logger } from '@/utils/logger';

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

  const refreshObservations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ObservationService.getObservations();
      setObservations(data);
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
      setObservations(prev => [...prev, observation]);
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
    } catch (err) {
      const errorMessage = 'Failed to delete observation';
      setError(errorMessage);
      logger.error(errorMessage, err);
      throw err;
    }
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