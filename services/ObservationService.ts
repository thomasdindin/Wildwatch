import AsyncStorage from '@react-native-async-storage/async-storage';
import { Observation } from '@/types/Observation';
import { ERROR_MESSAGES, ObservationError } from '@/constants/errors';
import { logger } from '@/utils/logger';
import { validateObservation } from '@/utils/validation';

const STORAGE_KEYS = {
  OBSERVATIONS: 'wildwatch_observations',
} as const;

/**
 * Service for managing observation data in AsyncStorage
 */
export class ObservationService {
  /**
   * Save a new observation to storage
   */
  static async saveObservation(observation: Observation): Promise<void> {
    try {
      validateObservation(observation);

      const observations = await this.getObservations();
      observations.push(observation);
      await this.persistObservations(observations);

      logger.info('Observation saved successfully', { id: observation.id });
    } catch (error) {
      const errorMessage = ERROR_MESSAGES.OBSERVATION.SAVE_FAILED;
      logger.error(errorMessage, error);
      throw new ObservationError(errorMessage, 'SAVE_FAILED', error as Error);
    }
  }

  /**
   * Retrieve all observations from storage
   */
  static async getObservations(): Promise<Observation[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.OBSERVATIONS);
      const observations = data ? JSON.parse(data) : [];

      logger.debug('Observations retrieved', { count: observations.length });
      return observations;
    } catch (error) {
      logger.error(ERROR_MESSAGES.OBSERVATION.LOAD_FAILED, error);
      return [];
    }
  }

  /**
   * Delete an observation by ID
   */
  static async deleteObservation(id: string): Promise<void> {
    try {
      if (!id) {
        throw new ObservationError('Observation ID is required');
      }

      const observations = await this.getObservations();
      const filteredObservations = observations.filter(obs => obs.id !== id);

      if (observations.length === filteredObservations.length) {
        throw new ObservationError(`Observation with ID ${id} not found`);
      }

      await this.persistObservations(filteredObservations);
      logger.info('Observation deleted successfully', { id });
    } catch (error) {
      const errorMessage = ERROR_MESSAGES.OBSERVATION.DELETE_FAILED;
      logger.error(errorMessage, error);
      throw new ObservationError(errorMessage, 'DELETE_FAILED', error as Error);
    }
  }

  /**
   * Update an existing observation
   */
  static async updateObservation(updatedObservation: Observation): Promise<void> {
    try {
      validateObservation(updatedObservation);

      const observations = await this.getObservations();
      const index = observations.findIndex(obs => obs.id === updatedObservation.id);

      if (index === -1) {
        throw new ObservationError(`Observation with ID ${updatedObservation.id} not found`);
      }

      observations[index] = updatedObservation;
      await this.persistObservations(observations);

      logger.info('Observation updated successfully', { id: updatedObservation.id });
    } catch (error) {
      const errorMessage = ERROR_MESSAGES.OBSERVATION.UPDATE_FAILED;
      logger.error(errorMessage, error);
      throw new ObservationError(errorMessage, 'UPDATE_FAILED', error as Error);
    }
  }

  /**
   * Generate a unique ID for observations
   */
  static generateId(): string {
    return `obs_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Private method to persist observations to storage
   */
  private static async persistObservations(observations: Observation[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(observations));
  }
}