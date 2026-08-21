import { Link } from "@tanstack/react-router";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { brand, callHref } from "@/config/brand";
import { whatsAppHref } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsAppHref()}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-24 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-float transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:bottom-6"
    >
      <MessageCircle className="size-7" aria-hidden="true" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl sm:hidden">
      <div className="grid grid-cols-3">
        <a
          href={callHref}
          className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-foreground"
          aria-label={`Call ${brand.phoneDisplay}`}
        >
          <Phone className="size-5 text-primary" aria-hidden="true" /> Call
        </a>
        <a
          href={whatsAppHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-foreground"
        >
          <MessageCircle className="size-5 text-[#25D366]" aria-hidden="true" /> WhatsApp
        </a>
        <Link
          to="/booking"
          className="gradient-hero flex flex-col items-center gap-1 py-3 text-xs font-semibold text-ocean-foreground"
        >
          <CalendarCheck className="size-5" aria-hidden="true" /> Book Now
        </Link>
      </div>
    </div>
  );
}
