import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json({ success: false, error: "Eksik koordinat parametresi." }, { status: 400 });
    }

    // Round coordinates to 4 decimal places (~11 meters accuracy) to maximize cache hits
    // and prevent OSM Nominatim abuse
    const roundedLat = parseFloat(lat).toFixed(4);
    const roundedLng = parseFloat(lng).toFixed(4);

    // Call free OpenStreetMap Nominatim reverse geocoding API
    // We supply a custom User-Agent to satisfy OSM Nominatim Usage Policy
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${roundedLat}&lon=${roundedLng}&accept-language=tr`,
      {
        headers: {
          "User-Agent": "NobetciPlus/1.0 (contact: nobetciplus@gmail.com)"
        },
        next: { revalidate: 86400 } // Cache reverse geocoding results for 24 hours
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API returned status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract key address parts: neighborhood (mahalle), road (cadde/sokak), district (ilçe), city (il)
    const address = data.address || {};
    const neighborhood = address.neighbourhood || address.suburb || address.village || "";
    const district = address.district || address.town || address.county || "";
    const city = address.province || address.city || "";
    
    let resolvedAddress = "";
    if (neighborhood) resolvedAddress += `${neighborhood}, `;
    if (district) resolvedAddress += `${district}`;
    if (city && city !== district) resolvedAddress += ` / ${city}`;

    // Fallback if details are sparse
    if (!resolvedAddress) {
      resolvedAddress = data.display_name?.split(",").slice(0, 3).join(",") || "Bilinmeyen Konum";
    }

    return NextResponse.json({ success: true, address: resolvedAddress });
  } catch (error: unknown) {
    console.error("Geocoding proxy error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
