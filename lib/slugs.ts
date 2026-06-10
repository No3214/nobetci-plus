const trMap: Record<string, string> = {
  "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
  "Ç": "c", "Ğ": "g", "İ": "i", "Ö": "o", "Ş": "s", "Ü": "u",
};

export function toSlug(text: string): string {
  if (!text) return "";
  
  let slug = text.trim();
  
  // Replace Turkish characters
  slug = slug.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => trMap[match] || match);
  
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-"); // Remove consecutive dashes
}

export function fromSlug(slug: string): string {
  // Simple fromSlug won't perfectly restore Turkish chars without a dictionary,
  // but we can replace dashes with spaces and capitalize words.
  if (!slug) return "";
  
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function normalizeTurkishText(text: string): string {
  if (!text) return "";
  return text.toLocaleLowerCase("tr-TR").trim();
}
