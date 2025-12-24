/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { DataTable } from "./data-table";
import { columns, patient } from "./columns";
import { useTranslations } from "next-intl";

export function DataTableClientWrapper({ data }: { data: patient[] }) {
  const [fetchedData, setFetchedData] = useState<patient[]>(data);
  const t = useTranslations("Update")

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

  const memoizedColumns = useMemo(() => columns(refetchData, t), [refetchData, t])

  return <DataTable columns={memoizedColumns} data={fetchedData} />;
}
