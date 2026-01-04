import { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Play, Check } from 'lucide-react-native';
import { colors, borderRadius, spacing, typography, elevation } from '@/constants/colors';
import type { Habit } from '@/types';
import { HabitTimer } from './HabitTimer';

interface HabitCardProps {
  habit: Habit;
  onComplete: () => void;
  isCompleted: boolean;
}

export function HabitCard({ habit, onComplete, isCompleted }: HabitCardProps) {
  const [showTimer, setShowTimer] = useState(false);
  const scale = useSharedValue(1);

  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'physical':
        return {
          color: colors.energy,
          gradientStart: colors.energyGradientStart,
          gradientEnd: colors.energyGradientEnd,
        };
      case 'mental':
        return {
          color: colors.calm,
          gradientStart: colors.calmGradientStart,
          gradientEnd: colors.calmGradientEnd,
        };
      case 'hybrid':
        return {
          color: colors.focus,
          gradientStart: colors.focusGradientStart,
          gradientEnd: colors.focusGradientEnd,
        };
      default:
        return {
          color: colors.accent,
          gradientStart: colors.accentGradientStart,
          gradientEnd: colors.accentGradientEnd,
        };
    }
  };

  const categoryColors = getCategoryColors(habit.category);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleStart = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowTimer(true);
  };

  const handleComplete = () => {
    setShowTimer(false);
    onComplete();
  };

  if (showTimer) {
    return (
      <HabitTimer
        habit={habit}
        onComplete={handleComplete}
        onCancel={() => setShowTimer(false)}
      />
    );
  }

  return (
    <Animated.View
      style={[
        styles.card,
        isCompleted && styles.completedCard,
        elevation.small,
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <LinearGradient
            colors={[categoryColors.gradientStart, categoryColors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.categoryIndicator}
          />
          <View style={styles.textContent}>
            <Text style={styles.name}>{habit.name}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {habit.description}
            </Text>
          </View>
        </View>
        {isCompleted && (
          <View style={[styles.checkIcon, styles.checkIconBackground]}>
            <Check size={20} color={colors.textPrimary} strokeWidth={3} />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.meta}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaText}>{habit.duration} min</Text>
          </View>
          <View style={styles.metaBadge}>
            <Text style={styles.metaText}>{habit.frequency}</Text>
          </View>
        </View>
        {!isCompleted && (
          <Animated.View
            style={styles.startButtonWrapper}
            onTouchStart={handlePressIn}
            onTouchEnd={handlePressOut}
            onTouchCancel={handlePressOut}
          >
            <Animated.View
              style={styles.startButton}
              onStartShouldSetResponder={() => true}
              onResponderRelease={handleStart}
            >
              <LinearGradient
                colors={[colors.accentGradientStart, colors.accentGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startGradient}
              >
                <Play size={16} color={colors.textPrimary} fill={colors.textPrimary} />
                <Text style={styles.startText}>Start</Text>
              </LinearGradient>
            </Animated.View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardGray,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  completedCard: {
    opacity: 0.65,
    borderWidth: 1.5,
    borderColor: colors.success,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryIndicator: {
    width: 4,
    borderRadius: borderRadius.xs,
    marginRight: spacing.md,
    alignSelf: 'stretch',
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: typography.letterSpacing.tight,
  },
  description: {
    fontSize: typography.fontSizes.sm,
    color: colors.textTertiary,
    lineHeight: typography.fontSizes.sm * typography.lineHeights.relaxed,
  },
  checkIcon: {
    marginLeft: spacing.md,
  },
  checkIconBackground: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaBadge: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  metaText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.textTertiary,
    letterSpacing: typography.letterSpacing.wide,
  },
  startButtonWrapper: {
    overflow: 'hidden',
    borderRadius: borderRadius.md,
  },
  startButton: {
    overflow: 'hidden',
    borderRadius: borderRadius.md,
    minHeight: 36,
  },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  startText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.wide,
  },
});
