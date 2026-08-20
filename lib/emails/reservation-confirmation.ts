export function reservationConfirmationEmail({
  name,
  date,
  time,
  partySize,
}: {
  name: string;
  date: string;
  time: string;
  partySize: number;
}) {
  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `
    <div style="font-family: sans-serif; background: #F3EEE3; padding: 32px;">
      <div style="max-width: 480px; margin: 0 auto; background: #FCFBF9; border-radius: 4px; overflow: hidden;">
        <div style="background: #4A3324; padding: 24px; text-align: center;">
          <span style="font-size: 20px; font-weight: 700; color: #FCFBF9;">Guinguette A&amp;M</span>
        </div>
        <div style="padding: 28px; color: #2B2724;">
          <h1 style="font-size: 20px; margin: 0 0 16px;">Réservation confirmée !</h1>
          <p style="margin: 0 0 16px; line-height: 1.5;">
            Bonjour ${name},<br />
            Votre table est réservée à la Guinguette A&amp;M :
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="padding: 6px 0; color: #7A4B2A; font-weight: 600;">Date</td>
              <td style="padding: 6px 0; text-transform: capitalize;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #7A4B2A; font-weight: 600;">Heure</td>
              <td style="padding: 6px 0;">${time}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #7A4B2A; font-weight: 600;">Personnes</td>
              <td style="padding: 6px 0;">${partySize}</td>
            </tr>
          </table>
          <p style="margin: 0 0 16px; line-height: 1.5;">
            28bis avenue de la République, à Igny — suivez la lumière et le bruit du babyfoot.
          </p>
          <p style="margin: 0; line-height: 1.5; color: #4A3324;">
            À bientôt,<br />Abel &amp; Maël
          </p>
        </div>
      </div>
    </div>
  `;
}
