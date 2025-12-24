/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ApproveChange, fetchingCredential } from "@/lib/actions";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PatientInfo = {
  _id: string
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
  schedulingNumber: number;
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

import { useSelection } from "./selection-context";

const useCredentialData = () => {
  const [credentialData, setCredentialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchingCredential();
        setCredentialData(data || []);
      } catch (error) {
        console.error("Error fetching credential data:", error);
        setCredentialData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAvailableSpecialities = () => {
    const doctors = credentialData.filter(
      (credential: any) =>
        credential.roleType === "Doctor" && credential.Speciality
    );

    const specialities = [
      ...new Set(doctors.map((doctor: any) => doctor.Speciality)),
    ].sort();

    return specialities;
  };

  const getDoctorsBySpeciality = (speciality: string) => {
    return credentialData.filter(
      (doctor: any) =>
        doctor.Speciality === speciality && doctor.roleType === "Doctor"
    );
  };

  return {
    credentialData,
    loading,
    getAvailableSpecialities,
    getDoctorsBySpeciality,
  };
};

const SpecialityCell = ({ row, t }: { row: any, t: (key: string) => string }) => {
  const { selectedSpecialities, setSelectedSpeciality, setAvailableDoctors } =
    useSelection();
  const {
    getAvailableSpecialities,
    getDoctorsBySpeciality,
    loading,
    credentialData,
  } = useCredentialData();
  const selectedSpeciality =
    selectedSpecialities[row.original._id] || row.original.recommend || "";
  const [hasSetDefault, setHasSetDefault] = useState(false);

  useEffect(() => {
    if (
      row.original.recommend &&
      !selectedSpecialities[row.original._id] &&
      !hasSetDefault &&
      credentialData.length > 0
    ) {
      console.log("Setting default speciality:", row.original.recommend);
      setSelectedSpeciality(row.original._id, row.original.recommend);

      const doctors = getDoctorsBySpeciality(row.original.recommend);
      console.log("Doctors for default speciality:", doctors);
      setAvailableDoctors(row.original._id, doctors);

      setHasSetDefault(true);
    }
  }, [
    row.original.recommend,
    row.original._id,
    selectedSpecialities,
    setSelectedSpeciality,
    setAvailableDoctors,
    getDoctorsBySpeciality,
    credentialData.length,
    hasSetDefault,
  ]);

  const handleSpecialityChange = async (value: string) => {
    console.log("Speciality changed to:", value);
    setSelectedSpeciality(row.original._id, value);

    try {
      const doctors = getDoctorsBySpeciality(value);
      console.log("Doctors for selected speciality:", doctors);
      setAvailableDoctors(row.original._id, doctors);
    } catch (error) {
      console.error("Error getting doctors:", error);
      setAvailableDoctors(row.original._id, []);
    }
  };

  const specialities = getAvailableSpecialities();
  console.log("Available specialities:", specialities);

  return (
    <Select
      value={selectedSpeciality}
      onValueChange={handleSpecialityChange}
      disabled={loading}
    >
      <SelectTrigger className="cursor-pointer">
        <SelectValue
          placeholder={
            loading ? `${t("Loading specialities")}` : `${t("Select Speciality")}`
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("Speciality")}</SelectLabel>
          {specialities.length > 0 ? (
            specialities.map((speciality) => (
              <SelectItem key={speciality} value={speciality}>
                {speciality}
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-1 text-sm text-muted-foreground">
              {loading ? `${t("Loading")}` : `${t("No specialities available")}`}
            </div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const DoctorsCell = ({ row, t }: { row: any, t:(key: string) => string }) => {
  const {
    selectedSpecialities,
    selectedDoctors,
    setSelectedDoctor,
    availableDoctors,
  } = useSelection();

  const selectedSpeciality = selectedSpecialities[row.original._id] || "";
  const selectedDoctor = selectedDoctors[row.original._id] || "";
  const doctorsForSpeciality = availableDoctors[row.original._id] || [];

  console.log("DoctorsCell - Selected Speciality:", selectedSpeciality);
  console.log("DoctorsCell - Available Doctors:", doctorsForSpeciality);

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
                ? doctorsForSpeciality.length > 0
                  ? `${t("Select Doctor")}`
                  : `${t("No doctors available")}`
                : `${t("Select speciality first")}`
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("Doctors")}</SelectLabel>
            {doctorsForSpeciality.length > 0 ? (
              doctorsForSpeciality.map((doctor: any) => (
                <Tooltip key={doctor._id}>
                  <TooltipTrigger className="flex flex-col gap-3 w-full">
                    <SelectItem value={doctor._id}>
                      {doctor.Full_Name}
                    </SelectItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col gap-1 text-sm">
                      <p className="font-bold">{doctor.Full_Name} {t("Schedule")}</p>
                      <p>
                        <strong>{t("Speciality:")}</strong> {doctor.Speciality}
                      </p>
                      <p>
                        <strong>{t("Experience:")}</strong> {doctor.experienceYear}{" "}
                        {t("years")}
                      </p>
                      <p>
                        <strong>{t("Available Dates:")}</strong>{" "}
                        {doctor.AppointmentDates &&
                        doctor.AppointmentDates.length > 0
                          ? doctor.AppointmentDates.map((date: Date) =>
                              new Date(date).toLocaleDateString()
                            ).join(", ")
                          : `${t("No scheduled dates")}`}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))
            ) : (
              <div className="px-2 py-1 text-sm text-muted-foreground">
                {selectedSpeciality
                  ? `${t("No doctors available for selected speciality")}`
                  : `${t("Select speciality first")}`}
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </TooltipProvider>
  );
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
    id: "detail",
    header: () => <div>{t("Detail")}</div>,
    cell: ({ row }) => {
      const original = row.original as any;
      return (
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
                  {t("Allergies")}
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
                  {t("Past Medical History")}
                </span>
                <div className="p-2 rounded-md max-h-[120px] overflow-y-auto whitespace-pre-wrap wrap-break-words">
                  {original.past_Medical_History || "No information provided"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">
                  {t("Family Medical History")}
                </span>
                <div className="p-2 rounded-md max-h-[120px] overflow-y-auto whitespace-pre-wrap wrap-break-words">
                  {original.family_Medical_History || "No information provided"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">
                  {t("Change Reason")}
                </span>
                <div className="p-2 rounded-md min-h-10">
                  {original.reasonChange}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit text-red-400 font-semibold">
                  {t("Recommended Speciality")}
                </span>
                <div className="p-2 rounded-md min-h-10">
                  {original.recommend}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "doctorName",
    header: () => <div>{t("Current Doctor")}</div>,
  },
  {
    accessorKey: "doctorSpeciality",
    header: () => <div>{t("Speciality")}</div>,
  },
  {
    accessorKey: "reasonChange",
    header: () => <div>{t("Change reason")}</div>,
  },
  {
    id: "speciality",
    header: () => <div>{t("New Speciality")}</div>,
    cell: ({ row }) => <SpecialityCell row={row} t={t}/>,
  },
  {
    id: "doctor",
    header: () => <div>{t("New Doctor")}</div>,
    cell: ({ row }) => <DoctorsCell row={row} t={t}/>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { selectedDoctors, setSelectedDoctor, setSelectedSpeciality } =
        useSelection();
      const selectedDoctor = selectedDoctors[row.original._id];

      const clearSelection = () => {
        setSelectedSpeciality(row.original._id, "");
        setSelectedDoctor(row.original._id, "");
      };

      return (
        <div className="flex gap-3 items-center">
          <Button
            onClick={async () => {
              if (!selectedDoctor) {
                toast.error(`${t("Please select a doctor first")}`);
                return;
              }
              try {
                await ApproveChange(row, selectedDoctor);
                await refresh();
                clearSelection();
                toast.success(`${t("Patient transferred successfully")}`);
              } catch (error: any) {
                toast.error(`${t("Failed to transfer patient:")} ${error.message}`);
              }
            }}
            disabled={!selectedDoctor}
          >
            {t("Approve Transfer")}
          </Button>
        </div>
      );
    },
  },
];
