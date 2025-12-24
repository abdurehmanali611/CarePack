/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { patient } from "./columns";
import { DataTableClientWrapper } from "./DataTableClientWrapper";
import { fetchingMedical, fetchingUsers } from "@/lib/actions";

export default function PatientInfo() {
  const [data, setData] = useState<patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const [medicalRes, usersRes] = await Promise.all([
          fetchingMedical(),
          fetchingUsers()
        ]);

        if (!medicalRes.ok || !usersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const patients = await medicalRes.json();
        const users = await usersRes.json();

        const processedData = patients.map((item: any) => {
          const user = users.find((use: any) => use._id === item.userId);
          return {
            ...item,
            patientName: user?.Full_Name || "-",
            age: user
              ? new Date().getFullYear() - new Date(user?.birthDate).getFullYear()
              : "-",
            email: user?.email,
            phoneNumber: user?.phoneNumber
          };
        });
        
        setData(processedData);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="container mx-auto py-3">
          <div className="h-10 bg-gray-200 animate-pulse rounded-md w-64 mb-4" />
          <div className="h-96 bg-gray-200 animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="container mx-auto py-3">
        <DataTableClientWrapper data={data} />
      </div>
    </div>
  );
}