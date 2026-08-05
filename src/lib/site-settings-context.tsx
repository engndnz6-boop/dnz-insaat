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
import {
  DEFAULT_SITE_SETTINGS,
  normalizeSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";

type SiteSettingsContextValue = {
  settings: SiteSettings;
  ready: boolean;
  source: "onedrive" | "local" | "default";
  saveSettings: (next: SiteSettings) => Promise<void>;
};

const STORAGE_KEY = "dnz-site-settings-v1";
const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(
  null
);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<"onedrive" | "local" | "default">(
    "default"
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/site-settings", { cache: "no-store" });
        const data = (await res.json()) as {
          settings?: SiteSettings;
          source?: string;
        };
        if (!cancelled && data.settings) {
          const normalized = normalizeSiteSettings(data.settings);
          setSettings(normalized);
          setSource(data.source === "onedrive" ? "onedrive" : "default");
          setReady(true);
          return;
        }
      } catch {
        /* fall through */
      }

      if (cancelled) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as SiteSettings;
          setSettings(normalizeSiteSettings(parsed));
          setSource("local");
          setReady(true);
          return;
        }
      } catch {
        /* ignore */
      }
      if (!cancelled) {
        setSettings(DEFAULT_SITE_SETTINGS);
        setSource("default");
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, ready]);

  const saveSettings = useCallback(async (next: SiteSettings) => {
    const normalized = normalizeSiteSettings(next);
    setSettings(normalized);
    try {
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      if (res.ok) setSource("onedrive");
    } catch {
      /* local fallback already set */
    }
  }, []);

  const value = useMemo(
    () => ({ settings, ready, source, saveSettings }),
    [settings, ready, source, saveSettings]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }
  return ctx;
}
