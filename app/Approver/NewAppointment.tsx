/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from "react";
import { patient, SelectionProvider } from "./columns";
import {
  fetchingCredential,
  fetchingMedical,
  fetchingUsers,
} from "@/lib/actions";
import { DataTableClientWrapper } from "./DataTableClientWrapper";

async function getData(): Promise<patient[]> {
  const patients = (await fetchingMedical()) || [];
  const users = (await fetchingUsers()) || [];
  const credentials = (await fetchingCredential()) || [];

  const doctors = credentials
    .filter((item: any) => item.roleType === "Doctor")
    .map((d: any) => ({
      id: d._id,
      name: d.Full_Name,
      speciality: d.Speciality,
      appDates: d.AppointmentDates || []
    }));

  const uniqueSpeciality = [...new Set(doctors.map((d: any) => d.speciality))];

  const updated = patients
    .filter((item: any) => item.status !== "specialityChange")
    .map((item: any) => {
      const user = users.find((u: any) => u._id === item.userId);
      return {
        ...item,
        patientName: user?.Full_Name || "Unknown",
        age: user
          ? new Date().getFullYear() - new Date(user?.birthDate).getFullYear()
          : "-",
        sex: user?.gender || "-",
        doctors: doctors,
        specialities: uniqueSpeciality,
      };
    });
  return updated;
}

export default function NewAppointment() {
  const [data, setData] = useState<patient[]>([]);

  const refetchData = useCallback(async() => {
    const fetched = await getData()
    setData(fetched)
  }, [])

  useEffect(() => {
    (async () => {
     await refetchData()
    })()
  }, [refetchData]);

  return (
    <div className="flex flex-col gap-5">
      <div className="container mx-auto py-3">
        <SelectionProvider>
          <DataTableClientWrapper data={data ?? []} refresh={refetchData}/>
        </SelectionProvider>
      </div>
    </div>
  );
}
