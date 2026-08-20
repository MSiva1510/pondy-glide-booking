import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-aqua">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "soft";
}) {
  return (
    <section id={id} className={`${tone === "soft" ? "bg-surface" : "bg-background"} py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}