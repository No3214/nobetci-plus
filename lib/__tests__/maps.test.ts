import { describe, it, expect } from "vitest";
import { getGoogleMapsUrl, getAppleMapsUrl, getYandexMapsUrl } from "../maps";

describe("maps helper", () => {
  const lat = 38.67;
  const lng = 26.75;

  it("should generate valid Google Maps url", () => {
    const url = getGoogleMapsUrl(lat, lng);
    expect(url).toBe("https://www.google.com/maps/dir/?api=1&destination=38.67,26.75");
  });

  it("should generate valid Apple Maps url", () => {
    const url = getAppleMapsUrl(lat, lng);
    expect(url).toBe("http://maps.apple.com/?daddr=38.67,26.75");
  });

  it("should generate valid Yandex Maps url", () => {
    const url = getYandexMapsUrl(lat, lng);
    expect(url).toBe("https://yandex.com/maps/?rtext=~38.67,26.75&rtt=auto");
  });
});
