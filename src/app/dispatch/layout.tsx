import Link from "next/link";
import { signedInDispatcher } from "@/lib/dispatch/access";
import { signOut } from "@/app/sign-in/actions";

export const dynamic = "force-dynamic";

export default async function DispatchLayout({ children }: { children: React.ReactNode }) {
  await signedInDispatcher();
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/dispatch" className="text-lg font-semibold">TMS Pro · Dispatch</Link>
          <form action={signOut}>
            <button className="rounded border px-3 py-2">Sign out</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
