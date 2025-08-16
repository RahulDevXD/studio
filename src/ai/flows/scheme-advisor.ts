// This file uses server-side code.
'use server';

/**
 * @fileOverview An AI-powered scheme advisor flow to provide personalized recommendations for welfare schemes.
 *
 * - schemeAdvisor - A function that provides personalized scheme recommendations.
 * - SchemeAdvisorInput - The input type for the schemeAdvisor function.
 * - SchemeAdvisorOutput - The return type for the schemeAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SchemeAdvisorInputSchema = z.object({
  caste: z.enum([
    'SC',
    'ST',
    'BC',
    'EWS',
    'Kapu',
    'Minorities',
    'General',
  ]).describe('The caste of the applicant.'),
  age: z.number().describe('The age of the applicant.'),
  income: z.number().describe('The annual income of the applicant.'),
  isRural: z.boolean().describe('Whether the applicant lives in a rural area.'),
});
export type SchemeAdvisorInput = z.infer<typeof SchemeAdvisorInputSchema>;

const SchemeAdvisorOutputSchema = z.object({
  recommendedSchemes: z.array(z.string()).describe('A list of recommended schemes based on the applicant profile.'),
  reasoning: z.string().describe('The reasoning behind the scheme recommendations.'),
});
export type SchemeAdvisorOutput = z.infer<typeof SchemeAdvisorOutputSchema>;

export async function schemeAdvisor(input: SchemeAdvisorInput): Promise<SchemeAdvisorOutput> {
  return schemeAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'schemeAdvisorPrompt',
  input: {schema: SchemeAdvisorInputSchema},
  output: {schema: SchemeAdvisorOutputSchema},
  prompt: `You are an AI assistant specialized in recommending welfare schemes to citizens of Andhra Pradesh.

  Based on the applicant's profile (caste, age, income, location), recommend relevant schemes and explain your reasoning.

  Applicant Profile:
  Caste: {{{caste}}}
  Age: {{{age}}}
  Income: {{{income}}}
  Location: {{{isRural}}}

  Available Schemes:
  - Annadata Sukhibhava Scheme (Agriculture, Farmers)
  - PM-Kisan Samman Nidhi (Agriculture, Small & Marginal Farmers)
  - National Livestock Mission (Animal Husbandry, Entrepreneurs)
  - Thalliki Vandanam Scheme (Education, Mothers of School Children)
  - Jagananna Vidya Deevena (Education, Post-Metric Students)
  - Jagananna Vasathi Deevena (Education, Post-Metric Students)
  - Skill Development Schemes (Skill Development, Unemployed Youth)
  - Dr. YSR Aarogyasri Scheme (Health, BPL Families)
  - YSR Arogya Asara (Health, Post-Operative Patients)
  - YSR Pension Kanuka / NTR Bharosa (Social Security, Elderly, Widows, Disabled)
  - YSR Jagananna Housing Colonies (Housing, BPL Families)
  - Pradhan Mantri Awas Yojana (Housing, EWS, LIG, MIG Families)
  - YSR Cheyutha Scheme (Women Empowerment, Women (45-60 yrs))
  - Aadabidda Nidhi Scheme (Women Empowerment, Women (19-59 yrs))
  - Girl Child Protection Scheme (Child Welfare, Girl Children)
  - Economic Support Schemes (Entrepreneurship, SC, BC, ST, Minority, Kapu Communities)

  Ensure that the output is well-formatted and easy to understand.
  Include the reasoning for each scheme recommendation.
  Do not recommend schemes that the applicant is clearly ineligible for.
  Be concise.
  `, 
});

const schemeAdvisorFlow = ai.defineFlow(
  {
    name: 'schemeAdvisorFlow',
    inputSchema: SchemeAdvisorInputSchema,
    outputSchema: SchemeAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
