import { useState } from "react";
import { MessageCircle, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/data/services";
import { isValidIndianMobile } from "@/lib/booking-validation";
import { whatsAppHref } from "@/lib/whatsapp";
import { callHref } from "@/config/brand";

type ContactErrors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: ContactErrors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!isValidIndianMobile(form.phone)) next.phone = "Enter a valid 10-digit mobile number.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.message.trim()) next.message = "Please tell us about your trip.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Enquiries are routed through WhatsApp until the fleet enquiry API is connected.
    window.open(
      whatsAppHref(
        `Hello, I have an enquiry.\n\nName: ${form.name}\nPhone: ${form.phone}${form.email ? `\nEmail: ${form.email}` : ""}${
          form.service ? `\nService: ${form.service}` : ""
        }\n\n${form.message}`,
      ),
      "_blank",
      "noopener",
    );
    toast.success("Enquiry ready to send", {
      description: "We've opened WhatsApp with your message.",
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8"
      aria-label="Contact form"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" className="mt-1" value={form.name} onChange={set("name")} />
          {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name}</p> : null}
        </div>
        <div>
          <Label htmlFor="c-phone">Phone</Label>
          <Input
            id="c-phone"
            type="tel"
            inputMode="tel"
            className="mt-1"
            value={form.phone}
            onChange={set("phone")}
          />
          {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone}</p> : null}
        </div>
        <div>
          <Label htmlFor="c-email">Email (optional)</Label>
          <Input
            id="c-email"
            type="email"
            className="mt-1"
            value={form.email}
            onChange={set("email")}
          />
          {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email}</p> : null}
        </div>
        <div>
          <Label htmlFor="c-service">Service</Label>
          <select
            id="c-service"
            value={form.service}
            onChange={set("service")}
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="c-message">Message</Label>
          <Textarea
            id="c-message"
            rows={4}
            className="mt-1"
            value={form.message}
            onChange={set("message")}
            placeholder="Tell us your route, date and travel needs"
          />
          {errors.message ? (
            <p className="mt-1 text-xs text-destructive">{errors.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button type="submit" className="flex-1 rounded-xl">
          <Send className="size-4" aria-hidden="true" /> Send Enquiry
        </Button>
        <Button asChild type="button" variant="outline" className="rounded-xl">
          <a href={whatsAppHref()} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp Us
          </a>
        </Button>
        <Button asChild type="button" variant="ghost" className="rounded-xl">
          <a href={callHref}>
            <Phone className="size-4" aria-hidden="true" /> Call Now
          </a>
        </Button>
      </div>
    </form>
  );
}
