"use client";

import { useEffect, useState } from "react";
import WelcomeScreen from "./WelcomeScreen";
import KvkkModal from "./KvkkModal";

interface OnboardingFlowProps {
  onComplete: (useGps: boolean) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [consentGranted, setConsentGranted] = useState<boolean | null>(null);
  const [isKvkkOpen, setIsKvkkOpen] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const consent = localStorage.getItem("nobetci-kvkk-consent");
      if (consent === "true") {
        setConsentGranted(true);
        onComplete(true); // Default to attempting GPS if already consented
      } else {
        setConsentGranted(false);
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  const handleAcceptGps = () => {
    localStorage.setItem("nobetci-kvkk-consent", "true");
    setConsentGranted(true);
    onComplete(true);
  };

  const handleContinueManual = () => {
    localStorage.setItem("nobetci-kvkk-consent", "true");
    setConsentGranted(true);
    onComplete(false);
  };

  if (consentGranted === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-800 border-t-emerald-500" />
      </div>
    );
  }

  if (consentGranted === false) {
    return (
      <>
        <WelcomeScreen
          onAcceptGps={handleAcceptGps}
          onContinueManual={handleContinueManual}
          onOpenPrivacy={() => setIsKvkkOpen(true)}
        />
        <KvkkModal isOpen={isKvkkOpen} onClose={() => setIsKvkkOpen(false)} />
      </>
    );
  }

  return null;
}
