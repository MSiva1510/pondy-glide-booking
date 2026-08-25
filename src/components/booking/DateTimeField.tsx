import * as React from "react";
import { CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { WheelPicker, type WheelOption } from "@/components/ui/wheel-picker";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (n: number) => String(n).padStart(2, "0");
const range = (from: number, to: number): WheelOption[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({
    value: String(from + i),
    label: String(from + i),
  }));

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function DateField({
  id,
  value,
  onChange,
  minISO,
  placeholder = "Select date",
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  minISO?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const now = new Date();
  const initial = value ? value.split("-").map(Number) : null;
  const [year, setYear] = React.useState(initial?.[0] ?? now.getFullYear());
  const [month, setMonth] = React.useState(initial?.[1] ?? now.getMonth() + 1);
  const [day, setDay] = React.useState(initial?.[2] ?? now.getDate());

  React.useEffect(() => {
    if (!value) return;
    const [y, m, d] = value.split("-").map(Number);
    if (y && m && d) {
      setYear(y);
      setMonth(m);
      setDay(d);
    }
  }, [value]);

  const maxDay = daysInMonth(year, month);
  const safeDay = Math.min(day, maxDay);
  const iso = `${year}-${pad(month)}-${pad(safeDay)}`;
  const disabled = Boolean(minISO && iso < minISO);

  const display = value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : placeholder;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          id={id}
          type="button"
          className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 text-left text-sm"
        >
          <span className={value ? "font-medium" : "text-muted-foreground"}>{display}</span>
          <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-3xl">
        <DrawerHeader className="pb-0">
          <DrawerTitle className="text-center text-base">Travel date</DrawerTitle>
        </DrawerHeader>
        <div className="mx-auto flex w-full max-w-sm gap-1 px-4 py-2">
          <WheelPicker
            ariaLabel="Day"
            options={range(1, maxDay)}
            value={String(safeDay)}
            onChange={(v) => setDay(Number(v))}
          />
          <WheelPicker
            ariaLabel="Month"
            options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))}
            value={String(month)}
            onChange={(v) => setMonth(Number(v))}
          />
          <WheelPicker
            ariaLabel="Year"
            options={range(now.getFullYear(), now.getFullYear() + 2)}
            value={String(year)}
            onChange={(v) => setYear(Number(v))}
          />
        </div>
        <DrawerFooter className="mx-auto w-full max-w-sm">
          {disabled ? (
            <p className="text-center text-xs text-destructive">Please pick a future date.</p>
          ) : null}
          <Button
            className="h-12 rounded-xl text-base"
            disabled={disabled}
            onClick={() => {
              onChange(iso);
              setOpen(false);
            }}
          >
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function TimeField({
  id,
  value,
  onChange,
  placeholder = "Select time",
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const parsed = value ? value.split(":").map(Number) : null;
  const initialHour = parsed?.[0] ?? 9;
  const [hour12, setHour12] = React.useState(((initialHour + 11) % 12) + 1);
  const [minute, setMinute] = React.useState(parsed?.[1] ?? 0);
  const [meridiem, setMeridiem] = React.useState(initialHour >= 12 ? "PM" : "AM");

  React.useEffect(() => {
    if (!value) return;
    const [h, m] = value.split(":").map(Number);
    if (h === undefined || m === undefined) return;
    setHour12(((h + 11) % 12) + 1);
    setMinute(m);
    setMeridiem(h >= 12 ? "PM" : "AM");
  }, [value]);

  const hour24 = (hour12 % 12) + (meridiem === "PM" ? 12 : 0);
  const iso = `${pad(hour24)}:${pad(minute)}`;
  const display = value
    ? `${((Number(value.slice(0, 2)) + 11) % 12) + 1}:${value.slice(3, 5)} ${Number(value.slice(0, 2)) >= 12 ? "PM" : "AM"}`
    : placeholder;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          id={id}
          type="button"
          className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 text-left text-sm"
        >
          <span className={value ? "font-medium" : "text-muted-foreground"}>{display}</span>
          <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-3xl">
        <DrawerHeader className="pb-0">
          <DrawerTitle className="text-center text-base">Pickup time</DrawerTitle>
        </DrawerHeader>
        <div className="mx-auto flex w-full max-w-sm gap-1 px-4 py-2">
          <WheelPicker
            ariaLabel="Hour"
            options={range(1, 12)}
            value={String(hour12)}
            onChange={(v) => setHour12(Number(v))}
          />
          <WheelPicker
            ariaLabel="Minute"
            options={Array.from({ length: 12 }, (_, i) => ({
              value: String(i * 5),
              label: pad(i * 5),
            }))}
            value={String(Math.round(minute / 5) * 5)}
            onChange={(v) => setMinute(Number(v))}
          />
          <WheelPicker
            ariaLabel="AM or PM"
            options={[
              { value: "AM", label: "AM" },
              { value: "PM", label: "PM" },
            ]}
            value={meridiem}
            onChange={setMeridiem}
          />
        </div>
        <DrawerFooter className="mx-auto w-full max-w-sm">
          <Button
            className="h-12 rounded-xl text-base"
            onClick={() => {
              onChange(iso);
              setOpen(false);
            }}
          >
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
