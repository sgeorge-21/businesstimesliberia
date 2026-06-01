import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
  const userId = context.userId;

   const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
   .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

   console.log("SERVER DATA:", data);
  console.log("SERVER ERROR:", error);

  if (error) {
    throw new Error(error.message);
  }

  return { isAdmin: Boolean(data) };
});
