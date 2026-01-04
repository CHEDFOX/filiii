import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`text_${size}`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.accent : colors.textPrimary}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.mediumGray,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  disabled: {
    opacity: 0.5,
  },
  size_small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  size_medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  size_large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  text: {
    fontWeight: typography.fontWeights.bold,
  },
  primaryText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.md,
  },
  secondaryText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.md,
  },
  outlineText: {
    color: colors.accent,
    fontSize: typography.fontSizes.md,
  },
  text_small: {
    fontSize: typography.fontSizes.sm,
  },
  text_medium: {
    fontSize: typography.fontSizes.md,
  },
  text_large: {
    fontSize: typography.fontSizes.lg,
  },
});
