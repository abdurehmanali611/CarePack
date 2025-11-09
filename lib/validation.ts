import z from "zod";

export const newUserSchema = z.object({
  Full_Name: z.string().min(2, "Please Enter Your name").toLowerCase(),
  email: z.email("Please Enter a valid Email"),
  phoneNumber: z.string().min(8, "Please Enter Valid Phone Number"),
  gender: z.string().min(1, "Please select your gender").toLowerCase(),
  birthDate: z
    .union([z.date(), z.undefined()])
    .refine((val) => val !== undefined, {
      message: "Please Select Your birth Day",
    }),
  emergencyContactName: z
    .string()
    .min(2, "Please enter a valid name")
    .toLowerCase(),
  emergencyContactPhone: z.string().min(8, "Please enter a valid Phone Number"),
});

export const patientMedicalInfo = z.object({
  preHistory: z.boolean(),
  doctorName: z
    .string()
    .min(2, "Please Select a Doctor")
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  reason: z.string().min(1, "Please select your reason").toLowerCase(),
  symptoms: z
    .string()
    .min(2, "Please Enter Your symptoms")
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  allergies: z
    .string()
    .min(2, "Please provide us your allergies (if any)")
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  past_Medical_History: z
    .string()
    .min(2, "Please provide us a valid Past Medical History (if any)")
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  family_Medical_History: z
    .string()
    .min(2, "please provide us a Family Medical history (if Relevant)")
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  expected_Appointment_Date: z
    .union([z.date(), z.undefined()])
    .refine((val) => val !== undefined, {
      message: "Please Select Expected Appointment Date",
    }),
  comments_Or_Notes: z
    .string()
    .min(2, "Please provide us some notes/comments to be considered (if any)")
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  insurance_Provider: z
    .string()
    .min(2, "Please tell us the Insurance Providers name")
    .optional()
    .or(z.literal("")),
  insurance_policy_Id: z
    .string()
    .min(1, "Please tell us about your Insurance ID")
    .optional()
    .or(z.literal("")),
  insurance_Or_Private: z
    .string()
    .min(3, "Please Select how to get our service")
    .toLowerCase(),
  identity_Type: z
    .string()
    .min(2, "Please Select an Identity type")
    .toLowerCase(),
  identity_Number: z.string().min(2, "Please Enter a valid Id No"),
  identity_photo: z.string().min(10, "Please Enter Your scanned ID Image")
});