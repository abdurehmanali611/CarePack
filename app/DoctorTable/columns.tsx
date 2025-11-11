"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";
export type patient = {
  id: number;
  patientName: string;
  status: "Treated" | "Rescheduled";
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
    header: () => <div className="font-semibold font-serif">Disease</div>,
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
  },
  {
    id: "actions",
    cell: ({}) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer text-white focus:outline-none">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["copy", "cut", "Paste"].map((item) => (
              <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
