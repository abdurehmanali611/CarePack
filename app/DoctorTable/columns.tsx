/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AlertDoctor } from "./doctorButton";
import { useState } from "react";
import {
  handleCured,
  handleReschedule,
} from "@/lib/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PatientInfo = {
  _id: string;
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
  userId: string;
  schedulingNumber: number
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

export const columns = (refresh: () => void, t: (key: string) => string): ColumnDef<patient>[] => [
  {
    accessorKey: "id",
    header: () => <div className="font-semibold font-serif">{t("ID")}</div>,
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "patientName",
    header: () => <div>{t("Patient Name")}</div>,
  },
  {
    accessorKey: "age",
    header: () => <div>{t("Age")}</div>,
  },
  {
    accessorKey: "reason",
    header: () => <div>{t("Reason")}</div>,
  },
  {
    accessorKey: "AppointmentDate",
    header: () => <div>{t("Appointment Date")}</div>,
    cell: ({ row }) => (
      <div>{new Date(row.getValue("AppointmentDate")).toDateString()}</div>
    ),
  },
  {
    id: "AppointmentTime",
    header: () => <div>{t("Appointment Time")}</div>,
    cell: ({ row }) => {
      const original = row.original as any;
      const appDate = new Date(original.AppointmentDate);
      return (
        <div>
          {appDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    id: "Detail",
    header: () => <div>{t("Detail")}</div>,
    cell: ({ row }) => {
      const original = row.original as any;
      return original.reason === "Disease" ? (
        <Dialog>
          <DialogTrigger asChild className="cursor-pointer">
            <Button variant="outline" size="sm">
              {t("View Detail")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{original.patientName} {t("Details")}</DialogTitle>
              <DialogDescription>
                {original.patientName} {t("information Details")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">{t("Reason")}</span>
                <div className="p-2 rounded-md min-h-10">{original.reason}</div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">
                  {t("Symptoms")}
                </span>
                <div className="flex flex-col gap-1 p-2 rounded-md max-h-30 overflow-y-auto">
                  {original.symptoms?.map((symptom: any, index: any) => (
                    <div key={index} className="text-sm">
                      • {symptom}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">
                  {t("Allergies")}
                </span>
                <div className="flex flex-col gap-1 p-2 rounded-md max-h-30 overflow-y-auto">
                  {original.allergies?.map((allergy: any, index: any) => (
                    <div key={index} className="text-sm">
                      • {allergy}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">
                  {t("Past Medical History")}
                </span>
                <div className="p-2 rounded-md max-h-30 overflow-y-auto whitespace-pre-wrap wrap-break-words">
                  {original.past_Medical_History || "No information provided"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">
                  {t("Family Medical History")}
                </span>
                <div className="p-2 rounded-md max-h-30 overflow-y-auto whitespace-pre-wrap wrap-break-words">
                  {original.family_Medical_History || "No information provided"}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <p>{t("CheckUp")}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div>{t("Status")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [disease, setDisease] = useState<string | null>(null);
      const [date, setDate] = useState<string | null>(null);
      return (
        <div className="flex justify-between items-center">
          <AlertDoctor
            btnName={t("Cured")}
            title={t("Disease")}
            description={t("What was the Disease/Case")}
            type="text"
            label={t("Disease")}
            placeholder={t("Disease name/Checkup")}
            value={disease ?? ""}
            setValue={setDisease}
            btnText={t("Submit")}
            ToDo={async () => {
              const original = row.original as any;
              await handleCured(disease, original.userId, original._id);
              await refresh()
              toast.success(`${t("Patient Data Updated Successfully")}`);
            }}
          />
          <AlertDoctor
            btnName={t("Reschedule")}
            title={t("Reschedule")}
            description={t("Set time and Date for the another Schedule")}
            type="datetime-local"
            label={t("Date and Time")}
            placeholder={t("Assign Date and Time")}
            value={date ?? ""}
            setValue={setDate}
            btnText={t("Reschedule")}
            ToDo={async () => {
              const original = row.original as any;
              const newDate = new Date(`${date}`);
              await handleReschedule(newDate, original._id, original.doctorId);
              await refresh()
              toast.success(`${t("Patient Data Updated Successfully")}`);
            }}
          />
        </div>
      );
    },
  },
];
