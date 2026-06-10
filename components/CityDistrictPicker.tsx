"use client";

import { useState } from "react";
import citiesData from "@/data/tr-cities-districts.json";
import { Search, Map } from "lucide-react";

interface CityDistrictPickerProps {
  onSelect: (city: string, district: string) => void;
  defaultCity?: string;
  defaultDistrict?: string;
}

export default function CityDistrictPicker({
  onSelect,
  defaultCity = "",
  defaultDistrict = ""
}: CityDistrictPickerProps) {
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);
  const [districts, setDistricts] = useState<string[]>(() => {
    if (defaultCity) {
      const cityData = citiesData.find((c) => c.city === defaultCity);
      return cityData ? cityData.districts : [];
    }
    return [];
  });

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const cityData = citiesData.find((c) => c.city === city);
    if (cityData) {
      setDistricts(cityData.districts);
      setSelectedDistrict("");
    } else {
      setDistricts([]);
      setSelectedDistrict("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCity && selectedDistrict) {
      onSelect(selectedCity, selectedDistrict);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-neutral-900 border border-neutral-800 p-5 shadow-lg">
      <h3 className="text-sm font-bold text-neutral-100 mb-3 flex items-center gap-2">
        <Map className="h-4 w-4 text-emerald-400" /> Veya İl/İlçe Seçin
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* City Select */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
            İl Seçin
          </label>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full rounded-2xl border border-neutral-800 bg-neutral-800/60 p-3.5 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 transition"
          >
            <option value="" disabled className="text-neutral-500">
              İl seçin...
            </option>
            {citiesData.map((city) => (
              <option key={city.city} value={city.city} className="bg-neutral-900">
                {city.city}
              </option>
            ))}
          </select>
        </div>

        {/* District Select */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
            İlçe Seçin
          </label>
          <select
            value={selectedDistrict}
            disabled={!selectedCity}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full rounded-2xl border border-neutral-800 bg-neutral-800/60 p-3.5 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled className="text-neutral-500">
              İlçe seçin...
            </option>
            {districts.map((district) => (
              <option key={district} value={district} className="bg-neutral-900">
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!selectedCity || !selectedDistrict}
        className="mt-4 w-full rounded-2xl bg-emerald-600/90 py-3.5 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Search className="h-4 w-4" /> Eczaneleri Listele
      </button>
    </form>
  );
}
