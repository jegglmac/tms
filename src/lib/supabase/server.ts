import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { authorizationTraceHeader, authorizationTraceId, createAuthorizationFetch } from "@/lib/dispatch/authorization-diagnostics";
import { supabaseConfig } from "./config";

export async function authorizationCorrelationId() {
  const value = (await headers()).get(authorizationTraceHeader);
  return value && authorizationTraceId.test(value) ? value : crypto.randomUUID();
}

export async function database(correlationId?: string) {
  const config = supabaseConfig();
  if (!config) return null;
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    global: { fetch: createAuthorizationFetch(correlationId ?? await authorizationCorrelationId(), "server") },
    cookieOptions: config.cookieOptions,
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        try {
          for (const { name, value, options } of values) jar.set(name, value, options);
        } catch {
          // Server Components are read-only. The proxy refreshes their cookies.
        }
      },
    },
  });
}
