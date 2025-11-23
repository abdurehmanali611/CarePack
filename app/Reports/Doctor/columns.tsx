"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

type PatientInfo = {
  name: string;
  age: number;
  reason: string;
  doctorName: string;
  symptoms: string[];
  allergies: string[];
  past_Medical_History: string;
  family_Medical_History: string;
  AppointmentDate: Date;
  status: string;
  schedulingNumber: number;
  userId: string;
  reasonChange: string;
  recommend: string;
};
export type patient = {
  _id: string;
  Full_Name: string;
  Sex: string;
  Speciality?: string;
  experienceYear: number;
  passKey: string;
  roleType: string;
  image: string;
  AppointmentDates?: Date[];
  patientInfos?: PatientInfo[];
};

export const columns: ColumnDef<patient>[] = [
  {
    accessorKey: "id",
    header: () => <div className="font-semibold font-serif">ID</div>,
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "image",
    header: () => <div>Image</div>,
    cell: ({ row }) => {
      return (
        <Image
          src={row.getValue("image")}
          alt={row.original.Full_Name}
          width={34}
          height={34}
          loading="eager"
          className="rounded-xl"
        />
      );
    },
  },
  {
    accessorKey: "Full_Name",
    header: () => <div>Full Name</div>,
  },
  {
    accessorKey: "Sex",
    header: () => <div className="font-semibold font-serif">Sex</div>,
  },
  {
    accessorKey: "Speciality",
    header: () => <div className="font-semibold font-serif">Speciality</div>,
  },
  {
    accessorKey: "experienceYear",
    header: () => (
      <div className="font-semibold font-serif">Experience Year</div>
    ),
    cell: ({ row }) => (
      <h2 className="text-center">{row.getValue("experienceYear")}</h2>
    ),
  },
  {
    accessorKey: "AppointmentDates",
    header: () => (
      <div className="font-semibold font-serif">Appointment Dates</div>
    ),
    cell: ({ row }) => {
      const dates = row.original.AppointmentDates ?? [];
      if (!dates.length) return <div>No Appointment</div>;

      return (
        <ul className="space-y-1">
          {dates.map((d, i) => (
            <li key={i} className="text-sm">
              {new Date(d).toLocaleDateString()}
            </li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: "patientInfos",
    header: () => <div className="font-semibold font-serif">Patient Info</div>,
    cell: ({ row }) => {
      const infos = row.original.patientInfos ?? [];
      if (!infos.length) return <div>No Info Recorded</div>;

      return (
        <div className="space-y-2">
          {infos.map((info, i) => (
            <div key={i} className="border p-1 rounded-md text-xs">
              <p>
                <span className="font-semibold">Name:</span> {info.name}
              </p>
              <p>
                <span className="font-semibold">Age:</span> {info.age}
              </p>
              <p>
                <span className="font-semibold">Doctor:</span> {info.doctorName}
              </p>
              <p>
                <span className="font-semibold">Reason:</span> {info.reason}
              </p>
              <p>
                <span className="font-semibold">Appointment:</span>{" "}
                {new Date(info.AppointmentDate).toLocaleDateString()}
              </p>

              <p>
                <span className="font-semibold">Symptoms:</span>{" "}
                {info.symptoms.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Allergies:</span>{" "}
                {info.allergies.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Past History:</span>{" "}
                {info.past_Medical_History}
              </p>
              <p>
                <span className="font-semibold">Family History:</span>{" "}
                {info.family_Medical_History}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {info.status}
              </p>
              {info.status === "Scheduled" && (
                <p>
                  <span className="font-semibold">Scheduling Number:</span>{" "}
                  {info.schedulingNumber}
                </p>
              )}
              {info.status === "specialityChange" && (
                <div>
                  <p>
                    <span className="font-semibold">Reason:</span>{" "}
                    {info.reasonChange}
                  </p>
                  <p>
                    <span className="font-semibold">Recommended to:</span>{" "}
                    {info.recommend}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    },
  },
];
