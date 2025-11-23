import DoctorTable from "@/app/DoctorTable/page";
import { getUserByName } from "@/lib/actions";
import { Brain, Heart, HospitalIcon, Stethoscope } from "lucide-react";

interface DoctorPageProps {
  params: Promise<{
    roleKey: string;
  }>;
}

export default async function Doctor({ params }: DoctorPageProps) {
  const { roleKey } = await params;
  const result = await getUserByName(roleKey);

  if (!result.success || !result.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Doctor Not Found
          </h1>
          <p className="text-gray-600">
            Doctor profile for{" "}
            <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">
              {roleKey}
            </span>{" "}
            could not be found.
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
            Access Denied
          </h1>
          <p className="text-gray-600">
            This user is not a doctor. Role:{" "}
            <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">
              {doctor.roleType}
            </span>
          </p>
        </div>
      </div>
    );
  }

  const getDoctorIcon = () => {
    switch (doctor.speciality) {
      case "Cardiology":
        return <Heart className="w-7 h-7 text-red-600" />;
      case "Neurology":
        return <Brain className="w-7 h-7 text-purple-600" />;
      default:
        return <Stethoscope className="w-7 h-7 text-blue-600" />;
    }
  };

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
          CarePack
        </div>
        <div className="flex gap-3 items-center">
          {getDoctorIcon()}
          <div className="flex flex-col items-end">
            <span className="font-semibold">{doctor.fullName}</span>
            <span className={`text-sm ${getTextColor()}`}>
              {doctor.speciality || "Medical Doctor"}
            </span>
            {doctor.experienceYear !== undefined && (
              <span className="text-xs text-gray-600">
                {doctor.experienceYear} years experience
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-semibold font-serif text-xl">
          Welcome, Dr. {doctor.fullName.split(" ").pop()}
        </p>
        <p>Start your day with managing your appointments and patient care</p>
      </div>
      <DoctorTable name={doctor.fullName}/>
    </div>
  );
}
