/* eslint-disable @typescript-eslint/no-explicit-any */
import { columns, patient } from "./columns";
import { DataTable } from "./data-table";
import { fetchingMedical, fetchingUsers } from "@/lib/actions";

async function getData(): Promise<patient[]> {
  const patients = (await fetchingMedical()) || [];
  const users = (await fetchingUsers()) || [];

  const data = patients.map((item: any) => {
    const user = users.find((use: any) => use._id === item.userId)
    return {
      ...item,
      patientName: user?. Full_Name || "Undefined",
      age: user
          ? new Date().getFullYear() - new Date(user?.birthDate).getFullYear()
          : "-",
      email: user?.email,
      phoneNumber: user?.phoneNumber
    };
  });
  return data;
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
