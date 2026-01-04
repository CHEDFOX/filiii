import { Platform } from 'react-native';
import { Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography, elevation } from '@/constants/colors';

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
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSpring(0.96, {
      damping: 15,
      stiffness: 400,
    });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    variant === 'primary' && elevation.medium,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`text_${size}`],
  ];

  return (
    <Animated.View style={[animatedStyle, buttonStyles]}>
      <Animated.View
        style={styles.touchable}
        onTouchStart={disabled || loading ? undefined : handlePressIn}
        onTouchEnd={disabled || loading ? undefined : handlePressOut}
        onTouchCancel={disabled || loading ? undefined : handlePressOut}
      >
        <Animated.View
          style={styles.content}
          onStartShouldSetResponder={() => true}
          onResponderRelease={() => {
            if (!disabled && !loading) {
              onPress();
            }
          }}
        >
          {loading ? (
            <ActivityIndicator
              color={variant === 'outline' ? colors.accent : colors.textPrimary}
            />
          ) : (
            <Text style={textStyles}>{title}</Text>
          )}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    minHeight: 44,
  },
  touchable: {
    flex: 1,
  },
  content: {
    flex: 1,
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
    borderWidth: 2,
    borderColor: colors.accent,
  },
  disabled: {
    opacity: 0.4,
  },
  size_small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    minHeight: 40,
  },
  size_medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },
  size_large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    minHeight: 56,
  },
  text: {
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },
  primaryText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.md,
  },
  secondaryText: {
    color: colors.textSecondary,
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
