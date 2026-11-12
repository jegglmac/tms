"use client";

import { useActionState } from "react";
import { signIn } from "./actions";

export default function SignInPage() {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-16 text-slate-950">
      <form action={action} className="mx-auto grid max-w-sm gap-4 rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">Sign in to TMS Pro</h1>
        <label className="grid gap-1">Email
          <input className="rounded border p-2" name="email" type="email" autoComplete="username" required />
        </label>
        <label className="grid gap-1">Password
          <input className="rounded border p-2" name="password" type="password" autoComplete="current-password" required />
        </label>
        {state.error && <p role="alert" className="text-red-700">{state.error}</p>}
        <button disabled={pending} className="rounded bg-blue-800 px-4 py-2 text-white disabled:opacity-60">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
