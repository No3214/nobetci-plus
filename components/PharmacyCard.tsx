"use client";

import { useState } from "react";
import { Pharmacy } from "@/types/pharmacy";
import { formatDistance } from "@/lib/distance";
import { getPhoneUrl, getWhatsappUrl, normalizePhone } from "@/lib/phone";
import { Phone, MessageCircle, MapPin, AlertTriangle, ShieldCheck, Navigation, Clock, Share2 } from "lucide-react";
import MapChoiceSheet from "@/components/MapChoiceSheet";
import ReportDialog from "@/components/ReportDialog";

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  index: number; // 0, 1, 2 for display priority
  elderMode?: boolean;
}

export default function PharmacyCard({ pharmacy, index, elderMode = false }: PharmacyCardProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [medication, setMedication] = useState("");

  // Calculate current duty time countdown (weekdays: 18:00-08:00, Sat: 13:00-08:00, Sun: 24h)
  const getDutyTimeStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0: Sunday, 6: Sat
    const hour = now.getHours();

    let isDuty = false;
    let statusText = "";

    if (day === 0) {
      isDuty = true;
      statusText = "🟢 NÖBETÇİ (PAZAR HİZMETİ)";
    } else if (day === 6) {
      if (hour >= 13 || hour < 8) {
        isDuty = true;
        statusText = "🟢 NÖBETÇİ (CUMARTESİ HİZMETİ)";
      } else {
        statusText = `⏰ NÖBET BAŞLANGICI: ${13 - hour} SAAT SONRA`;
      }
    } else {
      if (hour >= 18 || hour < 8) {
        isDuty = true;
        statusText = "🟢 NÖBETÇİ (HAFTA İÇİ HİZMETİ)";
      } else {
        statusText = `⏰ NÖBET BAŞLANGICI: ${18 - hour} SAAT SONRA`;
      }
    }
    return { isDuty, statusText };
  };

  const { isDuty, statusText } = getDutyTimeStatus();

  // Dynamic WhatsApp text generator for prefilled stock query
  const getCustomWhatsappUrl = () => {
    if (!medication.trim()) {
      return getWhatsappUrl(pharmacy.phone);
    }
    const cleanNum = normalizePhone(pharmacy.phone);
    const text = encodeURIComponent(
      `Merhaba, ${pharmacy.name}. Nöbetçi misiniz? Stoklarınızda "${medication.trim()}" ilacı bulunuyor mu? Konum teyidi ile birlikte bilgi alabilir miyim?`
    );
    return `https://wa.me/${cleanNum}?text=${text}`;
  };

  // Native Web Share API or copy-to-clipboard fallback
  const handleShare = async () => {
    const shareText = `🏥 ${pharmacy.name}\n📍 Adres: ${pharmacy.address}\n📞 Telefon: ${pharmacy.phone}\n🗺️ Yol Tarifi Al: https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`;
    
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${pharmacy.name} Nöbetçi Eczane`,
          text: shareText,
        });
      } catch (err) {
        console.warn("Share API cancelled:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Eczane bilgileri panoya kopyalandı!");
      } catch (err) {
        console.error("Clipboard copy failed:", err);
        alert("Kopyalanamadı.");
      }
    }
  };

  // Confidence level colors
  const getConfidenceColor = (score: number) => {
    if (score >= 95) return "text-emerald-400 bg-emerald-500/10";
    if (score >= 85) return "text-teal-400 bg-teal-500/10";
    return "text-amber-400 bg-amber-500/10";
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
        elderMode 
          ? "bg-black text-white border-white border-2 p-6 shadow-none" 
          : index === 0
            ? "bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950/20 border-emerald-500/40 p-5 shadow-emerald-950/10 shadow-xl"
            : "bg-neutral-900/90 border-neutral-800 p-5 hover:border-neutral-700 shadow-md"
      }`}
    >
      {/* Index Tag / Highlight badge */}
      {index === 0 && !elderMode && (
        <span className="absolute top-0 right-0 rounded-bl-2xl bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          En Yakın Eczane
        </span>
      )}
      {index === 0 && elderMode && (
        <span className="absolute top-0 right-0 rounded-bl-xl bg-white px-3 py-1 text-xs font-black uppercase tracking-wider text-black">
          EN YAKIN
        </span>
      )}

      {/* Basic info row */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className={`font-black text-neutral-100 flex items-center gap-1.5 leading-tight ${
            elderMode ? "text-2xl md:text-3xl text-white" : "text-xl"
          }`}>
            {pharmacy.name}
          </h3>
          
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {/* Distance badge */}
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold ${
              elderMode 
                ? "bg-white text-black text-sm border border-black" 
                : "bg-neutral-800 text-emerald-400 text-xs"
            }`}>
              <MapPin className="h-3.5 w-3.5" />
              {pharmacy.distance !== undefined ? formatDistance(pharmacy.distance) : "Hesaplanıyor"}
            </span>

            {/* Countdown / Status badge */}
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
              elderMode
                ? "bg-black text-white border border-white text-xs"
                : isDuty 
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
            }`}>
              <Clock className="h-3 w-3" />
              {statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Address */}
      <p className={`leading-relaxed text-neutral-200 ${
        elderMode 
          ? "mt-4 text-base md:text-lg font-black text-white" 
          : "mt-3.5 text-xs text-neutral-400 font-medium line-clamp-2"
      }`}>
        {pharmacy.address}
      </p>

      {/* Legal disclaimer notice inside card */}
      <p className={`text-[10px] text-amber-500/80 font-bold mt-2.5 flex items-center gap-1`}>
        ⚠️ Yola çıkmadan önce eczaneyi arayıp nöbet durumunu teyit edin.
      </p>

      {/* Dynamic Medication Stock inquiry box (Consumer pain point) */}
      {!elderMode && (
        <div className="mt-3 bg-neutral-950/40 rounded-xl p-2.5 border border-neutral-800/40 flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide shrink-0">💊 İlaç Sor:</span>
          <input
            type="text"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
            placeholder="Sorgulamak için ilaç adı yazın..."
            className="flex-grow bg-transparent text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none"
          />
        </div>
      )}

      {/* Surplus Items & Discount Commission Block */}
      {!elderMode && pharmacy.surplus_items && pharmacy.surplus_items.length > 0 && (
        <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-12 h-12 bg-emerald-500/20 blur-xl rounded-full pointer-events-none" />
          <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>🎉 Özel Nöbetçi+ İndirimleri</span>
          </h4>
          <div className="space-y-2">
            {pharmacy.surplus_items.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-neutral-950/60 rounded-lg p-2 border border-neutral-800/50">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-neutral-200">{item.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.discount_badge && (
                      <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-sm">
                        {item.discount_badge}
                      </span>
                    )}
                    {item.price && <span className="text-[10px] font-mono text-emerald-400">{item.price}</span>}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const text = encodeURIComponent(`Merhaba, Nöbetçi+ uygulamanızdaki indirimli "${item.name}" (${item.price}) için ulaşıyorum. Nöbetçi+ İndirim Kodum: NBT-123. Üründen benim adıma 1 adet ayırabilir misiniz?`);
                    window.open(`https://wa.me/${normalizePhone(pharmacy.phone)}?text=${text}`, '_blank');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-md transition shadow-md shadow-emerald-900/30"
                >
                  İndirimli Al
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Updated Status */}
      <div className={`mt-2 font-bold flex items-center gap-1 ${
        elderMode ? "text-xs text-neutral-300" : "text-[10px] text-neutral-500"
      }`}>
        <span className={`rounded-full bg-emerald-500 ${elderMode ? "h-2.5 w-2.5" : "h-1.5 w-1.5 animate-pulse"}`} />
        Son Güncelleme: {pharmacy.updated_at || "22:40"}
      </div>

      {/* Action Buttons Row */}
      <div className={`grid grid-cols-3 gap-2.5 ${elderMode ? "mt-6" : "mt-5"}`}>
        {/* Yol Tarifi */}
        <button
          onClick={() => setIsMapOpen(true)}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl text-white active:scale-95 transition-all ${
            elderMode 
              ? "bg-emerald-500 border border-white py-5 shadow-none hover:bg-emerald-400" 
              : "bg-emerald-600/90 py-3.5 hover:bg-emerald-500 shadow-md shadow-emerald-900/10"
          }`}
        >
          <Navigation className={`text-white ${elderMode ? "h-7 w-7" : "h-5.5 w-5.5"}`} />
          <span className={`font-black uppercase ${elderMode ? "text-xs md:text-sm" : "text-[11px]"}`}>Yol Tarifi</span>
        </button>

        {/* Ara */}
        <a
          href={getPhoneUrl(pharmacy.phone)}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl active:scale-95 transition-all ${
            elderMode 
              ? "bg-white text-black border border-black py-5 shadow-none hover:bg-neutral-100" 
              : "bg-neutral-800 text-neutral-100 border border-neutral-700/50 py-3.5 hover:bg-neutral-700"
          }`}
        >
          <Phone className={`${elderMode ? "h-7 w-7 text-black" : "h-5.5 w-5.5 text-neutral-200"}`} />
          <span className={`font-black uppercase ${elderMode ? "text-xs md:text-sm" : "text-[11px]"}`}>Ara</span>
        </a>

        {/* WhatsApp */}
        <a
          href={getCustomWhatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl active:scale-95 transition-all ${
            elderMode 
              ? "bg-black text-emerald-400 border-2 border-emerald-400 py-5 shadow-none hover:bg-neutral-900" 
              : "bg-neutral-800 text-neutral-100 border border-neutral-700/50 py-3.5 hover:bg-neutral-700"
          }`}
        >
          <MessageCircle className={`text-emerald-400 ${elderMode ? "h-7 w-7" : "h-5.5 w-5.5"}`} />
          <span className={`font-black uppercase ${elderMode ? "text-xs md:text-sm" : "text-[11px]"}`}>WhatsApp</span>
        </a>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-4 flex flex-col gap-3 border-t border-neutral-800/40 pt-3">
        
        {/* Affiliate / Monetization: Taxi/Uber */}
        <a 
          href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${pharmacy.latitude}&dropoff[longitude]=${pharmacy.longitude}&dropoff[nickname]=${encodeURIComponent(pharmacy.name)}&client_id=AFFILIATE_NOBETCI_123`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-neutral-950 border border-neutral-800 hover:bg-neutral-900 text-[11px] font-bold text-neutral-300 py-2.5 rounded-xl transition shadow-sm"
        >
          🚕 Eczaneye Taksi Çağır (Uber)
        </a>

        <div className="flex justify-between items-center">
          <button
            onClick={handleShare}
            className={`inline-flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 transition ${
              elderMode ? "text-xs underline" : "text-[11px]"
          }`}
        >
          <Share2 className="h-3.5 w-3.5" />
          Bilgileri Paylaş
        </button>
        <button
          onClick={() => setIsReportOpen(true)}
          className={`inline-flex items-center gap-1 font-bold transition ${
            elderMode 
              ? "text-xs text-white underline hover:text-amber-400" 
              : "text-[11px] text-neutral-500 hover:text-amber-400"
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Konum hatalı mı? Bildir
        </button>
        </div>
      </div>

      {/* Dialog Sheets */}
      <MapChoiceSheet
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        latitude={pharmacy.latitude}
        longitude={pharmacy.longitude}
        pharmacyName={pharmacy.name}
      />

      <ReportDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        pharmacyId={pharmacy.id}
        pharmacyName={pharmacy.name}
      />
    </div>
  );
}
