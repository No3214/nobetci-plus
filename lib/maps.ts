export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function getAppleMapsUrl(lat: number, lng: number): string {
  return `http://maps.apple.com/?daddr=${lat},${lng}`;
}

export function getYandexMapsUrl(lat: number, lng: number): string {
  return `https://yandex.com/maps/?rtext=~${lat},${lng}&rtt=auto`;
}
