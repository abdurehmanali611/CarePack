import DoctorTable from "@/app/DoctorTable/page";
import { Heart, HospitalIcon, Stethoscope, Syringe } from "lucide-react";

interface DoctorPageProps {
  params: Promise<{
    roleKey: string;
  }>;
}

const DOCTOR_ROLE_DATA = {
  doctor: {
    name: "General Practitioner",
    icon: <Stethoscope className="w-7 h-7 text-blue-600" />,
    description:
      "Primary care access panel for general appointments and basic diagnostics.",
    features: [
      "View today's scheduled appointments",
      "Access common patient medical records (non-specialist)",
      "Create prescriptions and referral orders",
      "Update patient visit notes",
    ],
    border_color: "border-blue-500",
    text_color: "text-blue-500",
  },
  "doctor-specialist": {
    name: "Cardiologist Specialist",
    icon: <Heart className="w-7 h-7 text-red-600" />,
    description:
      "Specialized dashboard for cardiology patients, advanced imaging, and test results.",
    features: [
      "Review ECG and imaging results",
      "Manage critical patient care plans",
      "Schedule specialized procedures",
      "Consultation requests from general practitioners",
    ],
    border_color: "border-red-500",
    text_color: "text-red-500",
  },
  "nurse-practitioner": {
    name: "Nurse Practitioner (NP)",
    icon: <Syringe className="w-7 h-7 text-green-600" />,
    description:
      "Clinical interface for patient triage, medication administration, and routine check-ups.",
    features: [
      "Triage incoming patient requests",
      "Administer and log medication",
      "Monitor vital signs history",
      "Prepare patient discharge summaries",
    ],
    border_color: "border-green-500",
    text_color: "text-green-500",
  },
};

export default async function Doctor({ params }: DoctorPageProps) {
  const { roleKey } = await params;
  const role = DOCTOR_ROLE_DATA[roleKey as keyof typeof DOCTOR_ROLE_DATA];

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            404 - Access Denied
          </h1>
          <p className="text-gray-600">
            The physician role key{" "}
            <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">
              {roleKey}
            </span>{" "}
            is not recognized or authorized.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 p-5">
      <div className="flex justify-between items-center border-4 p-4 border-gray-400 rounded-xl bg-gray-200 text-black">
        <div className="flex gap-3 items-center">
          <HospitalIcon />
          CarePack
        </div>
        <div className="flex gap-3 items-center">
        {role.icon}
        {role.name}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-semibold font-serif text-xl">Welcome, {role.name}</p>
        <p>
          Start day with Managing your Appointments
        </p>
      </div>
      <DoctorTable />
    </div>
  );
}
