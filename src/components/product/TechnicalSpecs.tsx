import type { TechnicalSpecs } from "@/lib/types";

const LABELS: Record<keyof TechnicalSpecs, string> = {
  dimensions: "Boyut",
  material: "Malzeme",
  weight: "Ağırlık",
  warranty: "Garanti",
  thickness: "Kalınlık",
  finish: "Yüzey",
  fireResistance: "Yangın Dayanımı",
};

export function TechnicalSpecsTable({ specs }: { specs: TechnicalSpecs }) {
  const rows = (Object.keys(LABELS) as (keyof TechnicalSpecs)[])
    .filter((key) => specs[key])
    .map((key) => ({ label: LABELS[key], value: specs[key]! }));

  return (
    <div className="overflow-hidden border border-black/5">
      <h3 className="border-b border-black/5 bg-brand-anthracite px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
        Teknik Özellikler
      </h3>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className={i % 2 === 0 ? "bg-brand-ink/30" : "bg-transparent"}
            >
              <th className="w-1/3 px-4 py-3 text-left font-medium text-brand-mist">
                {row.label}
              </th>
              <td className="px-4 py-3 text-brand-bone">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
