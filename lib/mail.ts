import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 465);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function verifyMailConnection() {
  try {
    console.log("VERIFYING SMTP CONNECTION...");
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("MAIL_FROM:", process.env.MAIL_FROM);

    const result = await transporter.verify();
    console.log("SMTP VERIFY SUCCESS:", result);

    return result;
  } catch (error) {
    console.error("SMTP VERIFY ERROR:", error);
    throw error;
  }
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.MAIL_FROM) {
    throw new Error("MAIL_FROM is not configured.");
  }

  try {
    console.log("SENDING EMAIL...");
    console.log("FROM:", process.env.MAIL_FROM);
    console.log("TO:", to);
    console.log("SUBJECT:", subject);

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT SUCCESS:", info);
    return info;
  } catch (error) {
    console.error("SEND EMAIL ERROR:", error);
    throw error;
  }
}