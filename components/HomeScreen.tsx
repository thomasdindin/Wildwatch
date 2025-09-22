import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCurrentPosition } from '../hooks/useCurrentPosition';
import { LoadingScreen } from './LoadingScreen';
import { UnauthorizedScreen } from './UnauthorizedScreen';

interface HomeScreenProps {
  onNavigateToMap: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToMap }) => {
  const { location, status, error, requestPermission } = useCurrentPosition();

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'denied' || status === 'error') {
    return <UnauthorizedScreen onRetry={requestPermission} message={error || undefined} />;
  }

  if (!location) {
    return <LoadingScreen message="Localisation en cours..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🦎 WildWatch</Text>

      <View style={styles.coordinatesContainer}>
        <Text style={styles.sectionTitle}>Votre position</Text>
        <Text style={styles.coordinate}>
          Latitude: {location.coords.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordinate}>
          Longitude: {location.coords.longitude.toFixed(6)}
        </Text>
        <Text style={styles.accuracy}>
          Précision: ±{Math.round(location.coords.accuracy || 0)}m
        </Text>
      </View>

      <TouchableOpacity style={styles.mapButton} onPress={onNavigateToMap}>
        <Text style={styles.mapButtonText}>🗺️ Voir la carte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  coordinatesContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  coordinate: {
    fontSize: 16,
    marginBottom: 4,
    color: '#007AFF',
    fontFamily: 'monospace',
  },
  accuracy: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  mapButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  mapButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});