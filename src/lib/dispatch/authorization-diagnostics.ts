const invalidSessionCodes = [
  "bad_jwt", "refresh_token_already_used", "refresh_token_not_found", "session_expired", "session_not_found",
] as const;
const tokenRejectionCodes = ["PGRST301", "PGRST303"] as const;
const safeCodes: readonly string[] = [
  ...invalidSessionCodes, ...tokenRejectionCodes,
  "request_timeout", "over_request_rate_limit", "unexpected_failure",
  "PGRST302", "PGRST000", "PGRST001", "PGRST002", "PGRST003", "PGRST202", "42501", "57014",
];
type Stage = "proxy_session" | "session" | "company_rpc";

export class DispatcherSessionUnavailable extends Error {
  constructor() {
    super("Dispatcher session could not be verified.");
  }
}

function property(error: unknown, key: "code" | "error_code" | "name" | "status"): unknown {
  if (!error || typeof error !== "object") return undefined;
  return (error as Partial<Record<typeof key, unknown>>)[key];
}

export function isMissingSession(error: unknown) {
  return property(error, "name") === "AuthSessionMissingError";
}

export function isInvalidSession(error: unknown) {
  const code = property(error, "code");
  return isMissingSession(error) || property(error, "name") === "AuthInvalidJwtError" ||
    invalidSessionCodes.some((knownCode) => knownCode === code);
}

export function isRestTokenRejection(error: unknown, status: unknown) {
  return status === 401 && tokenRejectionCodes.some((code) => code === property(error, "code"));
}

export function logAuthorizationFailure(stage: Stage, started: number, error: unknown, status?: number) {
  const code = property(error, "code");
  const httpStatus = status ?? property(error, "status");
  const allowedStatus = typeof httpStatus === "number" && Number.isInteger(httpStatus) &&
    httpStatus >= 100 && httpStatus <= 599 ? httpStatus : undefined;
  console.warn(JSON.stringify({
    event: "dispatch_authorization_failure",
    stage,
    timestamp: new Date().toISOString(),
    correlationId: crypto.randomUUID(),
    elapsedMs: Math.round(performance.now() - started),
    code: typeof code === "string" && safeCodes.includes(code) ? code : undefined,
    status: allowedStatus,
  }));
}

export const fetchAuthorizationSafely: typeof fetch = async (input, init) => {
  const target = new URL(input instanceof Request ? input.url : input);
  const path = target.pathname;
  const verifiesAccess = path === "/rest/v1/rpc/tms_can_dispatch" ||
    path === "/auth/v1/user" || path === "/auth/v1/.well-known/jwks.json" ||
    (path === "/auth/v1/token" && target.searchParams.get("grant_type") === "refresh_token");
  if (!verifiesAccess) return fetch(input, init);

  // The SDK can emit errors during session recovery. Strip upstream error text
  // before it reaches the SDK, retaining the status and known codes it needs.
  const response = await fetch(input, init).catch(() => {
    throw new TypeError("Supabase authorization request failed.");
  });
  if (response.status < 400) return response;
  const body: unknown = await response.json().catch(() => null);
  const upstreamCode = property(body, "code") ?? property(body, "error_code");
  const code = typeof upstreamCode === "string" && safeCodes.includes(upstreamCode) ? upstreamCode : undefined;
  const headers = new Headers({ "Content-Type": "application/json" });
  const apiVersion = response.headers.get("x-supabase-api-version");
  if (apiVersion === "2024-01-01") headers.set("x-supabase-api-version", apiVersion);
  const message = "Supabase authorization request failed.";
  return new Response(JSON.stringify({ message, msg: message, code, error_code: code }), {
    status: response.status, headers,
  });
};
