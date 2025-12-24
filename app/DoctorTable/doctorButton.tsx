/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchingCredential } from "@/lib/actions";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface components {
  btnName: string;
  title: string;
  description: string;
  type: string;
  label: string;
  label2?: string;
  placeholder: string;
  placeholder2?: string;
  value: string;
  value2?: string;
  setValue: (value: string | null) => void;
  setValue2?: (value: string | null) => void;
  btnText?: string;
  ToDo: (value: any) => void;
  special?: string;
}

export function AlertDoctor({
  btnName,
  title,
  description,
  type,
  label,
  placeholder,
  value,
  setValue,
  btnText,
  ToDo,
  special,
  placeholder2,
  label2,
  value2,
  setValue2,
}: components) {
  const [data, setData] = useState<any[]>([]);
  const t = useTranslations("DoctorTable")

  useEffect(() => {
    (async () => {
      const credential = (await fetchingCredential()) || [];
      const uniqueSpecialities = [
        ...new Set(credential.map((item: any) => item.Speciality)),
      ].filter(Boolean);
      setData(uniqueSpecialities.map((s) => ({ Speciality: s })));
    })();
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="cursor-pointer">
        <Button
          variant={
            btnName === `${t("Speciality Change")}` ? "destructive" : "secondary"
          }
        >
          {btnName}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-3 items-start">
          {special && (
            <div className="flex flex-col gap-3">
              <Label htmlFor={label2}>{label2}</Label>
              <Select value={value2} onValueChange={setValue2}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder={placeholder2} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{label2}</SelectLabel>
                    {data.map((item: any) => (
                      <SelectItem key={item.Full_Name} value={item.Speciality}>
                        {item.Speciality}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          <Label htmlFor={label}>{label}</Label>
          <Input
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl"
          />
        </div>
        {btnText && (
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => await ToDo(value)}
              className="cursor-pointer"
            >
              {btnText}
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
