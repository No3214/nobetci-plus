import { Pharmacy } from "@/types/pharmacy";
import { PharmacyProvider, PharmacyProviderInput } from "../pharmacy-provider";
import { generateMockPharmacies } from "@/lib/pharmacy-data";

export class MockProvider implements PharmacyProvider {
  name = "mock";
  priority = 100; // Last resort

  canHandle(): boolean {
    return true; // Always handles as a last resort fallback
  }

  async fetch(input: PharmacyProviderInput): Promise<Pharmacy[]> {
    const mocks = generateMockPharmacies(input.lat, input.lng, input.city, input.district);
    
    return mocks.map((m, idx) => ({
      ...m,
      source: this.name,
      source_label: "Demo Veri (Mock)",
      source_updated_at: new Date().toISOString(),
      is_live: false,
      confidence_score: 50,
      warning_message: "Demo veri gösteriliyor."
    }));
  }
}
