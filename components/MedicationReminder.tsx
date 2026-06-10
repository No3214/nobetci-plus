"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface Med {
  id: string;
  name: string;
  time: string;
  taken: boolean;
}

export default function MedicationReminder() {
  const [meds, setMeds] = useState<Med[]>([]);
  const [newName, setNewName] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Load from local storage
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("nobetci-meds");
    if (saved) {
      try {
        setMeds(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("nobetci-meds", JSON.stringify(meds));
    }
  }, [meds, isClient]);

  // Checker loop
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      meds.forEach(med => {
        if (med.time === currentTimeString && !med.taken) {
          // Trigger browser notification if allowed
          if (Notification.permission === "granted") {
            new Notification("İlaç Hatırlatıcısı!", {
              body: `${med.name} ilacınızı içme vaktiniz geldi. Geçmiş olsun!`,
              icon: "/icon.svg"
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                new Notification("İlaç Hatırlatıcısı Aktif", { body: "Bildirimler açıldı."});
              }
            });
          }
          
          // Fallback UI alert
          alert(`⏰ İLAÇ VAKTİ: ${med.name} ilacınızı içme saatiniz geldi!`);
          
          // Mark as taken automatically to prevent spamming
          toggleTaken(med.id);
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [meds, isClient]);

  const addMed = () => {
    if (!newName || !newTime) return;
    const newMed: Med = {
      id: Date.now().toString(),
      name: newName,
      time: newTime,
      taken: false
    };
    setMeds([...meds, newMed]);
    setNewName("");
    setNewTime("");
  };

  const removeMed = (id: string) => {
    setMeds(meds.filter(m => m.id !== id));
  };

  const toggleTaken = (id: string) => {
    setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const resetAll = () => {
    setMeds(meds.map(m => ({ ...m, taken: false })));
  };

  if (!isClient) return null;

  return (
    <div className="mb-6 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide text-xs">
          <Bell className="h-4 w-4" /> Günlük İlaç Alarmı
        </h3>
        {meds.length > 0 && (
           <button onClick={resetAll} className="text-[9px] font-bold text-neutral-500 hover:text-white transition uppercase">
             Günü Sıfırla
           </button>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <input 
          type="text" 
          placeholder="İlaç Adı (Örn: Aspirin)" 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-grow bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
        />
        <input 
          type="time" 
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="w-24 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
        />
        <button 
          onClick={addMed}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 flex items-center justify-center transition"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        {meds.length === 0 ? (
          <p className="text-[10px] text-neutral-500 italic text-center py-2">
            Henüz eklenmiş bir ilaç alarmı yok. Uygulamaya her gün girmeniz için harika bir sebep!
          </p>
        ) : (
          meds.map(med => (
            <div key={med.id} className={`flex items-center justify-between rounded-xl border p-2.5 transition ${
              med.taken ? "bg-emerald-500/10 border-emerald-500/20 opacity-60" : "bg-neutral-950/50 border-neutral-800"
            }`}>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleTaken(med.id)}
                  className={`h-5 w-5 rounded-full flex items-center justify-center transition ${
                    med.taken ? "bg-emerald-500 text-white" : "bg-neutral-800 border border-neutral-600"
                  }`}
                >
                  {med.taken && <CheckCircle2 className="h-3 w-3" />}
                </button>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold ${med.taken ? "line-through text-neutral-400" : "text-white"}`}>
                    {med.name}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500">{med.time}</span>
                </div>
              </div>
              <button 
                onClick={() => removeMed(med.id)}
                className="text-neutral-600 hover:text-red-400 transition p-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
