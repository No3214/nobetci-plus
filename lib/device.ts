export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIPhoneOrIPad = /iphone|ipad|ipod/.test(userAgent);
  
  // Also check for modern iPads which masquerade as Macintosh
  const isMacWithTouch = window.navigator.maxTouchPoints > 0 && /macintosh/.test(userAgent);
  
  return isIPhoneOrIPad || isMacWithTouch;
}
