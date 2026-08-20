import nodemailer from "nodemailer";

const SENDER = { name: "Guinguette A&M", address: "mael.domenech@gmail.com" };

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  const login = process.env.BREVO_SMTP_LOGIN;
  const key = process.env.BREVO_SMTP_KEY;
  if (!login || !key) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: { user: login, pass: key },
    });
  }
  return transporter;
}

export async function sendTransactionalEmail({
  to,
  subject,
  htmlContent,
}: {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
}) {
  const t = getTransporter();
  if (!t) return;

  try {
    await t.sendMail({
      from: SENDER,
      to: { name: to.name, address: to.email },
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Brevo SMTP email failed", error);
  }
}
