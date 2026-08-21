import { Link } from "@tanstack/react-router";
import { brand } from "@/config/brand";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${brand.brandName} home`}>
      <span className="gradient-hero flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-ocean-foreground shadow-card">
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 17h14M6 17l-1-5 2.2-4.4A2 2 0 0 1 9 6.5h6a2 2 0 0 1 1.8 1.1L19 12l-1 5" />
          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="16.5" cy="17.5" r="1.5" />
        </svg>
      </span>
      <span className="leading-tight">
        <span
          className={`block text-base font-bold tracking-tight ${variant === "light" ? "text-ocean-foreground" : "text-primary"}`}
        >
          {brand.brandName}
        </span>
        <span
          className={`block text-[11px] font-medium ${variant === "light" ? "text-ocean-foreground/70" : "text-muted-foreground"}`}
        >
          {brand.city} Cabs & Car Rental
        </span>
      </span>
    </Link>
  );
}
