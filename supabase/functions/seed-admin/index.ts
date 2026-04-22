import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "admin@ride.app";
const ADMIN_PASSWORD = "Admin123!";
const ADMIN_NAME = "Admin";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check if any admin already exists
    const { data: existing } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({
          ok: true,
          message: "Admin already exists",
          email: ADMIN_EMAIL,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Create admin user
    const { data: created, error: createErr } =
      await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { name: ADMIN_NAME, role: "user" },
      });

    if (createErr || !created.user) {
      return new Response(
        JSON.stringify({ ok: false, error: createErr?.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Replace default 'user' role with 'admin'
    await supabase.from("user_roles").delete().eq("user_id", created.user.id);
    await supabase
      .from("user_roles")
      .insert({ user_id: created.user.id, role: "admin" });

    return new Response(
      JSON.stringify({
        ok: true,
        message: "Admin seeded",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: (e as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
