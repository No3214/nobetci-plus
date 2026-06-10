"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, X } from "lucide-react";
import { getGoogleMapsUrl, getAppleMapsUrl, getYandexMapsUrl } from "@/lib/maps";
import { isIOS } from "@/lib/device";

interface MapChoiceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  pharmacyName: string;
}

export default function MapChoiceSheet({
  isOpen,
  onClose,
  latitude,
  longitude,
  pharmacyName
}: MapChoiceSheetProps) {
  const [deviceIsIos, setDeviceIsIos] = useState(false);

  useEffect(() => {
    setDeviceIsIos(isIOS());
  }, []);

  // Closes the sheet on pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when open
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const maps = [
    {
      name: "Google Haritalar",
      url: getGoogleMapsUrl(latitude, longitude),
      icon: "🌐",
      description: "Google Haritalar ile rota oluştur",
      isPrimary: !deviceIsIos
    },
    {
      name: "Apple Haritalar",
      url: getAppleMapsUrl(latitude, longitude),
      icon: "🗺️",
      description: "Apple Maps ile rota oluştur",
      isPrimary: deviceIsIos
    },
    {
      name: "Yandex Navigasyon",
      url: getYandexMapsUrl(latitude, longitude),
      icon: "🚗",
      description: "Yandex Navigasyon uygulamasında aç",
      isPrimary: false
    }
  ];

  // Sort maps: primary first
  const sortedMaps = [...maps].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return 0;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-3xl bg-neutral-900 p-6 text-white shadow-2xl border-t border-neutral-800"
          >
            {/* Header Handle */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutral-700" />

            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  <Navigation className="h-3 w-3" /> Yol Tarifi
                </span>
                <h3 className="mt-2 text-lg font-bold text-neutral-100">
                  {pharmacyName}
                </h3>
                <p className="text-xs text-neutral-400">
                  Rotayı açmak istediğiniz harita uygulamasını seçin.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-neutral-800 p-1.5 text-neutral-400 hover:bg-neutral-700 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {sortedMaps.map((map) => (
                <a
                  key={map.name}
                  href={map.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className={`flex items-center justify-between rounded-2xl p-4 transition ${
                    map.isPrimary
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30"
                      : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl">{map.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold text-sm flex items-center gap-1.5">
                        {map.name}
                        {map.isPrimary && (
                          <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-[10px] font-medium text-emerald-200">
                            Önerilen
                          </span>
                        )}
                      </p>
                      <p className={`text-xs ${map.isPrimary ? "text-emerald-200" : "text-neutral-400"}`}>
                        {map.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold">→</span>
                </a>
              ))}
            </div>

            {/* Taxi Affiliate Ride Option */}
            <div className="mt-4 border-t border-neutral-800 pt-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                🚖 Taksi İle Git
              </span>
              <a
                href={`https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${encodeURIComponent(pharmacyName)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center justify-between rounded-2xl bg-neutral-950 border border-neutral-800 p-4 hover:bg-neutral-800/50 transition active:scale-98"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">🚕</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-neutral-200">Uber ile Taksi Çağır</p>
                    <p className="text-xs text-neutral-400">Eczane konumu otomatik hedef olarak yüklenir</p>
                  </div>
                </div>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Uygulamada Aç
                </span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full rounded-2xl bg-neutral-800/50 py-3.5 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
            >
              Vazgeç
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
