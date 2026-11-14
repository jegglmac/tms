"use server";

import { redirect } from "next/navigation";
import { companyAccess, uuidPattern } from "@/lib/dispatch/access";
import type { FormState } from "./actions";

export async function saveAssignment(company: string, load: string, version: number,
  _state: FormState, form: FormData): Promise<FormState> {
  const { client } = await companyAccess(company);
  const request = form.get("requestId");
  const driver = form.get("driver");
  const vehicle = form.get("vehicle");
  if (!uuidPattern.test(load) || !Number.isInteger(version) || version < 1 ||
    typeof request !== "string" || !uuidPattern.test(request) ||
    typeof driver !== "string" || (driver !== "" && !uuidPattern.test(driver)) ||
    typeof vehicle !== "string" || (vehicle !== "" && !uuidPattern.test(vehicle))) {
    return { error: "Invalid assignment details. Reload the load and choose resources again." };
  }
  const uncertain = { error: "The assignment change could not be confirmed. Reopen the load to check its current assignment before trying again." };
  let result;
  try {
    result = await client.rpc("tms_set_load_assignment", {
      p_company: company, p_load: load, p_version: version, p_request: request,
      p_driver: driver || null, p_vehicle: vehicle || null,
    });
  } catch { return uncertain; }
  if (result.error) {
    if (result.error.code === "40001") return { error: "This load has changed. Reload the load before editing its assignments." };
    if (result.error.code === "23505") return { error: "A selected resource is reserved or this request has changed. Reload the load and choose available resources." };
    if (result.error.code === "22023" || result.error.code === "23503") return { error: "A selected resource is no longer eligible. Reload the load and choose available resources." };
    if (result.error.code === "42501") return { error: "Assignment access denied. Sign in again or contact your company administrator." };
    return uncertain;
  }
  if (result.data?.load_id !== load || typeof result.data?.changed !== "boolean" ||
    !Number.isInteger(result.data?.version) || result.data.version < version) return uncertain;
  redirect(`/dispatch/${company}/${load}`);
}
