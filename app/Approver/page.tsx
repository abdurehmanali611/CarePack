/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Card from "@/components/Card";
import { getStatusCount } from "@/lib/actions";
import { useTranslations } from "next-intl";
import NewAppointment from "./NewAppointment";
import { useLayoutEffect, useState } from "react";

export default function Approver() {
  const t = useTranslations("NewApp");
  const [counts, setCounts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    async function fetchCounts() {
      try {
        setLoading(true);
        const result = await getStatusCount();
        setCounts(result);
      } catch (error) {
        console.error("Failed to fetch status counts:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCounts();
  }, []);

  if (loading || !counts) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 w-64 bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="container mx-auto py-3">
          <div className="h-10 bg-gray-200 animate-pulse rounded-md w-64 mb-4" />
          <div className="h-96 bg-gray-200 animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <Card
          type="Scheduled"
          count={counts.Scheduled}
          label={t("Scheduled Appointments")}
          icon="/assets/appointments.svg"
        />
        <Card
          type="Pending"
          count={counts.Pending + counts.specialityChange}
          label={t("Pending Appointments")}
          icon="/assets/pending.svg"
        />
        <Card
          type="Cancelled"
          count={counts.Cancelled}
          label={t("Cancelled Appointments")}
          icon="/assets/cancelled.svg"
        />
        <Card
          type="Treated"
          count={counts.Healed}
          label={t("Healed Appointments")}
          icon="/assets/treated.svg"
        />
      </div>
      <div className="container mx-auto py-3">
        <NewAppointment />
      </div>
    </div>
  );
}