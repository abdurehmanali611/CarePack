import Approver from "@/app/Approver/page";
import Reports from "@/app/Reports/page";
import { getUserByName } from "@/lib/actions";
import { Briefcase, HospitalIcon, Users } from "lucide-react";

interface AdminPageProps {
  params: Promise<{
    roleKey: string;
  }>;
}

export default async function Admin({ params }: AdminPageProps) {
  const { roleKey } = await params;
  
  if (!roleKey) {
    console.log('❌ Admin Page: roleKey is undefined or empty');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Routing Error
          </h1>
          <p className="text-gray-600">
            Role key parameter is missing from URL.
          </p>
        </div>
      </div>
    );
  }
  const result = await getUserByName(roleKey);
  
  if (!result.success || !result.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            User not found
          </h1>
          <p className="text-gray-600">
            User data for{" "}
            <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">
              {roleKey}
            </span>{" "}
            couldn&apos;t be found
          </p>
        </div>
      </div>
    );
  }

  const user = result.user;
  if (user.roleType !== "Admin" && user.roleType !== "Manager") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            User role{" "}
            <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">
              {user.roleType}
            </span>{" "}
            does not have admin access.
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = user.roleType === "Admin";

  const roleData = {
    icon: isAdmin ? (
      <Briefcase className="w-7 h-7 text-indigo-600" />
    ) : (
      <Users className="w-7 h-7 text-emerald-600" />
    ),
    border_color: isAdmin ? "border-indigo-500" : "border-emerald-500",
    text_color: isAdmin ? "text-indigo-600" : "text-emerald-600",

    component: isAdmin ? <Approver /> : <Reports /> ,
    welcomeMessage: isAdmin
      ? "Start your day with institutional oversight and strategic planning"
      : "Start your day with team management and operational coordination",
  };

  return (
    <div className="p-5 flex flex-col gap-10">
      <div
        className={`flex justify-between items-center border-4 p-4 rounded-xl bg-gray-200 text-black ${roleData.border_color}`}
      >
        <div className="flex gap-3 items-center">
          <HospitalIcon />
          CarePack
        </div>
        <div className="flex items-center gap-3">
          {roleData.icon}
          <div className="flex flex-col items-end">
            <span className="font-semibold">{user.fullName}</span>
            <span className={`text-sm ${roleData.text_color}`}>
              {user.roleType}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-semibold font-serif text-xl">
          Welcome, {user.fullName}
        </p>
        <p className="text-gray-600">{roleData.welcomeMessage}</p>
      </div>
      {roleData.component}
    </div>
  );
}
