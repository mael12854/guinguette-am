"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { submitOrder, type CartLine } from "@/app/carte/actions";
import type { MenuCategory } from "@/lib/types";
import type { MenuItemWithOptions } from "@/lib/data/menu";

const CATEGORY_LABELS: Record<MenuCategory, string> = {
  entree: "Entrées",
  plat: "Plats",
  dessert: "Desserts",
  boisson: "Boissons",
};
const CATEGORY_ORDER: MenuCategory[] = ["entree", "plat", "dessert", "boisson"];

type CartEntry = CartLine & { key: string; itemName: string; optionLabel: string | null };

export function MenuBrowser({ items }: { items: MenuItemWithOptions[] }) {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [tableLabel, setTableLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const byCategory = useMemo(() => {
    const map = new Map<MenuCategory, MenuItemWithOptions[]>();
    for (const item of items) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [items]);

  const total = cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  function addToCart(item: MenuItemWithOptions) {
    const optionId = selectedOptions[item.id] ?? item.options[0]?.id ?? null;
    const option = item.options.find((opt) => opt.id === optionId) ?? null;
    const unitPrice = item.price + (option?.extra_price ?? 0);
    const key = `${item.id}:${optionId ?? "none"}`;

    setCart((prev) => {
      const existing = prev.find((line) => line.key === key);
      if (existing) {
        return prev.map((line) =>
          line.key === key ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [
        ...prev,
        {
          key,
          menuItemId: item.id,
          optionId,
          unitPrice,
          quantity: 1,
          itemName: item.name,
          optionLabel: option?.label ?? null,
        },
      ];
    });
  }

  function removeLine(key: string) {
    setCart((prev) => prev.filter((line) => line.key !== key));
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    const result = await submitOrder(
      customerName,
      tableLabel,
      cart.map(({ key: _key, itemName: _itemName, optionLabel: _optionLabel, ...line }) => line)
    );
    setSubmitting(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    router.push(`/suivi/${result.orderId}`);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-10">
      <div className="flex flex-col gap-10">
        {CATEGORY_ORDER.filter((cat) => byCategory.has(cat)).map((category) => (
          <div key={category}>
            <h2 className="font-serif font-semibold text-2xl text-bois mb-4">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="flex flex-col gap-4">
              {byCategory.get(category)!.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  selectedOption={selectedOptions[item.id] ?? item.options[0]?.id}
                  onSelectOption={(optionId) =>
                    setSelectedOptions((prev) => ({ ...prev, [item.id]: optionId }))
                  }
                  onAdd={() => addToCart(item)}
                />
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-noir/60">La carte n&apos;est pas encore disponible.</p>
        )}
      </div>

      <aside className="border border-bois/15 rounded-sm p-6 bg-blanc-casse h-fit sticky top-6 flex flex-col gap-4">
        <h2 className="font-serif font-semibold text-xl text-bois">Votre commande</h2>

        {cart.length === 0 && (
          <p className="text-sm text-noir/60">Ajoutez des articles depuis la carte.</p>
        )}

        <ul className="flex flex-col gap-2">
          {cart.map((line) => (
            <li key={line.key} className="flex items-start justify-between gap-2 text-sm">
              <div>
                <div className="text-noir">
                  {line.quantity}× {line.itemName}
                </div>
                {line.optionLabel && (
                  <div className="text-xs text-noir/60">{line.optionLabel}</div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-noir/80">
                  {(line.unitPrice * line.quantity).toFixed(2)} €
                </span>
                <button
                  onClick={() => removeLine(line.key)}
                  className="text-terracotta text-xs hover:underline"
                  aria-label={`Retirer ${line.itemName}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>

        {cart.length > 0 && (
          <div className="border-t border-bois/15 pt-3 flex justify-between font-medium text-noir">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <label className="text-xs uppercase tracking-wide text-noir/60">
            Votre nom
          </label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nom"
            className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
          />
          <label className="text-xs uppercase tracking-wide text-noir/60 mt-1">
            Table (optionnel)
          </label>
          <input
            value={tableLabel}
            onChange={(e) => setTableLabel(e.target.value)}
            placeholder="Ex. Table 4"
            className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
          />
        </div>

        {error && <p className="text-sm text-terracotta">{error}</p>}

        <Button
          onClick={handleSubmit}
          disabled={cart.length === 0 || submitting}
          className="w-full mt-1"
        >
          {submitting ? "Envoi..." : "Commander"}
        </Button>
      </aside>
    </div>
  );
}

function MenuItemCard({
  item,
  selectedOption,
  onSelectOption,
  onAdd,
}: {
  item: MenuItemWithOptions;
  selectedOption: string | undefined;
  onSelectOption: (optionId: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="border border-bois/15 rounded-sm p-5 bg-blanc-casse flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif font-semibold text-lg text-bois">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-noir/70 mt-1">{item.description}</p>
          )}
        </div>
        <span className="text-sm font-medium text-noir shrink-0">
          {item.price.toFixed(2)} €
        </span>
      </div>

      {item.options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelectOption(opt.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedOption === opt.id
                  ? "bg-vert text-white border-vert"
                  : "border-bois/20 text-noir/70 hover:border-vert"
              }`}
            >
              {opt.label}
              {opt.extra_price > 0 ? ` (+${opt.extra_price.toFixed(2)} €)` : ""}
            </button>
          ))}
        </div>
      )}

      <div>
        <Button variant="outline" onClick={onAdd} className="text-xs px-4 py-1.5">
          Ajouter
        </Button>
      </div>
    </div>
  );
}
