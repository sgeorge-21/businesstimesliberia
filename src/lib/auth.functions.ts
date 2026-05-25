import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
  console.log("FULL CONTEXT:", context)

  const userId =
    context.userId ||
    context.user?.id ||
    context.auth?.user?.id

  console.log("RESOLVED USER ID:", userId)

  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle()

  console.log("QUERY DATA:", data)
  console.log("QUERY ERROR:", error)

  if (error) {
    throw new Error(error.message)
  }

  return {
    isAdmin: !!data,
  }
})
