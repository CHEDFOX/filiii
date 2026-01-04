export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt: Date;
}

export interface OnboardingAnswers {
  physicalGoals: string;
  mentalWellnessGoals: string;
  lifestylePreferences: string;
  timeAvailability: string;
  motivationStyle: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: 'mental' | 'physical' | 'hybrid';
  duration: number;
  frequency: string;
  priority: 'high' | 'medium' | 'low';
  notificationsEnabled: boolean;
  notificationTime?: string;
  createdAt: Date;
  completedDates: string[];
  aiGenerated: boolean;
}

export interface DailyRoutine {
  id: string;
  userId: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  activities: string[];
  duration: number;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioPlayed?: boolean;
}

export interface SoundFrequency {
  id: string;
  name: string;
  category: 'focus' | 'calm' | 'sleep' | 'energy';
  url: string;
  duration: number;
}

export interface UserProgress {
  userId: string;
  totalHabits: number;
  completedToday: number;
  streak: number;
  completionRate: number;
  lastUpdated: Date;
}

export interface AIGoalResponse {
  classification: 'mental' | 'physical' | 'hybrid';
  dailyRoutines: Array<{
    timeOfDay: 'morning' | 'afternoon' | 'evening';
    activities: string[];
    duration: number;
  }>;
  habits: Array<{
    name: string;
    description: string;
    category: 'mental' | 'physical' | 'hybrid';
    duration: number;
    frequency: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface AIHabitRefinement {
  name: string;
  description: string;
  category: 'mental' | 'physical' | 'hybrid';
  notificationCopy: string;
}

export interface VoiceSettings {
  enabled: boolean;
  rate: number;
  pitch: number;
  volume: number;
}
