import Card from "@/components/Card";
import CardLeader from "@/components/CardLeader";
import { Briefcase, HospitalIcon, Users } from "lucide-react";

interface AdminPageProps {
  params: Promise<{
    roleKey: string;
  }>;
}

const ROLE_DATA = {
  "general-manager": {
    name: "General Manager",
    icon: <Briefcase className="w-10 h-10 text-indigo-600" />,
    description:
      "Full oversight of organizational strategy, budget, and executive decisions.",
    features: [
      "View global financial reports",
      "Approve capital expenditure",
      "Manage all subordinate roles",
    ],
  },
  "group-leader": {
    name: "Group Leader",
    icon: <Users className="w-10 h-10 text-emerald-600" />,
    description:
      "Management of team projects, performance reviews, and resource allocation.",
    features: [
      "Review team-specific tasks and deadlines",
      "Conduct quarterly performance evaluations",
      "Allocate team resources",
    ],
  },
};

export default async function Admin({ params }: AdminPageProps) {
  const { roleKey } = await params;
  const role = ROLE_DATA[roleKey as keyof typeof ROLE_DATA];

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            404 - Not Found
          </h1>
          <p className="text-gray-600">
            The role key{" "}
            <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">
              {roleKey}
            </span>{" "}
            is not recognized.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <HospitalIcon />
          CarePack
        </div>
        {role.name}
      </div>
      <div className="flex flex-col gap-3">
        <p>Hi there 👋</p>
        <p>Take alook for Reports you have</p>
      </div>
      {role.name == "General Manager" ? (
          <Card />
      ) : (
        <CardLeader />
      )}
    </div>
  );
}
