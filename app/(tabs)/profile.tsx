import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Flame, Target, TrendingUp } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { ProgressCircle } from '@/components/profile/ProgressCircle';
import { Button } from '@/components/common/Button';
import { colors, borderRadius, spacing, typography } from '@/constants/colors';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logOut = useAuthStore((state) => state.logOut);
  const { progress, loadProgress, meditativeMode, toggleMeditativeMode } = useProfileStore();
  const [showMeditativeTimer, setShowMeditativeTimer] = useState(false);

  useEffect(() => {
    if (user) {
      loadProgress(user.id);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEnterMeditative = () => {
    toggleMeditativeMode();
    setShowMeditativeTimer(true);
  };

  const handleExitMeditative = () => {
    toggleMeditativeMode();
    setShowMeditativeTimer(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <ProgressCircle
            progress={progress?.completionRate || 0}
            onPress={handleEnterMeditative}
          />
          <Text style={styles.progressHint}>Tap to enter meditative mode</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Target size={24} color={colors.accent} />
            </View>
            <Text style={styles.statValue}>{progress?.totalHabits || 0}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Flame size={24} color={colors.energy} />
            </View>
            <Text style={styles.statValue}>{progress?.streak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={24} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{progress?.completedToday || 0}</Text>
            <Text style={styles.statLabel}>Completed Today</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showMeditativeTimer} animationType="fade" transparent={false}>
        <View style={styles.meditativeContainer}>
          <View style={styles.meditativeContent}>
            <Text style={styles.meditativeText}>Breathe</Text>
            <Text style={styles.meditativeSubtext}>Focus on the present moment</Text>
          </View>
          <Button
            title="Exit Meditation"
            onPress={handleExitMeditative}
            variant="outline"
            style={styles.exitButton}
          />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  logoutButton: {
    padding: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  name: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  progressHint: {
    fontSize: typography.fontSizes.xs,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.mediumGray,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  meditativeContainer: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  meditativeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meditativeText: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  meditativeSubtext: {
    fontSize: typography.fontSizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  exitButton: {
    width: '100%',
  },
});
