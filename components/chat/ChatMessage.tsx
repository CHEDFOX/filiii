import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, typography, elevation } from '@/constants/colors';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {isUser ? (
        <View style={[styles.bubble, styles.userBubbleWrapper, elevation.small]}>
          <LinearGradient
            colors={colors.gradients.ocean}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.userBubble}
          >
            <Text style={styles.userText}>{message.content}</Text>
            <Text style={styles.userTimestamp}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </LinearGradient>
        </View>
      ) : (
        <View style={[styles.bubble, styles.assistantBubble, elevation.small]}>
          <Text style={styles.assistantText}>{message.content}</Text>
          <Text style={styles.assistantTimestamp}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  userBubbleWrapper: {
    borderRadius: borderRadius.xl,
  },
  userBubble: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.xl,
  },
  assistantBubble: {
    backgroundColor: colors.cardGray,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  userText: {
    fontSize: typography.fontSizes.md,
    lineHeight: typography.fontSizes.md * typography.lineHeights.body,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  assistantText: {
    fontSize: typography.fontSizes.md,
    lineHeight: typography.fontSizes.md * typography.lineHeights.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userTimestamp: {
    fontSize: typography.fontSizes.xxs,
    color: 'rgba(255, 255, 255, 0.8)',
    alignSelf: 'flex-end',
    fontWeight: typography.fontWeights.medium,
  },
  assistantTimestamp: {
    fontSize: typography.fontSizes.xxs,
    color: colors.textQuaternary,
    alignSelf: 'flex-end',
    fontWeight: typography.fontWeights.medium,
  },
});
