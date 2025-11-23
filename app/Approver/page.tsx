import Card from "@/components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusCount } from "@/lib/actions";
import dynamic from "next/dynamic";

const NewAppointment = dynamic(() => import('./NewAppointment'))
const SpecialityChange = dynamic(() => import('../SpecialityChange/SpecialityChange'))

export default async function Approver() {
    const counts = await getStatusCount()
    return <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
         <Card
          type="Scheduled"
          count={counts.Scheduled}
          label="Scheduled Appointments"
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
          label="Healed Appointments"
          icon="/assets/treated.svg"
        />
        </div>
        <div className="container mx-auto py-3">
        <Tabs defaultValue="new">
            <TabsList>
                <TabsTrigger value="new" className="cursor-pointer">New Appointment</TabsTrigger>
                <TabsTrigger value="specialist" className="cursor-pointer">Specialist Change</TabsTrigger>
            </TabsList>
            <TabsContent value="new">
                <NewAppointment />
            </TabsContent>
            <TabsContent value="specialist">
                <SpecialityChange />
            </TabsContent>
        </Tabs>
        </div>
    </div>
}