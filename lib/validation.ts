import z from "zod";

export const newUserSchema = z.object({
  Full_Name: z.string().min(2, "Please Enter Your name"),
  email: z.email("Please Enter a valid Email"),
  phoneNumber: z.string().min(8, "Please Enter Valid Phone Number"),
  gender: z.string().min(1, "Please select your gender"),
  birthDate: z
    .union([z.date(), z.undefined()])
    .refine((val) => val !== undefined, {
      message: "Please Select Your birth Day",
    }),
  emergencyContactName: z
    .string()
    .min(2, "Please enter a valid name"),
  emergencyContactPhone: z.string().min(8, "Please enter a valid Phone Number"),
});

export const patientMedicalInfo = z.object({
  preHistory: z.boolean(),
  doctorName: z
    .string()
    .min(2, "Please Select a Doctor")
    .optional()
    .or(z.literal("")),
  reason: z.string().min(1, "Please select your reason"),
  symptoms: z
    .array(z.string().min(2, "Please Enter Your symptoms"))
    .optional()
    .or(z.literal("")),
  allergies: z
    .array(
      z
        .string()
        .min(2, "Please provide us your allergies (if any)")
    )
    .optional()
    .or(z.literal("")),
  past_Medical_History: z
    .string()
    .min(2, "Please provide us a valid Past Medical History (if any)")
    .optional()
    .or(z.literal("")),
  family_Medical_History: z
    .string()
    .min(2, "please provide us a Family Medical history (if Relevant)")
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
    .optional()
    .or(z.literal("")),
  identity_Type: z
    .string()
    .min(2, "Please Select an Identity type"),
  identity_Number: z.string().min(2, "Please Enter a valid Id No"),
  identity_photo: z.string().min(10, "Please Enter Your scanned ID Image"),
});

export const CredentialForm = z.object({
  Full_Name: z.string().min(2, "Please Enter Doctor's Name"),
  Sex: z.string().min(1, "Please Select his/her sex"),
  Speciality: z.string().min(1, "Please Select the field of Speciality").optional().or(z.literal("")),
  experienceYear: z.coerce.number().min(0, "Please Enter his/her years of Experience"),
  passKey: z.string().min(6, "Please enter 'Six' digit Passkey"),
  image: z.string().min(10, "Please upload an image")
});

export const updateCredentialForm = z.object({
  Full_Name: z.string().min(2, "Please Enter Doctor's Name"),
  Sex: z.string().min(1, "Please Select his/her sex"),
  Speciality: z.string().min(1, "Please Select the field of Speciality").optional().or(z.literal("")),
  experienceYear: z.coerce.number().min(0, "Please Enter his/her years of Experience"),
  passKey: z.string().min(6, "Please enter 'Six' digit Passkey"),
  roleType: z.string().min(1, "Please Select the role type"),
  image: z.string().min(10, "Please upload an image")
});
