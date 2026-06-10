import { Pharmacy } from "../types/pharmacy";
import { z } from "zod";

const IzmirPharmacySchema = z.object({
  Adi: z.string(),
  Ilce: z.string(),
  Adres: z.string(),
  Telefon: z.string().nullish().transform(val => val ?? ""),
  Enlem: z.union([z.string(), z.number()]),
  Boylam: z.union([z.string(), z.number()]),
}).passthrough();

const IzmirApiResponseSchema = z.array(IzmirPharmacySchema);

const CollectApiPharmacySchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string().nullish().transform(val => val ?? ""),
  loc: z.string(),
}).passthrough();

const CollectApiResponseSchema = z.object({
  success: z.boolean(),
  result: z.array(CollectApiPharmacySchema).optional().default([]),
}).passthrough();

/**
 * Fetches live duty pharmacies directly from the Izmir Metropolitan Municipality Open Data API.
 * This is a free, official public endpoint.
 */
export async function fetchLiveIzmirPharmacies(district?: string): Promise<Pharmacy[]> {
  try {
    // Fetch with a 15-minute fetch cache revalidation
    const res = await fetch("https://openapi.izmir.bel.tr/api/nobetcieczaneler", {
      next: { revalidate: 900 } 
    });

    if (!res.ok) {
      console.warn("Izmir Open Data API returned error status:", res.status);
      return [];
    }

    const data = await res.json();
    const parsed = IzmirApiResponseSchema.safeParse(data);
    
    if (!parsed.success) {
      console.warn("Izmir API shape changed or invalid:", parsed.error.format());
      return [];
    }

    let pharmacies: Pharmacy[] = parsed.data.map((item, index: number) => {
      const rawPhone = item.Telefon.replace(/\D/g, "");
      // Format phone into standardized Turkish phone string: 0 (232) XXX XX XX
      let formattedPhone = item.Telefon;
      if (rawPhone.length === 10 && rawPhone.startsWith("232")) {
        formattedPhone = `0 (232) ${rawPhone.slice(3, 6)} ${rawPhone.slice(6, 8)} ${rawPhone.slice(8, 10)}`;
      }

      return {
        id: `live-izmir-${item.Adi.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-${index}`,
        name: item.Adi.toLowerCase().includes("eczane") ? item.Adi : `${item.Adi} Eczanesi`,
        city: "İzmir",
        district: item.Ilce.trim(),
        address: item.Adres,
        phone: formattedPhone,
        latitude: typeof item.Enlem === "number" ? item.Enlem : parseFloat(String(item.Enlem)),
        longitude: typeof item.Boylam === "number" ? item.Boylam : parseFloat(String(item.Boylam)),
        confidence_score: 99, // Municipal verified
        updated_at: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
      };
    });

    // Filter by district if selected
    if (district) {
      const matchDistrict = district.toLocaleLowerCase("tr-TR").trim();
      pharmacies = pharmacies.filter(
        (p) => p.district.toLocaleLowerCase("tr-TR").trim() === matchDistrict
      );
    }

    return pharmacies;
  } catch (error) {
    console.error("Error fetching live Izmir pharmacies:", error);
    return [];
  }
}

/**
 * Commercial Integration Wrapper: CollectAPI
 * This function displays how we connect to CollectAPI if the user provides an API key.
 */
export async function fetchCollectAPILivePharmacies(
  city: string,
  district: string,
  apiKey: string
): Promise<Pharmacy[]> {
  try {
    const res = await fetch(
      `https://api.collectapi.com/health/dutyPharmacy?il=${encodeURIComponent(city)}&ilce=${encodeURIComponent(district)}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `apikey ${apiKey}`
        },
        next: { revalidate: 1800 } // Cache for 30 minutes
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    const parsed = CollectApiResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.warn("CollectAPI shape changed or invalid:", parsed.error.format());
      return [];
    }

    if (!parsed.data.success) return [];

    return parsed.data.result.map((item, idx: number) => {
      const parts = item.loc.split(",");
      const lat = parseFloat(parts[0] || "0");
      const lng = parseFloat(parts[1] || "0");

      return {
        id: `collectapi-${city}-${district}-${idx}`,
        name: item.name.toLowerCase().includes("eczane") ? item.name : `${item.name} Eczanesi`,
        city: city,
        district: district,
        address: item.address,
        phone: item.phone,
        latitude: lat,
        longitude: lng,
        confidence_score: 95,
        updated_at: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
      };
    });
  } catch (error) {
    console.error("Error in CollectAPI request:", error);
    return [];
  }
}
