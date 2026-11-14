import { companyAccess } from "@/lib/dispatch/access";
import { AssignmentForm, type ResourceOption } from "./assignment-form";
import { saveAssignment } from "./assignment-actions";

type Driver = { id: string; display_name: string; active: boolean };
type Vehicle = { id: string; unit_number: string; active: boolean; operating_status: string };
type Reservation = { load_id: string; driver_id: string | null; vehicle_id: string | null };
type Event = { version: number; actor_id: string; recorded_at: string; previous_driver_id: string | null;
  driver_id: string | null; previous_vehicle_id: string | null; vehicle_id: string | null };

export async function AssignmentPanel({ company, load, version }: { company: string; load: string; version: number }) {
  const { client, userId } = await companyAccess(company);
  // Read every page: never silently treat the API's default row limit as the full roster.
  async function rows<T>(table: string, columns: string, order: string, loadScoped = false): Promise<T[]> {
    const result: T[] = [];
    for (let offset = 0; ; offset += 500) {
      let query = client.from(table).select(columns).eq("company_id", company).order(order).range(offset, offset + 499);
      if (loadScoped) query = query.eq("load_id", load);
      const response = await query;
      if (response.error || !response.data) throw new Error("Assignment information could not be retrieved.");
      result.push(...response.data as unknown as T[]);
      if (response.data.length < 500) return result;
    }
  }
  const [drivers, vehicles, reservations, history] = await Promise.all([
    rows<Driver>("drivers", "id,display_name,active", "id"),
    rows<Vehicle>("vehicles", "id,unit_number,active,operating_status", "id"),
    rows<Reservation>("load_assignments", "load_id,driver_id,vehicle_id", "load_id"),
    rows<Event>("load_assignment_events", "version,actor_id,recorded_at,previous_driver_id,driver_id,previous_vehicle_id,vehicle_id", "version", true),
  ]);
  const current = reservations.find(row => row.load_id === load);
  const driverName = (id: string | null | undefined) => id ? drivers.find(row => row.id === id)?.display_name ?? "Unavailable driver" : "Unassigned";
  const vehicleName = (id: string | null | undefined) => id ? vehicles.find(row => row.id === id)?.unit_number ?? "Unavailable vehicle" : "Unassigned";
  const driverOptions: ResourceOption[] = drivers.map(row => {
    const reserved = reservations.some(item => item.driver_id === row.id && item.load_id !== load);
    return { id: row.id, label: row.display_name, disabled: !row.active || reserved,
      availability: !row.active ? "Inactive" : reserved ? "Reserved on another load" : current?.driver_id === row.id ? "Assigned to this load" : "Available" };
  });
  const vehicleOptions: ResourceOption[] = vehicles.map(row => {
    const reserved = reservations.some(item => item.vehicle_id === row.id && item.load_id !== load);
    return { id: row.id, label: row.unit_number, disabled: !row.active || row.operating_status !== "in_service" || reserved,
      availability: !row.active ? "Inactive" : row.operating_status !== "in_service" ? row.operating_status.replaceAll("_", " ") : reserved ? "Reserved on another load" : current?.vehicle_id === row.id ? "Assigned to this load" : "Available" };
  });
  driverOptions.sort((a, b) => a.label.localeCompare(b.label) || a.id.localeCompare(b.id));
  vehicleOptions.sort((a, b) => a.label.localeCompare(b.label) || a.id.localeCompare(b.id));
  return <section aria-labelledby="assignment-heading" className="mt-6 min-w-0">
    <h2 id="assignment-heading" className="text-lg font-semibold">Driver and vehicle assignment</h2>
    <p data-testid="current-assignment" className="my-3 break-words">Driver: {driverName(current?.driver_id)} · Vehicle: {vehicleName(current?.vehicle_id)}</p>
    <AssignmentForm key={`assign-${load}-${version}`} submit={saveAssignment.bind(null, company, load, version)}
      driver={current?.driver_id ?? ""} vehicle={current?.vehicle_id ?? ""} drivers={driverOptions} vehicles={vehicleOptions} requestId={crypto.randomUUID()} />
    <h3 className="mb-2 mt-4 font-semibold">Assignment history</h3>
    <p className="mb-2 text-sm text-slate-600">Names reflect current roster labels. Reservations last until explicitly released.</p>
    {history.length === 0 ? <p>No assignment changes yet.</p> : <ol aria-label="Assignment history" className="grid gap-2">
      {history.map(event => <li key={event.version} className="break-words rounded border bg-white p-3">
        <p>Driver: {driverName(event.previous_driver_id)} → {driverName(event.driver_id)}</p>
        <p>Vehicle: {vehicleName(event.previous_vehicle_id)} → {vehicleName(event.vehicle_id)}</p>
        <p className="text-sm text-slate-600">Version {event.version} · {event.actor_id === userId ? "You" : "Company dispatcher"} · {new Date(event.recorded_at).toLocaleString("en-US", { timeZone: "America/New_York", timeZoneName: "short" })}</p>
      </li>)}
    </ol>}
  </section>;
}
