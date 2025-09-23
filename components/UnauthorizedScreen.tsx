import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { LocationIcon } from './Icons';

interface UnauthorizedScreenProps {
  onRetry: () => void;
  message?: string;
}

export const UnauthorizedScreen: React.FC<UnauthorizedScreenProps> = ({
  onRetry,
  message = 'Accès à la localisation refusé'
}) => {
  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Impossible d\'ouvrir les paramètres. Veuillez les ouvrir manuellement.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <LocationIcon color="#FF6B35" size={64} />
      </View>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.description}>
        Pour utiliser cette application, nous avons besoin d'accéder à votre localisation.
      </Text>

      <TouchableOpacity style={styles.button} onPress={openSettings}>
        <Text style={styles.buttonText}>Ouvrir les paramètres</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onRetry}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Réessayer</Text>
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
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 200,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
});