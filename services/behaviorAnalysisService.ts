import { supabase } from './supabaseConfig';
import { analyzeBehaviorPatterns } from './aiService';
import type { Habit, BehaviorAnalysis, UserActivityData } from '@/types';

export async function generateBehaviorAnalysis(userId: string): Promise<BehaviorAnalysis> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 14);

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId);

  const { data: user } = await supabase
    .from('users')
    .select('psychology_profile')
    .eq('id', userId)
    .maybeSingle();

  const { data: recentMessages } = await supabase
    .from('chat_messages')
    .select('content, role')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false })
    .limit(20);

  const activityData: UserActivityData = {
    habits:
      habits?.map((habit: any) => {
        const completedDates = habit.completed_dates || [];
        const recentCompletions = completedDates.filter((date: string) => {
          const d = new Date(date);
          return d >= startDate && d <= endDate;
        });

        const currentStreak = calculateCurrentStreak(completedDates);
        const longestStreak = calculateLongestStreak(completedDates);

        return {
          id: habit.id,
          name: habit.name,
          category: habit.category,
          completionRate: recentCompletions.length / 14,
          totalCompletions: completedDates.length,
          currentStreak,
          longestStreak,
          lastCompleted: completedDates.length > 0 ? new Date(completedDates[completedDates.length - 1]) : undefined,
        };
      }) || [],
    recentChatThemes: extractChatThemes(recentMessages || []),
    timeframe: {
      startDate,
      endDate,
      daysTracked: 14,
    },
    psychologyProfile: user?.psychology_profile,
  };

  const analysis = await analyzeBehaviorPatterns(activityData);

  await supabase.from('behavior_analyses').insert({
    user_id: userId,
    analysis_data: analysis,
    timeframe_start: startDate.toISOString(),
    timeframe_end: endDate.toISOString(),
    days_tracked: 14,
  });

  return analysis;
}

export async function getLatestAnalysis(userId: string): Promise<BehaviorAnalysis | null> {
  const { data } = await supabase
    .from('behavior_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return {
    ...data.analysis_data,
    analyzedAt: new Date(data.created_at),
  };
}

export async function markAnalysisAsViewed(analysisId: string): Promise<void> {
  await supabase.from('behavior_analyses').update({ viewed: true }).eq('id', analysisId);
}

export async function shouldGenerateNewAnalysis(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('behavior_analyses')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return true;

  const lastAnalysis = new Date(data.created_at);
  const daysSinceAnalysis = (Date.now() - lastAnalysis.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceAnalysis >= 7;
}

function calculateCurrentStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sortedDates = completedDates.map((d) => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    date.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - streak);

    if (date.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sortedDates = completedDates.map((d) => new Date(d)).sort((a, b) => a.getTime() - b.getTime());

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);

    const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (dayDiff > 1) {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

function extractChatThemes(messages: Array<{ content: string; role: string }>): string[] {
  const userMessages = messages.filter((m) => m.role === 'user').map((m) => m.content.toLowerCase());

  const themes: string[] = [];

  const themeKeywords = {
    motivation: ['motivated', 'motivation', 'tired', 'energy', 'struggling'],
    time: ['time', 'busy', 'schedule', 'morning', 'evening'],
    progress: ['progress', 'stuck', 'plateau', 'improving', 'better'],
    difficulty: ['hard', 'difficult', 'challenging', 'easy', 'tough'],
    consistency: ['consistent', 'streak', 'miss', 'skip', 'forget'],
  };

  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    const mentionCount = userMessages.filter((msg) => keywords.some((kw) => msg.includes(kw))).length;

    if (mentionCount >= 2) {
      themes.push(theme);
    }
  }

  return themes;
}
