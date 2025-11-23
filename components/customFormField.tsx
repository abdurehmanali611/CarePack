/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import {
  AlertTriangle,
  Calendar1,
  Mail,
  Upload,
  User,
  User2,
} from "lucide-react";
import { PhoneInput } from "./phone-input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { CldUploadWidget } from "next-cloudinary";
import Link from "next/link";
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
import clsx from "clsx";

export enum formFieldTypes {
  INPUT = "input",
  PHONE_INPUT = "phoneInput",
  CALENDAR = "calendar",
  RADIO_BUTTON = "radioButton",
  CHECKBOX = "checkBox",
  SELECT = "select",
  TEXTAREA = "textarea",
  IMAGE_UPLOADER = "imageUploader",
  SKELETON = "skeleton",
  ALERTDIALOG = "alertDialog",
}

interface BaseProps {
  label?: string;
  placeholder?: string;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: formFieldTypes;
  preHistory?: React.Dispatch<React.SetStateAction<boolean>>;
  listdisplay?: Array<any>;
  isDoctorList?: boolean;
  previewUrl?: string | null;
  handleCloudinary?: (result: any) => void;
  icon?: typeof User | typeof Mail | typeof User2 | typeof Calendar1;
  type?: string;
  reason?: React.Dispatch<React.SetStateAction<string>>;
  typeInsurance?: React.Dispatch<React.SetStateAction<string>>;
  setPassKey?: React.Dispatch<React.SetStateAction<string>>;
  setDialogError?: React.Dispatch<React.SetStateAction<string | null>>;
  handleAlertDialog?: (result: any) => void;
  passKey?: string;
  dialogError?: string | null;
  add?: "allergy" | "symptom";
}

interface FormConnectedProps extends BaseProps {
  control: Control<any>;
  name: string;
  fieldType:
    | formFieldTypes.INPUT
    | formFieldTypes.TEXTAREA
    | formFieldTypes.CHECKBOX
    | formFieldTypes.CALENDAR
    | formFieldTypes.PHONE_INPUT
    | formFieldTypes.RADIO_BUTTON
    | formFieldTypes.SELECT
    | formFieldTypes.IMAGE_UPLOADER
    | formFieldTypes.SKELETON;
}

interface AlertDialogProps extends BaseProps {
  fieldType: formFieldTypes.ALERTDIALOG;
  listdisplay: Array<any>;
  setPassKey: React.Dispatch<React.SetStateAction<string>>;
  setDialogError: React.Dispatch<React.SetStateAction<string | null>>;
  handleAlertDialog: (result: any) => void;
  passKey?: string;
  dialogError?: string | null;
}

type customProps = FormConnectedProps | AlertDialogProps;

const RenderInput = ({ field, props }: { field: any; props: customProps }) => {
  const [open, setOpen] = React.useState(false);

  switch (props.fieldType) {
    case formFieldTypes.INPUT:
      return (
        <div className="flex gap-3 items-center">
          {props.icon && <props.icon />}
          <FormControl>
            <div
              className={clsx("flex flex-col gap-2", {
                "w-full": props.type === "name",
              })}
            >
              <Input
                {...(props.add ? {} : field)}
                placeholder={props.placeholder}
                type={props.type}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    e.currentTarget.value !== "" &&
                    props.add
                  ) {
                    e.preventDefault();
                    const newValue = e.currentTarget.value.trim();
                    const currentArray = Array.isArray(field.value)
                      ? field.value
                      : [];
                    field.onChange([...currentArray, newValue]);
                    e.currentTarget.value = "";
                  }
                }}
              />
              {props.add && (
                <div className="flex flex-col flex-wrap gap-2 max-h-24 overflow-y-auto p-2 border rounded-md">
                  {(Array.isArray(field.value) ? field.value : []).map(
                    (a: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded text-sm flex items-start"
                      >
                        {a}
                        <button
                          type="button"
                          className="text-red-500 ml-2 cursor-pointer"
                          onClick={() => {
                            const currentArray = Array.isArray(field.value)
                              ? field.value
                              : [];
                            const next = currentArray.filter(
                              (_: string, idx: number) => idx !== i
                            );
                            field.onChange(next);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </FormControl>
        </div>
      );

    case formFieldTypes.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="w-80 h-36 ml-4"
          />
        </FormControl>
      );

    case formFieldTypes.CHECKBOX:
      return (
        <FormControl>
          <Label
            htmlFor={props.label}
            className="hover:bg-accent/50 flex items-center gap-5 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950"
          >
            <Checkbox
              id="toggle"
              onCheckedChange={(value) => {
                field.onChange(value);
                if (props.preHistory) props.preHistory(!!value);
              }}
            />
            <div className="grid gap-1.5 font-normal">
              <p className="text-sm leading-none font-medium">
                History with US
              </p>
              <p className="text-muted-foreground text-sm">
                Do you have a history with us ?{" "}
              </p>
            </div>
          </Label>
        </FormControl>
      );

    case formFieldTypes.CALENDAR:
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-fit justify-between ml-6 font-normal cursor-pointer"
            >
              <Calendar1 className="mr-2 h-4 w-4" />
              {field.value ? field.value.toDateString() : "Select Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              captionLayout="dropdown"
              buttonVariant="ghost"
              onSelect={(date) => {
                field.onChange(date);
                setOpen(!open);
              }}
              classNames={{
                day: "cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground",
              }}
            />
          </PopoverContent>
        </Popover>
      );

    case formFieldTypes.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="ET"
            countryCallingCodeEditable
            international
            {...field}
            placeholder={props.placeholder}
          />
        </FormControl>
      );

    case formFieldTypes.RADIO_BUTTON:
      return (
        <RadioGroup
          className="flex gap-6 h-11"
          onValueChange={(item) => {
            field.onChange(item);
            if (props.reason) {
              if (item === "CheckUp") props.reason("CheckUp");
              else if (item === "Disease") props.reason("Disease");
            } else if (props.typeInsurance) {
              if (item === "Insurance") props.typeInsurance("Insurance");
              else if (item === "Private") props.typeInsurance("Private");
            }
          }}
          value={field.value}
        >
          {props.listdisplay?.map((item) => (
            <div key={item} className="flex gap-2 items-center cursor-pointer">
              <RadioGroupItem
                value={item}
                id={item}
                className="cursor-pointer"
              />
              <Label htmlFor={item} className="cursor-pointer">
                {item}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case formFieldTypes.SELECT:
      return (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger
            className={
              props.isDoctorList
                ? "w-full p-3 cursor-pointer"
                : "w-[300px] cursor-pointer"
            }
          >
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{props.label}</SelectLabel>
              {props.isDoctorList
                ? props.listdisplay?.map(
                    (item) =>
                      item.roleType === "Doctor" && (
                        <Tooltip key={item._id}>
                          <TooltipTrigger className="flex flex-col gap-3">
                            <SelectItem
                              key={item._id}
                              value={item.Full_Name}
                              className="p-2 w-[900px]"
                            >
                              <Image
                                src={item.image}
                                alt={item.Full_Name || "Icon"}
                                width={24}
                                height={24}
                                loading="eager"
                                className="rounded-full"
                              />
                              <span className="font-semibold">
                                {item.Full_Name}
                              </span>
                            </SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>{item.Speciality}</TooltipContent>
                        </Tooltip>
                      )
                  )
                : props.listdisplay?.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );

    case formFieldTypes.IMAGE_UPLOADER:
      return (
        <FormControl>
          <div className="flex flex-col items-center gap-4 w-full">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
              onSuccess={props.handleCloudinary}
              options={{
                sources: ["local", "url", "camera"],
                multiple: false,
                maxFiles: 1,
                clientAllowedFormats: ["png", "jpeg", "webp", "jfif"],
              }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  onClick={() => open()}
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  {props.previewUrl ? "Change Photo" : "Choose File"}
                </Button>
              )}
            </CldUploadWidget>
            {props.previewUrl && (
              <div className="relative mt-4 flex flex-col items-center">
                <div className="border rounded-lg p-2 bg-gray-50 w-fit">
                  <Image
                    src={props.previewUrl}
                    alt="Uploaded Image"
                    width={props.type !== "credential" ? 200 : 100}
                    height={props.type !== "credential" ? 150 : 100}
                    loading="eager"
                    className="rounded-md object-cover"
                  />
                </div>
                {props.type !== "credential" && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    <Link
                      href={field.value}
                      target="blank"
                      className="font-semibold font-serif text-lg hover:underline hover:text-blue-400 hover:cursor-pointer"
                    >
                      {field.value}
                    </Link>{" "}
                    Successfully uploaded to Cloudinary
                  </p>
                )}
              </div>
            )}
          </div>
        </FormControl>
      );

    case formFieldTypes.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: customProps) => {
  if (props.fieldType === formFieldTypes.ALERTDIALOG) {
    return (
      <>
        {props.listdisplay?.map((item) => (
          <AlertDialog
            key={item}
            onOpenChange={(open) => {
              if (!open) {
                if (props.setPassKey) {
                  props.setPassKey("");
                }
                if (props.setDialogError) {
                  props.setDialogError(null);
                }
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
              {props.dialogError && (
                <div className="flex items-center text-sm text-red-600 border border-red-300 bg-red-50 p-2 rounded-md">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {props.dialogError}
                </div>
              )}
              <InputOTP
                maxLength={6}
                value={props.passKey}
                onChange={(e) => {
                  if (props.setPassKey) props.setPassKey(e);
                }}
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
                    if (props.setPassKey) props.setPassKey("");
                    if (props.setDialogError) props.setDialogError(null);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    props.handleAlertDialog?.(item);
                  }}
                  disabled={!props.passKey || props.passKey.length < 6}
                >
                  Submit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </>
    );
  }

  const { control, name, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={
            props.fieldType === formFieldTypes.IMAGE_UPLOADER
              ? "flex flex-col items-center gap-3"
              : "flex flex-col gap-3"
          }
        >
          {props.fieldType !== formFieldTypes.CHECKBOX && label && (
            <FormLabel className="text-foreground!">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
