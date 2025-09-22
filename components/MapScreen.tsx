import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useCurrentPosition } from '../hooks/useCurrentPosition';
import { LoadingScreen } from './LoadingScreen';
import { UnauthorizedScreen } from './UnauthorizedScreen';
import { ObservationForm } from './ObservationForm';
import { Observation } from '../types/Observation';
import { ObservationService } from '../services/ObservationService';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN!);

export const MapScreen: React.FC = () => {
  const { location, status, requestPermission } = useCurrentPosition();
  const [showObservationForm, setShowObservationForm] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const animationValues = useRef<{ [key: string]: Animated.Value }>({});

  useEffect(() => {
    loadObservations();
  }, []);

  const loadObservations = async () => {
    try {
      const savedObservations = await ObservationService.getObservations();
      setObservations(savedObservations);
    } catch (error) {
      console.error('Error loading observations:', error);
    }
  };

  const handleMapPress = (feature: any) => {
    const coordinates = feature.geometry.coordinates;
    setSelectedCoordinates({
      latitude: coordinates[1],
      longitude: coordinates[0],
    });
    setShowObservationForm(true);
  };

  const handleObservationSave = (newObservation: Observation) => {
    setObservations(prev => [...prev, newObservation]);

    animationValues.current[newObservation.id] = new Animated.Value(-100);

    Animated.timing(animationValues.current[newObservation.id], {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const handleFormClose = () => {
    setShowObservationForm(false);
    setSelectedCoordinates(null);
  };

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'denied' || status === 'error') {
    return <UnauthorizedScreen onRetry={requestPermission} />;
  }

  if (!location) {
    return <LoadingScreen message="Localisation en cours..." />;
  }

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        onPress={handleMapPress}
        compassEnabled={true}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <Mapbox.Camera
          centerCoordinate={[location.coords.longitude, location.coords.latitude]}
          zoomLevel={15}
          animationMode="flyTo"
          animationDuration={2000}
        />

        <Mapbox.PointAnnotation
          id="user-location"
          coordinate={[location.coords.longitude, location.coords.latitude]}
        >
          <View style={styles.userLocationMarker}>
            <View style={styles.userLocationInner} />
          </View>
        </Mapbox.PointAnnotation>

        {observations.map((observation) => {
          const animValue = animationValues.current[observation.id];

          return (
            <Mapbox.PointAnnotation
              key={observation.id}
              id={observation.id}
              coordinate={[observation.longitude, observation.latitude]}
              title={observation.name}
              snippet={`Observé le ${observation.date}`}
            >
              <Animated.View
                style={[
                  styles.observationMarker,
                  animValue && {
                    transform: [{ translateY: animValue }]
                  }
                ]}
              >
                <View style={styles.observationMarkerInner}>
                  <View style={styles.observationMarkerText}>
                    <View style={styles.observationIcon} />
                  </View>
                </View>
                <View style={styles.observationMarkerTail} />
              </Animated.View>
            </Mapbox.PointAnnotation>
          );
        })}
      </Mapbox.MapView>

      {showObservationForm && selectedCoordinates && (
        <ObservationForm
          visible={showObservationForm}
          onClose={handleFormClose}
          onSave={handleObservationSave}
          latitude={selectedCoordinates.latitude}
          longitude={selectedCoordinates.longitude}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userLocationInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    margin: 3,
  },
  observationMarker: {
    alignItems: 'center',
  },
  observationMarkerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  observationMarkerText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  observationIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  observationMarkerTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4CAF50',
    marginTop: -3,
  },
});