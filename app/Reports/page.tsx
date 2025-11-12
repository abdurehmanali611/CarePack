import Link from "next/link";
import { columns, patient } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";

async function getData(): Promise<patient[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      patientName: "Abiy Ahmed",
      status: "Treated",
      phoneNumber: "+251943542343",
      email: "abiyahmed@gmail.com",
      Doctor: "Dr. Michael Johnson",
      Disease: "Neural Disease",
    },
    {
      id: 2,
      patientName: "Mekiya Kheiru",
      status: "Scheduled",
      phoneNumber: "+251934567654",
      email: "mekiya@gmail.com",
      Doctor: "Dr. Michael Johnson",
      Disease: "Neural Disease",
    },
    {
      id: 3,
      patientName: "Abdurehman Ali",
      status: "Treated",
      phoneNumber: "+251935000642",
      email: "abdurehmanali611@gmail.com",
      Doctor: "Dr. Sofia Martinez",
      Disease: "Dermatology",
    },
    {
      id: 4,
      patientName: "Yusra Ali",
      status: "Scheduled",
      phoneNumber: "+251986857711",
      email: "yusra@gmail.com",
      Doctor: "Dr. David Kim",
      Disease: "Orthopedic Surgery",
    },
    {
      id: 5,
      patientName: "Ali Hussen",
      status: "Pending",
      phoneNumber: "+251911979276",
      email: "alihussen@gmail.com",
      Doctor: "Dr. Amelia Reed",
      Disease: "Cardiology",
    },
    {
      id: 6,
      patientName: "Mulunesh Ahmed",
      status: "Cancelled",
      phoneNumber: "+251913692129",
      email: "mulunesh@gmail.com",
      Doctor: "Dr. Fatma Al-Sayed",
      Disease: "Gastroenterology",
    },
  ];
}

export default async function Reports() {
  const data = await getData();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mx-2 p-5">
        <Card
          type="Scheduled"
          count={10}
          label="Schduled Appointments"
          icon="/assets/appointments.svg"
        />
        <Card
          type="Pending"
          count={10}
          label="Pending Appointments"
          icon="/assets/pending.svg"
        />
        <Card
          type="Cancelled"
          count={10}
          label="Cancelled Appointments"
          icon="/assets/cancelled.svg"
        />
        <Card
          type="Treated"
          count={10}
          label="Treated Patients"
          icon="/assets/treated.svg"
        />
      </div>
      <Button asChild className="px-3 flex justify-center w-fit self-end">
        <Link href="/Credential">Create Credential</Link>
      </Button>
      <div className="container mx-auto py-3">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
