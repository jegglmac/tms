"use server";

import { redirect } from "next/navigation";
import { companyAccess, uuidPattern } from "@/lib/dispatch/access";
import { readRosterFields, type RosterAction, type RosterKind } from "@/lib/dispatch/roster-fields";

export type RosterState = { error?: string };

export async function saveRoster(
  company: string, kind: RosterKind, action: RosterAction, id: string, version: number | null,
  _state: RosterState, form: FormData,
): Promise<RosterState> {
  const { client } = await companyAccess(company);
  if (!["drivers", "vehicles"].includes(kind) || !["create", "edit", "activate", "deactivate"].includes(action) ||
    !uuidPattern.test(id)) return { error: "Invalid roster request." };

  const values = action === "create" || action === "edit" ? readRosterFields(kind, form) : { data: null };
  if ("error" in values) return { error: values.error };
  const { data, error } = await client.rpc("tms_save_roster", {
    p_company: company, p_kind: kind, p_action: action, p_id: id, p_version: version, p_data: values.data,
  });
  if (error || data !== id) {
    if (error?.code === "40001") return { error: "This record changed. Reopen it before trying again." };
    if (error?.code === "23505") return {
      error: kind === "vehicles" ? "This unit number or record already exists. Reopen the vehicle list." : "This record already exists. Reopen the driver list.",
    };
    if (error?.code === "23514" || error?.code === "23502" || error?.code === "22023" || error?.code === "22P02") {
      return { error: "Review the record fields and try again." };
    }
    return { error: "The change could not be confirmed. Reopen the roster to check the record." };
  }
  redirect(`/dispatch/${company}/${kind}?record=${id}`);
}
