"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const router  = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="mesh-bg" />

      <div className="relative z-10 w-full max-w-sm fade-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
               style={{ background: "rgba(94,234,212,0.12)", border: "1px solid rgba(94,234,212,0.2)" }}>
            <TrendingUp size={22} className="text-mint" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">BTSG Spending Intelligence</h1>
          <p className="mt-1 text-sm text-white/40">Sign in to access your dashboard</p>
        </div>

        {/* Card */}
        <div className="glass specular rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-label">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@btsg.com"
                className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-white/25 outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 px-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl py-2.5 text-sm font-semibold text-base transition-all disabled:opacity-50"
              style={{
                background: loading ? "rgba(94,234,212,0.2)" : "#5EEAD4",
                color: "#0A0B14",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
