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

export interface PsychologyProfile {
  selfTalkPattern: 'self-compassionate' | 'self-critical' | 'analytical' | 'balanced' | 'achievement-driven';
  selfTalkIndicators: string[];
  motivationSource: 'intrinsic' | 'extrinsic' | 'purpose-driven' | 'identity-driven';
  deepWhy: string;
  resilienceStyle: 'self-accountability' | 'purpose-anchored' | 'community-driven' | 'strategic' | 'needs-support';
  pastSuccessFactors: string[];
  coachingTone: 'gentle' | 'direct' | 'empowering' | 'analytical' | 'collaborative';
  accountabilityType: 'self' | 'community' | 'external' | 'progress-tracking';
  coreValues: string[];
  keyMotivators: string[];
  potentialBarriers: string[];
  strengthsToLeverage: string[];
  burnoutRisk: 'low' | 'medium' | 'high';
  perfectionism: 'low' | 'medium' | 'high';
  needsStructure: boolean;
  needsCommunity: boolean;
}

export interface PsychologyQuestions {
  selfTalkResponse: string;
  successDefinition: string;
  persistenceStory: string;
}

export interface BehaviorAnalysis {
  keyInsights: Array<{
    type: 'success' | 'struggle' | 'pattern' | 'opportunity';
    title: string;
    description: string;
    confidence: 'high' | 'medium' | 'low';
  }>;
  habitRecommendations: Array<{
    habitId: string | null;
    action: 'continue' | 'adjust' | 'pause' | 'remove' | 'add';
    reasoning: string;
    suggestedChanges?: {
      frequency?: string;
      duration?: number;
      timeOfDay?: string;
    };
  }>;
  motivationalThemes: string[];
  riskFactors: Array<{
    factor: 'burnout' | 'consistency-drop' | 'overcommitment' | 'avoidance';
    severity: 'low' | 'medium' | 'high';
    evidence: string;
  }>;
  nextSteps: string[];
  celebrationMoments: string[];
  analyzedAt: Date;
}

export interface UserActivityData {
  habits: Array<{
    id: string;
    name: string;
    category: string;
    completionRate: number;
    totalCompletions: number;
    currentStreak: number;
    longestStreak: number;
    lastCompleted?: Date;
    averageCompletionTime?: string;
  }>;
  recentChatThemes: string[];
  timeframe: {
    startDate: Date;
    endDate: Date;
    daysTracked: number;
  };
  psychologyProfile?: PsychologyProfile;
}
