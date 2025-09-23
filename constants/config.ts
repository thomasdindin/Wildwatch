/**
 * Application configuration constants
 */

export const MAP_CONFIG = {
  DEFAULT_ZOOM: 15,
  ANIMATION_DURATION: 2000,
  MARKER_ANIMATION_DURATION: 300,
  USER_LOCATION_ZOOM: 15,
} as const;

export const HAPTIC_CONFIG = {
  DRAG_PRESS_DURATION: 500,
  IMPACT_STYLE: 'Light' as const,
  NOTIFICATION_SUCCESS: 'Success' as const,
  NOTIFICATION_ERROR: 'Error' as const,
} as const;

export const STORAGE_CONFIG = {
  KEYS: {
    OBSERVATIONS: 'wildwatch_observations',
  },
} as const;

export const VALIDATION_CONFIG = {
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 100,
  COORDINATES: {
    MIN_LATITUDE: -90,
    MAX_LATITUDE: 90,
    MIN_LONGITUDE: -180,
    MAX_LONGITUDE: 180,
  },
} as const;