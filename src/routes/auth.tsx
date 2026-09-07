import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { adminExists, bootstrapAdmin } from "@/lib/settings.functions";
import { brand } from "@/config/brand";

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
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"loading" | "signin" | "setup">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {mode === "setup" ? "Create owner account" : "Owner sign in"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "setup"
            ? "Set the password for your private admin area. This can only be done once."
            : "Private area for the website owner. Customers do not need this page."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "setup" ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <Button type="submit" className="w-full rounded-xl" disabled={busy || mode === "loading"}>
            {busy ? "Please wait…" : mode === "setup" ? "Create account & sign in" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
