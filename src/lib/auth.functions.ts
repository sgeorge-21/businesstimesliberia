import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getAdminStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    const userId = "d66bf593-89bc-4ad6-b02b-5e5981d6c56a";

    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    return {
      isAdmin: !!data,
    };
  });
