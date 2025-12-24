/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { patient } from "./columns";
import { DataTableClientWrapper } from "./DataTableClientWrapper";
import { fetchingCredential } from "@/lib/actions";

export default function DoctorInfo() {
  const [data, setData] = useState<patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const response = await fetchingCredential();
        if (!response.ok) {
          throw new Error('Failed to fetch credentials');
        }
        const cred = await response.json();
        const filteredData = cred.filter((item: any) => item.roleType === "Doctor");
        setData(filteredData);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
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