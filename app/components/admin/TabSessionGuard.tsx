"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

/**
 * Logs the user/admin out when the browser TAB is closed.
 *
 * How it works:
 * - sessionStorage belongs to one tab and is wiped when that tab closes.
 * - A tab that has been open while the user logged in carries a small flag.
 * - When a page loads with a logged-in session but WITHOUT the flag, it's a
 *   brand-new tab (or the site was reopened after closing). We ask any other
 *   open tabs of the site if they're still alive; if none answer, the earlier
 *   tab was closed, so we log out.
 * - Opening the site in a second tab while the first is still open keeps you
 *   logged in. Refreshing a page keeps you logged in.
 */
const FLAG = "pop-tab-session";
const CHANNEL = "pop-tab-presence";
const WAIT_MS = 400;

export default function TabSessionGuard() {
  const { status } = useSession();
  const [checking, setChecking] = useState(false);

  // Answer "is anyone there?" from newly opened tabs
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(CHANNEL);
    ch.onmessage = (e) => {
      if (e.data === "ping" && sessionStorage.getItem(FLAG))
        ch.postMessage("pong");
    };
    return () => ch.close();
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    let flag: string | null = null;
    try {
      flag = sessionStorage.getItem(FLAG);
    } catch {
      return;
    }

    // Not logged in: mark this tab, so a login done here keeps working
    if (status === "unauthenticated") {
      if (!flag) sessionStorage.setItem(FLAG, "1");
      return;
    }

    // Logged in and this tab already knows about it: nothing to do
    if (flag) return;

    // Logged in, but this tab is new: is another tab of the site still open?
    setChecking(true);
    let answered = false;
    let ch: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      ch = new BroadcastChannel(CHANNEL);
      ch.onmessage = (e) => {
        if (e.data === "pong" && !answered) {
          answered = true;
          sessionStorage.setItem(FLAG, "1");
          setChecking(false);
          ch?.close();
        }
      };
      ch.postMessage("ping");
    }

    const timer = setTimeout(async () => {
      ch?.close();
      if (answered) return;
      // No other tab is open → the previous tab was closed → log out
      await signOut({ redirect: false });
      sessionStorage.setItem(FLAG, "1");
      window.location.reload();
    }, WAIT_MS);

    return () => {
      clearTimeout(timer);
      ch?.close();
    };
  }, [status]);

  // Briefly cover the page while checking, so private pages don't flash
  if (!checking) return null;
  return <div className="fixed inset-0 z-[9999] bg-white" aria-hidden="true" />;
}
