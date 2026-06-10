"use client";

import { useEffect, useState } from "react";
import { Sun, AlertCircle, Clock, Thermometer } from "lucide-react";

interface HealthDashboardProps {
  latitude: number;
  longitude: number;
}

export default function HealthDashboard({ latitude, longitude }: HealthDashboardProps) {
  const [time, setTime] = useState<string>("");
  const [weather, setWeather] = useState<{ temp: number; uv: number; code: number } | null>(null);
  const [holiday, setHoliday] = useState<{ name: string; date: string; isTomorrow: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch APIs
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Weather API (Open-Meteo)
        const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,uv_index,weather_code`);
        if (wRes.ok) {
          const wData = await wRes.json();
          setWeather({
            temp: wData.current.temperature_2m,
            uv: wData.current.uv_index,
            code: wData.current.weather_code,
          });
        }

        // 2. Holiday API (Nager.Date)
        const hRes = await fetch("https://date.nager.at/api/v3/NextPublicHolidays/TR");
        if (hRes.ok) {
          const hData = await hRes.json();
          if (hData && hData.length > 0) {
            const nextHoli = hData[0];
            const hDate = new Date(nextHoli.date);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const isTomorrow = 
              hDate.getDate() === tomorrow.getDate() && 
              hDate.getMonth() === tomorrow.getMonth();

            // Show if it's within next 3 days
            if (isTomorrow || hDate.getTime() < tomorrow.getTime() + 86400000 * 3) {
                setHoliday({
                    name: nextHoli.localName,
                    date: hDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long" }),
                    isTomorrow
                });
            }
          }
        }
      } catch (error) {
        console.error("Dashboard data error", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, [latitude, longitude]);

  if (isLoading) return null;

  return (
    <div className="mb-6 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Holiday Alert (High Priority) */}
      {holiday && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-black text-red-500 uppercase tracking-wide text-sm">Resmi Tatil Uyarısı</h4>
            <p className="text-red-200/90 text-xs mt-1 font-medium leading-relaxed">
              {holiday.isTomorrow ? "Yarın" : holiday.date} tarihinde <strong>{holiday.name}</strong> nedeniyle tüm eczaneler kapalı olacaktır (Sadece kısıtlı sayıda nöbetçiler açık). Lütfen düzenli kullandığınız ilaçları bugünden temin etmeyi unutmayın!
            </p>
          </div>
        </div>
      )}

      {/* Weather & Health Widget */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Clock */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-md">
          <Clock className="h-5 w-5 text-neutral-400" />
          <span className="text-xl font-black text-white">{time || "--:--"}</span>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Yerel Saat</span>
        </div>

        {weather && (
          <>
            {/* Temp */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-md">
              <Thermometer className="h-5 w-5 text-sky-400" />
              <span className="text-xl font-black text-white">{weather.temp}°C</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Sıcaklık</span>
            </div>

            {/* UV Index / Surplus recommendation */}
            <div className={`col-span-2 border rounded-2xl p-3 flex items-center justify-between shadow-md relative overflow-hidden ${
              weather.uv > 5 ? "bg-amber-500/10 border-amber-500/30" : "bg-neutral-900 border-neutral-800"
            }`}>
              {weather.uv > 5 && <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/20 blur-2xl rounded-full pointer-events-none" />}
              
              <div className="flex flex-col z-10">
                <div className="flex items-center gap-1.5">
                  <Sun className={`h-4 w-4 ${weather.uv > 5 ? "text-amber-400 animate-pulse" : "text-neutral-400"}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${weather.uv > 5 ? "text-amber-500" : "text-neutral-500"}`}>
                    UV Endeksi: {weather.uv}
                  </span>
                </div>
                <p className={`text-[11px] mt-1.5 font-bold ${weather.uv > 5 ? "text-amber-200" : "text-neutral-300"}`}>
                  {weather.uv > 5 
                    ? "Güneş ışınları tehlikeli boyutta! Eczanelerdeki indirimli Güneş Kremlerine göz atın." 
                    : "Hava temiz, UV seviyesi sağlıklı sınırlarda."}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
