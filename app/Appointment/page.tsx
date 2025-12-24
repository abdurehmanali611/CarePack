"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Identifications } from "@/constants";
import { patientMedicalInfo } from "@/lib/validation";
import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import {
  fetchingCredential,
  handleUploadSuccess,
  onSubmitMedical,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface doctors {
  Full_Name: string;
  image: string;
  Speciality: string;
}

export default function Appointment() {
  const [preHistory, setPreHistory] = useState(false);
  const [reason, setReason] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [fetchedData, setFetchedData] = useState<doctors[]>([]);
  const t = useTranslations("appointment");

  const form = useForm<z.infer<typeof patientMedicalInfo>>({
    resolver: zodResolver(patientMedicalInfo),
    defaultValues: {
      preHistory: true,
      doctorName: "",
      reason: "",
      symptoms: [],
      allergies: [],
      past_Medical_History: "",
      family_Medical_History: "",
      expected_Appointment_Date: undefined,
      comments_Or_Notes: "",
      identity_Type: "",
      identity_Number: "",
      identity_photo: "",
    },
  });

  useEffect(() => {
    (async () => {
      await fetchingCredential().then((res) => setFetchedData(res || []));
    })();
  }, []);

  if (message !== null) {
    return (
      <Alert className="flex flex-col gap-2 items-center" variant="default">
        <CheckCircle2Icon />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  if (error !== null) {
    return (
      <Alert className="flex flex-col gap-2 items-center" variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <Card className="w-[75%] m-5">
        <CardHeader>
          <CardTitle>{t("Welcome 👋")}</CardTitle>
          <CardDescription>{t("Complete Your Appointment")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                onSubmitMedical(
                  values,
                  setIsLoading,
                  form,
                  setPreviewUrl,
                  setMessage,
                  setError,
                  router
                )
              )}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-5 mt-5">
                <h4 className="text-2xl font-semibold">
                  {t("Medical Information")}
                </h4>
                <CustomFormField
                  name="preHistory"
                  control={form.control}
                  fieldType={formFieldTypes.CHECKBOX}
                  label={t("history")}
                  preHistory={setPreHistory}
                />
                {preHistory && (
                  <CustomFormField
                    name="doctorName"
                    control={form.control}
                    fieldType={formFieldTypes.SELECT}
                    isDoctorList
                    label={t("Primary Physician Name:")}
                    placeholder={t("select the physician")}
                    listdisplay={fetchedData}
                  />
                )}
                <CustomFormField
                  name="reason"
                  control={form.control}
                  fieldType={formFieldTypes.RADIO_BUTTON}
                  listdisplay={["CheckUp", "Disease"]}
                  label={t("Reason of Visiting:")}
                  reason={setReason}
                />
                {reason == "Disease" && (
                  <div className="flex flex-col gap-10">
                    <div className="flex justify-between items-start flex-row-reverse">
                      <div className="flex flex-col gap-3">
                        <CustomFormField
                          name="allergies"
                          control={form.control}
                          fieldType={formFieldTypes.INPUT}
                          placeholder={t("peanut")}
                          label={t("Allergies (if any):")}
                          add="allergy"
                        />
                      </div>
                      <CustomFormField
                        name="past_Medical_History"
                        control={form.control}
                        fieldType={formFieldTypes.TEXTAREA}
                        placeholder={t("Tetanus")}
                        label={t("Past Medical History (if any):")}
                      />
                    </div>
                    <div className="flex justify-between items-start flex-row-reverse">
                      <div className="flex flex-col gap-3 items-end">
                        <CustomFormField
                          name="symptoms"
                          control={form.control}
                          fieldType={formFieldTypes.INPUT}
                          placeholder={t("headache")}
                          label={t("Disease Symptoms:")}
                          add="symptom"
                        />
                      </div>
                      <CustomFormField
                        name="family_Medical_History"
                        control={form.control}
                        fieldType={formFieldTypes.TEXTAREA}
                        placeholder={t("diabets")}
                        label={t("Family Medical History (if relevant):")}
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-start px-5 flex-row-reverse">
                  <CustomFormField
                    name="expected_Appointment_Date"
                    control={form.control}
                    fieldType={formFieldTypes.CALENDAR}
                    placeholder={t("Select Date")}
                    label={t("Expected Appointment Date:")}
                  />
                  <CustomFormField
                    name="comments_Or_Notes"
                    control={form.control}
                    fieldType={formFieldTypes.TEXTAREA}
                    placeholder={t("better to be in afternoon")}
                    label={t("Comments to be Considered:")}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 mt-24">
                <h4 className="text-2xl font-semibold">Identity Information</h4>
                <div className="flex justify-between items-center">
                  <CustomFormField
                    name="identity_Type"
                    control={form.control}
                    fieldType={formFieldTypes.SELECT}
                    label={t("ID Type:")}
                    placeholder={t("Select ID")}
                    listdisplay={Identifications}
                  />
                  <CustomFormField
                    name="identity_Number"
                    control={form.control}
                    fieldType={formFieldTypes.INPUT}
                    label={t("Identity Number:")}
                    placeholder={t("1234")}
                  />
                </div>
                <CustomFormField
                  name="identity_photo"
                  control={form.control}
                  fieldType={formFieldTypes.IMAGE_UPLOADER}
                  label={t("Scanned ID Photo")}
                  handleCloudinary={(result) =>
                    handleUploadSuccess(
                      result,
                      form,
                      setPreviewUrl,
                      "identity_photo"
                    )
                  }
                  previewUrl={previewUrl}
                />
              </div>
              <Button type="submit">
                {isLoading ? `${t("Loading")}` : `${t("Submit")}`}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
