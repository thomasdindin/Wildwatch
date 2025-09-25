import React, { ReactNode } from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/styles';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: string;
  minHeight?: string;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  maxHeight = '80%',
  minHeight = '50%',
}) => {
  const screenHeight = Dimensions.get('window').height;
  const maxHeightValue = typeof maxHeight === 'string'
    ? screenHeight * (parseInt(maxHeight) / 100)
    : maxHeight;
  const minHeightValue = typeof minHeight === 'string'
    ? screenHeight * (parseInt(minHeight) / 100)
    : minHeight;

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <SafeAreaView style={styles.safeArea}>
              <View style={[
                styles.container,
                {
                  maxHeight: maxHeightValue,
                  minHeight: minHeightValue,
                }
              ]}>
                {children}
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY.MEDIUM,
    justifyContent: 'flex-end',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
    borderTopLeftRadius: BORDER_RADIUS.XL,
    borderTopRightRadius: BORDER_RADIUS.XL,
    padding: SPACING.XL,
    ...SHADOWS.HEAVY,
  },
});