const BOIS = "#4A3324";
const TERRACOTTA = "#7A4B2A";
const VERT = "#4C7A4A";
const CREME = "#F3EEE3";
const BLANC_CASSE = "#FCFBF9";
const NOIR = "#2B2724";

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

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #E4DAC8; font-family: Arial, Helvetica, sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: ${TERRACOTTA}; font-weight: 700; width: 110px;">
        ${label}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #E4DAC8; font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: ${NOIR};">
        ${value}
      </td>
    </tr>`;

  return `
<!DOCTYPE html>
<html lang="fr">
  <body style="margin: 0; padding: 0; background: ${CREME};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${CREME};">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background: ${BLANC_CASSE}; border-radius: 8px; overflow: hidden;">

            <!-- header -->
            <tr>
              <td align="center" style="background: ${BOIS}; padding: 36px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="width: 72px; height: 72px; border-radius: 50%; border: 3px solid ${TERRACOTTA}; background: ${BOIS};">
                      <div style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 700; font-size: 24px; color: ${CREME}; line-height: 66px;">
                        A&amp;M
                      </div>
                    </td>
                  </tr>
                </table>
                <div style="margin-top: 16px; font-family: Georgia, 'Times New Roman', serif; font-weight: 700; font-size: 22px; letter-spacing: 0.02em; color: ${BLANC_CASSE};">
                  GUINGUETTE A&amp;M
                </div>
                <div style="margin-top: 4px; font-family: Arial, Helvetica, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; color: #C9B79C;">
                  Depuis 2026
                </div>
              </td>
            </tr>

            <!-- body -->
            <tr>
              <td style="padding: 32px 28px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom: 8px;">
                      <span style="display: inline-block; background: #E3ECE1; color: ${VERT}; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 5px 14px; border-radius: 100px;">
                        Réservation confirmée
                      </span>
                    </td>
                  </tr>
                </table>
                <p style="margin: 20px 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.6; color: ${NOIR};">
                  Bonjour ${name},<br />
                  Votre table vous attend à la Guinguette A&amp;M :
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px;">
                  ${row("Date", `<span style="text-transform: capitalize;">${formattedDate}</span>`)}
                  ${row("Heure", time)}
                  ${row("Personnes", String(partySize))}
                </table>

                <p style="margin: 24px 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #6B645C;">
                  📍 28bis avenue de la République, à Igny — suivez la lumière et le bruit du babyfoot.
                </p>
              </td>
            </tr>

            <!-- signature -->
            <tr>
              <td style="padding: 24px 28px 32px;">
                <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size: 16px; color: ${BOIS};">
                  À bientôt,<br />Abel &amp; Maël
                </p>
              </td>
            </tr>

            <!-- footer -->
            <tr>
              <td style="background: ${CREME}; padding: 16px 28px; text-align: center;">
                <span style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #8A8377;">
                  Guinguette A&amp;M · 28bis avenue de la République, Igny
                </span>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
