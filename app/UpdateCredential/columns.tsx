"use client";
import UpdateCredetial from "@/constants/tableActions";
import { ColumnDef } from "@tanstack/react-table";

export type patient = {
  _id: string;
  Full_Name: string;
  Sex: string;
  Speciality: string;
  experienceYear: number;
  passKey: string;
  roleType: string;
};

export const columns = (refetchData: () => void): ColumnDef<patient>[] => [
  {
    accessorKey: "_id",
    header: () => <div className="font-semibold font-serif">ID</div>,
    cell: ({ row }) => <h2 className="flex justify-center">{row.index + 1}</h2>,
  },
  {
    accessorKey: "roleType",
    header: () => <div>Role</div>,
  },
  {
    accessorKey: "Full_Name",
    header: () => <div>Full Name</div>,
  },
  {
    accessorKey: "Sex",
    header: () => <div>Sex</div>,
  },
  {
    accessorKey: "experienceYear",
    header: () => <div className="flex justify-center">Year of Experience</div>,
    cell: ({ row }) => {
      return (
        <h2 className="flex justify-center">
          {row.getValue("experienceYear")}
        </h2>
      );
    },
  },
  {
    accessorKey: "Speciality",
    header: () => <div>Speciality</div>,
  },
  {
    accessorKey: "passKey",
    header: () => <div>PassKey</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <UpdateCredetial
          id={row.original._id}
          Full_Name={row.getValue("Full_Name")}
          Sex = {row.getValue("Sex")}
          Speciality={row.getValue("Speciality")}
          experienceYear={row.getValue("experienceYear")}
          roleType={row.getValue("roleType")}
          passKey={row.getValue("passKey")}
          refetchData={refetchData}
        />
      );
    },
  },
];
