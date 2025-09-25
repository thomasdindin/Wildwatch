import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/constants/styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={COLORS.TEXT.TERTIARY}
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '500',
    marginBottom: SPACING.SM,
    color: COLORS.TEXT.PRIMARY,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER.MEDIUM,
    borderRadius: BORDER_RADIUS.SM,
    padding: SPACING.MD,
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT.PRIMARY,
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
    minHeight: 48,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  errorText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.ERROR,
    marginTop: SPACING.XS,
  },
});