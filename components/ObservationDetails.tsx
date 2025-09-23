import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Observation } from '../types/Observation';

interface ObservationDetailsProps {
  observation: Observation | null;
  visible: boolean;
  onClose: () => void;
}

export const ObservationDetails: React.FC<ObservationDetailsProps> = ({
  observation,
  visible,
  onClose,
}) => {
  if (!observation) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{observation.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Date d'observation:</Text>
            <Text style={styles.value}>{observation.date}</Text>

            <Text style={styles.label}>Localisation:</Text>
            <Text style={styles.value}>
              {observation.latitude.toFixed(6)}, {observation.longitude.toFixed(6)}
            </Text>

            <Text style={styles.label}>Créé le:</Text>
            <Text style={styles.value}>{new Date(observation.createdAt).toLocaleDateString()}</Text>

            {observation.imageUri && (
              <>
                <Text style={styles.label}>Photo:</Text>
                <Image source={{ uri: observation.imageUri }} style={styles.image} />
              </>
            )}
          </View>
        </View>
      </View>
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
    maxHeight: '70%',
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
  content: {
    flex: 1,
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
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 8,
    resizeMode: 'cover',
  },
});