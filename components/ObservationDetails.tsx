import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, TextInput, Alert, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Observation } from '@/types/Observation';
import { ObservationService } from '@/services/ObservationService';
import { CalendarIcon, EditIcon, CameraIcon, DeleteIcon } from './Icons';
import { logger } from '@/utils/logger';

interface ObservationDetailsProps {
  observation: Observation | null;
  visible: boolean;
  onClose: () => void;
  onUpdate?: (updatedObservation: Observation) => void;
  onDelete?: (observationId: string) => void;
}

export const ObservationDetails: React.FC<ObservationDetailsProps> = ({
  observation,
  visible,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [editedImageUri, setEditedImageUri] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!observation) return null;

  const handleEdit = () => {
    setEditedName(observation.name);
    setEditedDate(observation.date);
    setEditedImageUri(observation.imageUri);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedName.trim()) {
      Alert.alert('Erreur', 'Le nom de l\'observation ne peut pas être vide.');
      return;
    }

    setIsLoading(true);
    try {
      const updatedObservation: Observation = {
        ...observation,
        name: editedName.trim(),
        date: editedDate,
        imageUri: editedImageUri,
      };

      await ObservationService.updateObservation(updatedObservation);
      onUpdate?.(updatedObservation);
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les modifications.');
      logger.error('Failed to update observation', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName('');
    setEditedDate('');
    setEditedImageUri(undefined);
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Nous avons besoin de l\'autorisation d\'accès à votre appareil photo.'
      );
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Nous avons besoin de l\'autorisation d\'accès à votre galerie.'
      );
      return false;
    }
    return true;
  };

  const pickImageFromCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditedImageUri(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditedImageUri(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Modifier la photo',
      'Choisissez une option',
      [
        { text: 'Appareil photo', onPress: pickImageFromCamera },
        { text: 'Galerie', onPress: pickImageFromGallery },
        { text: 'Supprimer la photo', onPress: () => setEditedImageUri(undefined), style: 'destructive' },
        { text: 'Annuler', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setEditedDate(dateString);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleClose = () => {
    handleCancel();
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer l\'observation',
      'Êtes-vous sûr de vouloir supprimer cette observation ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            if (observation && onDelete) {
              onDelete(observation.id);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            {isEditing ? (
              <TextInput
                style={styles.titleInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Nom de l'observation"
                maxLength={100}
              />
            ) : (
              <Text style={styles.title}>{observation.name}</Text>
            )}

            <View style={styles.headerButtons}>
              {isEditing ? (
                <>
                  <TouchableOpacity
                    onPress={handleCancel}
                    style={styles.cancelButton}
                    disabled={isLoading}
                  >
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSave}
                    style={styles.saveButton}
                    disabled={isLoading}
                  >
                    <Text style={[styles.saveButtonText, isLoading && styles.disabledText]}>
                      {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                    <EditIcon color="#ffffff" size={18} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Date d'observation:</Text>
            {isEditing ? (
              <TouchableOpacity
                style={styles.dateButton}
                onPress={showDatePickerModal}
              >
                <Text style={styles.dateButtonText}>
                  {editedDate || 'Sélectionner une date'}
                </Text>
                <CalendarIcon color="#666" size={20} />
              </TouchableOpacity>
            ) : (
              <Text style={styles.value}>{observation.date}</Text>
            )}

            <Text style={styles.label}>Localisation:</Text>
            <Text style={styles.value}>
              {observation.latitude.toFixed(6)}, {observation.longitude.toFixed(6)}
            </Text>

            <Text style={styles.label}>Créé le:</Text>
            <Text style={styles.value}>{new Date(observation.createdAt).toLocaleDateString()}</Text>

            <Text style={styles.label}>Photo:</Text>
            {isEditing ? (
              <View style={styles.imageEditContainer}>
                {editedImageUri ? (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: editedImageUri }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.changeImageButton}
                      onPress={showImagePicker}
                    >
                      <Text style={styles.changeImageText}>Modifier la photo</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.addImageButton} onPress={showImagePicker}>
                    <View style={styles.addImageContent}>
                      <CameraIcon color="#007AFF" size={20} />
                      <Text style={styles.addImageText}>Ajouter une photo</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <>
                {observation.imageUri ? (
                  <Image source={{ uri: observation.imageUri }} style={styles.image} />
                ) : (
                  <Text style={styles.noImageText}>Aucune photo</Text>
                )}
              </>
            )}

            {!isEditing && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <View style={styles.deleteButtonContent}>
                  <DeleteIcon color="#ffffff" size={18} />
                  <Text style={styles.deleteButtonText}>Supprimer l'observation</Text>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>

      {/* DateTimePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={editedDate ? new Date(editedDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '60%',
    maxHeight: '85%',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    paddingBottom: 4,
    marginRight: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 16,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledText: {
    color: '#999',
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '400',
    lineHeight: 20,
  },
  dateInput: {
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dateButtonIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 8,
    resizeMode: 'cover',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  deleteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imageEditContainer: {
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  addImageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addImageText: {
    color: '#007AFF',
    fontSize: 16,
  },
  changeImageButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  changeImageText: {
    color: 'white',
    fontSize: 14,
  },
  noImageText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 8,
  },
});