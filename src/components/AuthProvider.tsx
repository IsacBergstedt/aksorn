"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import { startSync, stopSync } from "@/lib/progress/sync";

const SessionContext = createContext<Session | null>(null);

export function useSession() {
  return useContext(SessionContext);
}

/**
 * Subscribes to Supabase auth state and drives progress sync.
 * Signing out keeps the local copy so a guest on the same device
 * doesn't lose progress mid-session; signing in as a different user
 * replaces it with that account's remote state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (newSession?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
          void startSync(supabase, newSession.user);
        }
        if (event === "SIGNED_OUT") {
          stopSync();
        }
      },
    );
    return () => {
      subscription.subscription.unsubscribe();
      stopSync();
    };
  }, []);

  return (
    <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
  );
}
