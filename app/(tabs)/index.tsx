import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Plus, X, Sparkles } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useProfileStore } from '@/store/useProfileStore';
import { FloatingLogo } from '@/components/common/FloatingLogo';
import { HabitCard } from '@/components/habits/HabitCard';
import { Button } from '@/components/common/Button';
import { colors, borderRadius, spacing, typography, elevation } from '@/constants/colors';
import { refineHabit } from '@/services/aiService';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const { habits, loading, loadHabits, addHabit, markHabitComplete } = useHabitsStore();
  const { calculateProgress } = useProfileStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHabitText, setNewHabitText] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const addButtonScale = useSharedValue(1);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      loadHabits(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (user && habits.length > 0) {
      calculateProgress(user.id, habits);
    }
  }, [habits, user]);

  const handleCreateHabit = async () => {
    if (!user || !newHabitText.trim()) {
      setError('Please enter a habit description');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    try {
      setCreating(true);
      setError('');

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const refinedHabit = await refineHabit(newHabitText);

      await addHabit({
        userId: user.id,
        name: refinedHabit.name,
        description: refinedHabit.description,
        category: refinedHabit.category,
        duration: 15,
        frequency: 'daily',
        priority: 'medium',
        notificationsEnabled: false,
        aiGenerated: false,
      });

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setShowCreateModal(false);
      setNewHabitText('');
      setCreating(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create habit');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      setCreating(false);
    }
  };

  const handleCompleteHabit = async (habitId: string) => {
    await markHabitComplete(habitId, today);
    if (user) {
      calculateProgress(user.id, habits);
    }
  };

  const handleOpenModal = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowCreateModal(false);
    setNewHabitText('');
    setError('');
  };

  const addButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }],
  }));

  const handleAddButtonPressIn = () => {
    addButtonScale.value = withSpring(0.9);
  };

  const handleAddButtonPressOut = () => {
    addButtonScale.value = withSpring(1);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View entering={FadeIn} style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading your habits...</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FloatingLogo />

      <View style={styles.header}>
        <Animated.View entering={FadeIn.delay(200)}>
          <Text style={styles.greeting}>Hello, {user?.name}</Text>
          <Text style={styles.subtitle}>Let's make today count</Text>
        </Animated.View>
        <Animated.View
          entering={FadeIn.delay(400)}
          style={addButtonAnimatedStyle}
          onTouchStart={handleAddButtonPressIn}
          onTouchEnd={handleAddButtonPressOut}
          onTouchCancel={handleAddButtonPressOut}
        >
          <Animated.View
            style={styles.addButton}
            onStartShouldSetResponder={() => true}
            onResponderRelease={handleOpenModal}
          >
            <LinearGradient
              colors={[colors.accentGradientStart, colors.accentGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButtonGradient}
            >
              <Plus size={24} color={colors.textPrimary} strokeWidth={2.5} />
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {habits.length === 0 ? (
          <Animated.View entering={FadeIn.delay(600)} style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Sparkles size={48} color={colors.textTertiary} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySubtext}>Create your first habit to get started</Text>
          </Animated.View>
        ) : (
          habits.map((habit, index) => (
            <Animated.View
              key={habit.id}
              entering={FadeIn.delay(index * 100)}
            >
              <HabitCard
                habit={habit}
                onComplete={() => handleCompleteHabit(habit.id)}
                isCompleted={habit.completedDates.includes(today)}
              />
            </Animated.View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="fade"
        transparent
        onRequestClose={handleCloseModal}
      >
        <BlurView intensity={80} style={styles.modalOverlay}>
          <Animated.View
            entering={SlideInDown.springify()}
            exiting={SlideOutDown.springify()}
            style={styles.modalContentWrapper}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              <View style={styles.modalHandle} />

              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Sparkles size={24} color={colors.accent} strokeWidth={2} />
                  <Text style={styles.modalTitle}>Create New Habit</Text>
                </View>
                <Animated.View
                  style={styles.closeButton}
                  onStartShouldSetResponder={() => true}
                  onResponderRelease={handleCloseModal}
                >
                  <X size={24} color={colors.textTertiary} strokeWidth={2} />
                </Animated.View>
              </View>

              <Text style={styles.modalDescription}>
                Describe the habit you'd like to build. AI will help refine it.
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.modalInput}
                  value={newHabitText}
                  onChangeText={setNewHabitText}
                  placeholder="e.g., I want to meditate every morning"
                  placeholderTextColor={colors.textQuaternary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  autoFocus
                />
              </View>

              {error ? (
                <Animated.View entering={FadeIn} style={styles.errorContainer}>
                  <Text style={styles.modalError}>{error}</Text>
                </Animated.View>
              ) : null}

              <Button
                title={creating ? "Creating..." : "Create Habit"}
                onPress={handleCreateHabit}
                loading={creating}
                size="large"
                style={styles.modalButton}
              />
            </KeyboardAvoidingView>
          </Animated.View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.base,
  },
  loadingText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textTertiary,
    fontWeight: typography.fontWeights.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  greeting: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    fontWeight: typography.fontWeights.medium,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    ...elevation.colored,
  },
  addButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.massive,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.massive,
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    letterSpacing: typography.letterSpacing.tight,
  },
  emptySubtext: {
    fontSize: typography.fontSizes.md,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: typography.fontSizes.md * typography.lineHeights.relaxed,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContentWrapper: {
    maxHeight: '85%',
  },
  modalContent: {
    backgroundColor: colors.cardGray,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxxl : spacing.xl,
    ...elevation.large,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: colors.borderGray,
    borderRadius: borderRadius.xs,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.textTertiary,
    marginBottom: spacing.xl,
    lineHeight: typography.fontSizes.sm * typography.lineHeights.relaxed,
  },
  inputContainer: {
    marginBottom: spacing.base,
  },
  modalInput: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    fontSize: typography.fontSizes.md,
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: colors.borderGray,
    minHeight: 120,
    lineHeight: typography.fontSizes.md * typography.lineHeights.relaxed,
    fontWeight: typography.fontWeights.regular,
  },
  errorContainer: {
    backgroundColor: colors.errorDark,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  modalError: {
    color: colors.errorLight,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  modalButton: {
    marginTop: spacing.base,
  },
});
