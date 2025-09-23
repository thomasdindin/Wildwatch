/**
 * Global style constants and theme configuration
 */

export const COLORS = {
  PRIMARY: '#4CAF50',
  SECONDARY: '#007AFF',
  ERROR: '#F44336',
  WARNING: '#FF6B35',
  SUCCESS: '#4CAF50',

  TEXT: {
    PRIMARY: '#333333',
    SECONDARY: '#666666',
    TERTIARY: '#999999',
    LIGHT: '#ffffff',
  },

  BACKGROUND: {
    PRIMARY: '#ffffff',
    SECONDARY: '#f8f9fa',
    TERTIARY: '#f0f0f0',
  },

  BORDER: {
    LIGHT: '#e0e0e0',
    MEDIUM: '#ddd',
    DARK: '#999',
  },

  OVERLAY: {
    LIGHT: 'rgba(0, 0, 0, 0.1)',
    MEDIUM: 'rgba(0, 0, 0, 0.5)',
    DARK: 'rgba(0, 0, 0, 0.8)',
  },
} as const;

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
} as const;

export const BORDER_RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  ROUND: 1000,
} as const;

export const FONT_SIZES = {
  XS: 10,
  SM: 12,
  MD: 14,
  LG: 16,
  XL: 18,
  XXL: 20,
  XXXL: 24,
  HUGE: 28,
} as const;

export const SHADOWS = {
  LIGHT: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  HEAVY: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
} as const;