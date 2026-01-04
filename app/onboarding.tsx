import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { Button } from '@/components/common/Button';
import { colors, borderRadius, spacing, typography } from '@/constants/colors';
import { analyzeOnboardingAnswers } from '@/services/aiService';
import type { OnboardingAnswers } from '@/types';

const questions = [
  {
    id: 'physicalGoals',
    question: 'What are your physical fitness goals?',
    placeholder: 'e.g., lose weight, build strength, improve endurance...',
  },
  {
    id: 'mentalWellnessGoals',
    question: 'What mental wellness goals would you like to achieve?',
    placeholder: 'e.g., reduce stress, improve focus, better sleep...',
  },
  {
    id: 'lifestylePreferences',
    question: 'Describe your lifestyle preferences',
    placeholder: 'e.g., active lifestyle, sedentary job, family commitments...',
  },
  {
    id: 'timeAvailability',
    question: 'How much time can you dedicate daily?',
    placeholder: 'e.g., 30 minutes, 1 hour, flexible schedule...',
  },
  {
    id: 'motivationStyle',
    question: 'What motivation style works best for you?',
    placeholder: 'e.g., gentle encouragement, challenging pushes, accountability...',
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    physicalGoals: '',
    mentalWellnessGoals: '',
    lifestylePreferences: '',
    timeAvailability: '',
    motivationStyle: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = useAuthStore((state) => state.user);
  const { addHabit, addRoutine } = useHabitsStore();

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const currentAnswer = answers[currentQuestion.id as keyof OnboardingAnswers];

  const handleNext = async () => {
    if (!currentAnswer.trim()) {
      setError('Please provide an answer to continue');
      return;
    }

    setError('');

    if (isLastStep) {
      await handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const aiResponse = await analyzeOnboardingAnswers(answers);

      for (const routine of aiResponse.dailyRoutines) {
        await addRoutine({
          userId: user.id,
          timeOfDay: routine.timeOfDay,
          activities: routine.activities,
          duration: routine.duration,
        });
      }

      for (const habit of aiResponse.habits) {
        await addHabit({
          userId: user.id,
          name: habit.name,
          description: habit.description,
          category: habit.category,
          duration: habit.duration,
          frequency: habit.frequency,
          priority: habit.priority,
          notificationsEnabled: false,
          aiGenerated: true,
        });
      }

      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Failed to generate your personalized plan');
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.progress}>
            Question {currentStep + 1} of {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentStep + 1) / questions.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Creating your personalized plan...</Text>
          </View>
        ) : (
          <>
            <View style={styles.questionContainer}>
              <Text style={styles.question}>{currentQuestion.question}</Text>
              <TextInput
                style={styles.input}
                value={currentAnswer}
                onChangeText={(text) =>
                  setAnswers({
                    ...answers,
                    [currentQuestion.id]: text,
                  })
                }
                placeholder={currentQuestion.placeholder}
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                autoFocus
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>

            <View style={styles.actions}>
              {currentStep > 0 && (
                <Button
                  title="Back"
                  onPress={handleBack}
                  variant="outline"
                  style={styles.backButton}
                />
              )}
              <Button
                title={isLastStep ? 'Complete' : 'Next'}
                onPress={handleNext}
                style={styles.nextButton}
              />
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  progress: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  questionContainer: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  question: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    lineHeight: typography.fontSizes.xl * typography.lineHeights.heading,
  },
  input: {
    backgroundColor: colors.mediumGray,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderGray,
    minHeight: 120,
  },
  error: {
    color: colors.error,
    fontSize: typography.fontSizes.sm,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
});
