import "server-only";
import { notFound, redirect } from "next/navigation";
import { database } from "@/lib/supabase/server";
import { DispatcherSessionUnavailable, isInvalidSession, isMissingSession, isRestTokenRejection, logAuthorizationFailure } from "./authorization-diagnostics";

export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function signedInDispatcher() {
  const started = performance.now();
  const client = await database();
  if (!client) {
    logAuthorizationFailure("session", started, undefined);
    throw new DispatcherSessionUnavailable();
  }

  const { data, error } = await client.auth.getClaims().catch((error: unknown) => ({ data: null, error }));
  if (error && !isMissingSession(error)) logAuthorizationFailure("session", started, error);
  if (error && !isInvalidSession(error)) throw new DispatcherSessionUnavailable();
  if (error || !data?.claims.sub) redirect("/sign-in");
  return { client, userId: data.claims.sub };
}

export async function companyAccess(companyId: string) {
  const context = await signedInDispatcher();
  if (!uuidPattern.test(companyId)) notFound();
  const started = performance.now();
  const { data: permitted, error, status } = await Promise.resolve(
    context.client.rpc("tms_can_dispatch", { p_company: companyId }),
  ).catch((error: unknown) => ({ data: null, error, status: undefined }));
  if (error || typeof permitted !== "boolean") {
    logAuthorizationFailure("company_rpc", started, error, status);
    if (isRestTokenRejection(error, status)) redirect("/sign-in");
    throw new Error("Company access could not be verified.");
  }
  if (!permitted) notFound();
  return context;
}
