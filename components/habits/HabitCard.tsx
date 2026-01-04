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
      case 'wellness':
        return colors.gradients.sunset;
      case 'fitness':
        return colors.gradients.ocean;
      case 'learning':
        return colors.gradients.berry;
      case 'productivity':
        return colors.gradients.dream;
      case 'mindfulness':
        return colors.gradients.gold;
      case 'sleep':
        return colors.gradients.night;
      case 'physical':
        return colors.gradients.sunset;
      case 'mental':
        return colors.gradients.forest;
      case 'hybrid':
        return colors.gradients.purple;
      default:
        return colors.gradients.ocean;
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
      style={[styles.cardWrapper, elevation.medium, animatedStyle]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
    >
      <LinearGradient
        colors={categoryColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.gradientOverlay} />

        <View style={styles.content}>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Check size={16} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}

          <View style={styles.textSection}>
            <Text style={styles.name} numberOfLines={2}>
              {habit.name}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {habit.description}
            </Text>
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
                style={styles.startButton}
                onStartShouldSetResponder={() => true}
                onResponderRelease={handleStart}
              >
                <View style={styles.startButtonInner}>
                  <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
                </View>
              </Animated.View>
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: borderRadius.xl,
    marginBottom: spacing.base,
    overflow: 'hidden',
  },
  card: {
    borderRadius: borderRadius.xl,
    minHeight: 180,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    marginBottom: spacing.base,
  },
  completedText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: '#FFFFFF',
    letterSpacing: typography.letterSpacing.wide,
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    letterSpacing: typography.letterSpacing.tight,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: typography.fontSizes.sm * typography.lineHeights.body,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.base,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  metaText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: '#FFFFFF',
    letterSpacing: typography.letterSpacing.wide,
  },
  startButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonInner: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
