import { Temporal } from "@js-temporal/polyfill";

export const timeZone = "America/New_York";

export const loadFields = [
  { name: "counterparty", label: "Customer or broker", max: 160 },
  { name: "reference", label: "Customer or broker reference", max: 120, optional: true },
  { name: "rate", label: "Agreed rate (USD)", max: 12 },
  { name: "cargo", label: "Cargo description", max: 500 },
  { name: "pickupAddress", label: "Pickup address", max: 250 },
  { name: "pickupStart", label: "Pickup window start", max: 16, date: true },
  { name: "pickupEnd", label: "Pickup window end", max: 16, date: true },
  { name: "deliveryAddress", label: "Delivery address", max: 250 },
  { name: "deliveryStart", label: "Delivery window start", max: 16, date: true },
  { name: "deliveryEnd", label: "Delivery window end", max: 16, date: true },
] as const satisfies ReadonlyArray<{
  name: string; label: string; max: number; optional?: boolean; date?: boolean;
}>;

export type FieldName = typeof loadFields[number]["name"];
export type FieldValues = Partial<Record<FieldName, string>>;

export function localAppointment(instant: string) {
  return Temporal.Instant.from(instant).toZonedDateTimeISO(timeZone)
    .toPlainDateTime().toString({ smallestUnit: "minute" });
}

function easternInstant(value: string) {
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value)) throw new Error("Invalid appointment");
  return Temporal.PlainDateTime.from(value).toZonedDateTime(timeZone, {
    disambiguation: "reject",
  }).toInstant().toString();
}

export function readLoad(form: FormData) {
  const values = {} as Record<FieldName, string>;
  for (const field of loadFields) {
    const value = form.get(field.name);
    if (typeof value !== "string" || value.trim().length > field.max ||
      (!("optional" in field) && !value.trim())) {
      return { error: `Check ${field.label.toLowerCase()} and try again.` };
    }
    values[field.name] = value.trim();
  }
  const { rate, pickupStart, pickupEnd, deliveryStart, deliveryEnd, ...details } = values;
  if (!/^\d{1,7}(?:\.\d{1,2})?$/.test(rate)) return { error: "Enter a valid USD rate." };
  const [dollars, cents = ""] = rate.split(".");
  const rateCents = Number(dollars) * 100 + Number(cents.padEnd(2, "0"));
  if (rateCents > 100000000) return { error: "Rate exceeds the supported limit." };
  try {
    const [ps, pe, ds, de] = [pickupStart, pickupEnd, deliveryStart, deliveryEnd].map(easternInstant);
    if (ps > pe || ds > de || pe > ds) return { error: "Check the order of the pickup and delivery windows." };
    return { data: { ...details, rateCents, pickupStart: ps, pickupEnd: pe, deliveryStart: ds, deliveryEnd: de } };
  } catch {
    return { error: "Choose valid, unambiguous appointment times in Eastern Time." };
  }
}
