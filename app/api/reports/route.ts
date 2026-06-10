import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Report } from "@/types/pharmacy";
import fs from "fs";
import path from "path";

const REPORTS_FILE = path.join(process.cwd(), "reports.json");

// Simple in-memory rate limiter for reports POST API
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_POST_LIMIT = 5; // max 5 reports per window

function readLocalReports(): Report[] {
  try {
    if (fs.existsSync(REPORTS_FILE)) {
      const data = fs.readFileSync(REPORTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading local reports:", err);
  }
  return [];
}

function writeLocalReports(reports: Report[]) {
  try {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local reports:", err);
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    const requiredKey = process.env.ADMIN_SECRET_KEY || "nobetci-admin-2026";
    if (adminKey !== requiredKey) {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim." }, { status: 401 });
    }
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("reports")
        .select("*, pharmacies(name)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped: Report[] = data.map((item: any) => ({
          id: item.id,
          pharmacy_id: item.pharmacy_id,
          pharmacy_name: item.pharmacies?.name ?? "Bilinmeyen Eczane",
          report_type: item.report_type,
          message: item.message,
          user_latitude: item.user_latitude,
          user_longitude: item.user_longitude,
          status: item.status,
          created_at: item.created_at
        }));
        return NextResponse.json({ success: true, data: mapped });
      }
    }

    // Fallback: Read from local JSON
    const reports = readLocalReports();
    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    console.error("Error in /api/reports GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const rate = rateLimitCache.get(ip);

    if (rate && now < rate.resetTime) {
      if (rate.count >= MAX_POST_LIMIT) {
        return NextResponse.json(
          { success: false, error: "Çok fazla bildirim gönderdiniz. Lütfen 5 dakika sonra tekrar deneyin." },
          { status: 429 }
        );
      }
      rate.count += 1;
    } else {
      rateLimitCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    const body = await request.json();
    const { pharmacy_id, pharmacy_name, report_type, message, user_latitude, user_longitude } = body;

    // 2. Presence Checks
    if (!pharmacy_id || !report_type) {
      return NextResponse.json({ success: false, error: "Eksik parametre dolduruldu." }, { status: 400 });
    }

    // 3. Geolocation Validation (M2.2)
    if (user_latitude !== undefined && user_latitude !== null) {
      const latVal = parseFloat(user_latitude.toString());
      if (isNaN(latVal) || latVal < -90 || latVal > 90) {
        return NextResponse.json({ success: false, error: "Geçersiz enlem (latitude) koordinatı." }, { status: 400 });
      }
    }
    if (user_longitude !== undefined && user_longitude !== null) {
      const lngVal = parseFloat(user_longitude.toString());
      if (isNaN(lngVal) || lngVal < -180 || lngVal > 180) {
        return NextResponse.json({ success: false, error: "Geçersiz boylam (longitude) koordinatı." }, { status: 400 });
      }
    }

    const newReport: Report = {
      id: Math.random().toString(36).substring(2, 9),
      pharmacy_id,
      pharmacy_name: pharmacy_name ?? "Eczane",
      report_type,
      message,
      user_latitude: user_latitude ? parseFloat(user_latitude.toString()) : undefined,
      user_longitude: user_longitude ? parseFloat(user_longitude.toString()) : undefined,
      status: "open",
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("reports").insert([
        {
          pharmacy_id,
          report_type,
          message,
          user_latitude,
          user_longitude,
          status: "open"
        }
      ]);

      if (!error) {
        return NextResponse.json({ success: true, data: newReport });
      }
      console.error("Supabase insert report error:", error);
    }

    // Fallback: Save to local JSON file
    const reports = readLocalReports();
    reports.unshift(newReport);
    writeLocalReports(reports);

    return NextResponse.json({ success: true, data: newReport });
  } catch (error: any) {
    console.error("Error in /api/reports POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Support updating report status (e.g. resolve reports from admin panel)
export async function PUT(request: NextRequest) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    const requiredKey = process.env.ADMIN_SECRET_KEY || "nobetci-admin-2026";
    if (adminKey !== requiredKey) {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim." }, { status: 401 });
    }
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("reports")
        .update({ status })
        .eq("id", id);

      if (!error) {
        return NextResponse.json({ success: true });
      }
    }

    // Fallback: Update local file
    const reports = readLocalReports();
    const idx = reports.findIndex((r) => r.id === id);
    if (idx !== -1) {
      reports[idx].status = status;
      writeLocalReports(reports);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Report not found" }, { status: 404 });
  } catch (error: any) {
    console.error("Error in /api/reports PUT:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
