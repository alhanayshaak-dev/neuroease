// Anthropic API client configuration
// This will be used for AI-powered features like overload prediction,
// strategy suggestions, and conversation simplification

import type { SensorData, CopingStrategy } from '../types';

export const anthropicConfig = {
  baseUrl: 'https://api.anthropic.com/v1',
};

/**
 * Get the Anthropic API key from environment
 */
function getApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
}

/**
 * Overload prediction result
 */
export interface OverloadPrediction {
  predicted: boolean;
  confidence: number; // 0-100
  timeToOverloadMinutes?: number; // 5-10 minutes if predicted
  reason: string; // Explanation of prediction
  triggers: string[]; // Identified triggers
}

/**
 * Strategy suggestion result
 */
export interface StrategySuggestion {
  strategies: CopingStrategy[];
  reasoning: string;
}

/**
 * Call Anthropic Claude API
 * @param prompt The prompt to send to Claude
 * @param maxTokens Maximum tokens in response
 * @returns The response from Claude
 */
export async function callClaude(prompt: string, maxTokens: number = 1024): Promise<string> {
  const anthropicApiKey = getApiKey();
  if (!anthropicApiKey) {
    throw new Error('Anthropic API key not configured');
  }

  try {
    const response = await fetch(`${anthropicConfig.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw error;
  }
}

/**
 * Predict overload based on sensor data and context
 * Analyzes current stress trends and environmental factors to predict overload 5-10 minutes ahead
 *
 * @param sensorData Current and recent sensor data points
 * @param context Environmental context (location, activity, time of day)
 * @returns Prediction with confidence score
 *
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**
 */
export async function predictOverload(
  sensorData: SensorData[],
  context: {
    location?: string;
    activity?: string;
    timeOfDay?: string;
    recentTriggers?: string[];
  }
): Promise<OverloadPrediction> {
  const anthropicApiKey = getApiKey();
  if (!anthropicApiKey) {
    // Return a safe default prediction when API is not configured
    return {
      predicted: false,
      confidence: 0,
      reason: 'AI features disabled - API key not configured',
      triggers: [],
    };
  }

  if (!sensorData || sensorData.length === 0) {
    return {
      predicted: false,
      confidence: 0,
      reason: 'No sensor data available',
      triggers: [],
    };
  }

  try {
    // Analyze sensor data trends
    const stressScores = sensorData.map((d) => d.stress_score);
    const avgStress = stressScores.reduce((a, b) => a + b, 0) / stressScores.length;
    const stressDirection = stressScores[stressScores.length - 1] - stressScores[0];
    const isStressIncreasing = stressDirection > 0;

    // Build context for Claude
    const prompt = `You are an autism support AI analyzing sensor data to predict sensory overload.

Current Sensor Data:
- Average stress score: ${avgStress.toFixed(1)}/100
- Stress trend: ${isStressIncreasing ? 'INCREASING' : 'DECREASING'} (change: ${stressDirection.toFixed(1)})
- Latest stress score: ${stressScores[stressScores.length - 1]}/100
- Data points: ${sensorData.length}

Environmental Context:
- Location: ${context.location || 'unknown'}
- Activity: ${context.activity || 'unknown'}
- Time of day: ${context.timeOfDay || 'unknown'}
- Recent triggers: ${context.recentTriggers?.join(', ') || 'none identified'}

Based on this data, predict if the person will experience sensory overload in the next 5-10 minutes.

Respond in JSON format:
{
  "predicted": boolean,
  "confidence": number (0-100),
  "timeToOverloadMinutes": number (5-10 if predicted, null otherwise),
  "reason": "brief explanation",
  "triggers": ["trigger1", "trigger2"]
}

Consider:
1. Stress is increasing rapidly (>5 points per reading)
2. Stress is already high (>70)
3. Environmental factors (crowded location, high-stress activity)
4. Time of day (end of day often harder)
5. Recent triggers accumulating

Be conservative - only predict overload if confidence is >60%.`;

    const response = await callClaude(prompt, 500);

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to parse Claude response:', response);
      return {
        predicted: false,
        confidence: 0,
        reason: 'Failed to parse AI response',
        triggers: [],
      };
    }

    const prediction = JSON.parse(jsonMatch[0]) as OverloadPrediction;

    // Ensure confidence is within 0-100 range
    prediction.confidence = Math.max(0, Math.min(100, prediction.confidence));

    // Ensure timeToOverloadMinutes is within 5-10 range if predicted
    if (prediction.predicted && prediction.timeToOverloadMinutes) {
      prediction.timeToOverloadMinutes = Math.max(
        5,
        Math.min(10, prediction.timeToOverloadMinutes)
      );
    }

    return prediction;
  } catch (error) {
    console.error('Error predicting overload:', error);
    return {
      predicted: false,
      confidence: 0,
      reason: 'Error analyzing sensor data',
      triggers: [],
    };
  }
}

/**
 * Suggest coping strategies based on overload prediction
 * Returns top 3 strategies most likely to help based on patient history and current context
 *
 * @param prediction The overload prediction
 * @param availableStrategies List of strategies the patient has used before
 * @param context Environmental context
 * @returns Top 3 suggested strategies with reasoning
 *
 * **Validates: Requirements 2.3, 2.4, 2.5**
 */
export async function suggestStrategies(
  prediction: OverloadPrediction,
  availableStrategies: CopingStrategy[],
  context?: {
    location?: string;
    activity?: string;
    recentSuccessfulStrategies?: string[];
  }
): Promise<StrategySuggestion> {
  const anthropicApiKey = getApiKey();
  if (!anthropicApiKey) {
    // Return empty suggestions when API is not configured
    return {
      strategies: [],
      reasoning: 'AI features disabled - API key not configured',
    };
  }

  if (!availableStrategies || availableStrategies.length === 0) {
    return {
      strategies: [],
      reasoning: 'No strategies available',
    };
  }

  try {
    // Build context for Claude
    const strategiesJson = availableStrategies.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      duration_minutes: s.duration_minutes,
      success_rate: s.success_rate,
      description: s.description,
    }));

    const prompt = `You are an autism support AI recommending coping strategies.

Overload Prediction:
- Predicted: ${prediction.predicted}
- Confidence: ${prediction.confidence}%
- Reason: ${prediction.reason}
- Identified triggers: ${prediction.triggers.join(', ')}

Available Strategies:
${JSON.stringify(strategiesJson, null, 2)}

Environmental Context:
- Location: ${context?.location || 'unknown'}
- Activity: ${context?.activity || 'unknown'}
- Recently successful: ${context?.recentSuccessfulStrategies?.join(', ') || 'none'}

Select the top 3 strategies most likely to help prevent or manage overload in this situation.

Respond in JSON format:
{
  "strategyIds": ["id1", "id2", "id3"],
  "reasoning": "brief explanation of why these strategies are recommended"
}

Consider:
1. Success rate of each strategy
2. Duration (shorter is better for immediate relief)
3. Category diversity (mix of different types)
4. Recent success history
5. Appropriateness for location/activity`;

    const response = await callClaude(prompt, 500);

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to parse Claude response:', response);
      return {
        strategies: [],
        reasoning: 'Failed to parse AI response',
      };
    }

    const suggestion = JSON.parse(jsonMatch[0]) as {
      strategyIds: string[];
      reasoning: string;
    };

    // Map strategy IDs to actual strategies
    const suggestedStrategies = suggestion.strategyIds
      .map((id) => availableStrategies.find((s) => s.id === id))
      .filter((s) => s !== undefined) as CopingStrategy[];

    // Limit to top 3
    return {
      strategies: suggestedStrategies.slice(0, 3),
      reasoning: suggestion.reasoning,
    };
  } catch (error) {
    console.error('Error suggesting strategies:', error);
    return {
      strategies: [],
      reasoning: 'Error generating strategy suggestions',
    };
  }
}

/**
 * Filter predictions to only show if confidence > 60%
 * This prevents false alarms and reduces unnecessary alerts
 *
 * @param prediction The overload prediction
 * @returns True if prediction should be displayed to user
 *
 * **Validates: Requirements 2.6**
 */
export function shouldDisplayPrediction(prediction: OverloadPrediction): boolean {
  return prediction.predicted && prediction.confidence > 60;
}
