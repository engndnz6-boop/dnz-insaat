"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ImalatSystem } from "./engine";
import { seedImalat } from "./systems";

interface ImalatContextValue {
  systems: ImalatSystem[];
  ready: boolean;
  source: "onedrive" | "seed";
  /** Tüm listeyi OneDrive’a kaydeder (admin) */
  save: (next: ImalatSystem[]) => Promise<{ ok: boolean; error?: string }>;
}

const ImalatContext = createContext<ImalatContextValue | null>(null);

export function ImalatProvider({ children }: { children: ReactNode }) {
  const [systems, setSystems] = useState<ImalatSystem[]>(seedImalat);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<"onedrive" | "seed">("seed");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/imalat", { cache: "no-store" });
        const data = (await res.json()) as { source?: string; systems?: ImalatSystem[] };
        if (!cancelled && data.source === "onedrive" && Array.isArray(data.systems) && data.systems.length) {
          setSystems(data.systems);
          setSource("onedrive");
        }
      } catch {
        /* varsayılan sistemlerle devam */
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async (next: ImalatSystem[]) => {
    try {
      const res = await fetch("/api/imalat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systems: next }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        return { ok: false, error: d.error || "Kaydedilemedi." };
      }
      setSystems(next);
      setSource("onedrive");
      return { ok: true };
    } catch {
      return { ok: false, error: "OneDrive’a bağlanılamadı." };
    }
  }, []);

  const value = useMemo(() => ({ systems, ready, source, save }), [systems, ready, source, save]);
  return <ImalatContext.Provider value={value}>{children}</ImalatContext.Provider>;
}

export function useImalat() {
  const ctx = useContext(ImalatContext);
  if (!ctx) throw new Error("useImalat must be used within ImalatProvider");
  return ctx;
}
