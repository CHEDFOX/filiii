import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useProfileStore } from '@/store/useProfileStore';
import { FloatingLogo } from '@/components/common/FloatingLogo';
import { HabitCard } from '@/components/habits/HabitCard';
import { Button } from '@/components/common/Button';
import { colors, borderRadius, spacing, typography } from '@/constants/colors';
import { refineHabit } from '@/services/aiService';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const { habits, loading, loadHabits, addHabit, markHabitComplete } = useHabitsStore();
  const { calculateProgress } = useProfileStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHabitText, setNewHabitText] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

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
      return;
    }

    try {
      setCreating(true);
      setError('');

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

      setShowCreateModal(false);
      setNewHabitText('');
      setCreating(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create habit');
      setCreating(false);
    }
  };

  const handleCompleteHabit = async (habitId: string) => {
    await markHabitComplete(habitId, today);
    if (user) {
      calculateProgress(user.id, habits);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FloatingLogo />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name}</Text>
          <Text style={styles.subtitle}>Let's make today count</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowCreateModal(true)}>
          <Plus size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySubtext}>Create your first habit to get started</Text>
          </View>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={() => handleCompleteHabit(habit.id)}
              isCompleted={habit.completedDates.includes(today)}
            />
          ))
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Habit</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Describe the habit you'd like to build. AI will help refine it.
            </Text>

            <TextInput
              style={styles.modalInput}
              value={newHabitText}
              onChangeText={setNewHabitText}
              placeholder="e.g., I want to meditate every morning"
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus
            />

            {error ? <Text style={styles.modalError}>{error}</Text> : null}

            <Button
              title="Create Habit"
              onPress={handleCreateHabit}
              loading={creating}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  greeting: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSizes.md,
    color: colors.textTertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.darkGray,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  modalDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  modalInput: {
    backgroundColor: colors.mediumGray,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderGray,
    minHeight: 100,
    marginBottom: spacing.md,
  },
  modalError: {
    color: colors.error,
    fontSize: typography.fontSizes.sm,
    marginBottom: spacing.md,
  },
  modalButton: {
    marginTop: spacing.md,
  },
});
