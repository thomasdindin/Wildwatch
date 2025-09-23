/**
 * Error messages and error handling constants
 */

export const ERROR_MESSAGES = {
  OBSERVATION: {
    SAVE_FAILED: 'Failed to save observation',
    LOAD_FAILED: 'Failed to load observations',
    UPDATE_FAILED: 'Failed to update observation',
    DELETE_FAILED: 'Failed to delete observation',
    POSITION_UPDATE_FAILED: 'Failed to update observation position',
  },
  VALIDATION: {
    NAME_REQUIRED: 'Observation name is required',
    DATE_REQUIRED: 'Date is required',
    COORDINATES_REQUIRED: 'Valid coordinates are required',
  },
  PERMISSIONS: {
    LOCATION_DENIED: 'Location permission denied',
    CAMERA_DENIED: 'Camera permission denied',
  },
} as const;

export class ObservationError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ObservationError';
  }
}