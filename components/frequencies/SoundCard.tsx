import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, RotateCw } from 'lucide-react-native';
import { colors, borderRadius, spacing, typography, elevation } from '@/constants/colors';
import type { SoundFrequency } from '@/types';
import { WaveformAnimation } from './WaveformAnimation';

interface SoundCardProps {
  sound: SoundFrequency;
  isPlaying: boolean;
  isLooping: boolean;
  onPlayPause: () => void;
  onToggleLoop: () => void;
}

export function SoundCard({
  sound,
  isPlaying,
  isLooping,
  onPlayPause,
  onToggleLoop,
}: SoundCardProps) {
  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'focus':
        return colors.gradients.forest;
      case 'calm':
        return colors.gradients.ocean;
      case 'sleep':
        return colors.gradients.night;
      case 'energy':
        return colors.gradients.gold;
      default:
        return colors.gradients.purple;
    }
  };

  const gradient = getCategoryGradient(sound.category);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.cardWrapper}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.gradientOverlay} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{sound.category}</Text>
            </View>
            <TouchableOpacity
              style={[styles.loopButton, isLooping && styles.loopButtonActive]}
              onPress={onToggleLoop}
            >
              <RotateCw
                size={16}
                color="#FFFFFF"
                strokeWidth={isLooping ? 3 : 2}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.name} numberOfLines={2}>
              {sound.name}
            </Text>

            <View style={styles.waveformContainer}>
              <WaveformAnimation isPlaying={isPlaying} color="rgba(255, 255, 255, 0.8)" />
            </View>
          </View>

          <TouchableOpacity style={styles.playButton} onPress={onPlayPause}>
            <View style={styles.playButtonInner}>
              {isPlaying ? (
                <Pause size={20} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...elevation.medium,
  },
  card: {
    borderRadius: borderRadius.xl,
    aspectRatio: 0.85,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  content: {
    flex: 1,
    padding: spacing.base,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    fontSize: typography.fontSizes.xxs,
    fontWeight: typography.fontWeights.semibold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },
  loopButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loopButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: spacing.md,
    letterSpacing: typography.letterSpacing.tight,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  waveformContainer: {
    height: 50,
  },
  playButton: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonInner: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
