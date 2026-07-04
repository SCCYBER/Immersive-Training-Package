import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function cleanId(value: unknown) {
  return String(value || "").trim();
}

async function requireAdmin(req: Request, supabaseUrl: string, anonKey: string, serviceRoleKey: string) {
  const authHeader = req.headers.get("Authorization") || "";
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const callerResult = await userClient.auth.getUser();
  const caller = callerResult.data.user;

  if (!caller) {
    return { adminClient, caller: null, error: jsonResponse({ error: "Not authenticated." }, 401) };
  }

  const profileResult = await adminClient
    .from("profiles")
    .select("username,is_admin")
    .eq("id", caller.id)
    .single();

  if (!profileResult.data || profileResult.data.is_admin !== true) {
    return { adminClient, caller, error: jsonResponse({ error: "Admin access required." }, 403) };
  }

  return { adminClient, caller, adminProfile: profileResult.data, error: null };
}

async function writeAudit(adminClient: any, caller: any, action: string, targetType: string, targetId: string, details: Record<string, unknown>) {
  try {
    await adminClient.from("admin_audit_logs").insert({
      admin_user_id: caller.id,
      admin_username: caller.email || "admin",
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      created_at: new Date().toISOString(),
    });
  } catch (_e) {}
}

async function deleteAuthUsers(adminClient: any, userIds: string[]) {
  let deleted = 0;
  const errors: string[] = [];

  for (const userId of Array.from(new Set(userIds.filter(Boolean)))) {
    const result = await adminClient.auth.admin.deleteUser(userId);
    if (result.error) {
      errors.push(result.error.message);
    } else {
      deleted++;
    }
  }

  return { deleted, errors };
}

async function deleteLearner(adminClient: any, caller: any, id: string) {
  const learnerResult = await adminClient
    .from("learners")
    .select("id,username,user_id,organisation_id")
    .eq("id", id)
    .maybeSingle();

  if (!learnerResult.data) {
    return jsonResponse({ error: "Learner record not found." }, 404);
  }

  const learner = learnerResult.data;
  const userIds = learner.user_id ? [learner.user_id] : [];

  await adminClient.from("learners").update({ active: false }).eq("id", learner.id);

  if (learner.user_id) {
    await adminClient.from("profiles").update({ premium_enabled: false }).eq("id", learner.user_id);
    await adminClient.from("attempts").delete().eq("user_id", learner.user_id);
    await adminClient.from("profiles").delete().eq("id", learner.user_id);
  }

  const learnerDelete = await adminClient.from("learners").delete().eq("id", learner.id);
  if (learnerDelete.error) {
    return jsonResponse({ error: learnerDelete.error.message }, 400);
  }

  const authDelete = await deleteAuthUsers(adminClient, userIds);

  await writeAudit(adminClient, caller, "learner_delete", "learner", id, {
    username: learner.username,
    user_id: learner.user_id,
    organisation_id: learner.organisation_id,
    auth_delete_errors: authDelete.errors,
  });

  return jsonResponse({
    success: true,
    target_type: "learner",
    id,
    username: learner.username,
    learners_deleted: 1,
    auth_users_deleted: authDelete.deleted,
    auth_delete_errors: authDelete.errors,
  });
}

async function deleteCompany(adminClient: any, caller: any, id: string) {
  const orgResult = await adminClient
    .from("organisations")
    .select("id,name")
    .eq("id", id)
    .maybeSingle();

  if (!orgResult.data) {
    return jsonResponse({ error: "Company record not found." }, 404);
  }

  const learnerResult = await adminClient
    .from("learners")
    .select("id,username,user_id")
    .eq("organisation_id", id);

  if (learnerResult.error) {
    return jsonResponse({ error: learnerResult.error.message }, 400);
  }

  const learners = learnerResult.data || [];
  const userIds = learners.map((learner: any) => learner.user_id).filter(Boolean);

  await adminClient
    .from("organisations")
    .update({ premium_enabled: false, licence_count: 0, billing_status: "removed" })
    .eq("id", id);

  await adminClient.from("learners").update({ active: false }).eq("organisation_id", id);

  if (userIds.length > 0) {
    await adminClient.from("profiles").update({ premium_enabled: false }).in("id", userIds);
    await adminClient.from("attempts").delete().in("user_id", userIds);
    await adminClient.from("profiles").delete().in("id", userIds);
  }

  const learnerDelete = await adminClient.from("learners").delete().eq("organisation_id", id);
  if (learnerDelete.error) {
    return jsonResponse({ error: learnerDelete.error.message }, 400);
  }

  const orgDelete = await adminClient.from("organisations").delete().eq("id", id);
  if (orgDelete.error) {
    return jsonResponse({ error: orgDelete.error.message }, 400);
  }

  const authDelete = await deleteAuthUsers(adminClient, userIds);

  await writeAudit(adminClient, caller, "company_delete", "organisation", id, {
    name: orgResult.data.name,
    learner_count: learners.length,
    user_ids: userIds,
    auth_delete_errors: authDelete.errors,
  });

  return jsonResponse({
    success: true,
    target_type: "company",
    id,
    name: orgResult.data.name,
    learners_deleted: learners.length,
    auth_users_deleted: authDelete.deleted,
    auth_delete_errors: authDelete.errors,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: "Server configuration missing." }, 500);
  }

  const auth = await requireAdmin(req, supabaseUrl, anonKey, serviceRoleKey);
  if (auth.error) return auth.error;

  const body = await req.json();
  const targetType = String(body.target_type || body.type || "").trim().toLowerCase();
  const id = cleanId(body.id);

  if (!id) {
    return jsonResponse({ error: "Record id required." }, 400);
  }

  if (targetType === "learner") {
    return await deleteLearner(auth.adminClient, auth.caller, id);
  }

  if (targetType === "company" || targetType === "organisation") {
    return await deleteCompany(auth.adminClient, auth.caller, id);
  }

  return jsonResponse({ error: "Unknown delete target." }, 400);
});
