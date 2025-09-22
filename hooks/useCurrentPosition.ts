import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export type LocationStatus = 'loading' | 'granted' | 'denied' | 'error';

export interface UseCurrentPositionReturn {
  location: Location.LocationObject | null;
  status: LocationStatus;
  error: string | null;
  requestPermission: () => Promise<void>;
}

export const useCurrentPosition = (): UseCurrentPositionReturn => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [status, setStatus] = useState<LocationStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      setStatus('loading');
      setError(null);

      const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();

      if (permissionStatus !== 'granted') {
        setStatus('denied');
        setError('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      setStatus('granted');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return {
    location,
    status,
    error,
    requestPermission,
  };
};