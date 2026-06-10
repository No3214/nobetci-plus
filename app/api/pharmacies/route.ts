import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateMockPharmacies } from "@/lib/pharmacy-data";
import { calculateDistanceKm } from "@/lib/distance";
import { Pharmacy } from "@/types/pharmacy";
import { fetchLiveIzmirPharmacies, fetchCollectAPILivePharmacies } from "@/lib/pharmacy-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const city = searchParams.get("city");
    const district = searchParams.get("district");

    let lat: number | undefined = latParam ? parseFloat(latParam) : undefined;
    let lng: number | undefined = lngParam ? parseFloat(lngParam) : undefined;

    let pharmacies: Pharmacy[] = [];

    // 1. Try Live Municipal API integrations first for zero-config live data
    const isIzmirRegion = lat !== undefined && lng !== undefined && (lat >= 38.0 && lat <= 39.0) && (lng >= 26.0 && lng <= 28.2);
    if (city === "İzmir" || isIzmirRegion) {
      const liveIzmir = await fetchLiveIzmirPharmacies(district || undefined);
      if (liveIzmir.length > 0) {
        pharmacies = liveIzmir;
      }
    }

    // 2. Try CollectAPI if API key is provided (provides live coverage for all 81 Turkish cities)
    const collectApiKey = process.env.COLLECTAPI_KEY;
    if (pharmacies.length === 0 && collectApiKey && city && district) {
      const liveTurkey = await fetchCollectAPILivePharmacies(city, district, collectApiKey);
      if (liveTurkey.length > 0) {
        pharmacies = liveTurkey;
      }
    }

    // 2. Attempt to fetch from Supabase if pharmacies array is still empty
    if (pharmacies.length === 0 && isSupabaseConfigured && supabase) {
      let query = supabase.from("pharmacies").select("*");
      
      // If coordinates are provided, perform a bounding box geospatial query (~5.5km range)
      // to avoid downloading all national records in-memory.
      if (lat !== undefined && lng !== undefined) {
        const delta = 0.05; // ~0.05 degrees is approx 5.5 km
        query = query
          .gte("latitude", lat - delta)
          .lte("latitude", lat + delta)
          .gte("longitude", lng - delta)
          .lte("longitude", lng + delta);
      } else {
        if (city) {
          query = query.eq("city", city);
        }
        if (district) {
          query = query.eq("district", district);
        }
      }
      
      const { data, error } = await query;
      
      if (!error && data && data.length > 0) {
        // Map to Pharmacy type
        pharmacies = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          city: item.city,
          district: item.district,
          address: item.address,
          phone: item.phone,
          latitude: item.latitude,
          longitude: item.longitude,
          confidence_score: item.confidence_score ?? 100,
          updated_at: item.source_updated_at ? new Date(item.source_updated_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "22:00"
        }));
      }
    }

    // Fallback/Default: generate mock pharmacies if database is empty/unconfigured
    if (pharmacies.length === 0) {
      pharmacies = generateMockPharmacies(lat, lng, city || undefined, district || undefined);
    }

    // Calculate distance if coordinates are provided
    if (lat !== undefined && lng !== undefined) {
      pharmacies = pharmacies.map((p) => {
        const dist = calculateDistanceKm(lat!, lng!, p.latitude, p.longitude);
        return { ...p, distance: dist };
      });

      // Sort by distance ascending
      pharmacies.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    } else {
      // Default sort (by mock distance or confidence)
      pharmacies = pharmacies.map((p, index) => ({
        ...p,
        // Mock distance for sorting if GPS is denied
        distance: 0.8 + index * 0.5
      }));
    }

    return NextResponse.json({ success: true, data: pharmacies });
  } catch (error: any) {
    console.error("Error in /api/pharmacies GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
