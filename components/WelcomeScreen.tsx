"use client";

import { ShieldCheck, MapPin, Navigation, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onAcceptGps: () => void;
  onContinueManual: () => void;
  onOpenPrivacy: () => void;
}

export default function WelcomeScreen({
  onAcceptGps,
  onContinueManual,
  onOpenPrivacy,
}: WelcomeScreenProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-teal-500/5 rounded-full blur-[70px] pointer-events-none" />

      <main className="w-full max-w-md bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl relative z-10">
        
        {/* Animated Brand Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="h-16 w-16 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-950/40 flex items-center justify-center mb-6 relative group"
        >
          <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-lg group-hover:blur-xl transition pointer-events-none" />
          <span className="text-3xl font-extrabold text-white leading-none">+</span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            Nöbetçi<span className="text-emerald-500 font-extrabold">+</span>
          </h1>
          <p className="mt-2 text-xs font-semibold text-neutral-400 max-w-xs mx-auto leading-relaxed">
            Türkiye genelinde en yakın nöbetçi eczaneleri saniyeler içinde bulun, tek dokunuşla yol tarifi alın.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full space-y-4 mb-8"
        >
          {/* Feature 1 */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800/30">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200">En Yakın Eczaneler</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">
                GPS konumunuz kullanılarak en yakındaki 3 nöbetçi eczane anında mesafeleriyle listelenir.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800/30">
            <div className="rounded-xl bg-teal-500/10 p-2 text-teal-400 shrink-0">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200">Tek Dokunuşla Yol Tarifi</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">
                Google Haritalar, Apple Haritalar veya Yandex Navigasyon ile anında rota çizin.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800/30">
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200">KVKK & Gizlilik Garantisi</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">
                Konum koordinatlarınız sunucularımızda **asla kaydedilmez** ve üçüncü şahıslarla paylaşılmaz.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full space-y-3"
        >
          {/* Main Consent Action */}
          <button
            onClick={onAcceptGps}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black uppercase text-white transition-all duration-300 active:scale-98 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
            <span className="relative z-10 flex items-center gap-1.5">
              Konum İzni Ver ve Başla
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </button>

          {/* Manual Fallback Action */}
          <button
            onClick={onContinueManual}
            className="w-full py-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-bold uppercase text-neutral-300 transition active:scale-98 cursor-pointer"
          >
            Konum İzni Olmadan Ara (İl/İlçe Seç)
          </button>
        </motion.div>

        {/* Short Legal Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-[9px] text-neutral-500 leading-normal max-w-xs mx-auto">
            Uygulamayı kullanarak konum izinlerini başlatmış ve resmi mevzuatlara uygun olan{" "}
            <button
              onClick={onOpenPrivacy}
              className="text-emerald-500 font-bold hover:underline"
            >
              KVKK Aydınlatma Metni
            </button>{" "}
            koşullarını kabul etmiş olursunuz.
          </p>
        </motion.div>

      </main>

      {/* Brand Footer */}
      <footer className="mt-8 text-center relative z-10 pointer-events-none">
        <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
          Nöbetçi+ Güvenli Sağlık Rehberi
        </p>
      </footer>
    </div>
  );
}
