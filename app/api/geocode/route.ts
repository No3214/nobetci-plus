import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json({ success: false, error: "Eksik koordinat parametresi." }, { status: 400 });
    }

    // Call free OpenStreetMap Nominatim reverse geocoding API
    // We supply a custom User-Agent to satisfy OSM Nominatim Usage Policy
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=tr`,
      {
        headers: {
          "User-Agent": "NobetciPlus/1.0 (contact: nobetciplus@gmail.com)"
        }
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
  } catch (error: any) {
    console.error("Geocoding proxy error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
