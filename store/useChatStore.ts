import { create } from 'zustand';
import { supabase } from '@/services/supabaseConfig';
import type { ChatMessage } from '@/types';
import { chatWithCoach } from '@/services/aiService';
import { voiceService } from '@/services/voiceService';

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  voiceEnabled: boolean;
  loadMessages: (userId: string) => Promise<void>;
  sendMessage: (
    userId: string,
    content: string,
    userContext?: {
      activeHabits?: number;
      completedToday?: number;
      currentStreak?: number;
    }
  ) => Promise<void>;
  toggleVoice: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  voiceEnabled: true,

  loadMessages: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      const messages: ChatMessage[] = (data || []).map((row) => ({
        id: row.id,
        role: row.role,
        content: row.content,
        timestamp: new Date(row.timestamp),
        audioPlayed: row.audio_played,
      }));

      set({ messages, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  sendMessage: async (userId: string, content: string, userContext) => {
    try {
      set({ loading: true, error: null });

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      await supabase.from('chat_messages').insert({
        user_id: userId,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      });

      set((state) => ({ messages: [...state.messages, userMessage] }));

      const conversationHistory = get().messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const aiResponse = await chatWithCoach(content, conversationHistory, userContext);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        audioPlayed: false,
      };

      await supabase.from('chat_messages').insert({
        user_id: userId,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        audio_played: false,
      });

      set((state) => ({ messages: [...state.messages, assistantMessage], loading: false }));

      if (get().voiceEnabled) {
        try {
          await voiceService.speak(aiResponse);
        } catch (voiceError) {
          console.error('Voice playback error:', voiceError);
        }
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  toggleVoice: () => {
    set((state) => {
      const newVoiceEnabled = !state.voiceEnabled;
      voiceService.updateSettings({ enabled: newVoiceEnabled });
      return { voiceEnabled: newVoiceEnabled };
    });
  },
}));
