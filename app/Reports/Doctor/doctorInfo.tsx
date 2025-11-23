/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchingCredential } from "@/lib/actions";
import { columns, patient } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<patient[]> {
  const cred = (await fetchingCredential()) || []
  const data = cred.filter((item: any) => item.roleType === "Doctor")
  return data
}

export default async function Reports() {
  const data = await getData();

  return (
    <div className="flex flex-col gap-2">
      <div className="container mx-auto py-3">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
