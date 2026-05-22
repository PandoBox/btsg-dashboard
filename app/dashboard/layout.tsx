import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="relative flex min-h-screen">
      <div className="mesh-bg" />
      <Sidebar />
      <main className="relative z-10 flex-1 min-w-0 px-6 pb-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
