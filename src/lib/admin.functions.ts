import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const ROLE_VALUES = [
  "admin",
  "editor",
  "reporter",
  "contributor",
  "author",
  "subscriber",
] as const;
export type RoleValue = (typeof ROLE_VALUES)[number];

const roleSchema = z.enum(ROLE_VALUES);

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const adminCreateUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().min(6).max(200),
        displayName: z.string().min(1).max(120).optional(),
        roles: z.array(roleSchema).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: data.displayName ? { display_name: data.displayName } : undefined,
    });
    if (error || !created.user) throw new Error(error?.message || "Failed to create user");

    if (data.displayName) {
      await supabaseAdmin
        .from("profiles")
        .upsert({ id: created.user.id, email: data.email, display_name: data.displayName });
    }

    const roles = data.roles && data.roles.length > 0 ? data.roles : [];
    if (roles.length > 0) {
      const rows = roles.map((role) => ({ user_id: created.user!.id, role }));
      const { error: roleErr } = await supabaseAdmin.from("user_roles").insert(rows);
      if (roleErr && !roleErr.message.includes("duplicate")) throw new Error(roleErr.message);
    }

    return { userId: created.user.id, email: created.user.email };
  });

export const adminGrantRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ userId: z.string().uuid(), role: roleSchema }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    return { ok: true };
  });

export const adminRevokeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ userId: z.string().uuid(), role: roleSchema }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", data.role);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
