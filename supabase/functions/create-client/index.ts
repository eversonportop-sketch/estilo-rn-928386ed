import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user: caller },
      error: callerError,
    } = await anonClient.auth.getUser();
    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: consultantData, error: consultantError } = await adminClient
      .from("consultants")
      .select("id")
      .eq("profile_id", caller.id)
      .single();

    if (consultantError || !consultantData) {
      return new Response(JSON.stringify({ error: "Consultor não encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, phone, profession, objective, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "name, email e password são obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "A senha deve ter no mínimo 6 caracteres" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ✅ Verifica se email já existe em clients
    const { data: existingClient } = await adminClient.from("clients").select("id").eq("email", email).maybeSingle();

    if (existingClient) {
      return new Response(JSON.stringify({ error: "Este email já está cadastrado como cliente." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ✅ Verifica se email já existe no Auth
    const { data: authList } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    const emailJaExiste = authList?.users?.find((u) => u.email === email);
    if (emailJaExiste) {
      return new Response(JSON.stringify({ error: "Este email já está em uso." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return new Response(JSON.stringify({ error: `Erro ao criar login: ${authError.message}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = authData.user.id;

    const { data: clientData, error: clientError } = await adminClient
      .from("clients")
      .insert({
        name,
        email,
        phone: phone || null,
        profession: profession || null,
        objective: objective || null,
        user_id: userId,
        consultant_id: consultantData.id,
      })
      .select()
      .single();

    if (clientError) {
      // Rollback: remove usuário do Auth se insert falhar
      await adminClient.auth.admin.deleteUser(userId);
      return new Response(JSON.stringify({ error: `Erro ao criar cliente: ${clientError.message}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(clientData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
