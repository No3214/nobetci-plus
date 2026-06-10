import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateMockPharmacies } from "@/lib/pharmacy-data";
import { calculateDistanceKm } from "@/lib/distance";
import { Pharmacy } from "@/types/pharmacy";
import { fetchLiveIzmirPharmacies, fetchCollectAPILivePharmacies } from "@/lib/pharmacy-api";

const QuerySchema = z.object({
  lat: z.string().optional().nullable().transform(val => val ? parseFloat(val) : undefined).refine(val => val === undefined || (!isNaN(val) && val >= -90 && val <= 90), "Geçersiz enlem (lat)"),
  lng: z.string().optional().nullable().transform(val => val ? parseFloat(val) : undefined).refine(val => val === undefined || (!isNaN(val) && val >= -180 && val <= 180), "Geçersiz boylam (lng)"),
  city: z.string().optional().nullable().transform(val => val || undefined),
  district: z.string().optional().nullable().transform(val => val || undefined),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedParams = QuerySchema.safeParse({
      lat: searchParams.get("lat"),
      lng: searchParams.get("lng"),
      city: searchParams.get("city"),
      district: searchParams.get("district"),
    });

    if (!parsedParams.success) {
      return NextResponse.json({ success: false, error: "Geçersiz parametreler", details: parsedParams.error.format() }, { status: 400 });
    }

    const { lat, lng, city, district } = parsedParams.data;

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
        pharmacies = data.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          name: item.name as string,
          city: item.city as string,
          district: item.district as string,
          address: item.address as string,
          phone: item.phone as string,
          latitude: item.latitude as number,
          longitude: item.longitude as number,
          confidence_score: (item.confidence_score as number) ?? 100,
          updated_at: item.source_updated_at ? new Date(item.source_updated_at as string).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "22:00"
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

    return NextResponse.json(
      { success: true, data: pharmacies },
      { 
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=59" // ECC: Edge Cache Control (5 mins)
        }
      }
    );
  } catch (error: unknown) {
    console.error("Error in /api/pharmacies GET:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
