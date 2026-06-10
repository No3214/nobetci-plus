"use client";

import { useState } from "react";
import { Phone, AlertTriangle, ShieldCheck, HeartPulse, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HOTLINES = [
  { name: "112 Acil Çağrı Merkezi", number: "112", description: "Tüm acil yardım talepleri (Ambulans, Polis, İtfaiye)", color: "border-red-500/30 text-red-400 bg-red-500/5" },
  { name: "114 Zehir Danışma (UZEM)", number: "114", description: "İlaç ve kimyasal zehirlenme durumlarında anlık medikal danışmanlık", color: "border-amber-500/30 text-amber-400 bg-amber-500/5" },
  { name: "182 MHRS Hastane Randevu", number: "182", description: "Merkezi Hekim Randevu Sistemi hastane ve muayene kayıtları", color: "border-teal-500/30 text-teal-400 bg-teal-500/5" }
];

const FIRST_AID_TIPS = [
  {
    title: "🔥 Yanık Durumunda",
    content: "Yanan bölgeyi en az 10-15 dakika boyunca hafif akan serin su altında tutun. Üzerine buz, diş macunu veya krem sürmeyin. Bölgeyi temiz, nemli bir bezle örtün."
  },
  {
    title: "🤢 Zehirlenme Durumunda",
    content: "Kişiyi kesinlikle zorla kusturmaya çalışmayın. Kimyasalın türünü belirleyin, bilinci açık tutun ve vakit kaybetmeden 114 Zehir Danışma hattını arayın."
  },
  {
    title: "🥩 Boğulma / Soluk Borusu Tıkanması",
    content: "Öksüremiyorsa ve nefes alamıyorsa hemen Heimlich manevrası uygulayın (arkasına geçip göğüs kafesinin hemen altına yumruk yapıp yukarı doğru bastırarak). 112'yi arayın."
  }
];

export default function EmergencyCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"hotlines" | "firstaid">("hotlines");

  return (
    <div className="rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-lg transition-all duration-300">
      
      {/* Trigger Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left text-neutral-100 hover:bg-neutral-800/40 transition"
      >
        <div className="flex items-center gap-2.5">
          <HeartPulse className="h-5 w-5 text-emerald-400 animate-pulse" />
          <div>
            <h3 className="font-bold text-sm">Acil Durum Yardım Merkezi</h3>
            <p className="text-[10px] text-neutral-500">Hızlı ilk yardım kılavuzu ve acil hatlar</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-neutral-800 bg-neutral-900/50"
          >
            {/* Tabs */}
            <div className="flex border-b border-neutral-800">
              <button
                onClick={() => setActiveTab("hotlines")}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
                  activeTab === "hotlines"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                }`}
              >
                📞 Acil Hatlar
              </button>
              <button
                onClick={() => setActiveTab("firstaid")}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
                  activeTab === "firstaid"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                }`}
              >
                🩹 İlk Yardım
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5">
              {activeTab === "hotlines" ? (
                <div className="space-y-3">
                  {HOTLINES.map((hl) => (
                    <a
                      key={hl.number}
                      href={`tel:${hl.number}`}
                      className={`flex items-center justify-between rounded-2xl border p-3.5 hover:bg-neutral-800 transition ${hl.color}`}
                    >
                      <div className="text-left pr-4">
                        <p className="font-bold text-xs">{hl.name}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5 leading-snug">
                          {hl.description}
                        </p>
                      </div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-xs shrink-0">
                        Ara
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {FIRST_AID_TIPS.map((tip) => (
                    <div
                      key={tip.title}
                      className="rounded-2xl bg-neutral-950 p-4 border border-neutral-800/60"
                    >
                      <h4 className="font-bold text-xs text-neutral-200 flex items-center gap-1.5">
                        {tip.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed mt-1.5 font-medium">
                        {tip.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
