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

export const columns = (refetchData: () => void, t: (key: string) => string): ColumnDef<patient>[] => [
  {
    accessorKey: "_id",
    header: () => <div className="font-semibold font-serif">{t("ID")}</div>,
    cell: ({ row }) => <h2 className="flex justify-center">{row.index + 1}</h2>,
  },
  {
    accessorKey: "roleType",
    header: () => <div>{t("Role")}</div>,
  },
  {
    accessorKey: "Full_Name",
    header: () => <div>{t("Full Name")}</div>,
  },
  {
    accessorKey: "Sex",
    header: () => <div>{t("Sex")}</div>,
  },
  {
    accessorKey: "experienceYear",
    header: () => <div className="flex justify-center">{t("Year of Experience")}</div>,
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
    header: () => <div>{t("Speciality")}</div>,
  },
  {
    accessorKey: "passKey",
    header: () => <div>{t("PassKey")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <UpdateCredetial
          id={row.original._id}
          Full_Name={row.original.Full_Name}
          Sex = {row.original.Sex}
          Speciality={row.original.Speciality}
          experienceYear={row.original.experienceYear}
          roleType={row.original.roleType}
          passKey={row.original.passKey}
          refetchData={refetchData}
        />
      );
    },
  },
];
