import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { fetchAuthorizationSafely } from "@/lib/dispatch/authorization-diagnostics";
import { supabaseConfig } from "./config";

export async function database() {
  const config = supabaseConfig();
  if (!config) return null;
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    global: { fetch: fetchAuthorizationSafely },
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
