"use client";

import { useEffect, useState } from "react";
import { Report } from "@/types/pharmacy";
import { 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Clock, 
  MapPin, 
  Phone, 
  Ban, 
  HelpCircle, 
  ArrowLeft, 
  Lock, 
  LogOut, 
  ShieldAlert, 
  BarChart3, 
  PieChart,
  Activity
} from "lucide-react";
import Link from "next/link";
import GraphPanel from "@/components/GraphPanel";

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminKey, setAdminKey] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const verifyAndFetch = async (key: string) => {
    setRefreshing(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/reports", {
        headers: {
          "x-admin-key": key
        }
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem("nobetci-admin-key");
        setAuthError("Geçersiz yönetici şifresi.");
      } else if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReports(data.data);
          setIsAuthenticated(true);
          sessionStorage.setItem("nobetci-admin-key", key);
          setAdminKey(key);
        }
      } else {
        setAuthError("Sunucu bağlantı hatası.");
      }
    } catch (err) {
      console.error("Auth verify error:", err);
      setAuthError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setVerifying(false);
    }
  };

  // Load key from sessionStorage on mount
  useEffect(() => {
    const cachedKey = sessionStorage.getItem("nobetci-admin-key");
    if (cachedKey) {
      verifyAndFetch(cachedKey);
    } else {
      setTimeout(() => {
        setIsAuthenticated(false);
        setLoading(false);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    setVerifying(true);
    verifyAndFetch(adminKey.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem("nobetci-admin-key");
    setIsAuthenticated(false);
    setReports([]);
    setAdminKey("");
  };

  const handleResolve = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "resolved" ? "open" : "resolved";
    const key = sessionStorage.getItem("nobetci-admin-key") || adminKey;
    try {
      const res = await fetch("/api/reports", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-key": key
        },
        body: JSON.stringify({ id, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: nextStatus as "open" | "resolved" } : r))
        );
      }
    } catch (err) {
      console.error("Error resolving report:", err);
    }
  };

  // Statistics & Charts Data Calculation
  const totalCount = reports.length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const openCount = totalCount - resolvedCount;

  // Breakdown by report type
  const typeCounts = reports.reduce((acc, curr) => {
    acc[curr.report_type] = (acc[curr.report_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeLabels: Record<string, string> = {
    wrong_location: "Konum Yanlış",
    wrong_phone: "Telefon Yanlış",
    closed: "Eczane Kapalı",
    wrong_address: "Adres Hatalı",
    other: "Diğer Sorun"
  };

  const typeColors: Record<string, string> = {
    wrong_location: "#ef4444", // Red
    wrong_phone: "#f97316", // Orange
    closed: "#a855f7", // Purple
    wrong_address: "#3b82f6", // Blue
    other: "#737373" // Neutral/Gray
  };

  const typeBgTailwind: Record<string, string> = {
    wrong_location: "bg-red-500",
    wrong_phone: "bg-orange-500",
    closed: "bg-purple-500",
    wrong_address: "bg-blue-500",
    other: "bg-neutral-500"
  };

  // Generate SVG Donut slices
  const renderDonutChart = () => {
    if (totalCount === 0) return null;
    
    let accumulatedCircumference = 0;
    const radius = 60;
    const circumference = 2 * Math.PI * radius; // ~376.99
    const center = 100;

    return Object.entries(typeCounts).map(([type, count]) => {
      const percentage = count / totalCount;
      const strokeLength = percentage * circumference;
      const strokeOffset = circumference - strokeLength + accumulatedCircumference;
      accumulatedCircumference -= strokeLength;

      return (
        <circle
          key={type}
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={typeColors[type] || "#ffffff"}
          strokeWidth="20"
          strokeDasharray={`${strokeLength} ${circumference}`}
          strokeDashoffset={strokeOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out origin-center -rotate-90 hover:stroke-[24px] cursor-pointer"
          style={{ transformOrigin: "50% 50%" }}
        />
      );
    });
  };

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case "wrong_location":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-400">
            <MapPin className="h-3.5 w-3.5" /> Konum Yanlış
          </span>
        );
      case "wrong_phone":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/10 px-2 py-1 text-xs font-semibold text-orange-400">
            <Phone className="h-3.5 w-3.5" /> Telefon Yanlış
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-1 text-xs font-semibold text-purple-400">
            <Ban className="h-3.5 w-3.5" /> Kapalı
          </span>
        );
      case "wrong_address":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-400">
            <AlertCircle className="h-3.5 w-3.5" /> Adres Hatalı
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-neutral-700 px-2 py-1 text-xs font-semibold text-neutral-300">
            <HelpCircle className="h-3.5 w-3.5" /> Diğer
          </span>
        );
    }
  };

  // RENDER LOGIN SCREEN
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <main className="w-full max-w-sm bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl relative z-10">
          <div className="h-12 w-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-emerald-400 shadow-lg shadow-black/40">
            <Lock className="h-5 w-5" />
          </div>

          <h1 className="text-lg font-black text-neutral-100 tracking-tight text-center">Yönetici Paneli Girişi</h1>
          <p className="text-[11px] text-neutral-500 mt-1 mb-6 text-center leading-normal">
            Hata bildirimlerini görüntülemek ve çözmek için lütfen yönetici şifrenizi girin.
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Yönetici Şifresi"
                className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                required
              />
            </div>

            {authError && (
              <p className="text-[10px] text-red-400 font-bold text-center flex items-center justify-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black uppercase text-white transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/20"
            >
              {verifying ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                "Kimliği Doğrula"
              )}
            </button>
          </form>

          <Link
            href="/"
            className="mt-6 text-[10px] font-bold text-neutral-500 hover:text-neutral-300 transition flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" /> Eczane Bulucuya Dön
          </Link>
        </main>
      </div>
    );
  }

  // RENDER LOADING DURING VERIFICATION OR SYSTEM FETCH
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-800 border-t-emerald-500" />
        <p className="mt-4 text-xs font-semibold text-neutral-400">Veriler yükleniyor...</p>
      </div>
    );
  }

  // RENDER COMPLETED SECURED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-neutral-900 border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-neutral-100 tracking-tight flex items-center gap-2">
                Nöbetçi+ Hata Bildirimleri
              </h1>
              <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
                Kullanıcılar Tarafından Raporlanan Hatalar & Analizler
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => verifyAndFetch(adminKey)}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 px-4 py-3 text-xs font-bold text-neutral-300 hover:bg-neutral-800 hover:text-white transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
              Yenile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-2xl bg-red-950/20 border border-red-900/30 hover:border-red-900/50 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-950/40 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Güvenli Çıkış
            </button>
          </div>
        </header>

        {/* Global Telemetry & Graphify Panel */}
        <GraphPanel reportsCount={totalCount} activeUsers={1240} uberClicks={142} />

        {/* Analytics Section ("grapihyla güçlendir") */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          
          {/* STATS METRICS */}
          <div className="md:col-span-1 flex flex-col justify-between gap-4">
            
            {/* Stat Card 1 */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Toplam Rapor</span>
                <span className="text-3xl font-black text-white mt-1 block">{totalCount}</span>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-400">
                <Activity className="h-5 w-5" />
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">Bekleyen Sorun</span>
                <span className="text-3xl font-black text-amber-400 mt-1 block">{openCount}</span>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Çözülen Sorun</span>
                <span className="text-3xl font-black text-emerald-400 mt-1 block">{resolvedCount}</span>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>

          </div>

          {/* DONUT CHART (SVG) */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col md:col-span-1">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <PieChart className="h-4 w-4 text-emerald-400" /> Kategori Dağılımı
            </h3>
            
            {totalCount === 0 ? (
              <div className="flex flex-grow items-center justify-center text-xs text-neutral-600 font-semibold py-8">
                Veri bulunamadı
              </div>
            ) : (
              <div className="flex flex-row items-center justify-around gap-4 flex-grow">
                {/* SVG Donut */}
                <div className="relative h-28 w-28 shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="60" fill="transparent" stroke="#1c1f1e" strokeWidth="20" />
                    {renderDonutChart()}
                  </svg>
                  {/* Central Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white leading-none">{totalCount}</span>
                    <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">Rapor</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-1.5 text-[9px] font-bold text-neutral-400 uppercase tracking-wider flex-grow">
                  {Object.entries(typeCounts).map(([type, count]) => (
                    <div key={type} className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-md ${typeBgTailwind[type] || "bg-white"} shrink-0`} />
                      <span className="truncate max-w-[80px]" title={typeLabels[type]}>{typeLabels[type]}</span>
                      <span className="text-neutral-500 ml-auto font-mono text-right shrink-0">{count} adet</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BAR CHART (SVG/HTML Bar stats) */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col md:col-span-1 justify-between">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-emerald-400" /> Çözüm Oranları
            </h3>

            {totalCount === 0 ? (
              <div className="flex flex-grow items-center justify-center text-xs text-neutral-600 font-semibold py-8">
                Veri bulunamadı
              </div>
            ) : (
              <div className="space-y-4 flex-grow flex flex-col justify-center">
                {/* Resolution progress */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 mb-1.5">
                    <span className="flex items-center gap-1">🟢 ÇÖZÜLEN</span>
                    <span className="font-mono text-neutral-300">
                      {resolvedCount} / {totalCount} (%{Math.round((resolvedCount / totalCount) * 100)})
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800/40">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-1000 ease-out"
                      style={{ width: `${(resolvedCount / totalCount) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Open progress */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 mb-1.5">
                    <span className="flex items-center gap-1">⏰ BEKLEYEN</span>
                    <span className="font-mono text-neutral-300">
                      {openCount} / {totalCount} (%{Math.round((openCount / totalCount) * 100)})
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800/40">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 to-orange-500 transition-all duration-1000 ease-out"
                      style={{ width: `${(openCount / totalCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Reports Listing Table/Card Stack */}
        {reports.length === 0 ? (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-12 text-center shadow-lg">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-500/80 animate-bounce-slow" />
            <h3 className="mt-4 text-base font-bold text-neutral-200">Hiç Hata Bildirimi Yok</h3>
            <p className="mt-1.5 text-xs text-neutral-500 max-w-xs mx-auto leading-normal">
              Şu ana kadar kullanıcılar tarafından bildirilen herhangi bir sorun kaydı bulunmamaktadır. Eczane bilgileri tam performans çalışmaktadır.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1 pl-1">Bildirilen Hata Listesi</h3>
            
            {reports.map((report) => (
              <div
                key={report.id}
                className={`rounded-3xl border p-5 bg-neutral-900 transition-all duration-300 ${
                  report.status === "resolved"
                    ? "border-emerald-950 bg-emerald-950/5 opacity-60"
                    : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-neutral-200 text-sm sm:text-base">{report.pharmacy_name}</h3>
                      {getReportTypeBadge(report.report_type)}
                      {report.status === "resolved" && (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold text-emerald-400">
                          Çözüldü
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold">
                      <Clock className="h-3.5 w-3.5" />
                      {report.created_at ? new Date(report.created_at).toLocaleString("tr-TR") : "Bilinmiyor"}
                    </div>
                  </div>

                  <button
                    onClick={() => handleResolve(report.id!, report.status!)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
                      report.status === "resolved"
                        ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-750"
                        : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/20"
                    }`}
                  >
                    {report.status === "resolved" ? "Yeniden Aç" : "Çözüldü İşaretle"}
                  </button>
                </div>

                {report.message && (
                  <div className="mt-4 rounded-2xl bg-neutral-950 p-4 border border-neutral-800/40">
                    <p className="text-[10px] text-neutral-500 block font-bold uppercase tracking-wider mb-1">Kullanıcı Açıklaması:</p>
                    <p className="text-xs text-neutral-300 leading-relaxed font-medium">{report.message}</p>
                  </div>
                )}

                {/* Reporter Coordinates Analysis */}
                {(report.user_latitude !== undefined && report.user_longitude !== undefined) && (
                  <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-neutral-950/30 p-2.5 border border-neutral-800/50 text-[10px] text-neutral-400 font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                    <span>Raporlayan Konumu:</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${report.user_latitude},${report.user_longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-lg flex items-center gap-1"
                    >
                      <code>{report.user_latitude.toFixed(5)}, {report.user_longitude.toFixed(5)}</code>
                      <span className="text-[8px] text-neutral-500">(Haritada Gör)</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
