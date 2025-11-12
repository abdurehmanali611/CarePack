"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { sampleDataInformations } from "@/constants";
import { ColumnDef } from "@tanstack/react-table";

export type patient = {
  id: number;
  patientName: string;
  age: number
  sex: string
  scheduleNumber: number
  appointmentTime: string
};

export const columns: ColumnDef<patient>[] = [
  {
    accessorKey: "id",
    header: () => <div className="font-semibold font-serif">ID</div>,
  },
  {
    accessorKey: "patientName",
    header: () => <div>Patient Name</div>,
  },
  {
    accessorKey: "sex",
    header: () => <div>Sex</div>
  },
  {
    accessorKey: "age",
    header: () => <div>Age</div>
  },
  {
    accessorKey: "appointmentTime",
    header: () => <div>Appointment time</div>
  },
  {
    id: "Detail",
    header: () => <div>Detail</div>,
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger asChild className="cursor-pointer">
          <Button variant="outline">Show Detail</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Detail</DialogTitle>
            <DialogDescription>
              Detail Informations about the patient
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 items-center">
            <div className="flex flex-col gap-3">
              <h3 className="font-serif font-semibold text-lg text-red-400">
                Reason for Visiting:{" "}
              </h3>
              <h3 className="font-serif font-semibold text-lg text-red-400">
                Symptoms:{" "}
              </h3>
              <h3 className="font-serif font-semibold text-lg text-red-400">
                Comments:{" "}
              </h3>
            </div>
            {sampleDataInformations.map(
              (item) =>
                item.name === row.getValue("patientName") && (
                  <div key={item.name} className="flex flex-col gap-4">
                    <h3>{item.visitReason}</h3>
                    <h3>
                      {item.visitReason === "Disease"
                        ? item.symptom?.join(", ")
                        : "No symptom"}
                    </h3>
                    <h3>{item.comment}</h3>
                  </div>
                )
            )}
          </div>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    accessorKey: "scheduleNumber",
    header: () => <div>Schedule Number</div>,
    cell: ({row}) => {
      return <h2 className="flex justify-center">{row.getValue("scheduleNumber")}</h2>
    }
  },
  {
    id: "actions",
    cell: () => (
      <div className="flex gap-3 items-center justify-center">
        <Button variant="outline" className="cursor-pointer">Cured</Button>
        <Button variant="outline" className="cursor-pointer">Reschedule</Button>
        <Button variant="destructive" className="cursor-pointer">Specialist Change</Button>
      </div>
    )
  }
];
