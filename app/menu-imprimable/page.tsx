import { getAvailableMenu } from "@/lib/data/menu";
import { getOrderQrSvg, SITE_URL } from "@/lib/qr";
import { PrintMonogram } from "@/components/PrintMonogram";
import { allergenLabel } from "@/lib/allergens";
import type { MenuCategory } from "@/lib/types";

const BOIS = "#4A3324";
const TERRACOTTA = "#7A4B2A";
const NOIR = "#2B2724";

const CATEGORY_LABELS: Record<MenuCategory, string> = {
  entree: "À grignoter",
  plat: "Plats",
  dessert: "Desserts",
  boisson: "Boissons",
};
const CATEGORY_ORDER: MenuCategory[] = ["entree", "plat", "dessert", "boisson"];

export default async function MenuImprimablePage() {
  const [items, qrSvg] = await Promise.all([getAvailableMenu(), getOrderQrSvg(BOIS)]);

  const byCategory = new Map<MenuCategory, typeof items>();
  for (const item of items) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }

  return (
    <div className="min-h-screen print:min-h-0 bg-[#DEDAD2] py-10 print:bg-white print:py-0 flex flex-col items-center gap-6 print:gap-0">
      <p className="text-sm text-noir/60 print:hidden max-w-sm text-center">
        Imprimez cette page (Ctrl/Cmd + P) — pensée pour une feuille A4, à poser sur les
        tables ou à afficher au comptoir.
      </p>

      <div
        className="printable-a4"
        style={{
          width: "210mm",
          background: "#FCFBF9",
          border: "1px solid #C9C0B2",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          padding: "16mm 18mm",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "7mm",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <PrintMonogram size={68} />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontWeight: 700,
                fontSize: 30,
                color: BOIS,
                letterSpacing: "0.02em",
              }}
            >
              GUINGUETTE A&amp;M
            </div>
            <div
              style={{
                marginTop: 4,
                fontFamily: "var(--font-poppins), Arial, sans-serif",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: TERRACOTTA,
              }}
            >
              La carte
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {CATEGORY_ORDER.filter((cat) => byCategory.has(cat)).map((category) => (
            <div key={category}>
              <div
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: BOIS,
                  borderBottom: `1.5px solid ${TERRACOTTA}`,
                  paddingBottom: 4,
                  marginBottom: 8,
                }}
              >
                {CATEGORY_LABELS[category]}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {byCategory.get(category)!.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-poppins), Arial, sans-serif",
                          fontWeight: 600,
                          fontSize: 14,
                          color: NOIR,
                        }}
                      >
                        {item.name}
                        {item.options.length > 0 && (
                          <span style={{ fontWeight: 400, color: "#8A7A64" }}>
                            {" "}
                            ({item.options.map((o) => o.label).join(", ")})
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <div
                          style={{
                            fontFamily: "var(--font-poppins), Arial, sans-serif",
                            fontSize: 12,
                            color: "#8A7A64",
                            marginTop: 2,
                          }}
                        >
                          {item.description}
                        </div>
                      )}
                      {item.allergens.length > 0 && (
                        <div
                          style={{
                            fontFamily: "var(--font-poppins), Arial, sans-serif",
                            fontSize: 10.5,
                            color: TERRACOTTA,
                            marginTop: 2,
                          }}
                        >
                          {item.allergens.map(allergenLabel).join(", ")}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-poppins), Arial, sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        color: NOIR,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.price.toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p style={{ fontFamily: "var(--font-poppins), Arial, sans-serif", fontSize: 13, color: "#8A7A64" }}>
              La carte n&apos;est pas encore disponible.
            </p>
          )}
        </div>

        <div
          style={{
            paddingTop: 14,
            borderTop: `1px dashed ${TERRACOTTA}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <div style={{ width: 80, height: 80 }} dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <div>
            <div
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontWeight: 600,
                fontSize: 15,
                color: BOIS,
              }}
            >
              Commandez depuis votre table
            </div>
            <div
              style={{
                fontFamily: "var(--font-poppins), Arial, sans-serif",
                fontSize: 11,
                color: "#8A7A64",
                marginTop: 2,
              }}
            >
              Scannez ce QR code ou rendez-vous sur {SITE_URL.replace("https://", "")}/carte
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
