"use server";

import { redirect } from "next/navigation";
import { companyAccess, uuidPattern } from "@/lib/dispatch/access";
import { readLoad } from "@/lib/dispatch/fields";

type LoadAction = "create" | "edit" | "ready";
export type FormState = { error?: string };

export async function saveLoad(
  company: string, action: LoadAction, loadId: string | null, version: number | null,
  _state: FormState, form: FormData,
): Promise<FormState> {
  const { client } = await companyAccess(company);
  if (!["create", "edit", "ready"].includes(action)) return { error: "Invalid load operation." };
  const requestId = form.get("requestId");
  if (typeof requestId !== "string" || !uuidPattern.test(requestId)) return { error: "Reload this page and try again." };
  if (action !== "create" && (!loadId || !uuidPattern.test(loadId) || !Number.isInteger(version))) {
    return { error: "Reload the load and try again." };
  }
  const values = action === "ready" ? { data: null } : readLoad(form);
  if (values.error) return { error: values.error };
  const { data, error } = await client.rpc("tms_save_load", {
    p_company: company, p_request: requestId, p_action: action,
    p_load: loadId, p_version: version, p_data: values.data,
  });
  if (error || typeof data !== "string" || !uuidPattern.test(data)) {
    if (error?.code === "40001" || error?.code === "23505") {
      return { error: "This load or request has changed. Reopen the load before trying again." };
    }
    return { error: "The save could not be confirmed. Retry with the same details or reopen the load to check its status." };
  }
  redirect(`/dispatch/${company}/${data}`);
}
