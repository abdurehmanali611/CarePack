"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { updateCredentialForm } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Trash, User } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Specialities } from ".";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  DeletingCredential,
  fetchingCredential,
  updatingCredential,
} from "@/lib/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface updateCredentialType {
  id: string;
  Full_Name: string;
  Sex: string;
  Speciality: string;
  experienceYear: number;
  passKey: string;
  roleType: string;
}

export default function UpdateCredetial({
  id,
  Full_Name,
  Sex,
  Speciality,
  experienceYear,
  passKey,
  roleType,
  refetchData,
}: updateCredentialType & { refetchData: () => void }) {
  const [fetchedData, setFetchedData] = useState<updateCredentialType[] | null>(
    null
  );
  const [open, setOpen] = useState(false);

  async function fetchCredential() {
    await fetchingCredential().then((res) => setFetchedData(res || []));
  }

  useEffect(() => {
    fetchCredential();
  }, []);

  const roleTypeCheck = fetchedData?.find((item) => item.roleType == "Admin" );

  const form = useForm<z.infer<typeof updateCredentialForm>>({
    resolver: zodResolver(updateCredentialForm) as any,
    defaultValues: {
      Full_Name: Full_Name,
      Sex: Sex,
      Speciality: Speciality,
      experienceYear: experienceYear,
      passKey: passKey,
      roleType: roleType,
    },
  });

  const handleUpdate = async (values: z.infer<typeof updateCredentialForm>) => {
    await updatingCredential(values, id);
    await refetchData();
    setOpen(false); 
  };

  const handleDelete = async () => {
    await DeletingCredential(id);
    await refetchData();
  };

  return (
    <div className="flex gap-3 items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="cursor-pointer">
          <Button>
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update {Full_Name} informations</DialogTitle>
            <DialogDescription>
              Here you can Update {Full_Name} informations
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdate)}
              className="flex flex-col gap-5"
            >
              <CustomFormField
                name="Full_Name"
                control={form.control}
                fieldType={formFieldTypes.INPUT}
                label="Full Name:"
                icon={User}
                type="name"
              />
              <CustomFormField
                name="Sex"
                control={form.control}
                fieldType={formFieldTypes.RADIO_BUTTON}
                label="Gender:"
                listdisplay={["Male", "Female", "Other"]}
              />
              <CustomFormField
                name="Speciality"
                control={form.control}
                fieldType={formFieldTypes.SELECT}
                label="Select Speciality:"
                listdisplay={Specialities}
              />
              <div className="flex justify-between items-center">
                <CustomFormField
                  name="experienceYear"
                  control={form.control}
                  fieldType={formFieldTypes.INPUT}
                  label="Year of Experience:"
                  type="number"
                />
                <CustomFormField
                  name="passKey"
                  control={form.control}
                  fieldType={formFieldTypes.INPUT}
                  label="PassKey:"
                />
              </div>
              {(roleTypeCheck === undefined || roleType == "Admin") && (
                <FormField
                  name="roleType"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          className="flex gap-3 items-center"
                        >
                          {["Admin", "Doctor"].map((item) => (
                            <div key={item} className="flex gap-3 items-center">
                              <RadioGroupItem
                                value={item}
                                className="cursor-pointer"
                              />
                              <Label className="cursor-pointer">{item}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <Button className="cursor-pointer" type="submit">
                Update
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AlertDialog>
        <AlertDialogTrigger asChild className="cursor-pointer">
          <Button variant="destructive">
            <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deleting {Full_Name}</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Are you sure you want to Delete {Full_Name} informations</p>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              asChild
              onClick={handleDelete}
              className="cursor-pointer"
            >
              <Button variant="destructive">Delete</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
