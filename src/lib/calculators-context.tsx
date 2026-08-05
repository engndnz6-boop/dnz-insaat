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
  createMaterialId,
  createSystemId,
  seedCalculators,
  type CalculatorMaterial,
  type CalculatorSystem,
} from "@/lib/calculators";

const STORAGE_KEY = "dnz-insaat-calculators-v3";

interface CalculatorsContextValue {
  systems: CalculatorSystem[];
  ready: boolean;
  getSystem: (id: string) => CalculatorSystem | undefined;
  addSystem: (title: string, description?: string) => CalculatorSystem;
  updateSystem: (system: CalculatorSystem) => void;
  deleteSystem: (id: string) => void;
  addMaterial: (systemId: string, material?: Partial<CalculatorMaterial>) => void;
  updateMaterial: (
    systemId: string,
    materialId: string,
    patch: Partial<CalculatorMaterial>
  ) => void;
  deleteMaterial: (systemId: string, materialId: string) => void;
  resetToSeed: () => void;
}

const CalculatorsContext = createContext<CalculatorsContextValue | null>(null);

export function CalculatorsProvider({ children }: { children: ReactNode }) {
  const [systems, setSystems] = useState<CalculatorSystem[]>(seedCalculators);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CalculatorSystem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSystems(parsed);
        }
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(systems));
  }, [systems, ready]);

  const getSystem = useCallback(
    (id: string) => systems.find((s) => s.id === id),
    [systems]
  );

  const addSystem = useCallback((title: string, description = "") => {
    const system: CalculatorSystem = {
      id: createSystemId(title),
      title: title.trim() || "Yeni sistem",
      description,
      materials: [
        {
          id: createMaterialId(),
          name: "Yeni malzeme",
          unit: "m²",
          ratePerM2: 1,
          unitPrice: 0,
          roundMode: "round",
        },
      ],
    };
    setSystems((prev) => [...prev, system]);
    return system;
  }, []);

  const updateSystem = useCallback((system: CalculatorSystem) => {
    setSystems((prev) => prev.map((s) => (s.id === system.id ? system : s)));
  }, []);

  const deleteSystem = useCallback((id: string) => {
    setSystems((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addMaterial = useCallback(
    (systemId: string, material?: Partial<CalculatorMaterial>) => {
      const next: CalculatorMaterial = {
        id: createMaterialId(),
        name: material?.name || "Yeni malzeme",
        unit: material?.unit || "m²",
        ratePerM2: material?.ratePerM2 ?? 1,
        unitPrice: material?.unitPrice ?? 0,
        roundMode: material?.roundMode || "round",
        pieceWidthCm: material?.pieceWidthCm,
        pieceHeightCm: material?.pieceHeightCm,
        pieceLengthM: material?.pieceLengthM,
      };
      setSystems((prev) =>
        prev.map((s) =>
          s.id === systemId ? { ...s, materials: [...s.materials, next] } : s
        )
      );
    },
    []
  );

  const updateMaterial = useCallback(
    (
      systemId: string,
      materialId: string,
      patch: Partial<CalculatorMaterial>
    ) => {
      setSystems((prev) =>
        prev.map((s) => {
          if (s.id !== systemId) return s;
          return {
            ...s,
            materials: s.materials.map((m) =>
              m.id === materialId ? { ...m, ...patch } : m
            ),
          };
        })
      );
    },
    []
  );

  const deleteMaterial = useCallback((systemId: string, materialId: string) => {
    setSystems((prev) =>
      prev.map((s) =>
        s.id === systemId
          ? { ...s, materials: s.materials.filter((m) => m.id !== materialId) }
          : s
      )
    );
  }, []);

  const resetToSeed = useCallback(() => {
    setSystems(seedCalculators);
  }, []);

  const value = useMemo(
    () => ({
      systems,
      ready,
      getSystem,
      addSystem,
      updateSystem,
      deleteSystem,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      resetToSeed,
    }),
    [
      systems,
      ready,
      getSystem,
      addSystem,
      updateSystem,
      deleteSystem,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      resetToSeed,
    ]
  );

  return (
    <CalculatorsContext.Provider value={value}>
      {children}
    </CalculatorsContext.Provider>
  );
}

export function useCalculators() {
  const ctx = useContext(CalculatorsContext);
  if (!ctx) {
    throw new Error("useCalculators must be used within CalculatorsProvider");
  }
  return ctx;
}
