import Link from "next/link";
import { notFound } from "next/navigation";
import { companyAccess, uuidPattern } from "@/lib/dispatch/access";
import { localAppointment, type FieldValues } from "@/lib/dispatch/fields";
import { saveLoad } from "../../actions";
import { LoadForm, ReadyForm } from "../../load-form";
import { AssignmentPanel } from "../../assignment-panel";

type Stop = { kind: string; address: string; starts_at: string; ends_at: string };
type Load = {
  load_number: number; status: string; version: number; counterparty: string;
  reference: string; rate_cents: number; cargo: string; load_stops: Stop[];
};
type Event = { version: number; actor_id: string; from_status: string | null; to_status: string; recorded_at: string };

export default async function LoadPage({ params }: { params: Promise<{ company: string; load: string }> }) {
  const { company, load: id } = await params;
  const { client, userId } = await companyAccess(company);
  if (!uuidPattern.test(id)) notFound();
  const [record, history] = await Promise.all([
    client.from("loads").select("load_number,status,version,counterparty,reference,rate_cents,cargo,load_stops(kind,address,starts_at,ends_at)")
      .eq("company_id", company).eq("id", id).maybeSingle<Load>(),
    client.from("shipment_events").select("version,actor_id,from_status,to_status,recorded_at")
      .eq("company_id", company).eq("load_id", id).order("version").returns<Event[]>(),
  ]);
  if (record.error || history.error) throw new Error("Load details could not be retrieved.");
  if (!record.data) notFound();
  const load = record.data;
  const pickup = load.load_stops.find((stop) => stop.kind === "pickup");
  const delivery = load.load_stops.find((stop) => stop.kind === "delivery");
  if (!pickup || !delivery) throw new Error("Load is missing a stop.");
  const fields: FieldValues = {
    counterparty: load.counterparty, reference: load.reference,
    rate: (load.rate_cents / 100).toFixed(2), cargo: load.cargo,
    pickupAddress: pickup.address, pickupStart: localAppointment(pickup.starts_at), pickupEnd: localAppointment(pickup.ends_at),
    deliveryAddress: delivery.address, deliveryStart: localAppointment(delivery.starts_at), deliveryEnd: localAppointment(delivery.ends_at),
  };
  return (
    <>
      <Link className="text-blue-800 underline" href={`/dispatch/${company}`}>Back to loads</Link>
      <h1 className="mt-4 text-2xl font-semibold">Load #{load.load_number}</h1>
      <p className="mt-1 capitalize">Status: <strong>{load.status}</strong></p>
      {load.status === "draft" && <ReadyForm key={`ready-${id}-${load.version}`}
        submit={saveLoad.bind(null, company, "ready", id, load.version)} requestId={crypto.randomUUID()} />}
      <h2 className="mb-2 mt-6 text-lg font-semibold">Edit load</h2>
      <LoadForm key={`edit-${id}-${load.version}`} initial={fields}
        submit={saveLoad.bind(null, company, "edit", id, load.version)} requestId={crypto.randomUUID()} />
      <AssignmentPanel company={company} load={id} version={load.version} />
      <h2 className="mb-2 mt-6 text-lg font-semibold">Status history</h2>
      <ol className="grid gap-2">
        {history.data.map((event) => <li key={event.version} className="rounded border bg-white p-3">
          <strong className="capitalize">{event.from_status ? `${event.from_status} → ${event.to_status}` : "Created as draft"}</strong>
          <p>{new Date(event.recorded_at).toLocaleString("en-US", { timeZone: "America/New_York", timeZoneName: "short" })}</p>
          <p className="break-all text-sm text-slate-600">{event.actor_id === userId ? "You" : `Dispatcher ${event.actor_id}`}</p>
        </li>)}
      </ol>
    </>
  );
}
