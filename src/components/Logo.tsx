import { Link } from "@tanstack/react-router";
import { brand } from "@/config/brand";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${brand.brandName} home`}>
      <img
        src={brand.logoUrl || "/logo.png"}
        alt={`${brand.brandName} logo`}
        className="h-10 w-auto shrink-0 sm:h-12"
        width={120}
        height={48}
      />
      <span className="leading-tight">
        <span
          className={`block text-sm font-bold tracking-tight sm:text-base ${variant === "light" ? "text-ocean-foreground" : "text-primary"}`}
        >
          {brand.brandName}
        </span>
        <span
          className={`block text-[10px] font-medium sm:text-[11px] ${variant === "light" ? "text-ocean-foreground/70" : "text-muted-foreground"}`}
        >
          {brand.city} Cabs & Car Rental
        </span>
      </span>
    </Link>
  );
}
