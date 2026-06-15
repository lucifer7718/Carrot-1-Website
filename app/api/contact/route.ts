import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, query } = body;

    if (!name || !email || !query) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: "RESEND_API_KEY is missing in .env.local" },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Carrot Contact <onboarding@resend.dev>",
      to: ["wearcarrot923@gmail.com"],
      replyTo: email,
      subject: `New Contact Query from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1A1A1A;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Query:</strong></p>
          <p>${query.replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Resend failed to send email.",
          error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your query has been sent successfully.",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while sending your query.",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}