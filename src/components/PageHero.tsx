export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="gradient-hero py-14 text-ocean-foreground sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="animate-fade-up max-w-2xl">
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean-foreground/70">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
          {description ? (
            <p className="mt-4 text-base text-ocean-foreground/85">{description}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
