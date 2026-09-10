import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { adminExists, bootstrapAdmin } from "@/lib/settings.functions";
import { brand } from "@/config/brand";
import logoAsset from "@/assets/logo-sri-jayam.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `Owner Sign In | ${brand.brandName}` },
      {
        name: "description",
        content: "Private sign-in for the website owner. This page is not for customers.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: `Owner Sign In | ${brand.brandName}` },
      { property: "og:description", content: "Private owner sign-in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"loading" | "signin" | "setup">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        void navigate({ to: "/admin", replace: true });
        return;
      }
      const result = await adminExists();
      if (active) setMode(result.exists ? "signin" : "setup");
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "setup") {
        const result = await bootstrapAdmin({ data: { email: email.trim(), password } });
        if (!result.ok) {
          toast.error(result.error ?? "Could not create the account.");
          return;
        }
        toast.success("Admin account created. Signing you in…");
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      void navigate({ to: "/admin", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-surface">
      {/* ambient brand glow */}
      <div
        aria-hidden
        className="gradient-hero pointer-events-none absolute -top-40 left-1/2 h-[26rem] w-[46rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-teal/25 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 lg:min-h-[100dvh] lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16">
        {/* Brand panel */}
        <section className="gradient-hero shadow-float relative hidden overflow-hidden rounded-3xl p-10 text-ocean-foreground lg:block">
          <div
            aria-hidden
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/20"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full border border-white/10"
          />
          <img
            src={brand.logoUrl || logoAsset.url}
            alt={`${brand.brandName} logo`}
            className="h-14 w-auto"
            width={140}
            height={56}
          />
          <h2 className="mt-10 text-3xl font-bold leading-tight tracking-tight">
            The control room for
            <br />
            {brand.brandName}
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ocean-foreground/80">
            Update your brand, prices, cars, routes and booking connection — everything visitors see
            on {brand.city}&apos;s premium cab website.
          </p>
          <ul className="mt-10 space-y-3 text-sm text-ocean-foreground/85">
            {["Private owner access only", "Change prices & packages instantly", "Connect your own booking app"].map(
              (item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ),
            )}
          </ul>
        </section>

        {/* Form panel */}
        <section className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>

          <div className="shadow-card rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3 lg:hidden">
              <img
                src={brand.logoUrl || logoAsset.url}
                alt={`${brand.brandName} logo`}
                className="h-11 w-auto"
                width={110}
                height={44}
              />
              <span className="text-sm font-semibold text-primary">{brand.brandName}</span>
            </div>

            <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-foreground lg:mt-0">
              <Lock className="h-3 w-3" />
              Private area
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
              {mode === "setup" ? "Create owner account" : "Welcome back"}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {mode === "setup"
                ? "Set the password for your private admin area. This can only be done once."
                : "Sign in to manage your website. Customers never need this page."}
            </p>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-2xl pl-10 text-base"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete={mode === "setup" ? "new-password" : "current-password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl pl-10 pr-11 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-2xl text-base font-semibold"
                disabled={busy || mode === "loading"}
              >
                {busy
                  ? "Please wait…"
                  : mode === "loading"
                    ? "Loading…"
                    : mode === "setup"
                      ? "Create account & sign in"
                      : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-teal" />
              Secure, encrypted sign-in
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
