import { getOrderQrSvg } from "@/lib/qr";
import { PrintMonogram } from "@/components/PrintMonogram";

const BOIS = "#4A3324";
const TERRACOTTA = "#7A4B2A";
const CREME = "#F3EEE3";

function Panel({ qrSvg, upsideDown }: { qrSvg: string; upsideDown: boolean }) {
  return (
    <div
      style={{
        transform: upsideDown ? "rotate(180deg)" : undefined,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "28px 20px",
        background: CREME,
        color: BOIS,
        textAlign: "center",
      }}
    >
      <PrintMonogram />
      <div>
        <div
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "0.02em",
          }}
        >
          GUINGUETTE A&amp;M
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: "var(--font-poppins), Arial, sans-serif",
            fontSize: 13,
            color: TERRACOTTA,
          }}
        >
          Commandez depuis votre table
        </div>
      </div>
      <div
        style={{ width: 130, height: 130 }}
        dangerouslySetInnerHTML={{ __html: qrSvg }}
      />
      <div
        style={{
          fontFamily: "var(--font-poppins), Arial, sans-serif",
          fontSize: 11,
          color: "#8A7A64",
        }}
      >
        Scannez pour voir la carte
      </div>
    </div>
  );
}

export default async function ChevaletPage() {
  const qrSvg = await getOrderQrSvg(BOIS);

  return (
    <div className="min-h-screen print:min-h-0 bg-[#DEDAD2] py-10 print:bg-white print:py-0 flex flex-col items-center gap-6 print:gap-0">
      <p className="text-sm text-noir/60 print:hidden max-w-sm text-center">
        Imprimez cette page (Ctrl/Cmd + P), découpez le long du cadre, puis pliez au
        milieu — le chevalet tient debout tout seul, lisible des deux côtés.
      </p>

      <div
        className="print:shadow-none"
        style={{
          width: "300px",
          border: "1px solid #C9C0B2",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ height: "200px" }}>
          <Panel qrSvg={qrSvg} upsideDown={true} />
        </div>
        <div
          style={{
            borderTop: `2px dashed ${TERRACOTTA}`,
            position: "relative",
          }}
        >
          <span
            className="print:hidden"
            style={{
              position: "absolute",
              left: "50%",
              top: -9,
              transform: "translateX(-50%)",
              background: CREME,
              fontSize: 10,
              color: TERRACOTTA,
              padding: "0 8px",
            }}
          >
            plier ici
          </span>
        </div>
        <div style={{ height: "200px" }}>
          <Panel qrSvg={qrSvg} upsideDown={false} />
        </div>
      </div>
    </div>
  );
}
