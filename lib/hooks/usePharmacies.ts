import { useState, useCallback } from "react";
import { Pharmacy } from "@/types/pharmacy";

export function usePharmacies() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPharmacies = useCallback(async (lat?: number, lng?: number, city?: string, district?: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/pharmacies?";
      if (lat !== undefined && lng !== undefined) {
        url += `lat=${lat}&lng=${lng}`;
      } else if (city && district) {
        url += `city=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}`;
      }

      const res = await fetch(url);
      const resData = await res.json();

      if (resData.success) {
        setPharmacies(resData.data);
      } else {
        setError(resData.error || "Eczaneler çekilemedi.");
      }
    } catch (err) {
      console.error("Fetch pharmacies error:", err);
      setError("İnternet bağlantı hatası. Eczane bilgileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pharmacies,
    loading,
    error,
    fetchPharmacies
  };
}
