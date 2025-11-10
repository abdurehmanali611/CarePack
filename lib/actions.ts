/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from "react-hook-form";
import { newUserSchema, patientMedicalInfo } from "./validation";
import z from "zod";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface cloudinarySuccessResult {
  event: "success";
  info: {
    secure_url: string;
  };
}

export const handleUploadSuccess = (
  result: unknown,
  form: UseFormReturn<any>,
  setPreviewUrl: (url: string | null) => void
) => {
  if (
    typeof result == "object" &&
    result !== null &&
    "event" in result &&
    result.event == "success" &&
    "info" in result &&
    typeof result.info == "object" &&
    result.info !== null &&
    "secure_url" in result.info
  ) {
    const typedResult = result as cloudinarySuccessResult;
    const secured_url = typedResult.info.secure_url;

    form.setValue("identity_photo", secured_url, { shouldValidate: true });
    setPreviewUrl(secured_url);
  } else {
    console.error(
      "Cloudinary Upload Failed or returned an unexpected structure."
    );

    form.setValue("identity_photo", "");
    setPreviewUrl(null);
  }
};

export async function onSubmitMedical(
  values: z.infer<typeof patientMedicalInfo>,
  setIsLoading: (value: true | false) => void,
  form: UseFormReturn<any>,
  setPreviewUrl: (url: string | null) => void,
  setMessage: (message: string | null) => void,
  setError: (error: string | null) => void
) {
  console.log(values);
  try {
    setIsLoading(true);
    const userId = localStorage.getItem("patientId");
    const payload = {
      ...values,
      userId: userId,
    };
    await axios
      .post("http://localhost:4000/medical", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        form.reset();
        localStorage.removeItem("patientId");
        setPreviewUrl(null);
        setIsLoading(false);
        setMessage("Appointment Request Sent Successfully");
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
  } catch (error: unknown) {
    setIsLoading(true);
    let errorMessage = "An unknown Error Occured";
    if (axios.isAxiosError(error)) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    setError(errorMessage);
    setIsLoading(false);
    return;
  }
}

export async function onSubmitUser(
  values: z.infer<typeof newUserSchema>,
  setProceed: (value: true | false) => void,
  form: UseFormReturn<any>,
  setError: (value: string | null) => void,
  router: AppRouterInstance
) {
  console.log(values);
  try {
    setProceed(true);
    await axios
      .post("http://localhost:4000/users", values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .then((data) => {
        localStorage.setItem("patientId", data._id);
        form.reset();

        router.push("/Appointment");
      });
    setProceed(false);
  } catch (error: unknown) {
    setProceed(false);
    let errorMessage = "An unknown error occurred during User Creation";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    setError(errorMessage);
    return;
  }
}
