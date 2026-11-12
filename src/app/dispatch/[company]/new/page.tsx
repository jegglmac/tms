import Link from "next/link";
import { companyAccess } from "@/lib/dispatch/access";
import { saveLoad } from "../../actions";
import { LoadForm } from "../../load-form";

export default async function NewLoadPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  await companyAccess(company);
  return (
    <>
      <Link className="text-blue-800 underline" href={`/dispatch/${company}`}>Back to loads</Link>
      <h1 className="my-4 text-2xl font-semibold">New load</h1>
      <LoadForm submit={saveLoad.bind(null, company, "create", null, null)} requestId={crypto.randomUUID()} />
    </>
  );
}
