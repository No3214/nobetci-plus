import { Pharmacy } from "../types/pharmacy";

export interface CityData {
  name: string;
  districts: string[];
}

export const CITIES_AND_DISTRICTS: CityData[] = [
  {
    name: "İstanbul",
    districts: ["Kadıköy", "Beşiktaş", "Şişli", "Fatih", "Üsküdar", "Kartal", "Beyoğlu", "Maltepe", "Bakırköy", "Ataşehir"]
  },
  {
    name: "İzmir",
    districts: ["Foça", "Konak", "Karşıyaka", "Bornova", "Buca", "Çeşme", "Urla", "Alsancak", "Bayraklı", "Balçova"]
  },
  {
    name: "Ankara",
    districts: ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Altındağ", "Etimesgut", "Sincan", "Gölbaşı"]
  },
  {
    name: "Antalya",
    districts: ["Muratpaşa", "Kepez", "Konyaaltı", "Alanya", "Manavgat", "Kemer", "Kaş"]
  },
  {
    name: "Bursa",
    districts: ["Nilüfer", "Osmangazi", "Yıldırım", "Mudanya", "Gemlik", "İnegöl"]
  }
];

// District center coordinates approximation for mock coordinates fallback
export const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Kadıköy": { lat: 40.991, lng: 29.027 },
  "Beşiktaş": { lat: 41.042, lng: 29.008 },
  "Şişli": { lat: 41.060, lng: 28.987 },
  "Fatih": { lat: 41.018, lng: 28.948 },
  "Üsküdar": { lat: 41.027, lng: 29.016 },
  "Foça": { lat: 38.670, lng: 26.756 },
  "Konak": { lat: 38.419, lng: 27.128 },
  "Karşıyaka": { lat: 38.457, lng: 27.114 },
  "Çankaya": { lat: 39.920, lng: 32.854 },
  "Keçiören": { lat: 39.976, lng: 32.868 },
  "Muratpaşa": { lat: 36.887, lng: 30.707 },
  "Konyaaltı": { lat: 36.862, lng: 30.636 },
  "Nilüfer": { lat: 40.218, lng: 28.951 },
  "Osmangazi": { lat: 40.193, lng: 29.061 }
};

const PHARMACY_NAMES = [
  "Şifa", "Hayat", "Merkez", "Umut", "Güneş", "Hilal", "Bahar", "Yeni", "Esen", "Nilüfer", 
  "Sarıgül", "Park", "Sevgi", "Defne", "Ege", "Yıldız", "Derman", "Sağlık", "Deniz", "Atlas"
];

const STREET_NAMES = [
  "Atatürk Caddesi", "Cumhuriyet Bulvarı", "İnönü Caddesi", "Mithatpaşa Caddesi", "Fatih Sultan Mehmet Caddesi",
  "Namık Kemal Sokak", "Vatan Caddesi", "İstiklal Sokak", "Barış Sokak", "Yeşilçam Sokak"
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMockPhone(): string {
  const areaCode = getRandomItem(["212", "216", "232", "312", "242", "224"]);
  const num1 = Math.floor(100 + Math.random() * 900);
  const num2 = Math.floor(10 + Math.random() * 90);
  const num3 = Math.floor(10 + Math.random() * 90);
  return `0 (${areaCode}) ${num1} ${num2} ${num3}`;
}

export function generateMockPharmacies(
  lat?: number,
  lng?: number,
  city?: string,
  district?: string
): Pharmacy[] {
  const baseLat = lat ?? (district ? (DISTRICT_COORDINATES[district]?.lat ?? 41.0082) : 41.0082);
  const baseLng = lng ?? (district ? (DISTRICT_COORDINATES[district]?.lng ?? 28.9784) : 28.9784);
  const resolvedCity = city ?? "İzmir";
  const resolvedDistrict = district ?? "Foça";

  // Generate 5 mock pharmacies with unique coordinates close to the base location
  return Array.from({ length: 5 }).map((_, idx) => {
    // Offset coordinates slightly to simulate nearby locations (roughly 200m to 3km away)
    // 0.009 degrees of lat is roughly 1km
    const latOffset = (Math.random() - 0.5) * 0.03;
    const lngOffset = (Math.random() - 0.5) * 0.04;
    
    const pLat = baseLat + latOffset;
    const pLng = baseLng + lngOffset;
    
    // Last update should be recent (within the last hour)
    const now = new Date();
    const updateMinute = Math.floor(Math.random() * 45);
    now.setMinutes(now.getMinutes() - updateMinute);
    const updatedStr = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

    return {
      id: `pharmacy-${resolvedCity}-${resolvedDistrict}-${idx}`,
      name: `${getRandomItem(PHARMACY_NAMES)} Eczanesi`,
      city: resolvedCity,
      district: resolvedDistrict,
      address: `${getRandomItem(STREET_NAMES)} No: ${Math.floor(1 + Math.random() * 120)}, ${resolvedDistrict}/${resolvedCity}`,
      phone: generateMockPhone(),
      latitude: pLat,
      longitude: pLng,
      confidence_score: 85 + Math.floor(Math.random() * 15), // 85-100% confidence
      updated_at: updatedStr
    };
  });
}
