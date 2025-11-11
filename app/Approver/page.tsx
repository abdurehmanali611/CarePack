import Card from "@/components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const NewAppointment = dynamic(() => import('./NewAppointment'))
const SpecialityChange = dynamic(() => import('../SpecialityChange/SpecialityChange'))

export default function Approver() {
    return <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
         <Card
          type="Scheduled"
          count={5}
          label="Scheduled Appointments"
          icon="/assets/appointments.svg"
        />
        <Card
          type="Pending"
          count={5}
          label="Pending Appointments"
          icon="/assets/pending.svg"
        />
        <Card
          type="Cancelled"
          count={5}
          label="Cancelled Appointments"
          icon="/assets/cancelled.svg"
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