import DoctorContent from "@/components/DoctorContent";
import { getUserByName } from "@/lib/actions";
import { getTranslations } from "next-intl/server";

interface DoctorPageProps {
  params: Promise<{
    roleKey: string;
  }>;
}
  

export default async function Doctor({ params }: DoctorPageProps) {
  const { roleKey } = await params;
  const result = await getUserByName(roleKey);
  const t = await getTranslations("Doctor");

  if (!result.success || !result.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            {t("Doctor Not Found")}
          </h1>
          <p className="text-gray-600">
            {t("Doctor profile for")}
            <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">
              {roleKey}
            </span>{" "}
            {t("could not be found")}
          </p>
        </div>
      </div>
    );
  }

  const doctor = result.user;

  if (doctor.roleType !== "Doctor") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            {t("Access Denied")}
          </h1>
          <p className="text-gray-600">
            {t("This user is not a doctor Role:")}
            <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">
              {doctor.roleType}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return <DoctorContent doctor={doctor} />;
}
