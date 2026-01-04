import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Check } from 'lucide-react-native';
import { colors, borderRadius, spacing, typography } from '@/constants/colors';
import type { Habit } from '@/types';
import { HabitTimer } from './HabitTimer';

interface HabitCardProps {
  habit: Habit;
  onComplete: () => void;
  isCompleted: boolean;
}

export function HabitCard({ habit, onComplete, isCompleted }: HabitCardProps) {
  const [showTimer, setShowTimer] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical':
        return colors.energy;
      case 'mental':
        return colors.calm;
      case 'hybrid':
        return colors.focus;
      default:
        return colors.accent;
    }
  };

  const handleStart = () => {
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
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View
            style={[
              styles.categoryIndicator,
              { backgroundColor: getCategoryColor(habit.category) },
            ]}
          />
          <View style={styles.textContent}>
            <Text style={styles.name}>{habit.name}</Text>
            <Text style={styles.description}>{habit.description}</Text>
          </View>
        </View>
        {isCompleted && (
          <View style={styles.checkIcon}>
            <Check size={24} color={colors.success} strokeWidth={3} />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{habit.duration} min</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{habit.frequency}</Text>
        </View>
        {!isCompleted && (
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Play size={16} color={colors.textPrimary} fill={colors.textPrimary} />
            <Text style={styles.startText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.mediumGray,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    opacity: 0.7,
    borderWidth: 1,
    borderColor: colors.success,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSizes.sm * typography.lineHeights.body,
  },
  checkIcon: {
    marginLeft: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textTertiary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  startText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
});
