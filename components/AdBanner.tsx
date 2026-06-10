"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";

interface AdBannerProps {
  slot: string;
  className?: string;
}

export default function AdBanner({ slot, className = "" }: AdBannerProps) {
  const [adSenseClient, setAdSenseClient] = useState<string | null>(null);

  useEffect(() => {
    // Read the AdSense client ID from environment variables
    const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    if (client) {
      setAdSenseClient(client);
      try {
        // Push ad to Google AdSense array
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense push error:", err);
      }
    }
  }, []);

  if (adSenseClient) {
    return (
      <div className={`overflow-hidden rounded-2xl bg-neutral-900/60 p-2 text-center border border-neutral-800 ${className}`}>
        <span className="block text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-1.5">
          Reklam
        </span>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adSenseClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Premium Sponsorship Fallback Placeholder
  return (
    <div className={`overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800/80 p-5 text-center flex flex-col items-center justify-center relative ${className}`}>
      <span className="absolute top-0 right-0 rounded-bl-2xl bg-neutral-800 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-neutral-500">
        Sponsorluk / Reklam
      </span>
      <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
        <Info className="h-5 w-5" />
      </div>
      <h4 className="text-xs font-bold text-neutral-200">Buraya Reklam Verebilirsiniz</h4>
      <p className="text-[10px] text-neutral-500 mt-1 max-w-xs leading-normal">
        Nöbetçi+ platformunda yer alarak markanızı saniyeler içinde binlerce acil kullanıcıya ulaştırın.
      </p>
      <a
        href="mailto:sponsor@nobetciplus.com"
        className="mt-3.5 inline-flex items-center gap-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 px-3.5 py-1.5 text-[10px] font-bold text-emerald-400 transition"
      >
        İletişime Geç: sponsor@nobetciplus.com
      </a>
    </div>
  );
}
