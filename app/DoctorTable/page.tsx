"use client";
import { columns, patient } from "./columns";
import { DataTable } from "./data-table";
import { Calendar1 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";

async function getData(): Promise<patient[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      patientName: "Abdurehman Ali",
      age: 23,
      sex: "Male",
      appointmentTime: "10:00-12:00 AM",
      scheduleNumber: 1,
    },
    {
      id: 2,
      patientName: "Yusra Ali",
      age: 18,
      sex: "Female",
      appointmentTime: "10:00-12:00 AM",
      scheduleNumber: 3,
    },
    {
      id: 3,
      patientName: "Ali Hussen",
      age: 50,
      sex: "Male",
      appointmentTime: "10:00-12:00 AM",
      scheduleNumber: 2,
    },
    {
      id: 4,
      patientName: "Mulunesh Ahmed",
      age: 40,
      sex: "Female",
      appointmentTime: "10:00-12:00 AM",
      scheduleNumber: 3,
    },
  ];
}

export default function DoctorTable() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<patient[]>([]);

  useState(() => {
    getData().then((res) => setData(res));
  });

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
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
