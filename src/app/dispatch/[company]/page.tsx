import Link from "next/link";
import { companyAccess } from "@/lib/dispatch/access";

type LoadRow = { id: string; load_number: number; status: string; counterparty: string; reference: string };

export default async function CompanyDispatch({
  params, searchParams,
}: { params: Promise<{ company: string }>; searchParams: Promise<{ page?: string }> }) {
  const { company } = await params;
  const { client } = await companyAccess(company);
  const page = Math.max(1, Math.min(10000, Number((await searchParams).page) || 1));
  const offset = (Math.trunc(page) - 1) * 25;
  const [companyResult, list] = await Promise.all([
    client.from("companies").select("name").eq("id", company).single(),
    client.from("loads").select("id,load_number,status,counterparty,reference")
      .eq("company_id", company).order("updated_at", { ascending: false }).order("id")
      .range(offset, offset + 25).returns<LoadRow[]>(),
  ]);
  if (companyResult.error || list.error) throw new Error("Dispatch could not be loaded.");
  const path = `/dispatch/${company}`;
  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-slate-600">{companyResult.data.name}</p>
          <h1 className="text-3xl font-semibold">Dispatch Center</h1></div>
        <Link href={`${path}/new`} className="rounded bg-blue-800 px-4 py-2 text-white">New load</Link>
      </div>
      <nav aria-label="Company rosters" className="mb-4 flex flex-wrap gap-4">
        <Link href={`${path}/drivers`} className="text-blue-800 underline">Drivers</Link>
        <Link href={`${path}/vehicles`} className="text-blue-800 underline">Vehicles</Link>
      </nav>
      {list.data.length === 0 ? <p>No loads on this page.</p> : (
        <ul className="grid gap-3">
          {list.data.slice(0, 25).map((load) => <li key={load.id} className="rounded-lg border bg-white">
            <Link className="flex flex-wrap items-center justify-between gap-3 p-4" href={`${path}/${load.id}`}>
              <span><strong>Load #{load.load_number}</strong><br />{load.counterparty} {load.reference}</span>
              <span className="rounded bg-slate-100 px-2 py-1 capitalize">{load.status}</span>
            </Link>
          </li>)}
        </ul>
      )}
      <nav aria-label="Load pages" className="mt-4 flex gap-4">
        {offset > 0 && <Link href={`${path}?page=${offset / 25}`}>Previous</Link>}
        {list.data.length > 25 && <Link href={`${path}?page=${offset / 25 + 2}`}>Next</Link>}
      </nav>
    </>
  );
}
