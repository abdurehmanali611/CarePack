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
} from "./ui/alert-dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useCallback, useState } from "react";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { newUserSchema } from "@/lib/validation";
import CustomFormField, { formFieldTypes } from "./customFormField";

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

  async function onSubmit(values: z.infer<typeof newUserSchema>) {
    console.log(values);
    try {
      setProceed(true);
      await axios
        .post("http://localhost:4000/users", values, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data)
        .then((data) => {
          localStorage.setItem("patientId", data._id);
          form.reset();

          router.push("/Appointment");
        });
      setProceed(false);
    } catch (error: unknown) {
      setProceed(false);
      let errorMessage = "An unknown error occurred during User Creation";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
      setError(errorMessage);
      return;
    }
  }

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
      <Card className="lg:w-[60%] w-[465px] md:w-[650px]">
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
              onSubmit={form.handleSubmit(onSubmit)}
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
              <div className="md:flex md:justify-between md:items-center">
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
              <div className="md:flex md:justify-between md:items-center">
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
              <div className="md:flex md:justify-between md:items-center">
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
          {["Doctor", "Admin"].map((item) => (
            <AlertDialog
              key={item}
              onOpenChange={(open) => {
                if (!open) {
                  setPassKey("");
                  setDialogError(null);
                }
              }}
            >
              <AlertDialogTrigger asChild>
                <Button
                  key={item}
                  variant="link"
                  className="cursor-pointer text-blue-400 hover:text-red-400"
                >
                  {item}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-fit">
                <AlertDialogHeader>
                  <AlertDialogTitle asChild>
                    <h4 className="font-serif text-lg font-semibold">
                      {item} Access Verification
                    </h4>
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <p className="text-sm font-normal">
                      Please Enter the PassKey
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {dialogError && (
                  <div className="flex items-center text-sm text-red-600 border border-red-300 bg-red-50 p-2 rounded-md">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {dialogError}
                  </div>
                )}
                <InputOTP
                  maxLength={6}
                  value={passKey}
                  onChange={(e) => setPassKey(e)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="cursor-pointer"
                    onClick={() => {
                      setPassKey("");
                      setDialogError(null);
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePassKeySubmit(item);
                    }}
                    disabled={passKey.length < 6}
                  >
                    Submit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
}
