import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { SoundCard } from '@/components/frequencies/SoundCard';
import { colors, spacing, typography } from '@/constants/colors';
import { SOUND_FREQUENCIES } from '@/constants/sounds';

export default function FrequenciesScreen() {
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loopingSound, setLoopingSound] = useState<string | null>(null);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePlayPause = async (soundId: string, url: string) => {
    try {
      if (currentSound === soundId) {
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && status.isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
        }
      } else {
        if (sound) {
          await sound.unloadAsync();
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true, isLooping: loopingSound === soundId }
        );

        setSound(newSound);
        setCurrentSound(soundId);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleToggleLoop = async (soundId: string) => {
    const newLoopState = loopingSound === soundId ? null : soundId;
    setLoopingSound(newLoopState);

    if (sound && currentSound === soundId) {
      await sound.setIsLoopingAsync(newLoopState === soundId);
    }
  };

  const categories = ['focus', 'calm', 'sleep', 'energy'] as const;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Sound Space</Text>
        <Text style={styles.subtitle}>Find your perfect frequency</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {categories.map((category) => {
          const categorySounds = SOUND_FREQUENCIES.filter((s) => s.category === category);

          return (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category.toUpperCase()}</Text>
              {categorySounds.map((soundItem) => (
                <SoundCard
                  key={soundItem.id}
                  sound={soundItem}
                  isPlaying={currentSound === soundItem.id}
                  isLooping={loopingSound === soundItem.id}
                  onPlayPause={() => handlePlayPause(soundItem.id, soundItem.url)}
                  onToggleLoop={() => handleToggleLoop(soundItem.id)}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
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
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  categorySection: {
    marginBottom: spacing.xl,
  },
  categoryTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
});
