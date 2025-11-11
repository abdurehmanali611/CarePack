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
      currentDoctor: "Dr. Alex Petrov",
      reason: "Not Here",
      speciality: "Psychiatry",
      recommendedSpeciality: "Neurology"
    },
    {
      id: 2,
      patientName: "Yusra Ali",
      age: 18,
      sex: "Female",
      currentDoctor: "Dr. Elena Rossi",
      reason: "Not Here",
      speciality: "Ophthalmology",
      recommendedSpeciality: "Dermatology"
    },
    {
      id: 3,
      patientName: "Mulunesh Ahmed",
      age: 40,
      sex: "Female",
      currentDoctor: "Dr. Sanjay Patel",
      reason: "Not Here",
      speciality: "Internal Medicine",
      recommendedSpeciality: "Orthopedic Surgery"
    },
    {
      id: 4,
      patientName: "Ali Hussen",
      age: 50,
      sex: "Male",
      currentDoctor: "Dr. Chloe Dupont",
      reason: "Not Here",
      speciality: "Oncology",
      recommendedSpeciality: "Cardiology"
    },
  ];
}

export default async function SpecialityChange() {
  const data = await getData();

  return (
    <div className="flex flex-col gap-5">
      <div className="container mx-auto py-3">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
