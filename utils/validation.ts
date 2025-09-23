/**
 * Validation utilities for observation data
 */

import { Observation } from '@/types/Observation';
import { ERROR_MESSAGES, ObservationError } from '@/constants/errors';

export const validateObservation = (observation: Partial<Observation>): void => {
  if (!observation.name?.trim()) {
    throw new ObservationError(ERROR_MESSAGES.VALIDATION.NAME_REQUIRED);
  }

  if (!observation.date) {
    throw new ObservationError(ERROR_MESSAGES.VALIDATION.DATE_REQUIRED);
  }

  if (
    typeof observation.latitude !== 'number' ||
    typeof observation.longitude !== 'number' ||
    isNaN(observation.latitude) ||
    isNaN(observation.longitude)
  ) {
    throw new ObservationError(ERROR_MESSAGES.VALIDATION.COORDINATES_REQUIRED);
  }
};

export const validateCoordinates = (latitude: number, longitude: number): boolean => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};