"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Tag, Users, Lightbulb, Table2, LogOut
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard",              label: "Overview",     icon: LayoutDashboard },
  { href: "/dashboard/categories",   label: "Categories",   icon: Tag },
  { href: "/dashboard/vendors",      label: "Vendors",      icon: Users },
  { href: "/dashboard/optimization", label: "Optimization", icon: Lightbulb },
  { href: "/dashboard/explorer",     label: "Explorer",     icon: Table2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="flex flex-col w-56 shrink-0 h-screen sticky top-0 pt-6 pb-4 px-3 z-20">
      {/* Logo */}
      <div className="px-3 mb-8">
        <div className="text-xs text-label mb-0.5">BTSG Group</div>
        <div className="text-base font-semibold tracking-tight text-white">Spending Intelligence</div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const exact = href === "/dashboard";
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link ${active ? "nav-active" : ""}`}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="nav-link w-full text-left hover:text-rose-400 hover:bg-rose-500/10 mt-2"
      >
        <LogOut size={16} strokeWidth={1.8} />
        Sign out
      </button>
    </aside>
  );
}
