export interface AllergenDef {
  code: string;
  label: string;
}

// Les 14 allergènes à déclaration obligatoire (réglementation UE / INCO)
export const ALLERGENS: AllergenDef[] = [
  { code: "gluten", label: "Gluten" },
  { code: "crustaces", label: "Crustacés" },
  { code: "oeufs", label: "Œufs" },
  { code: "poissons", label: "Poissons" },
  { code: "arachides", label: "Arachides" },
  { code: "soja", label: "Soja" },
  { code: "lait", label: "Lait" },
  { code: "fruits_a_coque", label: "Fruits à coque" },
  { code: "celeri", label: "Céleri" },
  { code: "moutarde", label: "Moutarde" },
  { code: "sesame", label: "Sésame" },
  { code: "sulfites", label: "Sulfites" },
  { code: "lupin", label: "Lupin" },
  { code: "mollusques", label: "Mollusques" },
];

export function allergenLabel(code: string): string {
  return ALLERGENS.find((a) => a.code === code)?.label ?? code;
}
