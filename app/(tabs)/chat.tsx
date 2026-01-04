import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useProfileStore } from '@/store/useProfileStore';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { VoiceControls } from '@/components/chat/VoiceControls';
import { colors, borderRadius, spacing, typography } from '@/constants/colors';

export default function ChatScreen() {
  const user = useAuthStore((state) => state.user);
  const habits = useHabitsStore((state) => state.habits);
  const progress = useProfileStore((state) => state.progress);
  const { messages, loading, voiceEnabled, loadMessages, sendMessage, toggleVoice } =
    useChatStore();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (user) {
      loadMessages(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!user || !inputText.trim() || loading) return;

    const userContext = {
      activeHabits: habits.length,
      completedToday: progress?.completedToday || 0,
      currentStreak: progress?.streak || 0,
    };

    const message = inputText.trim();
    setInputText('');

    try {
      await sendMessage(user.id, message, userContext);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI Coach</Text>
          <Text style={styles.subtitle}>Your personal fitness companion</Text>
        </View>
        <VoiceControls enabled={voiceEnabled} onToggle={toggleVoice} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Start a conversation</Text>
            <Text style={styles.emptySubtext}>
              Ask me anything about your fitness journey, habits, or wellness goals
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatMessage message={item} />}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || loading}
          >
            <Send
              size={20}
              color={!inputText.trim() || loading ? colors.textTertiary : colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSizes.md,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: typography.fontSizes.md * typography.lineHeights.body,
  },
  messagesList: {
    paddingVertical: spacing.base,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    backgroundColor: colors.cardGray,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.textPrimary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.lightGray,
    opacity: 0.5,
  },
});
