"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Car, ShieldAlert } from "lucide-react";

interface GraphPanelProps {
  reportsCount: number;
  activeUsers?: number;
  uberClicks?: number;
}

export default function GraphPanel({ reportsCount, activeUsers = 124, uberClicks = 42 }: GraphPanelProps) {
  // Progress calculations
  const safetyScore = Math.max(0, 100 - (reportsCount * 5));
  const conversionRate = Math.min(100, Math.round((uberClicks / activeUsers) * 100)) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      
      {/* Widget 1: System Safety & Reports */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm font-bold text-neutral-400">Sistem Sağlığı</h3>
            <p className="text-3xl font-black text-white mt-1">%{safetyScore}</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-neutral-500 font-semibold">
            <span>Hatalı Konum Bildirimleri</span>
            <span className="text-amber-400">{reportsCount} Adet</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full" 
              style={{ width: `${safetyScore}%` }} 
            />
          </div>
        </div>
      </motion.div>

      {/* Widget 2: Monetization (Uber / BiTaksi) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm font-bold text-neutral-400">Taksi (Affiliate) Yönlendirmesi</h3>
            <p className="text-3xl font-black text-white mt-1">{uberClicks}</p>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
            <Car className="h-6 w-6" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-neutral-500 font-semibold">
            <span>Dönüşüm Oranı (Conversion)</span>
            <span className="text-amber-400">%{conversionRate}</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-amber-500 h-2 rounded-full" 
              style={{ width: `${conversionRate}%` }} 
            />
          </div>
        </div>
      </motion.div>

      {/* Widget 3: Traffic & User Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm font-bold text-neutral-400">Günlük Aktif Kullanıcı</h3>
            <p className="text-3xl font-black text-white mt-1">{activeUsers}</p>
          </div>
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
            <Users className="h-6 w-6" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-auto">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold text-neutral-500">(Demo Veri)</span>
        </div>
      </motion.div>

    </div>
  );
}
