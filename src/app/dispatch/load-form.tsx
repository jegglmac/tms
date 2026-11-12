"use client";

import { useActionState, useState } from "react";
import { loadFields, type FieldValues } from "@/lib/dispatch/fields";
import type { FormState } from "./actions";

type Action = (state: FormState, form: FormData) => Promise<FormState>;

export function LoadForm({ submit, initial, requestId }: {
  submit: Action; initial?: FieldValues; requestId: string;
}) {
  const [values, setValues] = useState<FieldValues>(initial ?? {});
  const [state, action, pending] = useActionState(submit, {});
  return (
    <form action={action} className="grid gap-4 rounded-lg border bg-white p-4 sm:grid-cols-2">
      <input name="requestId" type="hidden" value={requestId} />
      <p className="text-sm text-slate-600 sm:col-span-2">Appointment windows use Eastern Time.</p>
      {loadFields.map((field) => (
        <label key={field.name} className="grid min-w-0 gap-1 text-sm font-medium">
          {field.label}
          <input className="min-w-0 rounded border px-2 py-2 text-base"
            name={field.name} value={values[field.name] ?? ""}
            onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
            type={"date" in field ? "datetime-local" : "text"}
            maxLength={field.max} required={!("optional" in field)}
            inputMode={field.name === "rate" ? "decimal" : undefined} />
        </label>
      ))}
      {state.error && <p role="alert" className="text-red-700 sm:col-span-2">{state.error}</p>}
      <button disabled={pending} className="w-fit rounded bg-blue-800 px-4 py-2 text-white disabled:opacity-60">
        {pending ? "Saving…" : "Save load"}
      </button>
    </form>
  );
}

export function ReadyForm({ submit, requestId }: { submit: Action; requestId: string }) {
  const [state, action, pending] = useActionState(submit, {});
  return (
    <form action={action} className="mt-3">
      <input name="requestId" type="hidden" value={requestId} />
      {state.error && <p role="alert" className="mb-2 text-red-700">{state.error}</p>}
      <button disabled={pending} className="rounded border bg-white px-4 py-2 disabled:opacity-60">
        {pending ? "Saving…" : "Mark Ready"}
      </button>
    </form>
  );
}
