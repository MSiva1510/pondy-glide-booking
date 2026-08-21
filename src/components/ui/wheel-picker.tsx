import * as React from "react";

export interface WheelOption {
  value: string;
  label: string;
}

const ITEM_HEIGHT = 40;

/** iOS-style scroll wheel column. */
export function WheelPicker({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
}: {
  options: WheelOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef<number | null>(null);
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = index * ITEM_HEIGHT;
    if (Math.abs(el.scrollTop - target) > 2) el.scrollTop = target;
  }, [index]);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) window.clearTimeout(frame.current);
    frame.current = window.setTimeout(() => {
      const i = Math.round(el.scrollTop / ITEM_HEIGHT);
      const option = options[Math.min(options.length - 1, Math.max(0, i))];
      if (option && option.value !== value) onChange(option.value);
    }, 90);
  };

  return (
    <div className={`relative h-[200px] flex-1 ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-[80px] h-10 rounded-xl bg-secondary/70" />
      <div
        ref={ref}
        onScroll={onScroll}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
        className="no-scrollbar relative h-full snap-y snap-mandatory overflow-y-auto overscroll-contain"
        style={{ scrollPaddingBlock: 80 }}
      >
        <div style={{ height: 80 }} />
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="option"
            aria-selected={o.value === value}
            onClick={() => onChange(o.value)}
            style={{ height: ITEM_HEIGHT }}
            className={`flex w-full snap-center items-center justify-center text-base tabular-nums transition-all ${
              o.value === value
                ? "font-semibold text-foreground"
                : "text-muted-foreground/70 scale-95"
            }`}
          >
            {o.label}
          </button>
        ))}
        <div style={{ height: 80 }} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-card to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
    </div>
  );
}
