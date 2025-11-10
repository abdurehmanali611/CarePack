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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Identifications, Physicians } from "@/constants";
import { patientMedicalInfo } from "@/lib/validation";
import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import { handleUploadSuccess, onSubmitMedical } from "@/lib/actions";

export default function Appointment() {
  const [preHistory, setPreHistory] = useState(true);
  const [reason, setReason] = useState("");
  const [type, setType] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof patientMedicalInfo>>({
    resolver: zodResolver(patientMedicalInfo),
    defaultValues: {
      preHistory: true,
      doctorName: "",
      reason: "",
      symptoms: "",
      allergies: "",
      past_Medical_History: "",
      family_Medical_History: "",
      expected_Appointment_Date: undefined,
      comments_Or_Notes: "",
      insurance_Provider: "",
      insurance_Or_Private: "",
      insurance_policy_Id: "",
      identity_Type: "",
      identity_Number: "",
      identity_photo: "",
    },
  });

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
          <CardTitle>Welcome 👋</CardTitle>
          <CardDescription>Complete Your Appointment</CardDescription>
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
                  setError
                )
              )}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-5 mt-5">
                <h4 className="text-2xl font-semibold">Medical Information</h4>
                <CustomFormField
                  name="preHistory"
                  control={form.control}
                  fieldType={formFieldTypes.CHECKBOX}
                  label="history"
                  preHistory={setPreHistory}
                />
                {preHistory && (
                  <CustomFormField
                    name="doctorName"
                    control={form.control}
                    fieldType={formFieldTypes.SELECT}
                    isDoctorList
                    label="Primary Physician Name:"
                    placeholder="select the physician"
                    listdisplay={Physicians}
                  />
                )}
                <CustomFormField
                  name="reason"
                  control={form.control}
                  fieldType={formFieldTypes.RADIO_BUTTON}
                  listdisplay={["CheckUp", "Disease"]}
                  label="Reason of Visiting:"
                  reason={setReason}
                />
                {reason == "Disease" && (
                  <div className="flex flex-col gap-10">
                    <div className="flex justify-between items-center">
                      <CustomFormField
                        name="allergies"
                        control={form.control}
                        fieldType={formFieldTypes.TEXTAREA}
                        placeholder="peanut"
                        label="Allergies (if any):"
                      />
                      <CustomFormField
                        name="past_Medical_History"
                        control={form.control}
                        fieldType={formFieldTypes.TEXTAREA}
                        placeholder="Tetanus"
                        label="Past Medical History (if any):"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <CustomFormField
                        name="symptoms"
                        control={form.control}
                        fieldType={formFieldTypes.TEXTAREA}
                        placeholder="diarhea"
                        label="Disease Symptoms:"
                      />
                      <CustomFormField
                        name="family_Medical_History"
                        control={form.control}
                        fieldType={formFieldTypes.TEXTAREA}
                        placeholder="Hiv/AIDS"
                        label="Family Medical History (if relevant):"
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center px-5">
                  <CustomFormField
                    name="expected_Appointment_Date"
                    control={form.control}
                    fieldType={formFieldTypes.CALENDAR}
                    placeholder="Select Date"
                    label="Expected Appointment Date:"
                  />
                  <CustomFormField
                    name="insurance_Or_Private"
                    control={form.control}
                    fieldType={formFieldTypes.RADIO_BUTTON}
                    listdisplay={["Private", "Insurance"]}
                    label="Processing Type:"
                    typeInsurance={setType}
                  />
                </div>
                <div className="flex justify-between items-center px-5">
                  <CustomFormField
                    name="comments_Or_Notes"
                    control={form.control}
                    fieldType={formFieldTypes.TEXTAREA}
                    placeholder="better to be in afternoon"
                    label="Comments to be Considered:"
                  />
                  {type == "Insurance" && (
                    <div className="flex flex-col gap-5">
                      <CustomFormField
                        name="insurance_Provider"
                        control={form.control}
                        fieldType={formFieldTypes.INPUT}
                        placeholder="EIP"
                        label="Insurance Provider:"
                      />
                      <CustomFormField
                        name="insurance_policy_Id"
                        control={form.control}
                        fieldType={formFieldTypes.INPUT}
                        placeholder="1234"
                        label="Insurance Policy ID:"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-5 mt-24">
                <h4 className="text-2xl font-semibold">Identity Information</h4>
                <div className="flex justify-between items-center">
                  <CustomFormField
                    name="identity_Type"
                    control={form.control}
                    fieldType={formFieldTypes.SELECT}
                    label="ID Type:"
                    placeholder="Select ID"
                    listdisplay={Identifications}
                  />
                  <CustomFormField
                    name="identity_Number"
                    control={form.control}
                    fieldType={formFieldTypes.INPUT}
                    label="Identity Number:"
                    placeholder="1234"
                  />
                </div>
                <CustomFormField
                  name="identity_photo"
                  control={form.control}
                  fieldType={formFieldTypes.IMAGE_UPLOADER}
                  label="Scanned ID Photo"
                  handleCloudinary={(result) =>
                    handleUploadSuccess(result, form, setPreviewUrl)
                  }
                  previewUrl={previewUrl}
                />
              </div>
              <Button type="submit" className="cursor-pointer">
                {isLoading ? "Loading..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
