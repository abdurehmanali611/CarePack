/* eslint-disable react-hooks/exhaustive-deps */
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
import { onSubmitUser, verifyCredentials } from "@/lib/actions";
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
import { useTranslations } from "next-intl";

export default function NewUser() {
  const t = useTranslations("newUser");
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
        setDialogError(`${t("Please Enter a PassKey")}`);
        return;
      }
      try {
        const result = await verifyCredentials(passKey);

        if (!result.success) {
          setDialogError(result.error || "Invalid PassKey. Please Try Again");
          return;
        }

        const user = result.user;
        const formattedName = user.fullName.toLowerCase().replace(/\s+/g, "-");

        if (
          item === `${t("Admin")}` &&
          (user.roleType === "Admin" || user.roleType === "Manager")
        ) {
          setDialogError(null);
          setPassKey("");
          router.push(`/Admin/${formattedName}`);
        } else if (item === `${t("Doctor")}` && user.roleType === "Doctor") {
          setDialogError(null);
          setPassKey("");
          router.push(`/Doctor/${formattedName}`);
        } else {
          setDialogError(
            `Access Denied. Role type ${user.roleType} is not supported`
          );
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
        <AlertTitle>{t("Submission Error")}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={() => setError(null)} className="mt-4">
          {t("Try Form Again")}
        </Button>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen justify-between px-20 my-10">
      <Card className="w-[60%]">
        <CardHeader>
          <CardTitle className="flex flex-col gap-10">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-7">
                <div className="flex gap-2 items-center">
                  <Hospital />
                  <p>{t("CarePack")}</p>
                </div>
                <p>{t("Hi there 👋")}</p>
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
          </CardTitle>
          <CardDescription>
            {t("Make Your Appointment in Minute")}
          </CardDescription>
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
                label={t("Full Name:")}
                fieldType={formFieldTypes.INPUT}
                placeholder={t("Abiy Ahmed")}
                icon={User}
                type="name"
              />
              <div className="flex justify-between items-center">
                <CustomFormField
                  name="email"
                  control={form.control}
                  label={t("Email:")}
                  type="email"
                  fieldType={formFieldTypes.INPUT}
                  icon={Mail}
                  placeholder={t("abiyahmed@gmailcom")}
                />
                <CustomFormField
                  name="phoneNumber"
                  control={form.control}
                  placeholder={t("your phone number")}
                  fieldType={formFieldTypes.PHONE_INPUT}
                  label={t("Phone Number:")}
                />
              </div>
              <div className="flex justify-between items-center">
                <CustomFormField
                  name="birthDate"
                  control={form.control}
                  fieldType={formFieldTypes.CALENDAR}
                  placeholder={t("Select Date")}
                  label={t("Birth Date:")}
                />
                <CustomFormField
                  name="gender"
                  control={form.control}
                  fieldType={formFieldTypes.RADIO_BUTTON}
                  label={t("Gender:")}
                  listdisplay={["Male", "Female", "Other"]}
                />
              </div>
              <div className="flex justify-between items-center">
                <CustomFormField
                  name="emergencyContactName"
                  control={form.control}
                  fieldType={formFieldTypes.INPUT}
                  icon={User2}
                  placeholder={t("responder name")}
                  label={t("Emergency Responder:")}
                />
                <CustomFormField
                  name="emergencyContactPhone"
                  control={form.control}
                  fieldType={formFieldTypes.PHONE_INPUT}
                  placeholder={t("responder phone")}
                  label={t("Responder Phone:")}
                />
              </div>
              <Button type="submit" className="cursor-pointer">
                {proceed ? `${t("Proceeding")}` : `${t("Proceed")}`}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-between items-center">
          <p>
            &copy; <span>{t("2025 CarePack")}</span>
          </p>
          <CustomFormField
            fieldType={formFieldTypes.ALERTDIALOG}
            listdisplay={[`${t("Doctor")}`, `${t("Admin")}`]}
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
