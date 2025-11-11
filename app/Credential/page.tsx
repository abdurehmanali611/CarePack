"use client";
import CustomFormField, { formFieldTypes } from "@/components/customFormField";
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
import { onSubmitAdminCreation, onSubmitDoctorCreation } from "@/lib/actions";
import { adminCredentialForm, doctorCredentialForm } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function Credential() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof doctorCredentialForm>>({
    resolver: zodResolver(doctorCredentialForm),
    defaultValues: {
      Full_Name: "",
      Sex: "",
      Speciality: "",
      experienceYear: 0,
      passKey: "",
    },
  });

  const formAdmin = useForm<z.infer<typeof adminCredentialForm>>({
    resolver: zodResolver(adminCredentialForm),
    defaultValues: {
      Full_Name: "",
      Sex: "",
      experienceYear: 0,
      passKey: "",
    },
  });
  return (
    <div className="flex flex-col gap-3 items-center h-screen justify-center">
      <Tabs defaultValue="Doctor">
        <TabsList>
          <TabsTrigger value="Doctor" className="cursor-pointer">
            Doctor
          </TabsTrigger>
          <TabsTrigger value="Admin" className="cursor-pointer">
            Admin
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Doctor">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Credential</CardTitle>
              <CardDescription>
                Enter Doctor info to have an access for the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((values) =>
                    onSubmitDoctorCreation(values)
                  )}
                  className="flex flex-col gap-5"
                >
                  <CustomFormField
                    name="Full_Name"
                    control={form.control}
                    fieldType={formFieldTypes.INPUT}
                    label="Full name:"
                    icon={User}
                    placeholder="Abdu Ali"
                  />
                  <CustomFormField
                    name="Sex"
                    control={form.control}
                    fieldType={formFieldTypes.RADIO_BUTTON}
                    listdisplay={["Male", "Female", "Other"]}
                    label="Gender:"
                  />
                  <CustomFormField
                    name="Speciality"
                    control={form.control}
                    fieldType={formFieldTypes.SELECT}
                    listdisplay={Specialities}
                    label="Speciality:"
                  />
                  <div className="flex justify-between items-center gap-16">
                    <CustomFormField
                      name="experienceYear"
                      control={form.control}
                      fieldType={formFieldTypes.INPUT}
                      label="Experience:"
                      type="number"
                    />
                    <CustomFormField
                      name="passKey"
                      control={form.control}
                      fieldType={formFieldTypes.INPUT}
                      label="PassKey:"
                      placeholder="123456"
                    />
                  </div>
                  <Button type="submit" className="cursor-pointer">
                    {isLoading ? "Creating..." : "Create"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Admin">
          <Card>
            <CardHeader>
              <CardTitle>Admin Credential</CardTitle>
              <CardDescription>
                Enter an Admin info to have an access for the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((values) =>
                    onSubmitAdminCreation(values)
                  )}
                  className="flex flex-col gap-5"
                >
                  <CustomFormField
                    name="Full_Name"
                    control={formAdmin.control}
                    fieldType={formFieldTypes.INPUT}
                    label="Full name:"
                    icon={User}
                    placeholder="Abdu Ali"
                  />
                  <CustomFormField
                    name="Sex"
                    control={formAdmin.control}
                    fieldType={formFieldTypes.RADIO_BUTTON}
                    listdisplay={["Male", "Female", "Other"]}
                    label="Gender:"
                  />
                  <div className="flex justify-between items-center gap-16">
                    <CustomFormField
                      name="experienceYear"
                      control={formAdmin.control}
                      fieldType={formFieldTypes.INPUT}
                      label="Experience:"
                      type="number"
                    />
                    <CustomFormField
                      name="passKey"
                      control={formAdmin.control}
                      fieldType={formFieldTypes.INPUT}
                      label="PassKey:"
                      placeholder="123456"
                    />
                  </div>
                  <Button type="submit" className="cursor-pointer">
                    {isLoading ? "Creating..." : "Create"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
