/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { DataTable } from "./data-table";
import { columns, patient } from "./columns";

export function DataTableClientWrapper({ data }: { data: patient[] }) {
  const [fetchedData, setFetchedData] = useState<patient[]>(data);

  const refetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:4000/credential");
      const data = response.data
      const filteredData = data.filter((item: any) => item.roleType !== "Manager")
      setFetchedData(filteredData);
    } catch (error) {
      console.error("Error refetching credentials:", error);
    }
  }, []);

  useEffect(() => {
    (async() => {
      await refetchData();
    })()
  }, [refetchData]);

  return <DataTable columns={columns(refetchData)} data={fetchedData} />;
}
