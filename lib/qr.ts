import QRCode from "qrcode";

export const SITE_URL = "https://guinguette-am.vercel.app";
export const ORDER_URL = `${SITE_URL}/carte`;

export async function getOrderQrSvg(color: string) {
  return QRCode.toString(ORDER_URL, {
    type: "svg",
    margin: 0,
    color: { dark: color, light: "#00000000" },
  });
}
