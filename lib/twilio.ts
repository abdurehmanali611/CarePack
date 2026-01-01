"use server";
import twilio from "twilio";
import axios from "axios";

export async function SendSmSToUser(
  number: string | null | undefined,
  message: string
) {
  if (!number || typeof number !== "string" || number.trim() === "") {
    console.log("SendSmSToUser: no valid phone number provided, skipping SMS.");
    return;
  }

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    const res = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: number,
    });

    console.log("SMS sent, sid:", res.sid);
    return res;
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log("SendSmSToUser error:", errorMessage);
    return;
  }
}

export default SendSmSToUser;
