import Link from "next/link";
import { notFound } from "next/navigation";
import { companyAccess, uuidPattern } from "@/lib/dispatch/access";
import { rosterFields, vehicleLabels, type RosterKind } from "@/lib/dispatch/roster-fields";
import { saveRoster } from "./roster-actions";
import { ActivationForm, RosterForm } from "./roster-form";

type Row = {
  id: string;
  version: number;
  active: boolean;
  display_name?: string;
  unit_number?: string;
  equipment_type?: string;
  operating_status?: string;
};
export type RosterPageProps = {
  params: Promise<{ company: string }>;
  searchParams: Promise<{ record?: string; status?: string; page?: string }>;
};

export async function RosterPage({ kind, params, searchParams }: RosterPageProps & { kind: RosterKind }) {
  const { company } = await params;
  const { client } = await companyAccess(company);
  const { record, status, page } = await searchParams;
  const root = `/dispatch/${company}`;
  const path = `${root}/${kind}`;
  const isDriver = kind === "drivers";
  const noun = isDriver ? "driver" : "vehicle";
  const title = isDriver ? "Drivers" : "Vehicles";
  const label = isDriver ? "display_name" : "unit_number";
  const statusFilter = status === "active" || status === "inactive" ? status : "all";
  const pageNumber = Math.trunc(Math.max(1, Math.min(10000, Number(page) || 1)));

  if (record === "new") {
    return (
      <>
        <Link href={path} className="text-blue-800 underline">Back to {kind}</Link>
        <h1 className="my-4 text-2xl font-semibold">New {noun}</h1>
        <RosterForm kind={kind} submit={saveRoster.bind(null, company, kind, "create", crypto.randomUUID(), null)} />
      </>
    );
  }

  if (record !== undefined) {
    if (typeof record !== "string" || !uuidPattern.test(record)) notFound();
    const { data, error } = await client.from(kind).select("*")
      .eq("company_id", company).eq("id", record).maybeSingle<Row & Record<string, unknown>>();
    if (error) throw new Error("Roster record could not be loaded.");
    if (!data) notFound();
    const initial = Object.fromEntries(rosterFields[kind].map(({ name }) => [name, String(data[name] ?? "")]));
    const versionKey = `${data.id}-${data.version}`;
    return (
      <>
        <Link href={path} className="text-blue-800 underline">Back to {kind}</Link>
        <h1 className="mt-4 break-words text-2xl font-semibold">{data[label]}</h1>
        <p className="mt-1">Record status: <strong>{data.active ? "Active" : "Inactive"}</strong></p>
        <ActivationForm key={`activation-${versionKey}`} active={data.active}
          submit={saveRoster.bind(null, company, kind, data.active ? "deactivate" : "activate", data.id, data.version)} />
        <h2 className="mb-2 mt-6 text-lg font-semibold">Edit {noun}</h2>
        <RosterForm key={`edit-${versionKey}`} kind={kind} initial={initial}
          submit={saveRoster.bind(null, company, kind, "edit", data.id, data.version)} />
      </>
    );
  }

  const offset = (pageNumber - 1) * 25;
  let query = client.from(kind).select(isDriver ? "id,active,display_name" : "id,active,unit_number,equipment_type,operating_status")
    .eq("company_id", company);
  if (statusFilter !== "all") query = query.eq("active", statusFilter === "active");
  const { data, error } = await query.order(label).order("id").range(offset, offset + 25).returns<Row[]>();
  if (error) throw new Error("Roster could not be loaded.");

  return (
    <>
      <Link href={root} className="text-blue-800 underline">Back to Dispatch Center</Link>
      <div className="my-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <Link href={`${path}?record=new`} className="rounded bg-blue-800 px-4 py-2 text-white">New {noun}</Link>
      </div>
      <nav aria-label={`${title} status filter`} className="mb-4 flex flex-wrap gap-2">
        {["all", "active", "inactive"].map((filter) => (
          <Link key={filter} href={`${path}?status=${filter}`} aria-current={filter === statusFilter ? "page" : undefined}
            className="rounded border bg-white px-3 py-2 capitalize aria-[current=page]:border-blue-800">{filter}</Link>
        ))}
      </nav>
      {data.length === 0 ? <p>No {kind} on this page.</p> : (
        <ul className="grid gap-3">
          {data.slice(0, 25).map((row) => (
            <li key={row.id} className="rounded-lg border bg-white">
              <Link className="flex flex-wrap items-center justify-between gap-2 p-4" href={`${path}?record=${row.id}`}>
                <div className="min-w-0">
                  <strong className="break-words">{row[label]}</strong>
                  {!isDriver && <p className="text-sm text-slate-700">{vehicleLabels(row.equipment_type ?? "", row.operating_status ?? "")}</p>}
                </div>
                <span className="rounded bg-slate-100 px-2 py-1">{row.active ? "Active" : "Inactive"}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <nav aria-label={`${title} pages`} className="mt-4 flex gap-4">
        {pageNumber > 1 && <Link href={`${path}?status=${statusFilter}&page=${pageNumber - 1}`}>Previous</Link>}
        {data.length > 25 && <Link href={`${path}?status=${statusFilter}&page=${pageNumber + 1}`}>Next</Link>}
      </nav>
    </>
  );
}
