import AsyncStorage from '@react-native-async-storage/async-storage';
import { Observation } from '../types/Observation';

const OBSERVATIONS_KEY = 'wildwatch_observations';

export class ObservationService {
  static async saveObservation(observation: Observation): Promise<void> {
    try {
      const observations = await this.getObservations();
      observations.push(observation);
      await AsyncStorage.setItem(OBSERVATIONS_KEY, JSON.stringify(observations));
    } catch (error) {
      console.error('Error saving observation:', error);
      throw error;
    }
  }

  static async getObservations(): Promise<Observation[]> {
    try {
      const data = await AsyncStorage.getItem(OBSERVATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting observations:', error);
      return [];
    }
  }

  static async deleteObservation(id: string): Promise<void> {
    try {
      const observations = await this.getObservations();
      const filteredObservations = observations.filter(obs => obs.id !== id);
      await AsyncStorage.setItem(OBSERVATIONS_KEY, JSON.stringify(filteredObservations));
    } catch (error) {
      console.error('Error deleting observation:', error);
      throw error;
    }
  }

  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}