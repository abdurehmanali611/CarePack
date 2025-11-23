import Link from "next/link";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import { getStatusCount } from "@/lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const PatientInfo = dynamic(() => import('./Patient/patientInfo'))
const DoctorInfo = dynamic(() => import('./Doctor/doctorInfo'))

export default async function Reports() {
  const counts = await getStatusCount()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mx-2 p-5">
        <Card
          type="Scheduled"
          count={counts.Scheduled}
          label="Schduled Appointments"
          icon="/assets/appointments.svg"
        />
        <Card
          type="Pending"
          count={counts.Pending + counts.specialityChange}
          label="Pending Appointments"
          icon="/assets/pending.svg"
        />
        <Card
          type="Cancelled"
          count={counts.Cancelled}
          label="Cancelled Appointments"
          icon="/assets/cancelled.svg"
        />
        <Card
          type="Treated"
          count={counts.Healed}
          label="Treated Patients"
          icon="/assets/treated.svg"
        />
      </div>
      <div className="flex justify-between items-center px-5">
      <Button asChild>
        <Link href="/UpdateCredential">Update/Delete Credential</Link>
      </Button>
      <Button asChild>
        <Link href="/Credential">Create Credential</Link>
      </Button>
      </div>
      <div className="container mx-auto py-3">
        <Tabs defaultValue="patient">
            <TabsList>
                <TabsTrigger value="patient" className="cursor-pointer">Patient Table</TabsTrigger>
                <TabsTrigger value="doctor" className="cursor-pointer">Doctor Table</TabsTrigger>
            </TabsList>
            <TabsContent value="patient">
              <PatientInfo />
            </TabsContent>
            <TabsContent value="doctor">
              <DoctorInfo />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
