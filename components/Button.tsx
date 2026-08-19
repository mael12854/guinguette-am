import type { ButtonHTMLAttributes } from "react";

type Variant = "filled" | "outline";

const base =
  "inline-flex items-center justify-center text-sm font-medium px-6 py-2.5 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  filled: "bg-terracotta text-blanc-casse hover:opacity-90",
  outline: "border-[1.5px] border-terracotta text-terracotta hover:bg-terracotta/10",
};

export function Button({
  variant = "filled",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
