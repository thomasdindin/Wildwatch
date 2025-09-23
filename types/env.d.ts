/**
 * Environment variables type definitions
 */

declare module '@env' {
  export const EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN: string;
    }
  }
}