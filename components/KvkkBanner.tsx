"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import KvkkModal from "./KvkkModal";

export default function KvkkBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem("nobetci-kvkk-consent");
    if (!consent) {
      // Small delay for natural entrance animation
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("nobetci-kvkk-consent", "true");
    setIsVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: "150%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "150%", opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 p-5 text-white shadow-2xl"
          >
            <div className="flex items-start gap-3.5">
              <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-400 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1 pr-1">
                <h4 className="text-xs font-bold text-neutral-100 flex items-center gap-1">
                  KVKK ve Gizlilik Bilgilendirmesi
                </h4>
                <p className="text-[10px] text-neutral-400 leading-normal">
                  Size en yakın nöbetçi eczaneleri göstermek için konum verilerinizi (GPS) işliyoruz. Konum bilgileriniz sunucularımızda **asla kaydedilmez veya saklanmaz**.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2.5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 rounded-xl bg-neutral-800/80 py-2.5 text-[11px] font-bold text-neutral-300 hover:bg-neutral-800 transition"
              >
                Aydınlatma Metni
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-[11px] font-black text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-950/20"
              >
                Kabul Et
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <KvkkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
