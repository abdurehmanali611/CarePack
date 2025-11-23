/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { handleCanceling, handleSchedule } from "@/lib/actions";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import React, { useState, createContext, useContext, useMemo } from "react";
import { toast } from "sonner";

export type patient = {
  _id: string;
  preHistory: boolean;
  doctorName: string;
  reason: string;
  symptoms: Array<string>;
  allergies: Array<string>;
  past_Medical_History: string;
  family_Medical_History: string;
  expected_Appointment_Date: Date;
  comments_Or_Notes: string;
  identity_Type: string;
  identity_Number: string;
  identity_photo: string;
  userId: string;
  status: string;
  schedulingNumber: number;
  Disease?: string;
  Doctor?: string;
  patientName: string;
  age: number;
  sex: string;
  selectedSpeciality?: string;
  doctors: Array<{
    id: string;
    name: string;
    speciality: string;
    appDates: Array<Date>;
    appTimes: Array<Date>;
  }>;
  specialities: Array<string>;
  selectedDoctor?: string;
};

type SelectionContextType = {
  selectedSpecialities: Record<string, string>;
  setSelectedSpeciality: (rowId: string, speciality: string) => void;
  selectedDoctors: Record<string, string>;
  setSelectedDoctor: (rowId: string, doctor: string) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedSpecialities, setSelectedSpecialities] = useState<
    Record<string, string>
  >({});
  const [selectedDoctors, setSelectedDoctors] = useState<
    Record<string, string>
  >({});

  const setSelectedSpeciality = (rowId: string, speciality: string) => {
    setSelectedSpecialities((prev) => ({ ...prev, [rowId]: speciality }));
    setSelectedDoctors((prev) => ({ ...prev, [rowId]: "" }));
  };

  const setSelectedDoctor = (rowId: string, doctor: string) => {
    setSelectedDoctors((prev) => ({ ...prev, [rowId]: doctor }));
  };

  const contextValue = useMemo(
    () => ({
      selectedSpecialities,
      setSelectedSpeciality,
      selectedDoctors,
      setSelectedDoctor,
    }),
    [selectedSpecialities, selectedDoctors]
  );

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
    </SelectionContext.Provider>
  );
}

function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}

const SpecialityCell = ({ row }: { row: any }) => {
  const { selectedSpecialities, setSelectedSpeciality } = useSelection();
  const selectedSpeciality = selectedSpecialities[row.original._id] || "";

  return (
    <Select
      value={selectedSpeciality}
      onValueChange={(value) => {
        setSelectedSpeciality(row.original._id, value);
      }}
    >
      <SelectTrigger className="cursor-pointer">
        <SelectValue placeholder="Select Speciality..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Speciality</SelectLabel>
          {row.original.specialities.map((item: string) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const DoctorsCell = ({ row }: { row: any }) => {
  const { selectedSpecialities, selectedDoctors, setSelectedDoctor } =
    useSelection();

  const selectedSpeciality = selectedSpecialities[row.original._id] || "";
  const selectedDoctor = selectedDoctors[row.original._id] || "";

  console.log(selectedDoctor);
  const filteredPhysicians = row.original.doctors.filter(
    (item: any) => item.speciality === selectedSpeciality
  );

  return (
    <TooltipProvider>
      <Select
        value={selectedDoctor}
        onValueChange={(value) => {
          setSelectedDoctor(row.original._id, value);
        }}
        disabled={!selectedSpeciality}
      >
        <SelectTrigger className="cursor-pointer">
          <SelectValue
            placeholder={
              selectedSpeciality
                ? "Select Doctor..."
                : "Select speciality first"
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Doctors</SelectLabel>
            {filteredPhysicians.length > 0 ? (
              filteredPhysicians.map((item: any) => (
                <Tooltip key={item.name}>
                  <TooltipTrigger className="flex flex-col gap-3">
                    <SelectItem value={item.name}>{item.name}</SelectItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col gap-1 text-sm">
                      <p className="font-bold">{item.name} Schedule</p>
                      <p>
                        **Dates:**{" "}
                        {item.appDates.length > 0
                          ? item.appDates
                              .map((date: Date) =>
                                new Date(date).toLocaleDateString()
                              )
                              .join(", ")
                          : "No scheduled dates."}
                      </p>
                      <p>
                        **Times:**{" "}
                        {item.appDates.length > 0
                          ? item.appDates
                              .map((time: Date) =>
                                new Date(time).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              )
                              .join(", ")
                          : "No scheduled times."}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))
            ) : (
              <div className="px-2 py-1 text-sm text-muted-foreground">
                {selectedSpeciality
                  ? "No doctors for selected speciality"
                  : "Select speciality first"}
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </TooltipProvider>
  );
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
    accessorKey: "sex",
    header: () => <div>Sex</div>,
  },
  {
    accessorKey: "expected_Appointment_Date",
    header: () => <div>Expected Date</div>,
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue("expected_Appointment_Date")).toDateString()}
      </div>
    ),
  },
  {
    id: "Detail",
    header: () => <div>Detail</div>,
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger asChild className="cursor-pointer">
            <Button variant="outline" size="sm">Show Detail</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{row.getValue("patientName")} Details</DialogTitle>
              <DialogDescription>
                {row.getValue("patientName")} Information Details
              </DialogDescription>
            </DialogHeader>
            <ul className="flex flex-col gap-3">
              {row.original.doctorName !== "" && (
                <li className="flex gap-5">
                  <span className="text-red-400 font-semibold font-serif">
                    Previous Physician:
                  </span>{" "}
                  {row.original.doctorName}
                </li>
              )}
              <li className="flex gap-5">
                <span className="text-red-400 font-semibold font-serif">
                  Visiting Reason:
                </span>{" "}
                {row.original.reason}
              </li>
              {row.original.reason === "Disease" && (
                <div className="flex flex-col gap-3">
                  <li className="flex gap-5">
                    <span className="text-red-400 font-semibold font-serif">
                      Symptoms:
                    </span>{" "}
                    {row.original.symptoms.join(", ")}
                  </li>
                  <li className="flex gap-5">
                    <span className="text-red-400 font-semibold font-serif">
                      Allergies:
                    </span>{" "}
                    {row.original.allergies.join(", ")}
                  </li>
                  <li className="flex gap-5">
                    <span className="text-red-400 font-semibold font-serif">
                      Past Medical History:
                    </span>{" "}
                    {row.original.past_Medical_History}
                  </li>
                  <li className="flex gap-5">
                    <span className="text-red-400 font-semibold font-serif">
                      Family Medical History:
                    </span>{" "}
                    {row.original.family_Medical_History}
                  </li>
                </div>
              )}
              <li className="flex gap-5">
                <span className="text-red-400 font-semibold font-serif">
                  Comments or Notes:
                </span>{" "}
                {row.original.comments_Or_Notes}
              </li>
              <li className="flex gap-5">
                <span className="text-red-400 font-semibold font-serif">
                  ID Type:
                </span>{" "}
                {row.original.identity_Type}
              </li>
              <li className="flex gap-5">
                <span className="text-red-400 font-semibold font-serif">
                  ID Number:
                </span>{" "}
                {row.original.identity_Number}
              </li>
              <li className="flex flex-col gap-3">
                <span className="text-red-400 font-semibold font-serif">
                  Scanned ID Image:
                </span>{" "}
                <Image
                  src={row.original.identity_photo}
                  alt="ID Photo"
                  width={120}
                  height={120}
                  loading="eager"
                  className="rounded-xl self-center"
                />
              </li>
            </ul>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "specialities",
    header: () => <div>Speciality</div>,
    cell: ({ row }) => <SpecialityCell row={row} />,
  },
  {
    id: "doctors",
    header: () => <div>Doctor</div>,
    cell: ({ row }) => <DoctorsCell row={row} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        Status
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div
        className={clsx({
          "text-green-300 text-center": row.getValue("status") === "Scheduled",
          "text-red-300 text-center": row.getValue("status") === "Cancelled",
          "text-center": row.getValue("status") === "Pending",
        })}
      >
        {row.getValue("status") !== "Speciality Change" &&
          row.getValue("status")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [appDate, setAppDate] = React.useState<string | undefined>();
      const [appTime, setAppTime] = React.useState<string | undefined>();
      const [reason, setReason] = React.useState<string>("");
      const [open, setOpen] = useState(false);
      const { selectedDoctors, setSelectedDoctor, setSelectedSpeciality } =
        useSelection();
      const selectedDoctor = selectedDoctors[row.original._id];
      const rowId = row.original._id;

      const clearSelection = () => {
        setSelectedSpeciality(rowId, "");
        setSelectedDoctor(rowId, "");
      };
      return (
        row.original.status === "Pending" && (
          <div className="flex gap-3 items-center">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                asChild
                className="cursor-pointer"
                disabled={!selectedDoctor}
              >
                <Button>Schedule</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Already There</DialogTitle>
                  <DialogDescription>
                    Change the time and Date if necessary
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="date"
                      className="font-serif font-semibold text-xl "
                    >
                      Date:
                    </label>
                    <input
                      type="date"
                      name="appDate"
                      value={appDate ?? ""}
                      onChange={(e) => setAppDate(e.target.value)}
                      className="w-fit p-2 border-2 rounded-xl cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="Time"
                      className="font-serif font-semibold text-xl "
                    >
                      Time:
                    </label>
                    <input
                      type="time"
                      name="appTime"
                      value={appTime ?? ""}
                      onChange={(e) => setAppTime(e.target.value)}
                      className="w-fit p-2 border-2 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    const date = new Date(`${appDate}T${appTime}:00`);
                    await handleSchedule(row, date, selectedDoctor);
                    await refresh();
                    setOpen(false);
                    clearSelection();
                    setAppDate(undefined);
                    setAppTime(undefined);
                    toast.success("Appointment Updated Successfully");
                  }}
                  className="cursor-pointer"
                >
                  Schedule
                </Button>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild className="cursor-pointer">
                <Button variant="destructive">Cancel</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelling Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to Cancel {row.original.patientName}{" "}
                    request
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-3 my-3">
                  <Label htmlFor="reason">Reason:</Label>
                  <Input
                    placeholder="enter reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    type="text"
                    name="reason"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Go back
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      if (reason === "") {
                        toast.warning("Please Enter a reason of declining")
                      }else {
                        await handleCanceling(row.original._id, reason);
                        await refresh();
                        setOpen(false);
                        clearSelection();
                        setAppDate(undefined);
                        setAppTime(undefined);
                        toast.success("Appointment Updated Successfully");
                      }
                    }}
                    className="cursor-pointer"
                  >
                    Yes, Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      );
    },
  },
];
