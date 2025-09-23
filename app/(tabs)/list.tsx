import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { Observation } from '@/types/Observation';
import { useObservations } from '@/hooks/useObservations';
import { ObservationDetails } from '@/components/ObservationDetails';
import { CameraIcon, EditIcon, DeleteIcon, LeafIcon } from '@/components/Icons';
import { HAPTIC_CONFIG } from '@/constants/config';

export default function ListScreen() {
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [showObservationDetails, setShowObservationDetails] = useState(false);

  const {
    observations,
    isLoading,
    updateObservation,
    deleteObservation,
    refreshObservations
  } = useObservations();

  const handleObservationPress = (observation: Observation) => {
    setSelectedObservation(observation);
    setShowObservationDetails(true);
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
      setShowObservationDetails(false);
      setSelectedObservation(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType[HAPTIC_CONFIG.NOTIFICATION_SUCCESS]);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType[HAPTIC_CONFIG.NOTIFICATION_ERROR]);
    }
  };

  const handleDirectDelete = (observation: Observation) => {
    Alert.alert(
      'Supprimer l\'observation',
      `Êtes-vous sûr de vouloir supprimer "${observation.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => handleObservationDelete(observation.id),
        },
      ]
    );
  };

  const handleDetailsClose = () => {
    setShowObservationDetails(false);
    setSelectedObservation(null);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderObservationItem = ({ item }: { item: Observation }) => (
    <TouchableOpacity
      style={styles.observationItem}
      onPress={() => handleObservationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.observationContent}>
        {/* Photo ou placeholder */}
        <View style={styles.imageContainer}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.observationImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <CameraIcon color="#999" size={24} />
            </View>
          )}
        </View>

        {/* Informations */}
        <View style={styles.observationInfo}>
          <Text style={styles.observationName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.observationDate}>
            {formatDate(item.date)}
          </Text>
          <Text style={styles.observationTime}>
            {formatTime(item.createdAt)}
          </Text>
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleObservationPress(item)}
          >
            <EditIcon color="#2196F3" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDirectDelete(item)}
          >
            <DeleteIcon color="#F44336" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <LeafIcon color="#4CAF50" size={64} />
      <Text style={styles.emptyStateTitle}>Aucune observation</Text>
      <Text style={styles.emptyStateText}>
        Commencez par ajouter des observations depuis la carte !
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Observations</Text>
        <Text style={styles.headerSubtitle}>
          {observations.length} observation{observations.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={observations}
        keyExtractor={(item) => item.id}
        renderItem={renderObservationItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshing={isLoading}
        onRefresh={refreshObservations}
      />

      <ObservationDetails
        observation={selectedObservation}
        visible={showObservationDetails}
        onClose={handleDetailsClose}
        onUpdate={handleObservationUpdate}
        onDelete={handleObservationDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 120, // Espace pour la tab bar
  },
  observationItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  observationContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 16,
  },
  observationImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  observationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  observationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  observationDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  observationTime: {
    fontSize: 13,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
  },
});