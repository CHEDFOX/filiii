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
import { Plus, X, Sparkles, Heart, Dumbbell, BookOpen, Coffee, Moon, Zap, Smile, Target } from 'lucide-react-native';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const addButtonScale = useSharedValue(1);

  const today = new Date().toISOString().split('T')[0];

  const categories = [
    { id: 'wellness', name: 'Wellness', icon: Heart, colors: ['#FF6B9D', '#C06C84'] },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell, colors: ['#4FACFE', '#00F2FE'] },
    { id: 'learning', name: 'Learning', icon: BookOpen, colors: ['#FA709A', '#FEE140'] },
    { id: 'productivity', name: 'Work', icon: Target, colors: ['#A8EDEA', '#FED6E3'] },
    { id: 'mindfulness', name: 'Mindful', icon: Smile, colors: ['#FFD89B', '#19547B'] },
    { id: 'sleep', name: 'Sleep', icon: Moon, colors: ['#667EEA', '#764BA2'] },
  ];

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

    if (!selectedCategory) {
      setError('Please select a category');
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
        category: selectedCategory,
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
      setSelectedCategory('');
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
    setSelectedCategory('');
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

              <Animated.View
                style={styles.closeButton}
                onStartShouldSetResponder={() => true}
                onResponderRelease={handleCloseModal}
              >
                <X size={20} color={colors.textSecondary} strokeWidth={2.5} />
              </Animated.View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Create Your Habit</Text>
                  <Text style={styles.modalSubtitle}>
                    Choose a category and describe what you want to achieve
                  </Text>
                </View>

                <View style={styles.categoriesContainer}>
                  <Text style={styles.sectionLabel}>Select Category</Text>
                  <View style={styles.categoriesGrid}>
                    {categories.map((category, index) => {
                      const Icon = category.icon;
                      const isSelected = selectedCategory === category.id;

                      return (
                        <Animated.View
                          key={category.id}
                          entering={FadeIn.delay(index * 50)}
                          style={styles.categoryCardWrapper}
                          onStartShouldSetResponder={() => true}
                          onResponderRelease={() => {
                            setSelectedCategory(category.id);
                            if (Platform.OS !== 'web') {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }
                          }}
                        >
                          <LinearGradient
                            colors={category.colors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[
                              styles.categoryCard,
                              isSelected && styles.categoryCardSelected,
                            ]}
                          >
                            {isSelected && (
                              <View style={styles.categoryCheckmark}>
                                <Sparkles size={14} color="#FFFFFF" strokeWidth={3} />
                              </View>
                            )}
                            <View style={styles.categoryIconContainer}>
                              <Icon size={28} color="#FFFFFF" strokeWidth={2} />
                            </View>
                            <Text style={styles.categoryName}>{category.name}</Text>
                          </LinearGradient>
                        </Animated.View>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.inputSection}>
                  <Text style={styles.sectionLabel}>Describe Your Habit</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.habitInput}
                      value={newHabitText}
                      onChangeText={setNewHabitText}
                      placeholder="e.g., Meditate for 10 minutes every morning"
                      placeholderTextColor={colors.textQuaternary}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                  <Text style={styles.inputHint}>
                    AI will refine and optimize your habit for success
                  </Text>
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
                  style={styles.createButton}
                />
              </ScrollView>
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
    maxHeight: '92%',
  },
  modalContent: {
    backgroundColor: colors.darkGray,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    paddingTop: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxxl : spacing.xl,
    ...elevation.large,
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: colors.borderGray,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
    marginBottom: spacing.base,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.xl,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalScrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    marginBottom: spacing.xxxl,
    paddingRight: spacing.huge,
  },
  modalTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    fontSize: typography.fontSizes.md,
    color: colors.textTertiary,
    lineHeight: typography.fontSizes.md * typography.lineHeights.body,
    fontWeight: typography.fontWeights.regular,
  },
  sectionLabel: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: spacing.base,
  },
  categoriesContainer: {
    marginBottom: spacing.xxxl,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  categoryCardWrapper: {
    width: '33.33%',
    padding: spacing.xs,
  },
  categoryCard: {
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...elevation.medium,
  },
  categoryCardSelected: {
    transform: [{ scale: 0.95 }],
    ...elevation.colored,
  },
  categoryCheckmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: '#FFFFFF',
    letterSpacing: typography.letterSpacing.tight,
  },
  inputSection: {
    marginBottom: spacing.xl,
  },
  inputWrapper: {
    backgroundColor: colors.cardGray,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.borderGray,
    overflow: 'hidden',
  },
  habitInput: {
    padding: spacing.base,
    fontSize: typography.fontSizes.md,
    color: colors.textPrimary,
    minHeight: 100,
    lineHeight: typography.fontSizes.md * typography.lineHeights.body,
    fontWeight: typography.fontWeights.regular,
  },
  inputHint: {
    fontSize: typography.fontSizes.xs,
    color: colors.textQuaternary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  errorContainer: {
    backgroundColor: colors.errorDark,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  modalError: {
    color: colors.errorLight,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  createButton: {
    marginTop: spacing.base,
  },
});
