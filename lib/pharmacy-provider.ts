import { Pharmacy } from "@/types/pharmacy";

export interface PharmacyProviderInput {
  lat?: number;
  lng?: number;
  city?: string;
  district?: string;
}

export interface PharmacyProvider {
  name: string;
  priority: number;
  canHandle(input: PharmacyProviderInput): boolean;
  fetch(input: PharmacyProviderInput): Promise<Pharmacy[]>;
}

export type EnrichedPharmacy = Pharmacy & {
  source: string;
  source_label: string;
  confidence_score: number;
  is_live: boolean;
  warning_message?: string;
};
