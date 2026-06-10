import { Pharmacy } from "../types/pharmacy";

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
    
    // The API returns an array of pharmacies
    if (!data || !Array.isArray(data)) {
      return [];
    }

    let pharmacies: Pharmacy[] = data.map((item: any, index: number) => {
      const rawPhone = (item.Telefon || "").replace(/\D/g, "");
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
        latitude: parseFloat(item.Enlem),
        longitude: parseFloat(item.Boylam),
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

    const result = await res.json();
    if (!result.success || !Array.isArray(result.result)) return [];

    return result.result.map((item: any, idx: number) => ({
      id: `collectapi-${city}-${district}-${idx}`,
      name: item.name.toLowerCase().includes("eczane") ? item.name : `${item.name} Eczanesi`,
      city: city,
      district: district,
      address: item.address,
      phone: item.phone,
      latitude: parseFloat(item.loc.split(",")[0]),
      longitude: parseFloat(item.loc.split(",")[1]),
      confidence_score: 95,
      updated_at: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    }));
  } catch (error) {
    console.error("Error in CollectAPI request:", error);
    return [];
  }
}
