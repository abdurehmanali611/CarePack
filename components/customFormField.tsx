/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React, { useState } from "react";
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Calendar1, Mail, Upload, User, User2 } from "lucide-react";
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
}

interface customProps {
  control: Control<any>;
  name: string;
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
}

const RenderInput = ({ field, props }: { field: any; props: customProps }) => {
  const [open, setOpen] = useState(false);

  switch (props.fieldType) {
    case formFieldTypes.INPUT:
      return (
        <div className="flex gap-3 items-center">
          {props.icon && <props.icon />}
          <FormControl>
            <Input
              {...field}
              placeholder={props.placeholder}
              type={props.type}
            />
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
              defaultChecked
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
        <Select value={field} onValueChange={field.onChange}>
          <SelectTrigger
            className={props.isDoctorList ? "w-full p-3" : "w-[300px]"}
          >
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{props.label}</SelectLabel>
              {props.isDoctorList
                ? props.listdisplay?.map((item) => (
                    <Tooltip key={item.id}>
                      <TooltipTrigger className="flex flex-col gap-3">
                        <SelectItem
                          key={item.id}
                          value={item.name}
                          className="p-2 w-[900px]"
                        >
                          <Image
                            src={item.image}
                            alt={item.name || "Icon"}
                            width={24}
                            height={24}
                            loading="eager"
                            className="rounded-full"
                          />
                          <span className="font-semibold">{item.name}</span>
                        </SelectItem>
                      </TooltipTrigger>
                      <TooltipContent>{item.title}</TooltipContent>
                    </Tooltip>
                  ))
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
                clientAllowedFormats: ["png", "jpeg", "webp"],
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
                    width={200}
                    height={150}
                    loading="eager"
                    className="rounded-md object-cover"
                  />
                </div>
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
            <FormLabel>{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
