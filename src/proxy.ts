import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authorizationTraceHeader, createAuthorizationFetch, isInvalidSession, isMissingSession, logAuthorizationFailure } from "@/lib/dispatch/authorization-diagnostics";
import { supabaseConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  const correlationId = crypto.randomUUID();
  const forward = () => {
    const headers = new Headers(request.headers);
    headers.set(authorizationTraceHeader, correlationId);
    return NextResponse.next({ request: { headers } });
  };
  let response = forward();
  const config = supabaseConfig();
  if (config) {
    const cookieUpdates: Array<() => void> = [];
    const client = createServerClient(config.url, config.key, {
      global: { fetch: createAuthorizationFetch(correlationId, "proxy") },
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
      const forwarded = forward();
      for (const cookie of response.cookies.getAll()) forwarded.cookies.set(cookie);
      response = forwarded;
    }
    if (error && !isMissingSession(error)) logAuthorizationFailure("proxy_session", started, error, undefined, correlationId);
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

export const config = { matcher: ["/dispatch/:path*", "/sign-in"] };
