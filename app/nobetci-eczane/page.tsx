import Link from "next/link";
import citiesData from "@/data/tr-cities-districts.json";
import { toSlug } from "@/lib/slugs";

export const metadata = {
  title: "Türkiye Nöbetçi Eczaneleri | Eczane+",
  description: "Türkiye geneli en güncel nöbetçi eczaneler listesi. İl ve ilçe seçerek size en yakın nöbetçi eczaneyi hemen bulun.",
};

export default function TurkeyPharmaciesPage() {
  return (
    <div className="flex flex-col items-center bg-background px-4 pb-12 pt-6 font-sans flex-grow">
      <main className="w-full max-w-md">
        <h1 className="text-2xl font-black text-emerald-400 mb-2">Türkiye Nöbetçi Eczaneleri</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Şehrinizi seçerek anlık güncellenen nöbetçi eczane listesine ulaşabilirsiniz.
        </p>

        <div className="space-y-2">
          {citiesData.map((data) => (
            <Link 
              key={data.city} 
              href={`/${toSlug(data.city)}/nobetci-eczane`}
              className="block p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition-colors"
            >
              <h2 className="text-lg font-bold text-neutral-200">{data.city} Nöbetçi Eczaneleri</h2>
              <p className="text-xs text-neutral-500">{data.districts.length} ilçe</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
