"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

export type patient = {
  id: number;
  patientName: string;
  age: number;
  sex: string;
  currentDoctor: string;
  reason: string
  speciality: string
  recommendedSpeciality: string
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
    accessorKey: "currentDoctor",
    header: () => <div>Current Doctor</div>
  },
  {
    accessorKey: "speciality",
    header: () => <div>Speciality</div>
  },
  {
    accessorKey: "reason",
    header: () => <div>Reason</div>
  },
  {
    accessorKey: "recommendedSpeciality",
    header: () => <div>Recommended Speciality</div>
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex gap-3 items-center">
          <Button>Approve</Button>
          <Button variant="destructive">Decline</Button>
        </div>
      );
    },
  }
];
