import { createClient } from "https://esm.sh/@supabase/supabase-js@2.41.1";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  const { toDoId } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader! } } },
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { data: existToDoData } = await supabase.from("to_do_list").select().eq(
    "id",
    toDoId,
  ).single();

  if (user?.id !== existToDoData.user_id) {
    return new Response(JSON.stringify({ message: "Wrong user." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  const deleteResponse = await supabase.from("to_do_list").delete().eq(
    "id",
    toDoId,
  );

  return new Response(JSON.stringify(deleteResponse), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
