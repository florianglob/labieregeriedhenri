"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // La page login ne nécessite pas de vérification
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setReady(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) router.replace("/admin/login");
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  if (!ready) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "100vh", background: "var(--brun-dark)",
        gap: 12,
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--dore)" }}>
          La Bièregerie d&apos;Henri
        </div>
        <div style={{ fontFamily: "var(--font-script)", fontSize: 14, color: "rgba(245,241,232,0.4)", letterSpacing: "0.15em" }}>
          vérification…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
