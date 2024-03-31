// Follow this setup guide to integrate the Deno language server with your
// editor: https://deno.land/manual/getting_started/setup_your_environment This
// enables autocomplete, go to definition, etc. 유저가 맞는지 확인을 해서 => auth작업 디비에 투두
// 추가 => db crud 작업 supabase-client 사용(deno의 임포트 방식 -> cdn )

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.41.1";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  const { content } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader! } } },
  );

  const { data: { user } } = await supabase.auth.getUser();
  // const user = data.user;

  await supabase.from("to_do_list").insert({
    content,
    user_id: user?.id,
  });

  const response = await supabase.from("to_do_list").select().eq(
    "user_id",
    user?.id,
  ).order("id", { ascending: false }).limit(1).single();

  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, "Contetnt-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-to-do' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'
*/
