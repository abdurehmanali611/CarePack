"use server"
import twilio from 'twilio'
import axios from 'axios';

export async function SendSmSToUser(number: string, message: string) {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
    await client.messages
      .create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: number,
      })
      .then((res) => console.log(res.sid))
      .catch((err) => console.log(err.message));
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

export default SendSmSToUser