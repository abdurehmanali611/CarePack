/* eslint-disable @typescript-eslint/no-explicit-any */
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { number, message } = body as {
      number?: string | null;
      message?: string;
    };

    if (!number || typeof number !== "string" || number.trim() === "") {
      return new Response(
        JSON.stringify({ error: "No phone number provided" }),
        { status: 400 }
      );
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    const res = await client.messages.create({
      body: message ?? "",
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: number,
    });

    return new Response(JSON.stringify({ sid: res.sid }), { status: 200 });
  } catch (error: any) {
    console.error("send-sms route error message:", error?.message ?? error);
    console.error("send-sms route error code:", error?.code ?? null);
    console.error("send-sms route stack:", error?.stack ?? null);

    const payload: any = { error: error?.message ?? "Unknown error" };
    if (error?.code) payload.code = error.code;

    return new Response(JSON.stringify(payload), { status: 500 });
  }
}

export const runtime = "nodejs";
