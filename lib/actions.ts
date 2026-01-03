/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from "react-hook-form";
import {
  CredentialForm,
  newUserSchema,
  patientMedicalInfo,
  updateCredentialForm,
} from "./validation";
import z from "zod";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { credentialFormType } from "@/app/Credential/page";

const api = "https://care-pack-back-end.vercel.app"
const smsApi = "https://care-pack-red.vercel.app/api/send-sms"

async function sendSmsIfPresent(
  phone: string | null | undefined,
  message: string
) {
  if (!phone || typeof phone !== "string" || phone.trim() === "") {
    console.log("sendSmsIfPresent: no phone number provided, skipping SMS.");
    return;
  }

  try {
    await axios.post(smsApi, {
      number: phone,
      message,
    });
  } catch (err) {
    console.log("Failed to send SMS:", err);
  }
}

interface cloudinarySuccessResult {
  event: "success";
  info: {
    secure_url: string;
  };
}

interface statusCount {
  Scheduled: number;
  Pending: number;
  Cancelled: number;
  specialityChange: number;
  Healed: number;
}


export const handleUploadSuccess = (
  result: unknown,
  form: UseFormReturn<any>,
  setPreviewUrl: (url: string | null) => void,
  formField: string
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

    form.setValue(formField, secured_url, { shouldValidate: true });
    setPreviewUrl(secured_url);
  } else {
    console.error(
      "Cloudinary Upload Failed or returned an unexpected structure."
    );

    form.setValue(formField, "");
    setPreviewUrl(null);
  }
};

export async function onSubmitMedical(
  values: z.infer<typeof patientMedicalInfo>,
  setIsLoading: (value: true | false) => void,
  form: UseFormReturn<any>,
  setPreviewUrl: (url: string | null) => void,
  setMessage: (message: string | null) => void,
  setError: (error: string | null) => void,
  router: AppRouterInstance
) {
  console.log(values);
  try {
    setIsLoading(true);
    const userId = localStorage.getItem("patientId");
    const payload = {
      ...values,
      userId: userId,
      status: "Pending",
      schedulingNumber: 0,
    };
    await axios
      .post(`${api}/medical`, payload, {
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
          router.back();
        }, 3000);
      });
    const data2 = await fetchingUsers();
    const filteredData = data2.filter((item: any) => {
      return item._id === userId;
    });
    const phoneArray = filteredData.map((item: any) => item.phoneNumber);
    const phone = phoneArray.length > 0 ? phoneArray[0] : null;
    const smsMessaging = `Hi, It's CarePack, Your Appointment Request has been received. We will notify you once it's scheduled.`;
    await sendSmsIfPresent(phone, smsMessaging);
  } catch (error: unknown) {
    setIsLoading(true);
    let errorMessage = "An unknown Error Occured";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message ?? error.message;
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
      .post(`${api}/users`, values, {
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

export async function onSubmitAdminCreation(
  values: z.infer<typeof CredentialForm>,
  form: UseFormReturn<credentialFormType>,
  setIsLoading: (value: true | false) => void,
  setMessage: (value: string | null) => void,
  setErrorMessage: (value: string | null) => void,
  setPreviewUrl: (value: string | null) => void
) {
  try {
    setIsLoading(true);
    const role = "Admin";
    const payload = {
      ...values,
      roleType: role,
    };
    await axios
      .post(`${api}/credential`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        form.reset();
        setMessage("Admin Registered Successfully");
        setIsLoading(false);
        setPreviewUrl(null);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    setErrorMessage(errorMessage);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
    return;
  }
}

export async function onSubmitDoctorCreation(
  values: z.infer<typeof CredentialForm>,
  form: UseFormReturn<credentialFormType>,
  setIsLoading: (value: true | false) => void,
  setErrorMessage: (value: string | null) => void,
  setMessage: (value: string | null) => void,
  setPreviewUrl: (value: string | null) => void
) {
  try {
    setIsLoading(true);
    const payload = {
      ...values,
      roleType: "Doctor",
    };
    await axios
      .post(`${api}/credential`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        form.reset();
        setMessage(`${data.Full_Name} registered successfully`);
        setIsLoading(false);
        setPreviewUrl(null);
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      });
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    setErrorMessage(errorMessage);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
    return;
  }
}

export async function fetchingCredential() {
  try {
    const response = await axios.get(`${api}/credential`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "An Unknown Error is happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    return [];
  }
}

export async function updatingCredential(
  values: z.infer<typeof updateCredentialForm>,
  _id: string
) {
  try {
    await axios
      .patch(`${api}/credential/${_id}`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .then((data) => console.log(data));
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    return;
  }
}

export async function DeletingCredential(_id: string) {
  try {
    await axios
      .delete(`${api}/credential/${_id}`)
      .then((res) => res.data)
      .then((data) => console.log(data));
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    return;
  }
}

export async function fetchingMedical() {
  try {
    const response = await axios.get(`${api}/medical`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    return data;
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    return [];
  }
}

export async function fetchingUsers() {
  try {
    const response = await axios.get(`${api}/users`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    return data;
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    return [];
  }
}

export async function getStatusCount(): Promise<statusCount> {
  const medicals = (await fetchingMedical()) || [];

  const counts: statusCount = {
    Scheduled: 0,
    Pending: 0,
    Cancelled: 0,
    specialityChange: 0,
    Healed: 0,
  };

  medicals.forEach((item: any) => {
    if (item.status === "Scheduled") counts.Scheduled += 1;
    else if (item.status === "Pending") counts.Pending += 1;
    else if (item.status === "Cancelled") counts.Cancelled += 1;
    else if (item.status === "specialityChange") counts.specialityChange += 1;
    else if (item.status === "Healed") counts.Healed += 1;
    else return;
  });
  return counts;
}

async function updateUserStatus(userId: string, selectedDoctor: string) {
  try {
    const response = await axios.patch(
      `${api}/medical/${userId}`,
      { status: "Scheduled", Doctor: selectedDoctor, schedulingNumber: +1 },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    return data;
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    throw error;
  }
}

export async function handleSchedule(
  row: any,
  date: Date,
  selectedDoctor: string
) {
  const id = row.original._id;
  const selected = row.original.doctors.filter(
    (item: any) => item.name === selectedDoctor
  );
  const data3 = await fetchingMedical();
  const filteredData = data3.filter((item: any) => {
    return item._id === id;
  });
  const userId = filteredData.map((item: any) => item.userId)[0];

  const doctorId = selected?.map((item: any) => {
    return item.id;
  });

  try {
    const response = await axios.patch(
      `${api}/credential/${doctorId}`,
      {
        AppointmentDates: [date.toISOString()],
        patientInfos: [
          {
            name: row.original.patientName,
            age: row.original.age,
            reason: row.original.reason,
            symptoms: row.original.symptoms && row.original.symptoms,
            allergies: row.original.allergies && row.original.allergies,
            past_Medical_History:
              row.original.past_Medical_History &&
              row.original.past_Medical_History,
            family_Medical_History:
              row.original.family_Medical_History &&
              row.original.family_Medical_History,
            AppointmentDate: date.toISOString(),
            doctorName: selectedDoctor,
            status: "Scheduled",
            schedulingNumber: 1,
            userId: userId,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    await updateUserStatus(id, selectedDoctor);
    const data2 = await fetchingUsers();
    const filteredData2 = data2.filter((item: any) => {
      return item._id === userId;
    });
    const phoneArray = filteredData2.map((item: any) => item.phoneNumber);
    const phone = phoneArray.length > 0 ? phoneArray[0] : null;
    const smsMessaging = `Hi, It's CarePack, Your Appointment has been scheduled on ${date.toLocaleString()} with ${selectedDoctor}. Please be on time.`;
    await sendSmsIfPresent(phone, smsMessaging);
    return data;
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log("Error details:", errorMessage);
    throw error;
  }
}

export async function handleCanceling(rowId: string, reason: string) {
  try {
    const response = await axios.patch(
      `${api}/medical/${rowId}`,
      { status: "Cancelled", cancellingReason: reason },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    const data2 = await fetchingUsers();
    const data3 = await fetchingMedical();
    const filteredData = data3.filter((item: any) => {
      return item._id === rowId;
    });
    const userId = filteredData.map((item: any) => item.userId)[0];
    const filteredData2 = data2.filter((item: any) => {
      return item._id === userId;
    });
    const phoneArray = filteredData2.map((item: any) => item.phoneNumber);
    const phone = phoneArray.length > 0 ? phoneArray[0] : null;
    const smsMessaging = `Hi, It's CarePack, Sorry, Your Appointment has been cancelled. Reason: ${reason}.`;
    await sendSmsIfPresent(phone, smsMessaging);
    return data;
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    throw error;
  }
}

export async function verifyCredentials(passKey: string) {
  try {
    const response = await axios.post(
      `${api}/credential/verify`,
      { passKey },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.data) {
      throw new Error("Authentication failed");
    }
    return await response.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

export async function getUserByName(name: string) {
  try {
    const response = await axios.get(
      `${api}/credential/name/${name}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.data) {
      throw new Error("User not found");
    }
    return await response.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to fetch user data",
    };
  }
}

async function updateUserMedication(userId: string, value: string | null) {
  try {
    const response = await axios.patch(
      `${api}/medical/${userId}`,
      {
        status: "Healed",
        Disease: value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    return data;
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    return;
  }
}

export async function handleCured(
  value: string | null,
  userId: string,
  id: string
) {
  try {
    const response = await axios.patch(
      `${api}/credential/patientInfos/${id}`,
      {
        status: "Healed",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    const message =
      `Hi, It's CarePack, Congratulations! You have been marked as cured from ${value}. Wishing you continued good health.`;

    const data2 = await fetchingUsers();
    const filteredData2 = data2.filter((item: any) => {
      return item._id === userId;
    });
    const phoneArray = filteredData2.map((item: any) => item.phoneNumber);
    const phone = phoneArray.length > 0 ? phoneArray[0] : null;
    await sendSmsIfPresent(phone, message);
    await updateUserMedication(userId, value);
    return data;
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    return;
  }
}

export async function handleReschedule(
  value: Date,
  id: string,
  doctorId: string
) {
  try {
    const doctorResponse = await axios.get(
      `${api}/credential/id/${doctorId}`
    );
    const doctorData = doctorResponse.data;

    const currentPatientInfo = doctorData.patientInfos?.find(
      (patient: any) => patient._id === id
    );

    if (!currentPatientInfo) {
      throw new Error(
        `Patient info with id ${id} not found in doctor's patient list`
      );
    }

    const oldAppointmentDate = currentPatientInfo.AppointmentDate;

    const response = await axios.patch(
      `http://localhost:4000/credential/patientInfos/${id}`,
      {
        status: "Scheduled",
        schedulingNumber: currentPatientInfo.schedulingNumber + 1,
        AppointmentDate: value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // First, find the medical record for this user
    const medicalRecords = await fetchingMedical();
    const userMedicalRecord = medicalRecords.find(
      (record: any) => record.userId === currentPatientInfo.userId
    );

    if (userMedicalRecord) {
      // Update the medical record using the correct medical record ID
      await axios.patch(
        `http://localhost:4000/medical/${userMedicalRecord._id}`,  // Use medical record ID
        {
          schedulingNumber: currentPatientInfo.schedulingNumber + 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      console.error("Medical record not found for user:", currentPatientInfo.userId);
    }

    // Rest of the function remains the same...
    if (oldAppointmentDate && doctorData.AppointmentDates) {
      const oldDate = new Date(oldAppointmentDate);

      const updatedAppointmentDates = doctorData.AppointmentDates.filter(
        (date: any) => {
          const currentDate = new Date(date);
          return currentDate.getTime() !== oldDate.getTime();
        }
      ).concat(value);

      await axios.patch(
        `http://localhost:4000/credential/appointment-dates/${doctorId}`,
        {
          AppointmentDates: updatedAppointmentDates,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    const data2 = await fetchingUsers();
    const filteredData2 = data2.filter((item: any) => {
      return item._id === currentPatientInfo.userId;
    });
    const phoneArray = filteredData2.map((item: any) => item.phoneNumber);
    const phone = phoneArray.length > 0 ? phoneArray[0] : null;
    const smsMessaging = `Hi, It's CarePack, Your Appointment has been rescheduled to ${value.toLocaleString()} with ${
      doctorData.Full_Name
    }. Please be on time.`;
    await sendSmsIfPresent(phone, smsMessaging);
    return data;
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
      console.log("Axios error details:", error.response?.data);
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log("❌ Reschedule error:", errorMessage);
    return;
  }
}
