import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/styles';

interface IconButtonProps {
  children: ReactNode;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onPress,
  size = 'md',
  variant = 'default',
  disabled = false,
  style,
}) => {
  const sizeStyles = {
    sm: {
      width: 32,
      height: 32,
      borderRadius: BORDER_RADIUS.SM,
    },
    md: {
      width: 40,
      height: 40,
      borderRadius: BORDER_RADIUS.MD,
    },
    lg: {
      width: 48,
      height: 48,
      borderRadius: BORDER_RADIUS.LG,
    },
  };

  const variantStyles = {
    default: {
      backgroundColor: COLORS.BACKGROUND.PRIMARY,
      ...SHADOWS.LIGHT,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: COLORS.BORDER.MEDIUM,
    },
  };

  const disabledStyle = disabled
    ? {
        opacity: 0.5,
        backgroundColor: COLORS.BACKGROUND.TERTIARY,
      }
    : {};

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        variantStyles[variant],
        disabledStyle,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});