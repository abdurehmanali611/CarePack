"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type patient = {
  id: number;
  patientName: string;
  status: "Treated" | "Scheduled" | "Pending" | "Cancelled";
  phoneNumber: string;
  email: string;
  Doctor: string;
  Disease: string;
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
    accessorKey: "email",
    header: () => <div>Email</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="font-semibold font-serif">Phone Number</div>,
  },
  {
    accessorKey: "Doctor",
    header: () => <div className="font-semibold font-serif">Doctor</div>,
  },
  {
    accessorKey: "Disease",
    header: () => <div className="font-semibold font-serif">Disease/CheckUp</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
  }
];
