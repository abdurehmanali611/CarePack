"use client";

import { ColumnDef } from "@tanstack/react-table";

export type patient = {
  _id: string
  preHistory: boolean
  doctorName: string
  reason: string
  symptoms: Array<string>
  allergies: Array<string>
  past_Medical_History: string
  family_Medical_History: string
  expected_Appointment_Date: Date
  comments_Or_Notes: string
  identity_Type: string
  identity_Number: string
  identity_photo: string
  userId: string
  status: string
  cancellingReason?: string
  schedulingNumber: number
  Disease?: string
  Doctor?: string
  patientName: string
  age: number
  email: string
  phoneNumber: string
};

export const columns: ColumnDef<patient>[] = [
  {
    accessorKey: "id",
    header: () => <div className="font-semibold font-serif">ID</div>,
    cell: ({row}) => <div>{row.index + 1}</div>
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
    accessorKey: "email",
    header: () => <div>Email</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="font-semibold font-serif">Phone Number</div>,
  },
  {
    accessorKey: "doctorName",
    header: () => <div className="font-semibold font-serif">Previous Physician Name</div>,
    cell: ({row}) => <h2 className="self-center">{row.getValue("doctorName")}</h2>
  },
  {
    accessorKey: "Doctor",
    header: () => <div className="font-semibold font-serif">Current Doctor</div>,
    cell: ({row}) => <h2 className="self-center">{row.getValue("Doctor") ? row.getValue("Doctor") : "Not Scheduled"}</h2>
  },
  {
    accessorKey: "Disease",
    header: () => <div className="font-semibold font-serif">Disease</div>,
    cell: ({row}) => <h2 className="self-center">{row.getValue("Disease") ? row.getValue("Disease") : "Not Treated"}</h2>
  },
  {
    accessorKey: "status",
    header: () => <div className="font-semibold font-serif">Status</div>,
  },
  {
    accessorKey: "schedulingNumber",
    header: () => <div className="font-semibold font-serif">Scheduling Number</div>,
    cell: ({row}) => <h2 className="text-center">{row.getValue("schedulingNumber")}</h2>
  },
];
