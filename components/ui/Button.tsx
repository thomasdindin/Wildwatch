import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '@/constants/styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'default',
  size = 'md',
  disabled = false,
  style,
  textStyle,
}) => {
  const sizeStyles = {
    sm: {
      paddingHorizontal: SPACING.LG,
      paddingVertical: SPACING.SM,
      minHeight: 36,
    },
    md: {
      paddingHorizontal: SPACING.XL,
      paddingVertical: SPACING.MD,
      minHeight: 44,
    },
    lg: {
      paddingHorizontal: SPACING.XXL,
      paddingVertical: SPACING.LG,
      minHeight: 52,
    },
  };

  const variantStyles = {
    default: {
      backgroundColor: COLORS.SECONDARY,
      ...SHADOWS.LIGHT,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: COLORS.SECONDARY,
    },
  };

  const textVariantStyles = {
    default: {
      color: COLORS.TEXT.LIGHT,
    },
    ghost: {
      color: COLORS.SECONDARY,
    },
    outline: {
      color: COLORS.SECONDARY,
    },
  };

  const textSizeStyles = {
    sm: {
      fontSize: FONT_SIZES.MD,
    },
    md: {
      fontSize: FONT_SIZES.LG,
    },
    lg: {
      fontSize: FONT_SIZES.XL,
    },
  };

  const disabledStyle = disabled
    ? {
        opacity: 0.5,
        backgroundColor: COLORS.BACKGROUND.TERTIARY,
      }
    : {};

  const disabledTextStyle = disabled
    ? {
        color: COLORS.TEXT.TERTIARY,
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
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          textSizeStyles[size],
          textVariantStyles[variant],
          disabledTextStyle,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.SM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});