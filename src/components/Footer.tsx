import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { brand, callHref } from "@/config/brand";
import { whatsAppHref } from "@/lib/whatsapp";
import { services } from "@/data/services";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold">{brand.brandName}</p>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
            A {brand.city}-based cab, taxi and car rental service for local rides, airport transfers,
            sightseeing and outstation journeys across South India.
          </p>
        </div>

        <nav aria-label="Quick links">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Quick Links</p>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/75">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/services", label: "Services" },
              { to: "/cars", label: "Cars" },
              { to: "/pricing", label: "Pricing" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Services</p>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/75">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to="/booking" search={{ service: s.slug }} className="transition-colors hover:text-accent">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
            <li>
              <a href={callHref} className="flex items-center gap-2 transition-colors hover:text-accent">
                <Phone className="size-4" aria-hidden="true" /> {brand.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={whatsAppHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-accent"
              >
                <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" /> {brand.city}, {brand.state}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-primary-foreground/60 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {brand.brandName}. All Rights Reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-accent">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}