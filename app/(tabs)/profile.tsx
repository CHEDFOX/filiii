import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LogOut, Flame, Target, TrendingUp, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { ProgressCircle } from '@/components/profile/ProgressCircle';
import { Button } from '@/components/common/Button';
import { colors, borderRadius, spacing, typography, elevation } from '@/constants/colors';

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
          <LogOut size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.delay(100)} style={styles.profileCard}>
          <LinearGradient
            colors={colors.gradients.purple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <User size={40} color="#FFFFFF" strokeWidth={2} />
              </View>
            </View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </LinearGradient>
        </Animated.View>

        <View style={styles.statsGrid}>
          <Animated.View entering={FadeIn.delay(200)} style={styles.statCardWrapper}>
            <LinearGradient
              colors={colors.gradients.sunset}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statIconContainer}>
                <Flame size={28} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={styles.statValue}>{progress?.streak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(300)} style={styles.statCardWrapper}>
            <LinearGradient
              colors={colors.gradients.ocean}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statIconContainer}>
                <Target size={28} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={styles.statValue}>{progress?.totalHabits || 0}</Text>
              <Text style={styles.statLabel}>Total Habits</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(400)} style={styles.statCardWrapper}>
            <LinearGradient
              colors={colors.gradients.forest}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statIconContainer}>
                <TrendingUp size={28} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={styles.statValue}>{progress?.completedToday || 0}</Text>
              <Text style={styles.statLabel}>Completed Today</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        <Animated.View entering={FadeIn.delay(500)} style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Daily Progress</Text>
          <TouchableOpacity onPress={handleEnterMeditative} activeOpacity={0.9}>
            <ProgressCircle progress={progress?.completionRate || 0} onPress={handleEnterMeditative} />
          </TouchableOpacity>
          <Text style={styles.progressHint}>Tap to enter meditative mode</Text>
        </Animated.View>
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
    backgroundColor: colors.darkGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing.massive,
  },
  profileCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.base,
    ...elevation.medium,
  },
  profileGradient: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    letterSpacing: typography.letterSpacing.tight,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  email: {
    fontSize: typography.fontSizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.base,
  },
  statCardWrapper: {
    width: '33.33%',
    padding: spacing.xs,
  },
  statCard: {
    aspectRatio: 0.9,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.medium,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statLabel: {
    fontSize: typography.fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontWeight: typography.fontWeights.semibold,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  progressSection: {
    backgroundColor: colors.cardGray,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    letterSpacing: typography.letterSpacing.tight,
  },
  progressHint: {
    fontSize: typography.fontSizes.xs,
    color: colors.textQuaternary,
    marginTop: spacing.base,
    fontStyle: 'italic',
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
