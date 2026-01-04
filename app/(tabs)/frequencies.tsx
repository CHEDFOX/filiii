import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { Sparkles } from 'lucide-react-native';
import { SoundCard } from '@/components/frequencies/SoundCard';
import { colors, spacing, typography, borderRadius } from '@/constants/colors';
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
        <View style={styles.titleContainer}>
          <Sparkles size={28} color={colors.accent} strokeWidth={2} />
          <View style={styles.titleTextContainer}>
            <Text style={styles.title}>Sound Library</Text>
            <Text style={styles.subtitle}>Discover healing frequencies</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {SOUND_FREQUENCIES.map((soundItem, index) => (
            <Animated.View
              key={soundItem.id}
              entering={FadeIn.delay(index * 50)}
              style={styles.gridItem}
            >
              <SoundCard
                sound={soundItem}
                isPlaying={currentSound === soundItem.id}
                isLooping={loopingSound === soundItem.id}
                onPlayPause={() => handlePlayPause(soundItem.id, soundItem.url)}
                onToggleLoop={() => handleToggleLoop(soundItem.id)}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkGray,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing.massive,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  gridItem: {
    width: '50%',
    padding: spacing.xs,
  },
});
