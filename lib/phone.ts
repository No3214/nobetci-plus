export function normalizePhone(phone: string): string {
  // Extract all digits
  let clean = phone.replace(/\D/g, "");

  // If phone starts with 90, it's already got the country code.
  // In Turkey, local format is 05xx xxx xx xx or 5xx xxx xx xx.
  if (clean.length === 11 && clean.startsWith("0")) {
    clean = clean.slice(1);
  }

  if (!clean.startsWith("90")) {
    clean = `90${clean}`;
  }

  return clean;
}

export function getPhoneUrl(phone: string): string {
  const normalized = normalizePhone(phone);
  return `tel:+${normalized}`;
}

export function getWhatsappUrl(phone: string): string {
  const number = normalizePhone(phone);
  const text = encodeURIComponent(
    "Merhaba, nöbetçi eczane misiniz? Konumunuzu teyit etmek istiyorum."
  );
  return `https://wa.me/${number}?text=${text}`;
}
