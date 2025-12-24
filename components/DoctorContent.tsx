"use client";
import DoctorTable from "@/app/DoctorTable/page";
import { HospitalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import setLanguageValue from "@/actions/set-languages-action";
import Image from "next/image";

interface DoctorContentProps {
  doctor: {
    fullName: string;
    roleType: string;
    speciality?: string;
    experienceYear?: number;
    image: string;
  };
}

const DoctorContent = ({ doctor }: DoctorContentProps) => {
  const t = useTranslations("Doctor");
  const getBorderColor = () => {
    switch (doctor.speciality) {
      case "Cardiology":
        return "border-red-500";
      case "Neurology":
        return "border-purple-500";
      default:
        return "border-blue-500";
    }
  };

  const getTextColor = () => {
    switch (doctor.speciality) {
      case "Cardiology":
        return "text-red-600";
      case "Neurology":
        return "text-purple-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="flex flex-col gap-10 p-5">
      <div
        className={`flex justify-between items-center border-4 p-4 rounded-xl bg-gray-200 text-black ${getBorderColor()}`}
      >
        <div className="flex gap-3 items-center">
          <HospitalIcon />
          {t("CarePack")}
        </div>
        <div className="flex gap-3 items-center">
          <Image
            src={doctor.image}
            alt={doctor.fullName}
            width={50}
            height={50}
            loading="eager"
            className="rounded-full"
          />
          <div className="flex flex-col items-end">
            <span className="font-semibold">{doctor.fullName}</span>
            <span className={`text-sm ${getTextColor()}`}>
              {doctor.speciality || `${t("Medical Doctor")}`}
            </span>
            {doctor.experienceYear !== undefined && (
              <span className="text-xs text-gray-600">
                {doctor.experienceYear} {t("years experience")}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-semibold font-serif text-xl">
            {t("Welcome, Dr")} {doctor.fullName.split(" ").pop()}
          </p>
          <p>
            {t(
              "Start your day with managing your appointments and patient care"
            )}
          </p>
        </div>
        <Select
          defaultValue="en"
          onValueChange={(e: string) => setLanguageValue(e)}
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="English" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("Select language")}</SelectLabel>
              <SelectItem value="en">{t("English")}</SelectItem>
              <SelectItem value="am">{t("Amharic")}</SelectItem>
              <SelectItem value="ar">{t("Arabic")}</SelectItem>
              <SelectItem value="om">{t("Affan Oromo")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DoctorTable name={doctor.fullName} />
    </div>
  );
};

export default DoctorContent;
