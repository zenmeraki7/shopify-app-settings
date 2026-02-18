import { useMemo } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

/**
 * Returns a fetch() that automatically attaches Shopify session token headers.
 * REQUIRED for embedded apps hitting /api/* behind validateAuthenticatedSession.
 */
export function useAuthFetch() {
  const app = useAppBridge();

  return useMemo(() => {
    const authFetch = authenticatedFetch(app);

    // Normalize into a "fetch-like" function
    return (url, options = {}) =>
      authFetch(url, {
        ...options,
        headers: {
          Accept: "application/json",
          ...(options.headers || {}),
        },
      });
  }, [app]);
}
