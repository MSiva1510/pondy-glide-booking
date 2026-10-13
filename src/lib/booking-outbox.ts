/**
 * Same-origin failsafe for booking dispatch.
 *
 * Neither same-origin database accepts anonymous booking writes, so when the
 * dashboard RPC is unreachable the request is queued in the browser instead.
 * The queue is flushed automatically on the next visit (or the next submit),
 * and the customer always has the WhatsApp path for instant confirmation.
 */

import type { BookingRequest } from "@/types";

export interface OutboxEntry {
  booking: BookingRequest & { id: string };
  queuedAt: string;
  attempts: number;
}

const STORAGE_KEY = "sri-jayam-booking-outbox";
const MAX_ENTRIES = 20;

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function storage(): Store | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch {
    /* private mode / SSR */
  }
  return null;
}

export function loadOutbox(store?: Store): OutboxEntry[] {
  const s = store ?? storage();
  if (!s) return [];
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is OutboxEntry =>
        typeof e === "object" &&
        e !== null &&
        typeof (e as OutboxEntry).booking?.id === "string",
    );
  } catch {
    return [];
  }
}

function saveOutbox(entries: OutboxEntry[], store?: Store) {
  const s = store ?? storage();
  s?.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

export function enqueueOutbox(booking: BookingRequest & { id: string }, store?: Store) {
  const entries = loadOutbox(store).filter((e) => e.booking.id !== booking.id);
  entries.unshift({ booking, queuedAt: new Date().toISOString(), attempts: 0 });
  saveOutbox(entries, store);
}

export function pendingOutboxCount(store?: Store) {
  return loadOutbox(store).length;
}

export interface DispatchResult {
  ok: boolean;
  saved: boolean;
  via: "dashboard" | "fallback" | "failed";
  bookingNumber: string;
}

/**
 * Retries every queued request through `send` (the dispatchBooking server
 * function). Entries that succeed are dropped; entries that fail stay queued
 * with a bumped attempt counter. Returns the number still pending.
 */
export async function flushOutbox(
  send: (booking: BookingRequest & { id: string }) => Promise<DispatchResult>,
  store?: Store,
) {
  const entries = loadOutbox(store);
  if (entries.length === 0) return 0;
  const remaining: OutboxEntry[] = [];
  for (const entry of entries) {
    try {
      const res = await send(entry.booking);
      if (res.ok && res.saved) continue;
    } catch {
      /* stays queued */
    }
    remaining.push({ ...entry, attempts: entry.attempts + 1 });
  }
  const s = store ?? storage();
  if (s) {
    if (remaining.length === 0) s.removeItem(STORAGE_KEY);
    else saveOutbox(remaining, s);
  }
  return remaining.length;
}
