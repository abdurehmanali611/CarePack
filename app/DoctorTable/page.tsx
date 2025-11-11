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
      patientName: "Abiy Ahmed",
      status: "Treated",
      phoneNumber: "+251943542343",
      email: "abiyahmed@gmail.com",
      Doctor: "Dr. Michael Johnson",
      Disease: "Neural Disease",
    },
    {
      id: 2,
      patientName: "Mekiya Kheiru",
      status: "Rescheduled",
      phoneNumber: "+251934567654",
      email: "mekiya@gmail.com",
      Doctor: "Dr. Michael Johnson",
      Disease: "Neural Disease",
    },
    {
      id: 3,
      patientName: "Abdurehman Ali",
      status: "Treated",
      phoneNumber: "+251935000642",
      email: "abdurehmanali611@gmail.com",
      Doctor: "Dr. Sofia Martinez",
      Disease: "Dermatology",
    },
    {
      id: 4,
      patientName: "Yusra Ali",
      status: "Rescheduled",
      phoneNumber: "+251986857711",
      email: "yusra@gmail.com",
      Doctor: "Dr. David Kim",
      Disease: "Orthopedic Surgery",
    },
    {
      id: 5,
      patientName: "Ali Hussen",
      status: "Treated",
      phoneNumber: "+251911979276",
      email: "alihussen@gmail.com",
      Doctor: "Dr. Amelia Reed",
      Disease: "Cardiology",
    },
    {
      id: 6,
      patientName: "Mulunesh Ahmed",
      status: "Rescheduled",
      phoneNumber: "+251913692129",
      email: "mulunesh@gmail.com",
      Doctor: "Dr. Fatma Al-Sayed",
      Disease: "Gastroenterology",
    },
  ];
}

export default function DoctorTable() {
  const [date, setDate] = useState<Date | undefined>();
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
            <Button>
              {date
                ? `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
                : "Select Date"}
              <Calendar1 className="w-8 h-8" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              captionLayout="dropdown"
              buttonVariant="ghost"
              onSelect={(value) => {
                setDate(value);
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
