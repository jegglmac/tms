"use client";

import { useRouter } from "next/navigation";

export default function DispatchError({ reset }: { reset?: () => void }) {
  const router = useRouter();
  return (
    <section role="alert" className="grid gap-3">
      <h1 className="text-xl font-semibold">Dispatch could not be loaded</h1>
      <p>Try again. If the problem continues, contact your administrator.</p>
      <button className="w-fit rounded border bg-white px-4 py-2" onClick={reset ?? (() => router.refresh())}>Retry</button>
    </section>
  );
}
