export type Caste = 'SC' | 'ST' | 'BC' | 'EWS' | 'Kapu' | 'Minorities' | 'General';

export interface Scheme {
  id: number;
  slug: string;
  name: string;
  governingBody: 'Andhra Pradesh Govt.' | 'Central Govt.' | 'Central & State Govt.';
  sector: string;
  targetBeneficiary: string;
  casteEligibility: Caste[];
  content: {
    overview: string;
    status: string;
    benefits: string[];
    eligibility: string[];
    applicationProcess: string[];
    documents?: string[];
    checkStatus?: string;
    [key: string]: any;
  };
}

export type Translation = {
  [key: string]: string | { [key: string]: string };
};

export type Translations = {
  [key: string]: Translation;
};
