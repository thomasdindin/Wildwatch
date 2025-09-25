import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Platform, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Share from 'react-native-share';

import { Observation } from '@/types/Observation';
import { ObservationService } from '@/services/ObservationService';
import { CalendarIcon, EditIcon, CameraIcon, DeleteIcon, ShareIcon, CloseIcon, SaveIcon } from './Icons';
import { logger } from '@/utils/logger';
import { Modal, IconButton } from './ui';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/constants/styles';

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

  const handleDateChange = (_event: any, selectedDate?: Date) => {
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

  const handleShare = async () => {
    try {
      const shareOptions = {
        title: 'Observation de la faune',
        message: `🐾 Observation: ${observation.name}\n📅 Date: ${observation.date}\n📍 Localisation: ${observation.latitude.toFixed(6)}, ${observation.longitude.toFixed(6)}\n\nPartagé depuis WildWatch`,
        ...(observation.imageUri && { url: observation.imageUri }),
      };

      await Share.open(shareOptions);
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        logger.error('Failed to share observation', error);
        Alert.alert('Erreur', 'Impossible de partager l\'observation.');
      }
    }
  };

  return (
    <Modal visible={visible} onClose={handleClose}>
      <View style={styles.header}>
        {isEditing ? (
          <TextInput
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Nom de l'observation"
            maxLength={100}
            style={styles.titleInput}
            placeholderTextColor={COLORS.TEXT.TERTIARY}
            multiline={false}
            autoFocus={true}
          />
        ) : (
          <Text style={styles.title}>{observation.name}</Text>
        )}

        <View style={styles.headerButtons}>
          {isEditing ? (
            <>
              <IconButton
                onPress={handleCancel}
                size="md"
                variant="ghost"
                disabled={isLoading}
              >
                <CloseIcon color={COLORS.TEXT.SECONDARY} size={18} />
              </IconButton>
              <IconButton
                onPress={handleSave}
                size="md"
                disabled={isLoading}
              >
                <SaveIcon color={isLoading ? COLORS.TEXT.TERTIARY : COLORS.SECONDARY} size={18} />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onPress={handleShare} size="md">
                <ShareIcon color={COLORS.SECONDARY} size={18} />
              </IconButton>
              <IconButton onPress={handleEdit} size="md">
                <EditIcon color={COLORS.TEXT.PRIMARY} size={18} />
              </IconButton>
              <IconButton onPress={handleClose} size="md" variant="ghost">
                <Text style={styles.closeButtonText}>×</Text>
              </IconButton>
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
                <CalendarIcon color={COLORS.TEXT.SECONDARY} size={20} />
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
                  <DeleteIcon color={COLORS.TEXT.LIGHT} size={18} />
                  <Text style={styles.deleteButtonText}>Supprimer l'observation</Text>
                </View>
              </TouchableOpacity>
            )}
      </ScrollView>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XL,
    paddingBottom: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.LIGHT,
  },
  title: {
    fontSize: FONT_SIZES.XXXL,
    fontWeight: 'bold',
    color: COLORS.TEXT.PRIMARY,
    flex: 1,
  },
  titleInput: {
    flex: 1,
    marginRight: SPACING.MD,
    fontSize: FONT_SIZES.XXXL,
    fontWeight: 'bold',
    color: COLORS.TEXT.PRIMARY,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: SPACING.XS,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.SECONDARY,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  closeButtonText: {
    fontSize: FONT_SIZES.XXXL,
    color: COLORS.TEXT.SECONDARY,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: SPACING.MD,
  },
  label: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.TEXT.SECONDARY,
    marginTop: SPACING.LG,
    marginBottom: SPACING.XS,
  },
  value: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: SPACING.SM,
    fontWeight: '400',
    lineHeight: 20,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER.MEDIUM,
    borderRadius: BORDER_RADIUS.SM,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
  },
  dateButtonText: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT.PRIMARY,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.MD,
    marginTop: SPACING.SM,
    resizeMode: 'cover',
  },
  deleteButton: {
    backgroundColor: COLORS.ERROR,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.SM,
    marginTop: SPACING.XXL,
    marginBottom: SPACING.LG,
    alignItems: 'center',
  },
  deleteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.SM,
  },
  deleteButtonText: {
    color: COLORS.TEXT.LIGHT,
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
  },
  imageEditContainer: {
    marginBottom: SPACING.LG,
  },
  imageContainer: {
    alignItems: 'center',
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: COLORS.SECONDARY,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.SM,
    padding: SPACING.XL,
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
  },
  addImageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.SM,
  },
  addImageText: {
    color: COLORS.SECONDARY,
    fontSize: FONT_SIZES.LG,
  },
  changeImageButton: {
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    marginTop: SPACING.MD,
  },
  changeImageText: {
    color: COLORS.TEXT.LIGHT,
    fontSize: FONT_SIZES.MD,
  },
  noImageText: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT.TERTIARY,
    fontStyle: 'italic',
    marginBottom: SPACING.SM,
  },
});