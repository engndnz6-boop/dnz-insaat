import { Building2, DoorOpen, Grid3x3, Hammer, PaintRoller, Zap } from "lucide-react";
import type { Service } from "@/lib/services";

const MAP = { building: Building2, hammer: Hammer, grid: Grid3x3, zap: Zap, roller: PaintRoller, door: DoorOpen };

export function ServiceIcon({ name, className }: { name: Service["icon"]; className?: string }) {
  const Icon = MAP[name];
  return <Icon className={className} aria-hidden />;
}
