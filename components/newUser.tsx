"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import { AlertTriangle, Hospital, Mail, User, User2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { newUserSchema } from "@/lib/validation";
import CustomFormField, { formFieldTypes } from "./customFormField";
import { onSubmitUser } from "@/lib/actions";

const PASSKEY_ROLE_MAP: Record<string, string> = {
  // Admin Keys
  "432100": "general-manager",
  "432101": "group-leader",
  // Doctor Keys
  "123456": "doctor", // General Practitioner
  "654321": "doctor-specialist", // Cardiologist Specialist
  "789012": "nurse-practitioner", // Nurse Practitioner
};

export default function NewUser() {
  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      Full_Name: "",
      email: "",
      phoneNumber: "",
      gender: "",
      birthDate: undefined,
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
  });

  const [passKey, setPassKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [proceed, setProceed] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const router = useRouter();

  const handlePassKeySubmit = useCallback(
    (item: string) => {
      const roleKey = PASSKEY_ROLE_MAP[passKey];

      if (!roleKey) {
        setDialogError("Invalid PassKey. Please Try Again");
        return;
      }

      if (
        item == "Admin" &&
        (roleKey == "general-manager" || roleKey == "group-leader")
      ) {
        setDialogError(null);
        setPassKey("");
        router.push(`/Admin/${roleKey}`);
      } else if (
        item == "Doctor" &&
        (roleKey.startsWith("doctor") || roleKey.startsWith("nurse"))
      ) {
        setDialogError(null);
        setPassKey("");
        router.push(`/Doctor/${roleKey}`);
      } else {
        setDialogError(`Access Denied. PassKey is not authorized for ${item}`);
      }
    },
    [passKey, router]
  );

  if (error !== null) {
    return (
      <Alert variant="destructive" className="mx-auto my-10 max-w-xl">
        <AlertTriangle className="w-4 h-4" />
        <AlertTitle>Submission Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={() => setError(null)} className="mt-4">
          Try Form Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen justify-between px-20 my-10">
      <Card className="w-[60%]">
        <CardHeader>
          <CardTitle className="flex flex-col gap-10">
            <div className="flex gap-2 items-center">
              <Hospital />
              <p>CarePack</p>
            </div>
            <p>Hi there 👋</p>
          </CardTitle>
          <CardDescription>Make Your Appointment in Minute</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                onSubmitUser(values, setProceed, form, setError, router)
              )}
              className="flex flex-col gap-5"
            >
              <CustomFormField
                control={form.control}
                name="Full_Name"
                label="Full Name:"
                fieldType={formFieldTypes.INPUT}
                placeholder="Abiy Ahmed"
                icon={User}
              />
              <div className="flex justify-between items-center">
                <CustomFormField
                  name="email"
                  control={form.control}
                  label="Email:"
                  type="email"
                  fieldType={formFieldTypes.INPUT}
                  icon={Mail}
                  placeholder="abiyahmed@gmail.com"
                />
                <CustomFormField
                  name="phoneNumber"
                  control={form.control}
                  placeholder="your phone number"
                  fieldType={formFieldTypes.PHONE_INPUT}
                  label="Phone Number:"
                />
              </div>
              <div className="flex justify-between items-center">
                <CustomFormField
                  name="birthDate"
                  control={form.control}
                  fieldType={formFieldTypes.CALENDAR}
                  placeholder="Select Date"
                  label="Birth Date:"
                />
                <CustomFormField
                  name="gender"
                  control={form.control}
                  fieldType={formFieldTypes.RADIO_BUTTON}
                  label="Gender:"
                  listdisplay={["Male", "Female", "Other"]}
                />
              </div>
              <div className="flex justify-between items-center">
                <CustomFormField
                  name="emergencyContactName"
                  control={form.control}
                  fieldType={formFieldTypes.INPUT}
                  icon={User2}
                  placeholder="responder name"
                  label="Emergency Responder:"
                />
                <CustomFormField
                  name="emergencyContactPhone"
                  control={form.control}
                  fieldType={formFieldTypes.PHONE_INPUT}
                  placeholder="responder phone"
                  label="Responder Phone:"
                />
              </div>
              <Button type="submit" className="cursor-pointer">
                {proceed ? "Proceeding..." : "Proceed"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-between items-center">
          <p>
            &copy; <span>2025 CarePack</span>
          </p>
           <CustomFormField 
           fieldType={formFieldTypes.ALERTDIALOG}
           listdisplay={["Doctor", "Admin"]}
           setPassKey={setPassKey}
           passKey={passKey}
           setDialogError={setDialogError}
           dialogError={dialogError}
           handleAlertDialog={handlePassKeySubmit}
           />
        </CardFooter>
      </Card>
    </div>
  );
}
