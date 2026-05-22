"use client";
import { ReactNode } from "react";
import GlassCard from "./GlassCard";
import { deltaClass, deltaSign } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  sub?: string;
  delta?: number;       // % change
  icon?: ReactNode;
  delay?: number;
  accent?: string;
}

export default function KpiCard({ label, value, sub, delta, icon, delay = 0, accent }: Props) {
  return (
    <GlassCard delay={delay} className="glass-hover flex flex-col gap-3 min-w-0">
      <div className="flex items-start justify-between">
        <span className="text-label">{label}</span>
        {icon && (
          <span
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: accent ? `${accent}22` : "rgba(94,234,212,0.12)", color: accent ?? "#5EEAD4" }}
          >
            {icon}
          </span>
        )}
      </div>

      <div>
        <div className="text-value">{value}</div>
        {sub && <div className="mt-1 text-xs text-white/40">{sub}</div>}
      </div>

      {delta !== undefined && (
        <div className={`text-xs font-medium ${deltaClass(delta)}`}>
          {deltaSign(delta)}{delta.toFixed(1)}% vs prior period
        </div>
      )}
    </GlassCard>
  );
}
