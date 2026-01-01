"use client";
import { patient } from "./columns";
import { DataTableClientWrapper } from "./DataTableClientWrapper";
import { Calendar1 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { fetchingCredential } from "@/lib/actions";

async function getData(): Promise<patient[]> {
  const data = (await fetchingCredential()) || [];
  return data;
}

export default function DoctorTable({ name }: { name: string }) {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<patient[]>([]);

  const refetchData = useCallback(async () => {
    const res = await getData();
    const filteredData = res.filter(
      (patient) => patient.Full_Name === name
    );
    const flattenedData = filteredData.flatMap(
      (doctor) =>
        doctor.patientInfos
          ?.filter((item) => {
            const appDate = new Date(item.AppointmentDate);
            const today = new Date(date);
            console.log(
              appDate,
              today,
              appDate.toDateString(),
              today.toDateString()
            );

            return (
              (appDate.toDateString() === today.toDateString() &&
                (item.status !== "Healed" && item.status !== "specialityChange"))
            );
          })
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
            AppointmentDate: patientinfo.AppointmentDate,
            status: patientinfo.status,
            schedulingNumber: patientinfo.schedulingNumber,
            reeasonChange: patientinfo.reasonChange,
            recommend: patientinfo.recommend,
            doctorId: doctor._id,
            userId: patientinfo.userId,
            _id: patientinfo._id 
          })) || []
    );
    setData(flattenedData);
  }, [date, name]);

  useEffect(() => {
    (async () => {
      await refetchData();
    })()
  }, [refetchData]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center self-end w-fit p-5">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="cursor-pointer">
            <Button variant="outline">
              {date.toDateString()}
              <Calendar1 className="w-8 h-8" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              captionLayout="dropdown"
              buttonVariant="ghost"
              onSelect={(value) => {
                setDate(value!);
                setOpen(!open);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="container mx-auto py-3">
        <DataTableClientWrapper data={data ?? []} refresh={refetchData} />
      </div>
    </div>
  );
}