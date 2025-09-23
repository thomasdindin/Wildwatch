/**
 * Represents a wildlife observation with location, time, and optional image data
 */
export interface Observation {
  /** Unique identifier for the observation */
  id: string;

  /** User-provided name or description of the observation */
  name: string;

  /** Date of the observation in ISO string format */
  date: string;

  /** Latitude coordinate where the observation was made */
  latitude: number;

  /** Longitude coordinate where the observation was made */
  longitude: number;

  /** Optional URI to the observation's image */
  imageUri?: string;

  /** Timestamp when the observation was created in ISO string format */
  createdAt: string;
}

/**
 * Coordinates interface for location data
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Type for creating a new observation (without id and createdAt)
 */
export type CreateObservationData = Omit<Observation, 'id' | 'createdAt'>;