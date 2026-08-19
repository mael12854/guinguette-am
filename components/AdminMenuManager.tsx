"use client";

import { useState } from "react";
import {
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem,
  addOption,
  deleteOption,
} from "@/app/admin/actions";
import type { MenuCategory } from "@/lib/types";
import type { MenuItemWithOptions } from "@/lib/data/menu";

const CATEGORIES: { value: MenuCategory; label: string }[] = [
  { value: "entree", label: "À grignoter" },
  { value: "plat", label: "Plat" },
  { value: "dessert", label: "Dessert" },
  { value: "boisson", label: "Boisson" },
];

export function AdminMenuManager({ items }: { items: MenuItemWithOptions[] }) {
  return (
    <div className="flex flex-col gap-8">
      <NewItemForm />
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function NewItemForm() {
  return (
    <form
      action={createMenuItem}
      className="border border-bois/15 rounded-sm p-5 bg-blanc-casse grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end"
    >
      <FormField label="Nom" name="name" required />
      <FormField label="Prix (€)" name="price" type="number" step="0.01" required />
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wide text-noir/60">Catégorie</label>
        <select
          name="category"
          className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
          defaultValue="plat"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="text-sm px-4 py-2 rounded-sm bg-terracotta text-blanc-casse hover:opacity-90 h-fit"
      >
        Ajouter un article
      </button>
      <div className="sm:col-span-4">
        <FormField label="Description (optionnel)" name="description" />
      </div>
    </form>
  );
}

function ItemRow({ item }: { item: MenuItemWithOptions }) {
  const [showOptionForm, setShowOptionForm] = useState(false);

  return (
    <div className="border border-bois/15 rounded-sm p-5 bg-blanc-casse flex flex-col gap-4">
      <form
        action={updateMenuItem}
        className="grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end"
      >
        <input type="hidden" name="id" value={item.id} />
        <FormField label="Nom" name="name" defaultValue={item.name} required />
        <FormField
          label="Prix (€)"
          name="price"
          type="number"
          step="0.01"
          defaultValue={item.price}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wide text-noir/60">Catégorie</label>
          <select
            name="category"
            defaultValue={item.category}
            className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="text-sm px-4 py-2 rounded-sm border border-bois/25 text-bois hover:bg-bois/5 h-fit"
        >
          Enregistrer
        </button>
        <div className="sm:col-span-4">
          <FormField
            label="Description"
            name="description"
            defaultValue={item.description ?? ""}
          />
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-noir/80">
          <input
            type="checkbox"
            defaultChecked={item.is_available}
            onChange={(e) => toggleAvailability(item.id, e.target.checked)}
          />
          Disponible
        </label>
        <button
          onClick={() => setShowOptionForm((v) => !v)}
          className="text-sm text-vert hover:underline"
        >
          Gérer les goûts / options
        </button>
        <button
          onClick={() => {
            if (confirm(`Supprimer "${item.name}" ?`)) deleteMenuItem(item.id);
          }}
          className="text-sm text-terracotta hover:underline ml-auto"
        >
          Supprimer l&apos;article
        </button>
      </div>

      {(showOptionForm || item.options.length > 0) && (
        <div className="border-t border-bois/10 pt-4 flex flex-col gap-2">
          {item.options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-3 text-sm">
              <span className="text-noir/80">
                {opt.label}
                {opt.extra_price > 0 ? ` (+${opt.extra_price.toFixed(2)} €)` : ""}
              </span>
              <button
                onClick={() => deleteOption(opt.id)}
                className="text-terracotta text-xs hover:underline"
              >
                Retirer
              </button>
            </div>
          ))}
          {showOptionForm && (
            <form
              action={addOption}
              className="flex flex-wrap items-end gap-3 mt-1"
            >
              <input type="hidden" name="menuItemId" value={item.id} />
              <FormField label="Goût / option" name="label" required />
              <FormField
                label="Supplément (€)"
                name="extraPrice"
                type="number"
                step="0.01"
                defaultValue={0}
              />
              <button
                type="submit"
                className="text-sm px-3 py-2 rounded-sm border border-vert/40 text-vert hover:bg-vert/10 h-fit"
              >
                Ajouter
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  step,
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  step?: string;
  required?: boolean;
  defaultValue?: string | number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wide text-noir/60">{label}</label>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue}
        className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
      />
    </div>
  );
}
