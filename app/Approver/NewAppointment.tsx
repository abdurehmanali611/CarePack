import { columns, patient } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<patient[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      patientName: "Abdurehman Ali",
      age: 20,
      sex: "Male",
      expectedAppointmentDate: "12/10/2025",
      status: "Scheduled"
    },
    {
      id: 2,
      patientName: "Yusra Ali",
      age: 18,
      sex: "Female",
      expectedAppointmentDate: "12/10/2025",
      status: "Scheduled"
    },
    {
      id: 3,
      patientName: "Mulunesh Ahmed",
      age: 40,
      sex: "Female",
      expectedAppointmentDate: "12/10/2025",
      status: "Pending"
    },
    {
      id: 4,
      patientName: "Ali Hussen",
      age: 50,
      sex: "Male",
      expectedAppointmentDate: "12/10/2025",
      status: "Cancelled"
    },
  ];
}

export default async function NewAppointment() {
  const data = await getData();

  return (
    <div className="flex flex-col gap-5">
      <div className="container mx-auto py-3">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
