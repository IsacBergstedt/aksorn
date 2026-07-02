"use client";

import { useEffect, useState } from "react";

/**
 * True after client mount. Used to defer rendering of persisted-store
 * values (and anything random) so server HTML matches the first client
 * render.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
