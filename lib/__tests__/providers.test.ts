import { describe, it, expect, vi } from "vitest";
import { IzmirProvider } from "../providers/izmir-provider";
import { CollectApiProvider } from "../providers/collectapi-provider";
import { SupabaseProvider } from "../providers/supabase-provider";
import { MockProvider } from "../providers/mock-provider";

vi.mock("@/lib/supabase", () => ({
  supabase: {},
  isSupabaseConfigured: true
}));

describe("Pharmacy Providers", () => {
  
  describe("IzmirProvider", () => {
    const provider = new IzmirProvider();

    it("should handle Izmir city query", () => {
      expect(provider.canHandle({ city: "İzmir" })).toBe(true);
      expect(provider.canHandle({ city: "izmir" })).toBe(true);
    });

    it("should handle coordinates in Izmir province bounding box", () => {
      // Izmir center coordinates: ~38.4, 27.1
      expect(provider.canHandle({ lat: 38.4, lng: 27.1 })).toBe(true);
    });

    it("should not handle coordinates outside Izmir province", () => {
      // Istanbul center coordinates: ~41.0, 29.0
      expect(provider.canHandle({ lat: 41.0, lng: 29.0 })).toBe(false);
    });
  });

  describe("CollectApiProvider", () => {
    it("should handle if apiKey is set and city/district is provided", () => {
      process.env.COLLECTAPI_KEY = "test_key";
      const provider = new CollectApiProvider();
      expect(provider.canHandle({ city: "Istanbul", district: "Kadikoy" })).toBe(true);
    });

    it("should not handle if apiKey is missing", () => {
      process.env.COLLECTAPI_KEY = "";
      const provider = new CollectApiProvider();
      expect(provider.canHandle({ city: "Istanbul", district: "Kadikoy" })).toBe(false);
    });
  });

  describe("SupabaseProvider", () => {
    it("should handle if supabase is configured", () => {
      const provider = new SupabaseProvider();
      expect(provider.canHandle({ city: "Ankara" })).toBe(true);
    });
  });

  describe("MockProvider", () => {
    const provider = new MockProvider();

    it("should always handle any input as last resort", () => {
      expect(provider.canHandle({})).toBe(true);
      expect(provider.canHandle({ city: "Ankara", district: "Cankaya" })).toBe(true);
    });

    it("should return mock pharmacies with correct provider flags", async () => {
      const results = await provider.fetch({ city: "Ankara", district: "Cankaya" });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].source).toBe("mock");
      expect(results[0].is_live).toBe(false);
    });
  });
});
