/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Specialities } from "@/constants";
import {
  fetchingCredential,
  handleUploadSuccess,
  onSubmitAdminCreation,
  onSubmitDoctorCreation,
} from "@/lib/actions";
import { CredentialForm } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export type credentialFormType = {
  Full_Name: string;
  Sex: string;
  Speciality: string;
  experienceYear: number;
  passKey: string;
  image: string;
};

type userRoleData = {
  id: string;
  Full_Name: string;
  Sex: string;
  Speciality?: string;
  experienceYear: number;
  passKey: string;
  roleType: string;
};

export default function Credential() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<userRoleData[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const t = useTranslations("credential")

  const form = useForm<credentialFormType>({
    resolver: zodResolver(CredentialForm) as any,
    defaultValues: {
      Full_Name: "",
      Sex: "",
      Speciality: "",
      experienceYear: 0,
      passKey: "",
      image: "",
    },
  });

  useEffect(() => {
    fetchingCredential().then((res) => setFetchedData(res || []));
  }, [fetchedData]);

  const roleType = fetchedData?.find((item) => item.roleType == "Admin");

  if (message !== null) {
    return (
      <Alert>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  if (errorMessage !== null) {
    return (
      <Alert>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-3 items-center h-screen justify-center">
      <Tabs defaultValue="Doctor">
        <TabsList>
          <TabsTrigger value="Doctor" className="cursor-pointer">
            {t("Doctor")}
          </TabsTrigger>
          <TabsTrigger value="Admin" className="cursor-pointer">
            {t("Admin")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Doctor">
          <Card>
            <CardHeader>
              <CardTitle>{t("Doctor Credential")}</CardTitle>
              <CardDescription>
                {t("Enter Doctor info to have an access for the system")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((values) =>
                    onSubmitDoctorCreation(
                      values,
                      form,
                      setIsLoading,
                      setErrorMessage,
                      setMessage,
                      setPreviewUrl
                    )
                  )}
                  className="flex flex-col gap-5"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-5">
                      <CustomFormField
                        name="Full_Name"
                        control={form.control}
                        fieldType={formFieldTypes.INPUT}
                        label={t("Full name:")}
                        icon={User}
                        placeholder={t("Abdu Ali")}
                      />
                      <CustomFormField
                        name="Sex"
                        control={form.control}
                        fieldType={formFieldTypes.RADIO_BUTTON}
                        listdisplay={["Male", "Female", "Other"]}
                        label={t("Gender:")}
                      />
                    </div>
                    <CustomFormField
                      name="image"
                      control={form.control}
                      fieldType={formFieldTypes.IMAGE_UPLOADER}
                      label={t("Doctor Image")}
                      handleCloudinary={(result) =>
                        handleUploadSuccess(result, form, setPreviewUrl, "image")
                      }
                      previewUrl={previewUrl}
                      type="credential"
                    />
                  </div>
                  <CustomFormField
                    name="Speciality"
                    control={form.control}
                    fieldType={formFieldTypes.SELECT}
                    listdisplay={Specialities}
                    label={t("Speciality:")}
                  />
                  <div className="flex justify-between items-center gap-16">
                    <CustomFormField
                      name="experienceYear"
                      control={form.control}
                      fieldType={formFieldTypes.INPUT}
                      label={t("Experience:")}
                      type="number"
                    />
                    <CustomFormField
                      name="passKey"
                      control={form.control}
                      fieldType={formFieldTypes.INPUT}
                      label={t("PassKey:")}
                      placeholder={t("123456")}
                    />
                  </div>
                  <Button type="submit" className="cursor-pointer">
                    {isLoading ? `${t("Creating" )}`: `${t("Create")}`}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Admin">
          {roleType === undefined ? (
            <Card>
              <CardHeader>
                <CardTitle>{t("Admin Credential")}</CardTitle>
                <CardDescription>
                  {t("Enter an Admin info to have an access for the system")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((values) =>
                      onSubmitAdminCreation(
                        values,
                        form,
                        setIsLoading,
                        setMessage,
                        setErrorMessage,
                        setPreviewUrl
                      )
                    )}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-5">
                        <CustomFormField
                          name="Full_Name"
                          control={form.control}
                          fieldType={formFieldTypes.INPUT}
                          label={t("Full name:")}
                          icon={User}
                          placeholder={t("Abdu Ali")}
                        />
                        <CustomFormField
                          name="Sex"
                          control={form.control}
                          fieldType={formFieldTypes.RADIO_BUTTON}
                          listdisplay={["Male", "Female", "Other"]}
                          label={t("Gender:")}
                        />
                      </div>
                      <CustomFormField
                        name="image"
                        control={form.control}
                        fieldType={formFieldTypes.IMAGE_UPLOADER}
                        label={t("Admin Image")}
                        handleCloudinary={(result) =>
                          handleUploadSuccess(result, form, setPreviewUrl, "image")
                        }
                        previewUrl={previewUrl}
                        type="credential"
                      />
                    </div>
                    <div className="flex justify-between items-center gap-16">
                      <CustomFormField
                        name="experienceYear"
                        control={form.control}
                        fieldType={formFieldTypes.INPUT}
                        label={t("Experience:")}
                        type="number"
                      />
                      <CustomFormField
                        name="passKey"
                        control={form.control}
                        fieldType={formFieldTypes.INPUT}
                        label={t("PassKey:")}
                        placeholder={t("123456")}
                      />
                    </div>
                    <Button type="submit" className="cursor-pointer">
                      {isLoading ? `${t("Creating...")}` : `${t("Create")}`}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <p className="font-serif font-semibold text-lg">
              {t("No Creation for the second Admin")}
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
