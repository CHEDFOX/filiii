import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause, RotateCw } from 'lucide-react-native';
import { colors, borderRadius, spacing, typography } from '@/constants/colors';
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
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'focus':
        return colors.focus;
      case 'calm':
        return colors.calm;
      case 'sleep':
        return colors.sleep;
      case 'energy':
        return colors.energy;
      default:
        return colors.accent;
    }
  };

  const categoryColor = getCategoryColor(sound.category);

  return (
    <View style={[styles.card, { borderLeftColor: categoryColor, borderLeftWidth: 4 }]}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.name}>{sound.name}</Text>
          <Text style={styles.category}>{sound.category.toUpperCase()}</Text>
        </View>
        <TouchableOpacity
          style={[styles.loopButton, isLooping && styles.loopButtonActive]}
          onPress={onToggleLoop}
        >
          <RotateCw size={20} color={isLooping ? colors.accent : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.waveformContainer}>
        <WaveformAnimation isPlaying={isPlaying} color={categoryColor} />
      </View>

      <TouchableOpacity style={styles.playButton} onPress={onPlayPause}>
        {isPlaying ? (
          <Pause size={28} color={colors.textPrimary} fill={colors.textPrimary} />
        ) : (
          <Play size={28} color={colors.textPrimary} fill={colors.textPrimary} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.mediumGray,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  loopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loopButtonActive: {
    backgroundColor: colors.accent + '30',
  },
  waveformContainer: {
    height: 60,
    marginVertical: spacing.md,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
});
