import {
  ONBOARDING_SYSTEM_PROMPT,
  HABIT_REFINEMENT_PROMPT,
  CHAT_SYSTEM_PROMPT,
  PSYCHOLOGY_ANALYSIS_PROMPT,
  BEHAVIOR_ANALYSIS_PROMPT,
  generateAdaptiveSystemPrompt,
  OPENROUTER_CONFIG,
} from '@/constants/aiPrompts';
import type {
  AIGoalResponse,
  AIHabitRefinement,
  OnboardingAnswers,
  PsychologyProfile,
  PsychologyQuestions,
  BehaviorAnalysis,
  UserActivityData,
} from '@/types';

const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callOpenRouter(
  messages: OpenRouterMessage[],
  model: string = OPENROUTER_CONFIG.defaultModel
): Promise<string> {
  try {
    const response = await fetch(`${OPENROUTER_CONFIG.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        ...OPENROUTER_CONFIG.headers,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('Failed to communicate with AI service');
  }
}

export async function analyzeOnboardingAnswers(
  answers: OnboardingAnswers
): Promise<AIGoalResponse> {
  const userMessage = `
User's Onboarding Responses:
- Physical Goals: ${answers.physicalGoals}
- Mental Wellness Goals: ${answers.mentalWellnessGoals}
- Lifestyle Preferences: ${answers.lifestylePreferences}
- Time Availability: ${answers.timeAvailability}
- Motivation Style: ${answers.motivationStyle}

Create a personalized plan based on these responses.
  `;

  const response = await callOpenRouter([
    { role: 'system', content: ONBOARDING_SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ]);

  try {
    const parsed = JSON.parse(response);
    return parsed as AIGoalResponse;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Invalid AI response format');
  }
}

export async function refineHabit(habitText: string): Promise<AIHabitRefinement> {
  const userMessage = `Refine this habit: "${habitText}"`;

  const response = await callOpenRouter([
    { role: 'system', content: HABIT_REFINEMENT_PROMPT },
    { role: 'user', content: userMessage },
  ]);

  try {
    const parsed = JSON.parse(response);
    return parsed as AIHabitRefinement;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Invalid AI response format');
  }
}

export async function analyzePsychology(
  answers: PsychologyQuestions
): Promise<PsychologyProfile> {
  const userMessage = `
User's Psychological Responses:

1. When I don't meet my own expectations, I tell myself:
"${answers.selfTalkResponse}"

2. Success in my wellness journey looks like:
"${answers.successDefinition}"

3. A time I stuck with something difficult:
"${answers.persistenceStory}"

Analyze these responses and extract a deep psychological profile.
  `;

  const response = await callOpenRouter([
    { role: 'system', content: PSYCHOLOGY_ANALYSIS_PROMPT },
    { role: 'user', content: userMessage },
  ]);

  try {
    const parsed = JSON.parse(response);
    return parsed as PsychologyProfile;
  } catch (error) {
    console.error('Failed to parse psychology profile:', error);
    throw new Error('Invalid psychology analysis format');
  }
}

export async function analyzeBehaviorPatterns(
  activityData: UserActivityData
): Promise<BehaviorAnalysis> {
  const userMessage = `
TIMEFRAME: ${activityData.timeframe.daysTracked} days of data

HABIT PERFORMANCE:
${activityData.habits
  .map(
    (h) => `
- ${h.name} (${h.category})
  Completion Rate: ${(h.completionRate * 100).toFixed(1)}%
  Total Completions: ${h.totalCompletions}
  Current Streak: ${h.currentStreak} days
  Longest Streak: ${h.longestStreak} days
  Last Completed: ${h.lastCompleted ? new Date(h.lastCompleted).toLocaleDateString() : 'Never'}
  ${h.averageCompletionTime ? `Typical Time: ${h.averageCompletionTime}` : ''}`
  )
  .join('\n')}

RECENT CONVERSATION THEMES:
${activityData.recentChatThemes.length > 0 ? activityData.recentChatThemes.join(', ') : 'No recent conversations'}

${
  activityData.psychologyProfile
    ? `
USER'S PSYCHOLOGY PROFILE:
- Self-Talk: ${activityData.psychologyProfile.selfTalkPattern}
- Core Values: ${activityData.psychologyProfile.coreValues.join(', ')}
- Potential Barriers: ${activityData.psychologyProfile.potentialBarriers.join(', ')}
- Burnout Risk: ${activityData.psychologyProfile.burnoutRisk}
- Perfectionism: ${activityData.psychologyProfile.perfectionism}
`
    : ''
}

Analyze this user's behavior and provide personalized insights and recommendations.
  `;

  const response = await callOpenRouter([
    { role: 'system', content: BEHAVIOR_ANALYSIS_PROMPT },
    { role: 'user', content: userMessage },
  ]);

  try {
    const parsed = JSON.parse(response);
    return {
      ...parsed,
      analyzedAt: new Date(),
    } as BehaviorAnalysis;
  } catch (error) {
    console.error('Failed to parse behavior analysis:', error);
    throw new Error('Invalid behavior analysis format');
  }
}

export async function chatWithCoach(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  userContext?: {
    activeHabits?: number;
    completedToday?: number;
    currentStreak?: number;
    recentInsights?: string[];
  },
  psychologyProfile?: PsychologyProfile
): Promise<string> {
  const contextMessage = userContext
    ? `\n\nUser Context:
- Active Habits: ${userContext.activeHabits || 0}
- Completed Today: ${userContext.completedToday || 0}
- Current Streak: ${userContext.currentStreak || 0} days
${userContext.recentInsights && userContext.recentInsights.length > 0 ? `\nRecent Behavioral Insights:\n${userContext.recentInsights.map((i) => `- ${i}`).join('\n')}` : ''}`
    : '';

  const systemPrompt = psychologyProfile
    ? generateAdaptiveSystemPrompt(psychologyProfile) + contextMessage
    : CHAT_SYSTEM_PROMPT + contextMessage;

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(
      (msg) =>
        ({
          role: msg.role,
          content: msg.content,
        }) as OpenRouterMessage
    ),
    { role: 'user', content: userMessage },
  ];

  return await callOpenRouter(messages);
}
