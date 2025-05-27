"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else setSession(true);
      setLoading(false);
    });
  }, [router, supabase]);

  if (loading) return <p>Verificando autenticação…</p>;
  if (!session) return null;
  return <>{children}</>;
}
