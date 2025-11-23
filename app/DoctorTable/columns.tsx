/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AlertDoctor } from "./doctorButton";
import { useState } from "react";
import {
  handleCured,
  handleReschedule,
  handleSpecialityChange,
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

export const columns = (refresh: () => void): ColumnDef<patient>[] => [
  {
    accessorKey: "id",
    header: () => <div className="font-semibold font-serif">ID</div>,
    cell: ({ row }) => <div>{row.index + 1}</div>,
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
    accessorKey: "reason",
    header: () => <div>Reason</div>,
  },
  {
    accessorKey: "AppointmentDate",
    header: () => <div>Appointment Date</div>,
    cell: ({ row }) => (
      <div>{new Date(row.getValue("AppointmentDate")).toDateString()}</div>
    ),
  },
  {
    id: "AppointmentTime",
    header: () => <div>Appointment Time</div>,
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
    header: () => <div>Detail</div>,
    cell: ({ row }) => {
      const original = row.original as any;
      return original.reason === "Disease" ? (
        <Dialog>
          <DialogTrigger asChild className="cursor-pointer">
            <Button variant="outline" size="sm">
              View Detail
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{original.patientName} Details</DialogTitle>
              <DialogDescription>
                {original.patientName} information Details
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">Reason</span>
                <div className="p-2 rounded-md min-h-10">{original.reason}</div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">
                  Symptoms
                </span>
                <div className="flex flex-col gap-1 p-2 rounded-md max-h-[120px] overflow-y-auto">
                  {original.symptoms?.map((symptom: any, index: any) => (
                    <div key={index} className="text-sm">
                      • {symptom}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">
                  Allergies
                </span>
                <div className="flex flex-col gap-1 p-2 rounded-md max-h-[120px] overflow-y-auto">
                  {original.allergies?.map((allergy: any, index: any) => (
                    <div key={index} className="text-sm">
                      • {allergy}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">
                  Past Medical History
                </span>
                <div className="p-2 rounded-md max-h-[120px] overflow-y-auto whitespace-pre-wrap wrap-break-words">
                  {original.past_Medical_History || "No information provided"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">
                  Family Medical History
                </span>
                <div className="p-2 rounded-md max-h-[120px] overflow-y-auto whitespace-pre-wrap wrap-break-words">
                  {original.family_Medical_History || "No information provided"}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <p>CheckUp</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div>Status</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [disease, setDisease] = useState<string | null>(null);
      const [reason, setReason] = useState<string | null>(null);
      const [date, setDate] = useState<string | null>(null);
      const [speciality, setSpeciality] = useState<string | null>(null);
      return (
        <div className="flex justify-between items-center">
          <AlertDoctor
            btnName="Cured"
            title="Disease"
            description="What was the Disease/Case"
            type="text"
            label="Disease"
            placeholder="Disease name/Checkup"
            value={disease ?? ""}
            setValue={setDisease}
            btnText="Submit"
            ToDo={async () => {
              const original = row.original as any;
              await handleCured(disease, original.userId, original._id);
              await refresh()
              toast.success("Patient Data Updated Successfully");
            }}
          />
          <AlertDoctor
            btnName="Reschedule"
            title="Reschedule"
            description="Set time and Date for the another Schedule"
            type="datetime-local"
            label="Date and Time"
            placeholder="Assign Date and Time"
            value={date ?? ""}
            setValue={setDate}
            btnText="Reschedule"
            ToDo={async () => {
              const original = row.original as any;
              const newDate = new Date(`${date}`);
              await handleReschedule(newDate, original.userId, original._id, original.doctorId);
              await refresh()
              toast.success("Patient Data Updated Successfully");
            }}
          />
          <AlertDoctor
            btnName="Speciality Change"
            title="Change Specialist"
            description="Select which specialist you recommend with reason"
            type="text"
            label="Your reason"
            label2="select Speciality"
            placeholder="reason..."
            placeholder2="select here..."
            value={reason ?? ""}
            value2={speciality ?? ""}
            setValue={setReason}
            setValue2={setSpeciality}
            btnText="Send"
            special="yes"
            ToDo={async() => {
              const original = row.original as any;
              await handleSpecialityChange(
                reason,
                speciality,
                original.userId,
                original._id
              );
              await refresh()
              toast.success("Patient Data Updated Successfully");
            }}
          />
        </div>
      );
    },
  },
];
