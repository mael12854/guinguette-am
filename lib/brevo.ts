const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER = { email: "mael.domenech@gmail.com", name: "Guinguette A&M" };

export async function sendTransactionalEmail({
  to,
  subject,
  htmlContent,
}: {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ sender: SENDER, to: [to], subject, htmlContent }),
  });

  if (!response.ok) {
    console.error("Brevo email failed", response.status, await response.text());
  }
}
