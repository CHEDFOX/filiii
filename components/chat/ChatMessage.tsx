import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography } from '@/constants/colors';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {message.content}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userBubble: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.mediumGray,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: typography.fontSizes.md,
    lineHeight: typography.fontSizes.md * typography.lineHeights.body,
    marginBottom: spacing.xs,
  },
  userText: {
    color: colors.textPrimary,
  },
  assistantText: {
    color: colors.textPrimary,
  },
  timestamp: {
    fontSize: typography.fontSizes.xs,
    color: colors.textTertiary,
    alignSelf: 'flex-end',
  },
});
