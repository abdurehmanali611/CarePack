/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SelectionProvider } from "./selection-context";
import { useTranslations } from "next-intl";

export function DataTableClientWrapper({ data, refresh }: any) {
  const t = useTranslations("SpecialityChange")
  const memoizedColumns = useMemo(() => columns(refresh, t), [refresh, t]);
  
  return (
    <SelectionProvider>
      <DataTable columns={memoizedColumns} data={data}/>
    </SelectionProvider>
  );
}