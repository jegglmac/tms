"use client";

import { useActionState, useState } from "react";
import { rosterFields, type RosterKind } from "@/lib/dispatch/roster-fields";
import type { RosterState } from "./roster-actions";

type Submit = (state: RosterState, form: FormData) => Promise<RosterState>;

export function RosterForm({ kind, submit, initial = {} }: {
  kind: RosterKind; submit: Submit; initial?: Record<string, string>;
}) {
  const [values, setValues] = useState(initial);
  const [state, action, pending] = useActionState(submit, {});
  return (
    <form action={action} className="grid gap-4 rounded-xl border bg-white p-4 sm:grid-cols-2">
      {rosterFields[kind].map((field) => (
        <label key={field.name} className="grid min-w-0 gap-1 text-sm font-medium">
          {field.label}
          {field.options ? (
            <select name={field.name} className="min-w-0 rounded border p-2 text-base" required={field.required}
              value={values[field.name] ?? ""}
              onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}>
              <option value="">{field.required ? "Select" : "Unspecified"}</option>
              {Object.entries(field.options).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          ) : (
            <input name={field.name} className="min-w-0 rounded border p-2 text-base"
              type={field.type ?? "text"} required={field.required} maxLength={field.max}
              min={field.type === "number" ? 1900 : undefined} max={field.type === "number" ? 2100 : undefined}
              value={values[field.name] ?? ""}
              onChange={(event) => setValues({ ...values, [field.name]: event.target.value })} />
          )}
        </label>
      ))}
      {state.error && <p role="alert" className="text-red-700 sm:col-span-2">{state.error}</p>}
      <button disabled={pending} className="w-fit rounded bg-blue-800 px-4 py-2 text-white disabled:opacity-60">
        {pending ? "Saving…" : kind === "drivers" ? "Save driver" : "Save vehicle"}
      </button>
    </form>
  );
}

export function ActivationForm({ submit, active }: { submit: Submit; active: boolean }) {
  const [state, action, pending] = useActionState(submit, {});
  return (
    <form action={action} className="mt-3">
      {state.error && <p role="alert" className="mb-2 text-red-700">{state.error}</p>}
      <button disabled={pending} className="rounded border bg-white px-4 py-2 disabled:opacity-60">
        {pending ? "Saving…" : active ? "Deactivate" : "Activate"}
      </button>
    </form>
  );
}
