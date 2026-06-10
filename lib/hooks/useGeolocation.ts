import { useState, useCallback } from "react";

export type GpsStatus = "idle" | "requesting" | "granted" | "denied";
export type UserCoords = { lat?: number; lng?: number };

export function useGeolocation() {
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>("idle");
  const [userCoords, setUserCoords] = useState<UserCoords>({});
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddressName = async (lat: number, lng: number) => {
    setAddressLoading(true);
    try {
      const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
      const resData = await res.json();
      if (resData.success) {
        setResolvedAddress(resData.address);
      } else {
        setResolvedAddress(null);
      }
    } catch (err) {
      console.error("Geocoding lookup failed:", err);
      setResolvedAddress(null);
    } finally {
      setAddressLoading(false);
    }
  };

  const requestLocation = useCallback(async (onSuccess?: (lat: number, lng: number) => void, onError?: () => void) => {
    if (!navigator.geolocation) {
      setGpsStatus("denied");
      setError("Tarayıcınız konum özelliğini desteklemiyor.");
      if (onError) onError();
      return;
    }

    setGpsStatus("requesting");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserCoords({ lat, lng });
        setGpsStatus("granted");
        fetchAddressName(lat, lng);
        if (onSuccess) onSuccess(lat, lng);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setGpsStatus("denied");
        if (onError) onError();
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const clearCoords = useCallback(() => {
    setUserCoords({});
  }, []);

  return {
    gpsStatus,
    setGpsStatus,
    userCoords,
    clearCoords,
    resolvedAddress,
    addressLoading,
    error,
    requestLocation
  };
}
