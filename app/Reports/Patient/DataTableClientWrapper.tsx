"use client";
import { useMemo } from "react";
import { columns, patient } from "./columns";
import { DataTable } from "./data-table";
import { useTranslations } from "next-intl";

export function DataTableClientWrapper({ data }: {data: patient[]}) {
  const t = useTranslations("ReportsTable")
  const memoizedColumns = useMemo(() => columns(t), [t]);
  
  return <DataTable columns={memoizedColumns} data={data}/>
}