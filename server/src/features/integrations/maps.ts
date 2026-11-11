import type { MapsConfig } from "@socialevents/shared";

/** Maps runs client-side with a browser key (VITE_MAPS_BROWSER_KEY). The server
 *  only reports whether the client *should* attempt the live map; since the key
 *  lives in the client bundle, enablement is a client concern. The server
 *  endpoint exists for symmetry / future server-side map needs and always
 *  reports enabled=true (the client decides based on its own env). */
export function getMapsConfig(): MapsConfig {
  return { enabled: true };
}
