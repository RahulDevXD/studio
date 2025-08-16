'use server';

import {
  schemeAdvisor,
  type SchemeAdvisorInput,
  type SchemeAdvisorOutput,
} from '@/ai/flows/scheme-advisor';

export async function getSchemeAdvice(
  input: SchemeAdvisorInput
): Promise<SchemeAdvisorOutput> {
  try {
    const result = await schemeAdvisor(input);
    return result;
  } catch (error) {
    console.error('Error in getSchemeAdvice server action:', error);
    // Construct a user-friendly error message to return to the client
    return {
      recommendedSchemes: [],
      reasoning:
        'An error occurred while getting advice. The AI model may be temporarily unavailable. Please try again later.',
    };
  }
}
