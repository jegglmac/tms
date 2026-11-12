import "server-only";
import { notFound, redirect } from "next/navigation";
import { database } from "@/lib/supabase/server";

export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function signedInDispatcher() {
  const client = await database();
  if (!client) redirect("/sign-in");
  const { data, error } = await client.auth.getClaims();
  if (error || !data?.claims.sub) redirect("/sign-in");
  return { client, userId: data.claims.sub };
}

export async function companyAccess(companyId: string) {
  const context = await signedInDispatcher();
  if (!uuidPattern.test(companyId)) notFound();
  const { data: permitted, error } = await context.client.rpc("tms_can_dispatch", { p_company: companyId });
  if (error) throw new Error("Company access could not be verified.");
  if (!permitted) notFound();
  return context;
}
