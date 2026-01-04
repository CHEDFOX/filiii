import { create } from 'zustand';
import { supabase } from '@/services/supabaseConfig';
import type { UserProgress } from '@/types';

interface ProfileState {
  progress: UserProgress | null;
  loading: boolean;
  error: string | null;
  meditativeMode: boolean;
  loadProgress: (userId: string) => Promise<void>;
  updateProgress: (userId: string, data: Partial<UserProgress>) => Promise<void>;
  calculateProgress: (userId: string, habits: any[]) => Promise<void>;
  toggleMeditativeMode: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  progress: null,
  loading: false,
  error: null,
  meditativeMode: false,

  loadProgress: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        set({
          progress: {
            userId: data.user_id,
            totalHabits: data.total_habits,
            completedToday: data.completed_today,
            streak: data.streak,
            completionRate: data.completion_rate,
            lastUpdated: new Date(data.last_updated),
          },
          loading: false,
        });
      } else {
        const initialProgress: UserProgress = {
          userId,
          totalHabits: 0,
          completedToday: 0,
          streak: 0,
          completionRate: 0,
          lastUpdated: new Date(),
        };

        await supabase.from('user_progress').insert({
          user_id: userId,
          total_habits: 0,
          completed_today: 0,
          streak: 0,
          completion_rate: 0,
          last_updated: new Date().toISOString(),
        });

        set({ progress: initialProgress, loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateProgress: async (userId: string, data: Partial<UserProgress>) => {
    try {
      const updateData: any = {
        last_updated: new Date().toISOString(),
      };

      if (data.totalHabits !== undefined) updateData.total_habits = data.totalHabits;
      if (data.completedToday !== undefined) updateData.completed_today = data.completedToday;
      if (data.streak !== undefined) updateData.streak = data.streak;
      if (data.completionRate !== undefined) updateData.completion_rate = data.completionRate;

      const { error } = await supabase
        .from('user_progress')
        .update(updateData)
        .eq('user_id', userId);

      if (error) throw error;

      set((state) => ({
        progress: state.progress ? { ...state.progress, ...data } : null,
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  calculateProgress: async (userId: string, habits: any[]) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const completedToday = habits.filter((h) => h.completedDates.includes(today)).length;
      const totalHabits = habits.length;

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      });

      let streak = 0;
      for (const date of last7Days) {
        const completedOnDate = habits.filter((h) => h.completedDates.includes(date)).length;
        if (completedOnDate > 0) {
          streak++;
        } else {
          break;
        }
      }

      const completionRate =
        totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

      const progressData: UserProgress = {
        userId,
        totalHabits,
        completedToday,
        streak,
        completionRate,
        lastUpdated: new Date(),
      };

      await get().updateProgress(userId, progressData);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  toggleMeditativeMode: () => {
    set((state) => ({ meditativeMode: !state.meditativeMode }));
  },
}));
