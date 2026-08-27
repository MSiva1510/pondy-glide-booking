import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export interface IosSelectOption {
  value: string;
  label: string;
  hint?: string;
}

/**
 * iOS-style dropdown: a field that opens a bottom-sheet with an iOS grouped
 * list — large tap rows, inset separators and a checkmark on the selection.
 */
export function IosSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select",
  title,
  className,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  options: IosSelectOption[];
  placeholder?: string;
  title?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-input bg-background px-3 text-left text-sm transition-colors ${className ?? ""}`}
        >
          <span className={selected ? "truncate font-medium" : "truncate text-muted-foreground"}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-3xl">
        {title ? (
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-center text-base">{title}</DrawerTitle>
          </DrawerHeader>
        ) : null}
        <div className="mx-auto w-full max-w-sm px-4 pb-8 pt-1">
          <ul
            role="listbox"
            aria-label={title}
            className="overflow-hidden rounded-2xl bg-secondary"
          >
            {options.map((o, i) => {
              const active = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[15px] transition-colors active:bg-muted ${
                      active ? "font-semibold text-primary" : "text-foreground"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate">{o.label}</span>
                      {o.hint ? (
                        <span className="block truncate text-xs font-normal text-muted-foreground">
                          {o.hint}
                        </span>
                      ) : null}
                    </span>
                    {active ? (
                      <Check className="size-5 shrink-0 text-accent" aria-hidden="true" />
                    ) : null}
                  </button>
                  {i < options.length - 1 ? (
                    <div className="ml-4 h-px bg-border" aria-hidden="true" />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
