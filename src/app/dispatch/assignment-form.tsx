"use client";

import { useActionState } from "react";
import type { FormState } from "./actions";

export type ResourceOption = { id: string; label: string; availability: string; disabled: boolean };
export function AssignmentForm({ submit, driver, vehicle, drivers, vehicles, requestId }: {
  submit: (state: FormState, form: FormData) => Promise<FormState>;
  driver: string; vehicle: string; drivers: ResourceOption[]; vehicles: ResourceOption[]; requestId: string;
}) {
  const [state, action, pending] = useActionState(submit, {});
  return <form action={action} aria-label="Load assignment" className="grid min-w-0 gap-4 rounded-lg border bg-white p-4 sm:grid-cols-2">
    <input type="hidden" name="requestId" value={requestId} />
    <p className="text-sm text-slate-600 sm:col-span-2">Assignments are optional. Choose Unassigned to release a reservation. Changes to both resources are saved together.</p>
    {([{ name: "driver", title: "Assigned driver", value: driver, options: drivers },
      { name: "vehicle", title: "Assigned vehicle", value: vehicle, options: vehicles }] as const).map(field =>
      <label key={field.name} className="grid min-w-0 gap-1 text-sm font-medium">{field.title}
        <select name={field.name} defaultValue={field.value} className="w-full min-w-0 rounded border bg-white px-2 py-3 text-base" disabled={pending}>
          <option value="">Unassigned</option>
          {field.options.map(option => <option key={option.id} value={option.id} disabled={option.disabled}>
            {option.label} — {option.availability}
          </option>)}
        </select>
      </label>)}
    {state.error && <p role="alert" className="text-red-700 sm:col-span-2">{state.error}</p>}
    <button disabled={pending} className="w-fit rounded bg-blue-800 px-4 py-3 text-white disabled:opacity-60">
      {pending ? "Saving assignments…" : "Save assignments"}
    </button>
  </form>;
}
