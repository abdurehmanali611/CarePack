"use client";
import setLanguageValue from "@/actions/set-languages-action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Briefcase, HospitalIcon, Users } from "lucide-react";
import Approver from "@/app/Approver/page";
import Reports from "@/app/Reports/page";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface AdminContentProps {
  user: {
    fullName: string;
    roleType: string;
    image: string;
  };
}

const AdminContent = ({ user }: AdminContentProps) => {
  const isAdmin = user.roleType === "Admin";
  const t = useTranslations("Admin");
  const roleData = {
    icon: isAdmin ? (
      <Briefcase className="w-7 h-7 text-indigo-600" />
    ) : (
      <Users className="w-7 h-7 text-emerald-600" />
    ),
    border_color: isAdmin ? "border-indigo-500" : "border-emerald-500",
    text_color: isAdmin ? "text-indigo-600" : "text-emerald-600",

    component: isAdmin ? <Approver /> : <Reports />,
    welcomeMessage: isAdmin
      ? `${t(
          "Start your day with institutional oversight and strategic planning"
        )}`
      : `${t(
          "Start your day with team management and operational coordination"
        )}`,
  };

  return (
    <div className="p-5 flex flex-col gap-10">
      <div
        className={`flex justify-between items-center border-4 p-4 rounded-xl bg-gray-200 text-black ${roleData.border_color}`}
      >
        <div className="flex gap-3 items-center">
          <HospitalIcon />
          {t("CarePack")}
        </div>
        <div className="flex items-center gap-3">
          <Image
            src={user.image}
            alt={user.fullName}
            width={50}
            height={50}
            loading="eager"
            className="rounded-full"
          />
          <div className="flex flex-col items-end">
            <span className="font-semibold">{user.fullName}</span>
            <span className={`text-sm ${roleData.text_color}`}>
              {t(`${user.roleType}`)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-semibold font-serif text-xl">
            {t("Welcome,")} {user.fullName}
          </p>
          <p className="text-gray-600">{roleData.welcomeMessage}</p>
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
      {roleData.component}
    </div>
  );
};

export default AdminContent;
