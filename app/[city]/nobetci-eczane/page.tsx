import { Metadata } from "next";
import { fromSlug } from "@/lib/slugs";
import citiesData from "@/data/tr-cities-districts.json";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = fromSlug(city);
  return {
    title: `${cityName} Nöbetçi Eczaneleri | Eczane+`,
    description: `${cityName} ilindeki tüm nöbetçi eczaneler. En yakın ${cityName} nöbetçi eczane adres ve telefon bilgileri.`,
  };
}

export default async function CityPharmaciesPage({ params }: Props) {
  const { city } = await params;
  const cityName = fromSlug(city);
  const cityData = citiesData.find(c => c.city.toLowerCase() === cityName.toLowerCase());

  return (
    <div className="flex flex-col items-center bg-background px-4 pb-12 pt-6 font-sans flex-grow">
      <main className="w-full max-w-md">
        <Link href="/nobetci-eczane" className="text-emerald-500 text-xs font-bold mb-4 flex items-center gap-1 hover:underline">
          <ChevronLeft className="h-4 w-4" /> Tüm Şehirler
        </Link>
        <h1 className="text-2xl font-black text-emerald-400 mb-2">{cityName} Nöbetçi Eczaneleri</h1>
        <p className="text-sm text-neutral-400 mb-6">
          {cityName} ilindeki nöbetçi eczaneleri görmek için aşağıdaki formdan ilçe seçebilir veya doğrudan konum izni vererek anasayfada en yakın eczaneleri bulabilirsiniz.
        </p>

        <div className="mb-6">
          {/* We use a client component here but since this is a server component, we need to handle routing. For now we just show a static message or a client-side wrapper. */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
             <p className="text-xs text-neutral-300">
                Aramaya başlamak için <Link href="/" className="text-emerald-400 underline">anasayfaya</Link> dönün.
             </p>
          </div>
        </div>

        {cityData && (
          <div>
            <h3 className="text-sm font-bold text-neutral-500 mb-3 uppercase tracking-wider">{cityName} İlçeleri</h3>
            <div className="flex flex-wrap gap-2">
              {cityData.districts.map(district => (
                <span key={district} className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
                  {district}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
