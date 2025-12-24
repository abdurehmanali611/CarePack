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

export const columns=(t: (key: string) => string): ColumnDef<patient>[] => [
  {
    accessorKey: "id",
    header: () => <div className="font-semibold font-serif">{t("ID")}</div>,
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "image",
    header: () => <div>{t("Image")}</div>,
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
    header: () => <div>{t("Full Name")}</div>,
  },
  {
    accessorKey: "Sex",
    header: () => <div className="font-semibold font-serif">{t("Sex")}</div>,
  },
  {
    accessorKey: "Speciality",
    header: () => <div className="font-semibold font-serif">{t("Speciality")}</div>,
  },
  {
    accessorKey: "experienceYear",
    header: () => (
      <div className="font-semibold font-serif">{t("Experience Year")}</div>
    ),
    cell: ({ row }) => (
      <h2 className="text-center">{row.getValue("experienceYear")}</h2>
    ),
  },
  {
    accessorKey: "AppointmentDates",
    header: () => (
      <div className="font-semibold font-serif">{t("Appointment Dates")}</div>
    ),
    cell: ({ row }) => {
      const dates = row.original.AppointmentDates ?? [];
      if (!dates.length) return <div>{t("No Appointment")}</div>;

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
    header: () => <div className="font-semibold font-serif">{t("Patient Info")}</div>,
    cell: ({ row }) => {
      const infos = row.original.patientInfos ?? [];
      if (!infos.length) return <div>{t("No Info Recorded")}</div>;

      return (
        <div className="space-y-2">
          {infos.map((info, i) => (
            <div key={i} className="border p-1 rounded-md text-xs">
              <p>
                <span className="font-semibold">{t("Name:")}</span> {info.name}
              </p>
              <p>
                <span className="font-semibold">{t("Age:")}</span> {info.age}
              </p>
              <p>
                <span className="font-semibold">{t("Doctor:")}</span> {info.doctorName}
              </p>
              <p>
                <span className="font-semibold">{t("Reason:")}</span> {info.reason}
              </p>
              <p>
                <span className="font-semibold">{t("Appointment:")}</span>{" "}
                {new Date(info.AppointmentDate).toLocaleDateString()}
              </p>

              <p>
                <span className="font-semibold">{t("Symptoms:")}</span>{" "}
                {info.symptoms.join(", ")}
              </p>
              <p>
                <span className="font-semibold">{t("Allergies:")}</span>{" "}
                {info.allergies.join(", ")}
              </p>
              <p>
                <span className="font-semibold">{t("Past History:")}</span>{" "}
                {info.past_Medical_History}
              </p>
              <p>
                <span className="font-semibold">{t("Family History:")}</span>{" "}
                {info.family_Medical_History}
              </p>
              <p>
                <span className="font-semibold">{t("Status:")}</span> {info.status}
              </p>
              {info.status === "Scheduled" && (
                <p>
                  <span className="font-semibold">{t("Scheduling Number:")}</span>{" "}
                  {info.schedulingNumber}
                </p>
              )}
              {info.status === "specialityChange" && (
                <div>
                  <p>
                    <span className="font-semibold">{t("Reason:")}</span>{" "}
                    {info.reasonChange}
                  </p>
                  <p>
                    <span className="font-semibold">{t("Recommended to:")}</span>{" "}
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
