import { TouchableOpacity, StyleSheet } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { colors, spacing } from '@/constants/colors';

interface VoiceControlsProps {
  enabled: boolean;
  onToggle: () => void;
}

export function VoiceControls({ enabled, onToggle }: VoiceControlsProps) {
  return (
    <TouchableOpacity
      style={[styles.button, enabled ? styles.enabled : styles.disabled]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {enabled ? (
        <Volume2 size={24} color={colors.textPrimary} />
      ) : (
        <VolumeX size={24} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  enabled: {
    backgroundColor: colors.accent,
  },
  disabled: {
    backgroundColor: colors.lightGray,
  },
});
