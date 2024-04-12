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

  const { data: updatedToDoData } = await supabase.from("to_do_list").update({
    isdone: !existToDoData.isdone,
  }).eq("id", toDoId).select()
    .single();

  return new Response(JSON.stringify(updatedToDoData), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
