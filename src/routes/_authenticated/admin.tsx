import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db as supabase } from "@/integrations/fleet/client";
import { brand, brandDefaults } from "@/config/brand";
import {
  currentDefaults,
  type BookingApiSettings,
  type BrandOverrides,
  type ContentOverrides,
  type PublicSiteSettings,
  type SeoOverrides,
  type VehicleOverride,
} from "@/lib/site-settings";
import { getAllSettings, saveSetting, testBookingApi } from "@/lib/owner-admin";
import type { Testimonial } from "@/data/testimonials";
import type { PopularRoute } from "@/data/routes";
import type { PricingTier } from "@/data/pricing";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: `Website Settings | ${brand.brandName}` },
      { name: "description", content: "Private owner settings for the website." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Website Settings" },
      { property: "og:description", content: "Private owner settings for the website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {desc ? <p className="mt-1 text-sm text-muted-foreground">{desc}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });
}

function AdminPage() {
  const navigate = useNavigate();
  const defaults = useMemo(() => currentDefaults(), []);

  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [brandForm, setBrandForm] = useState<BrandOverrides>({});
  const [seoForm, setSeoForm] = useState<SeoOverrides>({});
  const [content, setContent] = useState<ContentOverrides>({});
  const [bookingApi, setBookingApi] = useState<BookingApiSettings>({ enabled: false });
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const data = await getAllSettings();
        const pub = data.public as PublicSiteSettings;
        setBrandForm(pub.brand ?? {});
        setSeoForm(pub.seo ?? {});
        setContent({
          vehicles: pub.content?.vehicles?.length ? pub.content.vehicles : defaults.vehicles,
          testimonials: pub.content?.testimonials?.length
            ? pub.content.testimonials
            : defaults.testimonials,
          routes: pub.content?.routes?.length ? pub.content.routes : defaults.routes,
          pricingTiers: pub.content?.pricingTiers?.length
            ? pub.content.pricingTiers
            : defaults.pricingTiers,
          pricingDisclaimer: pub.content?.pricingDisclaimer ?? "",
        });
        setBookingApi(data.bookingApi ?? { enabled: false });
      } catch (error) {
        console.error(error);
        setDenied(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [defaults]);

  async function save(key: string, value: unknown, isPublic: boolean, message: string) {
    setSaving(true);
    try {
      await saveSetting({ key, value, isPublic });
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-sm text-muted-foreground">Loading…</div>;
  }

  if (denied) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Not allowed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account cannot open the settings area.
        </p>
        <Button className="mt-6 rounded-xl" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );
  }

  const vehicleList = content.vehicles ?? [];
  const testimonialList = content.testimonials ?? [];
  const routeList = content.routes ?? [];
  const tierList = content.pricingTiers ?? [];

  const updateVehicle = (index: number, patch: Partial<VehicleOverride>) =>
    setContent((c) => ({
      ...c,
      vehicles: (c.vehicles ?? []).map((v, i) => (i === index ? { ...v, ...patch } : v)),
    }));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Website settings</h1>
          <p className="text-sm text-muted-foreground">
            Private area. Changes go live on the website after saving.
          </p>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={signOut}>
          Sign out
        </Button>
      </header>

      <Tabs defaultValue="business" className="mt-8">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
          <TabsList className="w-max rounded-xl">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="branding">Logo</TabsTrigger>
            <TabsTrigger value="cars">Cars</TabsTrigger>
            <TabsTrigger value="prices">Prices</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="booking">Bookings</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
        </div>

        {/* BUSINESS */}
        <TabsContent value="business" className="mt-6 space-y-5">
          <Card title="Business details" desc="Name, phone numbers and address shown across the site.">
            {(
              [
                ["brandName", "Business name"],
                ["tagline", "Tagline"],
                ["phone", "Phone number (for call links, e.g. +919442337470)"],
                ["phoneDisplay", "Phone number as displayed"],
                ["whatsapp", "WhatsApp number (digits only, with country code)"],
                ["email", "Email address"],
                ["city", "City"],
                ["state", "State"],
                ["address", "Address"],
                ["mapEmbedUrl", "Google Map embed link"],
                ["siteUrl", "Website address (https://…)"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label} hint={`Leave blank to use: ${brandDefaults[key] || "—"}`}>
                <Input
                  className="rounded-xl"
                  value={brandForm[key] ?? ""}
                  onChange={(e) => setBrandForm((b) => ({ ...b, [key]: e.target.value }))}
                />
              </Field>
            ))}
            <Button
              className="rounded-xl"
              disabled={saving}
              onClick={() => void save("brand", brandForm, true, "Business details saved.")}
            >
              Save business details
            </Button>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="mt-6 space-y-5">
          <Card title="Search engine settings" desc="Titles and descriptions used by Google and social previews.">
            <Field label="Home page title">
              <Input
                className="rounded-xl"
                value={seoForm.defaultTitle ?? ""}
                onChange={(e) => setSeoForm((s) => ({ ...s, defaultTitle: e.target.value }))}
              />
            </Field>
            <Field label="Home page description">
              <Textarea
                className="rounded-xl"
                rows={3}
                value={seoForm.defaultDescription ?? ""}
                onChange={(e) => setSeoForm((s) => ({ ...s, defaultDescription: e.target.value }))}
              />
            </Field>
            <Field label="Keywords" hint="Comma separated.">
              <Input
                className="rounded-xl"
                value={seoForm.keywords ?? ""}
                onChange={(e) => setSeoForm((s) => ({ ...s, keywords: e.target.value }))}
              />
            </Field>
            <Field label="Social share image link" hint="Full https link to an image.">
              <Input
                className="rounded-xl"
                value={seoForm.ogImage ?? ""}
                onChange={(e) => setSeoForm((s) => ({ ...s, ogImage: e.target.value }))}
              />
            </Field>
            <Field label="Google site verification code">
              <Input
                className="rounded-xl"
                value={seoForm.googleSiteVerification ?? ""}
                onChange={(e) =>
                  setSeoForm((s) => ({ ...s, googleSiteVerification: e.target.value }))
                }
              />
            </Field>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <p className="text-sm font-medium">Hide from search engines</p>
                <p className="text-xs text-muted-foreground">Turn on only while testing.</p>
              </div>
              <Switch
                checked={Boolean(seoForm.noIndex)}
                onCheckedChange={(v) => setSeoForm((s) => ({ ...s, noIndex: v }))}
              />
            </div>
            <Button
              className="rounded-xl"
              disabled={saving}
              onClick={() => void save("seo", seoForm, true, "Search settings saved.")}
            >
              Save search settings
            </Button>
          </Card>
        </TabsContent>

        {/* BRANDING */}
        <TabsContent value="branding" className="mt-6 space-y-5">
          <Card title="Logo & icon" desc="Upload a small image (under 300 KB) or paste an image link.">
            {(
              [
                ["logoUrl", "Logo"],
                ["faviconUrl", "Browser tab icon"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-2 rounded-xl border border-border p-3">
                <Label className="text-sm">{label}</Label>
                {brandForm[key] ? (
                  <img src={brandForm[key]} alt={label} className="h-12 w-auto rounded-lg" />
                ) : null}
                <Input
                  type="file"
                  accept="image/*"
                  className="rounded-xl"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 300_000) {
                      toast.error("Please choose an image smaller than 300 KB.");
                      return;
                    }
                    setBrandForm((b) => ({ ...b, [key]: "" }));
                    const url = await fileToDataUrl(file);
                    setBrandForm((b) => ({ ...b, [key]: url }));
                  }}
                />
                <Input
                  placeholder="…or paste an image link"
                  className="rounded-xl"
                  value={brandForm[key]?.startsWith("data:") ? "" : (brandForm[key] ?? "")}
                  onChange={(e) => setBrandForm((b) => ({ ...b, [key]: e.target.value }))}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setBrandForm((b) => ({ ...b, [key]: "" }))}
                >
                  Reset to original
                </Button>
              </div>
            ))}
            <Button
              className="rounded-xl"
              disabled={saving}
              onClick={() => void save("brand", brandForm, true, "Logo saved.")}
            >
              Save logo
            </Button>
          </Card>
        </TabsContent>

        {/* CARS */}
        <TabsContent value="cars" className="mt-6 space-y-5">
          <Card title="Cars & mileage" desc="Shown on the home page and the cars page.">
            {vehicleList.map((v, i) => (
              <div key={v.id} className="space-y-3 rounded-xl border border-border p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Car name">
                    <Input
                      className="rounded-xl"
                      value={v.name}
                      onChange={(e) => updateVehicle(i, { name: e.target.value })}
                    />
                  </Field>
                  <Field label="Category">
                    <Input
                      className="rounded-xl"
                      value={v.category}
                      onChange={(e) => updateVehicle(i, { category: e.target.value })}
                    />
                  </Field>
                  <Field label="Passengers">
                    <Input
                      type="number"
                      className="rounded-xl"
                      value={v.passengers}
                      onChange={(e) => updateVehicle(i, { passengers: Number(e.target.value) })}
                    />
                  </Field>
                  <Field label="Luggage">
                    <Input
                      type="number"
                      className="rounded-xl"
                      value={v.luggage}
                      onChange={(e) => updateVehicle(i, { luggage: Number(e.target.value) })}
                    />
                  </Field>
                  <Field label="Price per km (₹)">
                    <Input
                      type="number"
                      className="rounded-xl"
                      value={v.basePricePerKm}
                      onChange={(e) => updateVehicle(i, { basePricePerKm: Number(e.target.value) })}
                    />
                  </Field>
                  <Field label="Local starting price (₹)">
                    <Input
                      type="number"
                      className="rounded-xl"
                      value={v.localStartingPrice}
                      onChange={(e) =>
                        updateVehicle(i, { localStartingPrice: Number(e.target.value) })
                      }
                    />
                  </Field>
                </div>
                <Field label="Features & mileage" hint="One per line, e.g. 19 km per litre">
                  <Textarea
                    rows={4}
                    className="rounded-xl"
                    value={v.features.join("\n")}
                    onChange={(e) =>
                      updateVehicle(i, { features: e.target.value.split("\n").filter(Boolean) })
                    }
                  />
                </Field>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show this car on the website</span>
                  <Switch
                    checked={v.active}
                    onCheckedChange={(val) => updateVehicle(i, { active: val })}
                  />
                </div>
              </div>
            ))}
            <Button
              className="rounded-xl"
              disabled={saving}
              onClick={() => void save("content", content, true, "Cars saved.")}
            >
              Save cars
            </Button>
          </Card>
        </TabsContent>

        {/* PRICES */}
        <TabsContent value="prices" className="mt-6 space-y-5">
          <Card title="Packages & prices">
            {tierList.map((tier, i) => (
              <div key={`${tier.title}-${i}`} className="space-y-3 rounded-xl border border-border p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Title">
                    <Input
                      className="rounded-xl"
                      value={tier.title}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          pricingTiers: (c.pricingTiers ?? []).map((t, idx) =>
                            idx === i ? { ...t, title: e.target.value } : t,
                          ),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Price">
                    <Input
                      className="rounded-xl"
                      value={String(tier.price ?? "")}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          pricingTiers: (c.pricingTiers ?? []).map((t, idx) =>
                            idx === i ? { ...t, price: e.target.value } : t,
                          ),
                        }))
                      }
                    />
                  </Field>
                </div>
                <Field label="What's included" hint="One per line.">
                  <Textarea
                    rows={4}
                    className="rounded-xl"
                    value={(tier.includes ?? []).join("\n")}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        pricingTiers: (c.pricingTiers ?? []).map((t, idx) =>
                          idx === i
                            ? { ...t, includes: e.target.value.split("\n").filter(Boolean) }
                            : t,
                        ),
                      }))
                    }
                  />
                </Field>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      pricingTiers: (c.pricingTiers ?? []).filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Field label="Note shown under the prices">
              <Textarea
                rows={3}
                className="rounded-xl"
                value={content.pricingDisclaimer ?? ""}
                onChange={(e) => setContent((c) => ({ ...c, pricingDisclaimer: e.target.value }))}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() =>
                  setContent((c) => ({
                    ...c,
                    pricingTiers: [
                      ...(c.pricingTiers ?? []),
                      {
                        id: `tier-${Date.now()}`,
                        title: "New package",
                        subtitle: "",
                        price: "₹0",
                        unit: "",
                        includes: [],
                      } as PricingTier,
                    ],
                  }))
                }
              >
                Add package
              </Button>
              <Button
                className="rounded-xl"
                disabled={saving}
                onClick={() => void save("content", content, true, "Prices saved.")}
              >
                Save prices
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* REVIEWS */}
        <TabsContent value="reviews" className="mt-6 space-y-5">
          <Card title="Customer reviews">
            {testimonialList.map((t, i) => (
              <div key={t.id ?? i} className="space-y-3 rounded-xl border border-border p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Name">
                    <Input
                      className="rounded-xl"
                      value={t.name}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          testimonials: (c.testimonials ?? []).map((x, idx) =>
                            idx === i ? { ...x, name: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Trip">
                    <Input
                      className="rounded-xl"
                      value={t.trip}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          testimonials: (c.testimonials ?? []).map((x, idx) =>
                            idx === i ? { ...x, trip: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                  </Field>
                </div>
                <Field label="Review">
                  <Textarea
                    rows={3}
                    className="rounded-xl"
                    value={t.quote}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        testimonials: (c.testimonials ?? []).map((x, idx) =>
                          idx === i ? { ...x, quote: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                </Field>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      testimonials: (c.testimonials ?? []).filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() =>
                  setContent((c) => ({
                    ...c,
                    testimonials: [
                      ...(c.testimonials ?? []),
                      {
                        ...(defaults.testimonials[0] as Testimonial),
                        id: `review-${Date.now()}`,
                        name: "New customer",
                        quote: "",
                        trip: "",
                      },
                    ],
                  }))
                }
              >
                Add review
              </Button>
              <Button
                className="rounded-xl"
                disabled={saving}
                onClick={() => void save("content", content, true, "Reviews saved.")}
              >
                Save reviews
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ROUTES */}
        <TabsContent value="routes" className="mt-6 space-y-5">
          <Card title="Popular routes">
            {routeList.map((r, i) => (
              <div key={r.id ?? i} className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-4">
                <Field label="From">
                  <Input
                    className="rounded-xl"
                    value={r.from}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        routes: (c.routes ?? []).map((x, idx) =>
                          idx === i ? { ...x, from: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                </Field>
                <Field label="To">
                  <Input
                    className="rounded-xl"
                    value={r.to}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        routes: (c.routes ?? []).map((x, idx) =>
                          idx === i ? { ...x, to: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                </Field>
                <Field label="Distance (km)">
                  <Input
                    type="number"
                    className="rounded-xl"
                    value={r.distanceKm}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        routes: (c.routes ?? []).map((x, idx) =>
                          idx === i ? { ...x, distanceKm: Number(e.target.value) } : x,
                        ),
                      }))
                    }
                  />
                </Field>
                <Field label="Fare (₹)">
                  <Input
                    type="number"
                    className="rounded-xl"
                    value={r.fare ?? ""}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        routes: (c.routes ?? []).map((x, idx) =>
                          idx === i ? { ...x, fare: Number(e.target.value) } : x,
                        ),
                      }))
                    }
                  />
                </Field>
                <div className="sm:col-span-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() =>
                      setContent((c) => ({
                        ...c,
                        routes: (c.routes ?? []).filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() =>
                  setContent((c) => ({
                    ...c,
                    routes: [
                      ...(c.routes ?? []),
                      {
                        ...(defaults.routes[0] as PopularRoute),
                        id: `route-${Date.now()}`,
                        from: "Pondicherry",
                        to: "New destination",
                      },
                    ],
                  }))
                }
              >
                Add route
              </Button>
              <Button
                className="rounded-xl"
                disabled={saving}
                onClick={() => void save("content", content, true, "Routes saved.")}
              >
                Save routes
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* BOOKING API */}
        <TabsContent value="booking" className="mt-6 space-y-5">
          <Card
            title="Send bookings to your booking app"
            desc="Every website booking is posted to this address as JSON."
          >
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm font-medium">Send bookings to my own app</span>
              <Switch
                checked={bookingApi.enabled}
                onCheckedChange={(v) => setBookingApi((b) => ({ ...b, enabled: v }))}
              />
            </div>
            <Field label="Address (https://…)">
              <Input
                className="rounded-xl"
                value={bookingApi.url ?? ""}
                onChange={(e) => setBookingApi((b) => ({ ...b, url: e.target.value }))}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Security header name" hint="Optional, e.g. Authorization or x-api-key">
                <Input
                  className="rounded-xl"
                  value={bookingApi.authHeaderName ?? ""}
                  onChange={(e) => setBookingApi((b) => ({ ...b, authHeaderName: e.target.value }))}
                />
              </Field>
              <Field label="Security header value" hint="Kept private, never shown on the website.">
                <Input
                  type="password"
                  className="rounded-xl"
                  value={bookingApi.authHeaderValue ?? ""}
                  onChange={(e) => setBookingApi((b) => ({ ...b, authHeaderValue: e.target.value }))}
                />
              </Field>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                className="rounded-xl"
                disabled={saving}
                onClick={() => void save("booking_api", bookingApi, false, "Connection saved.")}
              >
                Save connection
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={async () => {
                  const result = await testBookingApi();
                  if (result.delivered) toast.success("Test booking delivered successfully.");
                  else toast.error(`Test failed: ${("body" in result && result.body) || result.reason}`);
                }}
              >
                Send test booking
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ACCOUNT */}
        <TabsContent value="account" className="mt-6 space-y-5">
          <Card title="Change password">
            <Field label="Current password">
              <Input
                type="password"
                className="rounded-xl"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Field>
            <Field label="New password" hint="At least 8 characters.">
              <Input
                type="password"
                className="rounded-xl"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Field>
            <Button
              className="rounded-xl"
              onClick={async () => {
                if (newPassword.length < 8) {
                  toast.error("Please use at least 8 characters.");
                  return;
                }
                const { error } = await supabase.auth.updateUser({
                  password: newPassword,
                  ...({ current_password: currentPassword } as Record<string, string>),
                });
                if (error) toast.error(error.message);
                else {
                  toast.success("Password updated.");
                  setNewPassword("");
                  setCurrentPassword("");
                }
              }}
            >
              Update password
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
