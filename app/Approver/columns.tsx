"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Physicians, sampleDataInformations, Specialities } from "@/constants";
import { ColumnDef } from "@tanstack/react-table";

export type patient = {
  id: number;
  patientName: string;
  age: number;
  sex: string;
  expectedAppointmentDate: string;
  status: "Pending" | "Scheduled" | "Cancelled";
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
    accessorKey: "age",
    header: () => <div>Age</div>,
  },
  {
    accessorKey: "sex",
    header: () => <div>Sex</div>,
  },
  {
    accessorKey: "expectedAppointmentDate",
    header: () => <div>Expected Date</div>,
  },
  {
    accessorKey: "Detail",
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
    accessorKey: "speciality",
    header: () => <div>Speciality</div>,
    cell: () => (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select Speciality..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Speciality</SelectLabel>
            {Specialities.map((item) => (
              <SelectItem key={item.id} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
  },
  {
    accessorKey: "Doctor",
    header: () => <div>Doctor</div>,
    cell: () => (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select Doctor..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Doctors</SelectLabel>
            {Physicians.map((item) => (
              <SelectItem key={item.id} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div>Status</div>,
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex gap-3 items-center">
          <Button>Schedule</Button>
          <Button variant="destructive">Cancel</Button>
        </div>
      );
    },
  },
];
