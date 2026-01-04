import { create } from 'zustand';
import { supabase } from '@/services/supabaseConfig';
import type { Habit, DailyRoutine } from '@/types';
import { notificationService } from '@/services/notificationService';

interface HabitsState {
  habits: Habit[];
  routines: DailyRoutine[];
  loading: boolean;
  error: string | null;
  loadHabits: (userId: string) => Promise<void>;
  loadRoutines: (userId: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => Promise<void>;
  updateHabit: (habitId: string, data: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  markHabitComplete: (habitId: string, date: string) => Promise<void>;
  addRoutine: (routine: Omit<DailyRoutine, 'id' | 'createdAt'>) => Promise<void>;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  routines: [],
  loading: false,
  error: null,

  loadHabits: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const habits: Habit[] = (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        description: row.description,
        category: row.category,
        duration: row.duration,
        frequency: row.frequency,
        priority: row.priority,
        notificationsEnabled: row.notifications_enabled,
        notificationTime: row.notification_time,
        createdAt: new Date(row.created_at),
        completedDates: row.completed_dates || [],
        aiGenerated: row.ai_generated,
      }));

      set({ habits, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  loadRoutines: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const routines: DailyRoutine[] = (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        timeOfDay: row.time_of_day,
        activities: row.activities,
        duration: row.duration,
        createdAt: new Date(row.created_at),
      }));

      set({ routines, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addHabit: async (habitData) => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: habitData.userId,
          name: habitData.name,
          description: habitData.description,
          category: habitData.category,
          duration: habitData.duration,
          frequency: habitData.frequency,
          priority: habitData.priority,
          notifications_enabled: habitData.notificationsEnabled,
          notification_time: habitData.notificationTime,
          completed_dates: [],
          ai_generated: habitData.aiGenerated,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const habit: Habit = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        description: data.description,
        category: data.category,
        duration: data.duration,
        frequency: data.frequency,
        priority: data.priority,
        notificationsEnabled: data.notifications_enabled,
        notificationTime: data.notification_time,
        createdAt: new Date(data.created_at),
        completedDates: data.completed_dates || [],
        aiGenerated: data.ai_generated,
      };

      if (habit.notificationsEnabled && habit.notificationTime) {
        const notificationCopy = `Time to ${habit.name}! ${habit.description}`;
        await notificationService.scheduleHabitNotification(
          habit.id,
          habit.name,
          notificationCopy,
          habit.notificationTime
        );
      }

      set((state) => ({ habits: [...state.habits, habit] }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateHabit: async (habitId: string, data: Partial<Habit>) => {
    try {
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.description) updateData.description = data.description;
      if (data.duration) updateData.duration = data.duration;
      if (data.frequency) updateData.frequency = data.frequency;
      if (data.priority) updateData.priority = data.priority;
      if (data.notificationsEnabled !== undefined)
        updateData.notifications_enabled = data.notificationsEnabled;
      if (data.notificationTime) updateData.notification_time = data.notificationTime;
      if (data.completedDates) updateData.completed_dates = data.completedDates;

      const { error } = await supabase.from('habits').update(updateData).eq('id', habitId);

      if (error) throw error;

      set((state) => ({
        habits: state.habits.map((h) => (h.id === habitId ? { ...h, ...data } : h)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteHabit: async (habitId: string) => {
    try {
      const { error } = await supabase.from('habits').delete().eq('id', habitId);

      if (error) throw error;

      set((state) => ({
        habits: state.habits.filter((h) => h.id !== habitId),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  markHabitComplete: async (habitId: string, date: string) => {
    try {
      const habit = get().habits.find((h) => h.id === habitId);
      if (!habit) return;

      const completedDates = [...habit.completedDates];
      if (!completedDates.includes(date)) {
        completedDates.push(date);
      }

      const { error } = await supabase
        .from('habits')
        .update({ completed_dates: completedDates })
        .eq('id', habitId);

      if (error) throw error;

      set((state) => ({
        habits: state.habits.map((h) => (h.id === habitId ? { ...h, completedDates } : h)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  addRoutine: async (routineData) => {
    try {
      const { data, error } = await supabase
        .from('routines')
        .insert({
          user_id: routineData.userId,
          time_of_day: routineData.timeOfDay,
          activities: routineData.activities,
          duration: routineData.duration,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const routine: DailyRoutine = {
        id: data.id,
        userId: data.user_id,
        timeOfDay: data.time_of_day,
        activities: data.activities,
        duration: data.duration,
        createdAt: new Date(data.created_at),
      };

      set((state) => ({ routines: [...state.routines, routine] }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
