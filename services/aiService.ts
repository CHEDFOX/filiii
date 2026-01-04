import {
  ONBOARDING_SYSTEM_PROMPT,
  HABIT_REFINEMENT_PROMPT,
  CHAT_SYSTEM_PROMPT,
  OPENROUTER_CONFIG,
} from '@/constants/aiPrompts';
import type { AIGoalResponse, AIHabitRefinement, OnboardingAnswers } from '@/types';

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

export async function chatWithCoach(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  userContext?: {
    activeHabits?: number;
    completedToday?: number;
    currentStreak?: number;
  }
): Promise<string> {
  const contextMessage = userContext
    ? `\n\nUser Context:
- Active Habits: ${userContext.activeHabits || 0}
- Completed Today: ${userContext.completedToday || 0}
- Current Streak: ${userContext.currentStreak || 0} days`
    : '';

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: CHAT_SYSTEM_PROMPT + contextMessage },
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
