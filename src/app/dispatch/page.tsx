import Link from "next/link";
import { redirect } from "next/navigation";
import { signedInDispatcher } from "@/lib/dispatch/access";

export default async function DispatchPage() {
  const { client, userId } = await signedInDispatcher();
  const { data, error } = await client.from("memberships").select("company_id,companies!inner(name)")
    .eq("user_id", userId).eq("role", "dispatcher").is("revoked_at", null)
    .order("company_id").returns<{ company_id: string; companies: { name: string } }[]>();
  if (error) throw new Error("Your company list could not be loaded.");
  if (data.length === 1) redirect(`/dispatch/${data[0].company_id}`);
  return (
    <>
      <h1 className="text-2xl font-semibold">Choose a company</h1>
      {data.length === 0 ? <p className="mt-3">No active dispatcher memberships.</p> : (
        <ul className="mt-4 grid gap-2">
          {data.map((company) => <li key={company.company_id}>
            <Link className="text-blue-800 underline" href={`/dispatch/${company.company_id}`}>
              {company.companies.name}
            </Link>
          </li>)}
        </ul>
      )}
    </>
  );
}
