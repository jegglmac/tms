export type RosterKind = "drivers" | "vehicles";
export type RosterAction = "create" | "edit" | "activate" | "deactivate";

const equipment = {
  box_truck: "Box truck",
  cargo_van: "Cargo van",
  straight_truck: "Straight truck",
  tractor_trailer: "Tractor-trailer",
};
const operatingStatus = {
  in_service: "In service",
  maintenance: "Maintenance",
  out_of_service: "Out of service",
};

type Field = {
  name: string;
  label: string;
  required?: boolean;
  max?: number;
  type?: "email" | "tel" | "number";
  options?: Record<string, string>;
};

const drivers: Field[] = [
  { name: "display_name", label: "Driver name", required: true, max: 120 },
  { name: "work_email", label: "Work email", type: "email", max: 254 },
  { name: "work_phone", label: "Work phone", type: "tel", max: 40 },
  { name: "relationship", label: "Relationship", options: { employee: "Employee", contractor: "Contractor" } },
];
const vehicles: Field[] = [
  { name: "unit_number", label: "Unit number", required: true, max: 40 },
  { name: "equipment_type", label: "Equipment type", required: true, options: equipment },
  { name: "operating_status", label: "Operating status", required: true, options: operatingStatus },
  { name: "make", label: "Make", max: 80 },
  { name: "model", label: "Model", max: 80 },
  { name: "model_year", label: "Model year", type: "number" },
];

export const rosterFields = { drivers, vehicles };

export function readRosterFields(kind: RosterKind, form: FormData) {
  const data: Record<string, string> = {};
  for (const field of rosterFields[kind]) {
    const input = form.get(field.name);
    if (typeof input !== "string") return { error: `Enter a valid ${field.label.toLowerCase()}.` };
    const value = input.trim();
    const valid = (!field.required || value !== "") &&
      value.length <= (field.max ?? 40) &&
      (!value || !field.options || Object.hasOwn(field.options, value));
    if (!valid) return { error: `Enter a valid ${field.label.toLowerCase()}.` };
    data[field.name] = value;
  }
  if (kind === "vehicles") {
    if (!/^[A-Za-z0-9][A-Za-z0-9._ -]{0,39}$/.test(data.unit_number)) {
      return { error: "Use letters, numbers, spaces, dots, underscores, or hyphens for the unit number. Start with a letter or number." };
    }
    if (data.model_year && (!/^\d{4}$/.test(data.model_year) || Number(data.model_year) < 1900 || Number(data.model_year) > 2100)) {
      return { error: "Enter a model year between 1900 and 2100." };
    }
  }
  return { data };
}

export function vehicleLabels(type: string, status: string) {
  return [
    equipment[type as keyof typeof equipment],
    operatingStatus[status as keyof typeof operatingStatus],
  ].join(" · ");
}
