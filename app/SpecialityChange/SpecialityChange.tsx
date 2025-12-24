"use client";
import { fetchingCredential } from "@/lib/actions";
import { DataTableClientWrapper } from "./DataTableClientWrapper";
import { useCallback, useEffect, useState } from "react";
import { patient } from "./columns";

async function getData(): Promise<patient[]> {
  const data = (await fetchingCredential()) ?? [];
  return data;
}

export default function SpecialityChange() {
  const [data, setData] = useState<patient[]>([]);

  const refetchData = useCallback(async () => {
    const res = await getData();
    const flattenedData = res.flatMap((doctor) =>
      doctor.patientInfos
        ?.filter((item) => item.status === "specialityChange")
        .map((patientinfo) => ({
          ...doctor, 
          ...patientinfo, 
          patientName: patientinfo.name,
          age: patientinfo.age,
          reason: patientinfo.reason,
          symptoms: patientinfo.symptoms,
          allergies: patientinfo.allergies,
          past_Medical_History: patientinfo.past_Medical_History,
          family_Medical_History: patientinfo.family_Medical_History,
          status: patientinfo.status,
          schedulingNumber: patientinfo.schedulingNumber,
          reasonChange: patientinfo.reasonChange,
          recommend: patientinfo.recommend,
          doctorName: doctor.Full_Name,
          doctorSpeciality: doctor.Speciality,
          doctorDocumentId: doctor._id,
          patientInfoId: patientinfo._id, 
        })) || []
    );
    setData(flattenedData)
  }, []);

  useEffect(() => {
    (async () => {
      await refetchData()
    })()
  }, [refetchData])

  return (
    <div className="flex flex-col gap-5">
      <div className="container mx-auto py-3">
        <DataTableClientWrapper data={data ?? []} refresh={refetchData} />
      </div>
    </div>
  );
}