import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import { whatsAppHref } from "@/lib/whatsapp";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/cars", label: "Cars" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-border bg-background/90 py-1.5 backdrop-blur-xl"
          : "border-transparent bg-background py-3"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Main"
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "text-primary bg-secondary" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href={whatsAppHref()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
            </a>
          </Button>
          <Button asChild size="sm" className="rounded-full px-5">
            <Link to="/booking">Book a Cab</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={`Call ${brand.phoneDisplay}`}
          >
            <a href={brand.callHref}>
              <Phone className="size-5" aria-hidden="true" />
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Chat on WhatsApp"
          >
            <a href={whatsAppHref()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-5" aria-hidden="true" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </nav>

      {open ? (
        <div className="animate-fade-in border-t border-border bg-background lg:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "text-primary" }}
                  className="block border-b border-border/60 py-3 text-base font-medium last:border-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="py-3">
              <Button asChild className="w-full rounded-full" onClick={() => setOpen(false)}>
                <Link to="/booking">Book a Cab</Link>
              </Button>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
