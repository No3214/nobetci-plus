"use client";

import { useState, useEffect } from "react";
import { Mic, Loader2 } from "lucide-react";

interface SpeechRecognitionResult {
  [index: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: SpeechRecognitionResult;
  };
}

interface SpeechRecognitionError {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionError) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
      };
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "tr-TR";

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const transcriptResult = event.results[current][0].transcript;
          setTranscript(transcriptResult);
          
          // Very simple fake NLP logic
          setTimeout(() => {
            alert(`Sesli Komut Algılandı: "${transcriptResult}"\n\nBu özellik yakında yapay zeka ile eczane stoklarına doğrudan bağlanacaktır!`);
            setTranscript("");
          }, 500);
        };

        recognition.onerror = (event: SpeechRecognitionError) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        const frameId = requestAnimationFrame(() => {
          setSpeechRecognition(recognition);
        });
        return () => cancelAnimationFrame(frameId);
      } else {
        const frameId = requestAnimationFrame(() => {
          setIsSupported(false);
        });
        return () => cancelAnimationFrame(frameId);
      }
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      speechRecognition?.stop();
    } else {
      speechRecognition?.start();
    }
  };

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {transcript && (
        <div className="bg-neutral-900 border border-neutral-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
          &quot;{transcript}&quot;
        </div>
      )}
      <button
        onClick={toggleListen}
        className={`h-14 w-14 rounded-full flex items-center justify-center shadow-emerald-900/50 shadow-2xl transition-all ${
          isListening 
            ? "bg-red-500 hover:bg-red-600 animate-pulse" 
            : "bg-emerald-600 hover:bg-emerald-500 hover:scale-105"
        }`}
      >
        {isListening ? (
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  );
}
