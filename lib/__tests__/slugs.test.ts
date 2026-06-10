import { describe, it, expect } from "vitest";
import { toSlug, fromSlug, normalizeTurkishText } from "../slugs";

describe("slug utilities", () => {
  describe("toSlug", () => {
    it("should translate Turkish characters to English equivalents", () => {
      expect(toSlug("İzmir")).toBe("izmir");
      expect(toSlug("Kadıköy")).toBe("kadikoy");
      expect(toSlug("Çeşme")).toBe("cesme");
      expect(toSlug("Beşiktaş")).toBe("besiktas");
      expect(toSlug("Ümraniye")).toBe("umraniye");
      expect(toSlug("Ortaköy")).toBe("ortakoy");
    });

    it("should handle mixed case and spaces", () => {
      expect(toSlug("Yeni Mahalle")).toBe("yeni-mahalle");
      expect(toSlug("  Buca  ")).toBe("buca");
    });

    it("should remove special characters", () => {
      expect(toSlug("Eczane & İlaç!")).toBe("eczane-ilac");
    });

    it("should return empty string for empty inputs", () => {
      expect(toSlug("")).toBe("");
    });
  });

  describe("fromSlug", () => {
    it("should replace dashes with spaces and capitalize words", () => {
      expect(fromSlug("yeni-mahalle")).toBe("Yeni Mahalle");
      expect(fromSlug("izmir")).toBe("Izmir");
    });

    it("should return empty string for empty inputs", () => {
      expect(fromSlug("")).toBe("");
    });
  });

  describe("normalizeTurkishText", () => {
    it("should lower case with Turkish locale", () => {
      expect(normalizeTurkishText("İZMİR")).toBe("izmir");
      expect(normalizeTurkishText("Isparta")).toBe("ısparta");
    });
  });
});
