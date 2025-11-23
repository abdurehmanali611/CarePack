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
import {
  onSubmitUser,
  verifyCredentials,
} from "@/lib/actions";

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
    async (item: string) => {
      if (!passKey.trim()) {
        setDialogError("Please Enter a PassKey");
        return;
      }
      try {
        const result = await verifyCredentials(passKey);

        if (!result.success) {
          setDialogError(result.error || "Invalid PassKey. Please Try Again");
          return;
        }

        const user = result.user
        const formattedName = user.fullName.toLowerCase().replace(/\s+/g, '-')

        if (item === "Admin" && (user.roleType === "Admin" || user.roleType === "Manager")) {
          setDialogError(null)
          setPassKey("")
          router.push(`/Admin/${formattedName}`)
        } else if(item === "Doctor" && user.roleType === "Doctor") {
          setDialogError(null)
          setPassKey("")
          router.push(`/Doctor/${formattedName}`)
        }else {
          setDialogError(`Access Denied. Role type ${user.roleType} is not supported`)
        }
      } catch (error) {
        console.log(error);
        setDialogError("Authentication failed. Please try again.");
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
                type="name"
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
