import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { fetchAuthorizationSafely, isInvalidSession, isMissingSession, logAuthorizationFailure } from "@/lib/dispatch/authorization-diagnostics";
import { supabaseConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = supabaseConfig();
  if (config) {
    const cookieUpdates: Array<() => void> = [];
    const client = createServerClient(config.url, config.key, {
      global: { fetch: fetchAuthorizationSafely },
      cookieOptions: config.cookieOptions,
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (values) => {
          cookieUpdates.push(() => {
            for (const { name, value } of values) request.cookies.set(name, value);
            for (const { name, value, options } of values) response.cookies.set(name, value, options);
          });
        },
      },
    });
    const started = performance.now();
    const { error } = await client.auth.getClaims().catch((error: unknown) => ({ error }));
    if (!error || isInvalidSession(error)) {
      // Keep the incoming session available for retry if Auth is temporarily unavailable.
      for (const applyCookies of cookieUpdates) applyCookies();
      const forwarded = NextResponse.next({ request });
      for (const cookie of response.cookies.getAll()) forwarded.cookies.set(cookie);
      response = forwarded;
    }
    if (error && !isMissingSession(error)) logAuthorizationFailure("proxy_session", started, error);
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

export const config = { matcher: ["/dispatch/:path*", "/sign-in"] };
