/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useState } from "react";
import { getStatusCount } from "@/lib/actions";
// Import the client components directly instead of using dynamic()
import PatientInfo from './Patient/patientInfo';
import DoctorInfo from './Doctor/doctorInfo';

export default function Reports() {
  const [counts, setCounts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("NewApp");

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
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mx-2 p-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 w-64 bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="flex justify-between items-center px-5">
          <div className="h-10 bg-gray-200 animate-pulse rounded-md w-48" />
          <div className="h-10 bg-gray-200 animate-pulse rounded-md w-48" />
        </div>
        <div className="container mx-auto py-3">
          <div className="h-10 bg-gray-200 animate-pulse rounded-md w-64 mb-4" />
          <div className="h-96 bg-gray-200 animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mx-2 p-5">
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
      <div className="flex justify-between items-center px-5">
        <Button asChild>
          <Link href="/UpdateCredential">{t("Update/Delete Credential")}</Link>
        </Button>
        <Button asChild>
          <Link href="/Credential">{t("Create Credential")}</Link>
        </Button>
      </div>
      <div className="container mx-auto py-3">
        <Tabs defaultValue="patient">
            <TabsList>
                <TabsTrigger value="patient" className="cursor-pointer">{t("Patient Table")}</TabsTrigger>
                <TabsTrigger value="doctor" className="cursor-pointer">{t("Doctor Table")}</TabsTrigger>
            </TabsList>
            <TabsContent value="patient">
              <PatientInfo />
            </TabsContent>
            <TabsContent value="doctor">
              <DoctorInfo />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}