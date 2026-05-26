import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

//import { getAdminStatus } from "@/lib/auth.functions";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refreshAdminStatus(nextUser: User | null) {
    if (!nextUser) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", nextUser.id);

  console.log("ROLE DATA:", data);
  console.log("ROLE ERROR:", error);

  if (error) {
    setIsAdmin(false);
    return;
  }

  const admin = data?.some((r) => r.role === "admin");

  console.log("IS ADMIN:", admin);

  setIsAdmin(!!admin);

} catch (e) {
  console.error("ADMIN CHECK FAILED:", e);
  setIsAdmin(false);
} finally {
  setLoading(false);
}
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => {
          refreshAdminStatus(s.user);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      void refreshAdminStatus(data.session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user, isAdmin, loading };
}
