"use client";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  delay?: number;
}

export default function GlassCard({ children, className = "", glow = false, delay = 0 }: Props) {
  return (
    <div
      className={`glass specular relative rounded-2xl p-5 fade-up ${glow ? "shadow-glow-mint" : ""} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
