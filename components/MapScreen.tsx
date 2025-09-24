import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, TouchableOpacity } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import * as Haptics from 'expo-haptics';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';

import { useCurrentPosition } from '@/hooks/useCurrentPosition';
import { useObservations } from '@/hooks/useObservations';
import { LoadingScreen } from './LoadingScreen';
import { UnauthorizedScreen } from './UnauthorizedScreen';
import { ObservationForm } from './ObservationForm';
import { ObservationDetails } from './ObservationDetails';
import { Observation } from '@/types/Observation';
import { LocationIcon, TargetIcon, PawIcon } from './Icons';
import { MAP_CONFIG, HAPTIC_CONFIG } from '@/constants/config';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN!);

export const MapScreen: React.FC = () => {
  const { location, status, requestPermission } = useCurrentPosition();
  const [showObservationForm, setShowObservationForm] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [showObservationDetails, setShowObservationDetails] = useState(false);
  const [draggedObservation, setDraggedObservation] = useState<Observation | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const animationValues = useRef<{ [key: string]: Animated.Value }>({});
  const cameraRef = useRef<Mapbox.Camera>(null);

  const { observations, addObservation, updateObservation, deleteObservation } = useObservations();

  useEffect(() => {
    observations.forEach(observation => {
      if (!animationValues.current[observation.id]) {
        animationValues.current[observation.id] = new Animated.Value(0);
      }
    });
  }, [observations]);

  const handleMapPress = (feature: any) => {
    const coordinates = feature.geometry.coordinates;
    setSelectedCoordinates({
      latitude: coordinates[1],
      longitude: coordinates[0],
    });
    setShowObservationForm(true);
  };

  const handleObservationSave = async (newObservation: Observation) => {
    try {
      await addObservation(newObservation);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType[HAPTIC_CONFIG.NOTIFICATION_SUCCESS]);

      animationValues.current[newObservation.id] = new Animated.Value(-200);
      Animated.spring(animationValues.current[newObservation.id], {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType[HAPTIC_CONFIG.NOTIFICATION_ERROR]);
    }
  };

  const handleFormClose = () => {
    setShowObservationForm(false);
    setSelectedCoordinates(null);
  };

  const handleObservationPress = (observation: Observation) => {
    setSelectedObservation(observation);
    setShowObservationDetails(true);
  };

  const handleDetailsClose = () => {
    setShowObservationDetails(false);
    setSelectedObservation(null);
  };

  const handleObservationUpdate = async (updatedObservation: Observation) => {
    try {
      await updateObservation(updatedObservation);
      setSelectedObservation(updatedObservation);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType[HAPTIC_CONFIG.NOTIFICATION_ERROR]);
    }
  };

  const handleObservationDelete = async (observationId: string) => {
    try {
      await deleteObservation(observationId);
      delete animationValues.current[observationId];
      setShowObservationDetails(false);
      setSelectedObservation(null);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType[HAPTIC_CONFIG.NOTIFICATION_ERROR]);
    }
  };

  const handleRecenterOnUser = () => {
    if (location && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: MAP_CONFIG.USER_LOCATION_ZOOM,
        animationDuration: 1000,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle[HAPTIC_CONFIG.IMPACT_STYLE]);
    }
  };

  const handleLongPress = (observation: Observation) => {
    setDraggedObservation(observation);
    setIsDragging(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleMapDrag = async (feature: any) => {
    if (isDragging && draggedObservation) {
      const coordinates = feature.geometry.coordinates;
      const updatedObservation: Observation = {
        ...draggedObservation,
        latitude: coordinates[1],
        longitude: coordinates[0],
      };

      try {
        await updateObservation(updatedObservation);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType[HAPTIC_CONFIG.NOTIFICATION_SUCCESS]);
      } catch (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType[HAPTIC_CONFIG.NOTIFICATION_ERROR]);
      }

      setIsDragging(false);
      setDraggedObservation(null);
    }
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
        onPress={isDragging ? handleMapDrag : handleMapPress}
        compassEnabled={true}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <Mapbox.Camera
          ref={cameraRef}
          centerCoordinate={[location.coords.longitude, location.coords.latitude]}
          zoomLevel={MAP_CONFIG.DEFAULT_ZOOM}
          animationMode="flyTo"
          animationDuration={MAP_CONFIG.ANIMATION_DURATION}
        />

        <Mapbox.LocationPuck
          visible={true}
          pulsing={{ isEnabled: true }}
        />

        {observations.map((observation) => {
          const animValue = animationValues.current[observation.id];
          const hasAnimation = animValue && animValue._value !== 0;

          return (
            <Mapbox.MarkerView
              key={observation.id}
              id={observation.id}
              coordinate={[observation.longitude, observation.latitude]}
            >
              <Animated.View
                style={[
                  hasAnimation && {
                    transform: [
                      {
                        translateY: animValue ? animValue.interpolate({
                          inputRange: [-200, 0],
                          outputRange: [-200, 0],
                          extrapolate: 'clamp'
                        }) : 0
                      },
                      {
                        scale: animValue ? animValue.interpolate({
                          inputRange: [-200, 0],
                          outputRange: [0.3, 1],
                          extrapolate: 'clamp'
                        }) : 1
                      }
                    ],
                    opacity: animValue ? animValue.interpolate({
                      inputRange: [-200, 0],
                      outputRange: [0, 1],
                      extrapolate: 'clamp'
                    }) : 1
                  }
                ]}
              >
                <LongPressGestureHandler
                  onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === State.ACTIVE) {
                      handleLongPress(observation);
                    }
                  }}
                  minDurationMs={HAPTIC_CONFIG.DRAG_PRESS_DURATION}
                >
                  <TouchableOpacity
                    style={[
                      styles.simpleMarker,
                      draggedObservation?.id === observation.id && styles.draggingMarker
                    ]}
                    onPress={() => {
                      if (!isDragging) {
                        handleObservationPress(observation);
                      }
                    }}
                    delayPressIn={100}
                  >
                    <Text style={styles.markerLabel}>{observation.name}</Text>
                    <View style={[
                      styles.markerContainer,
                      draggedObservation?.id === observation.id && styles.draggingContainer
                    ]}>
                      <PawIcon
                        color={draggedObservation?.id === observation.id ? "#FF6B35" : "#4CAF50"}
                        size={24}
                      />
                    </View>
                  </TouchableOpacity>
                </LongPressGestureHandler>
              </Animated.View>
            </Mapbox.MarkerView>
          );
        })}
      </Mapbox.MapView>

      {/* Bouton de recentrage */}
      <TouchableOpacity
        style={[styles.recenterButton, { bottom: 120 }]} // Ajusté pour la tab bar
        onPress={handleRecenterOnUser}
      >
        <LocationIcon color="#007AFF" size={20} />
      </TouchableOpacity>

      {/* Indicateur de mode drag */}
      {isDragging && (
        <View style={styles.dragIndicator}>
          <View style={styles.dragIndicatorContent}>
            <TargetIcon color="#ffffff" size={20} />
            <Text style={styles.dragIndicatorText}>
              Tapez sur la carte pour placer l'observation
            </Text>
          </View>
        </View>
      )}

      {showObservationForm && selectedCoordinates && (
        <ObservationForm
          visible={showObservationForm}
          onClose={handleFormClose}
          onSave={handleObservationSave}
          latitude={selectedCoordinates.latitude}
          longitude={selectedCoordinates.longitude}
        />
      )}

      <ObservationDetails
        observation={selectedObservation}
        visible={showObservationDetails}
        onClose={handleDetailsClose}
        onUpdate={handleObservationUpdate}
        onDelete={handleObservationDelete}
      />
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
  observationLabel: {
    position: 'absolute',
    top: -35,
    left: -60,
    right: -60,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 1000,
  },
  observationLabelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 120,
  },
  simpleMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
    textAlign: 'center',
    minWidth: 60,
  },
  markerContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  draggingMarker: {
    opacity: 0.7,
    transform: [{ scale: 1.1 }],
  },
  draggingContainer: {
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.1 }],
  },
  dragIndicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dragIndicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dragIndicatorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});