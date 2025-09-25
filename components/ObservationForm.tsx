import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ObservationService } from '@/services/ObservationService';
import { Observation } from '@/types/Observation';
import { CalendarIcon, CameraIcon } from './Icons';
import { logger } from '@/utils/logger';
import { Modal, Button, Input } from './ui';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/constants/styles';

interface ObservationFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (observation: Observation) => void;
  latitude: number;
  longitude: number;
}

export const ObservationForm: React.FC<ObservationFormProps> = ({
  visible,
  onClose,
  onSave,
  latitude,
  longitude,
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const resetForm = () => {
    setName('');
    setDate(new Date().toISOString().split('T')[0]);
    setImageUri(undefined);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
      setImageUri(result.assets[0].uri);
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
      setImageUri(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Ajouter une image',
      'Choisissez une option',
      [
        { text: 'Appareil photo', onPress: pickImageFromCamera },
        { text: 'Galerie', onPress: pickImageFromGallery },
        { text: 'Annuler', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setDate(dateString);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour l\'observation.');
      return;
    }

    setIsLoading(true);

    try {
      const observation: Observation = {
        id: ObservationService.generateId(),
        name: name.trim(),
        date,
        latitude,
        longitude,
        imageUri,
        createdAt: new Date().toISOString(),
      };

      await ObservationService.saveObservation(observation);
      onSave(observation);
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'observation.');
      logger.error('Failed to save observation', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} onClose={handleClose} maxHeight="90%" minHeight="70%">
      <View style={styles.header}>
        <Button
          title="Annuler"
          onPress={handleClose}
          variant="ghost"
          size="sm"
        />
        <Text style={styles.title}>Nouvelle observation</Text>
        <Button
          title={isLoading ? 'Sauvegarde...' : 'Enregistrer'}
          onPress={handleSave}
          disabled={isLoading}
          size="sm"
        />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <Input
            label="Nom de l'observation *"
            value={name}
            onChangeText={setName}
            placeholder="Ex: Lézard vert"
            maxLength={100}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={showDatePickerModal}
            >
              <Text style={styles.dateButtonText}>
                {date || 'Sélectionner une date'}
              </Text>
              <CalendarIcon color={COLORS.TEXT.SECONDARY} size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Position</Text>
            <Text style={styles.coordinates}>
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image</Text>
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={showImagePicker}
                >
                  <Text style={styles.changeImageText}>{"Changer l'image"}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addImageButton} onPress={showImagePicker}>
                <View style={styles.addImageContent}>
                  <CameraIcon color={COLORS.SECONDARY} size={20} />
                  <Text style={styles.addImageText}>Ajouter une image</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
      </ScrollView>

      {/* DateTimePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={date ? new Date(date) : new Date()}
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
    paddingBottom: SPACING.LG,
    marginBottom: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.LIGHT,
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '600',
    color: COLORS.TEXT.PRIMARY,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: SPACING.XL,
  },
  label: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '500',
    marginBottom: SPACING.SM,
    color: COLORS.TEXT.PRIMARY,
  },
  coordinates: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT.SECONDARY,
    fontFamily: 'monospace',
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.SM,
    borderWidth: 1,
    borderColor: COLORS.BORDER.MEDIUM,
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
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: BORDER_RADIUS.SM,
    marginBottom: SPACING.MD,
  },
  changeImageButton: {
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
  },
  changeImageText: {
    color: COLORS.TEXT.LIGHT,
    fontSize: FONT_SIZES.MD,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER.MEDIUM,
    borderRadius: BORDER_RADIUS.SM,
    padding: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
  },
  dateButtonText: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT.PRIMARY,
    flex: 1,
  },
});