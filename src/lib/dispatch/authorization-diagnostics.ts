const invalidSessionCodes = [
  "bad_jwt", "refresh_token_already_used", "refresh_token_not_found", "session_expired", "session_not_found",
] as const;
const tokenRejectionCodes = ["PGRST301", "PGRST303"] as const;
const safeCodes: readonly string[] = [
  ...invalidSessionCodes, ...tokenRejectionCodes,
  "request_timeout", "over_request_rate_limit", "unexpected_failure",
  "PGRST302", "PGRST000", "PGRST001", "PGRST002", "PGRST003", "PGRST202", "42501", "57014",
];
export const authorizationTraceHeader = "x-tms-authorization-trace";
export const authorizationTraceId = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;

type Stage = "proxy_session" | "session" | "company_rpc";

export class DispatcherSessionUnavailable extends Error {
  constructor() {
    super("Dispatcher session could not be verified.");
  }
}

function property(error: unknown, key: "code" | "error_code" | "name" | "status" | "cause"): unknown {
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

export function logAuthorizationFailure(stage: Stage, started: number, error: unknown, status?: number, correlationId: string = crypto.randomUUID()) {
  const code = property(error, "code");
  const httpStatus = status ?? property(error, "status");
  const allowedStatus = typeof httpStatus === "number" && Number.isInteger(httpStatus) &&
    httpStatus >= 100 && httpStatus <= 599 ? httpStatus : undefined;
  console.warn(JSON.stringify({
    event: "dispatch_authorization_failure",
    stage,
    timestamp: new Date().toISOString(),
    correlationId,
    elapsedMs: Math.round(performance.now() - started),
    code: typeof code === "string" && safeCodes.includes(code) ? code : undefined,
    status: allowedStatus,
  }));
}

type Endpoint = "auth" | "token_refresh" | "signing_keys" | "company_rpc";

function endpointCategory(target: URL): Endpoint | undefined {
  switch (target.pathname) {
    case "/rest/v1/rpc/tms_can_dispatch": return "company_rpc";
    case "/auth/v1/user": return "auth";
    case "/auth/v1/.well-known/jwks.json": return "signing_keys";
    case "/auth/v1/token":
      return target.searchParams.get("grant_type") === "refresh_token" ? "token_refresh" : undefined;
  }
}

function failureKind(error: unknown, signal?: AbortSignal | null) {
  const name = property(error, "name");
  if (name === "TimeoutError" || (signal?.aborted && property(signal.reason, "name") === "TimeoutError")) {
    return "timeout";
  }
  if (signal?.aborted || name === "AbortError") return "cancelled";
  const cause = property(error, "cause");
  const code = property(cause, "code") ?? property(error, "code");
  switch (code) {
    case "UND_ERR_CONNECT_TIMEOUT": return "connect_timeout";
    case "UND_ERR_HEADERS_TIMEOUT": return "headers_timeout";
    case "UND_ERR_BODY_TIMEOUT": return "body_timeout";
    case "UND_ERR_SOCKET": return "socket_error";
    case "ECONNRESET": return "connection_reset";
    case "ECONNREFUSED": return "connection_refused";
    case "ENOTFOUND":
    case "EAI_AGAIN": return "dns_error";
    case "ETIMEDOUT": return "transport_timeout";
    default: return undefined;
  }
}

export function createAuthorizationFetch(correlationId: string, clientScope: "proxy" | "server"): typeof fetch {
  const clientId = crypto.randomUUID();
  const attempts: Partial<Record<Endpoint, number>> = {};
  return async (input, init) => {
    const endpoint = endpointCategory(new URL(input instanceof Request ? input.url : input));
    if (!endpoint) return fetch(input, init);

    const attempt = (attempts[endpoint] ?? 0) + 1;
    attempts[endpoint] = attempt;
    const started = performance.now();
    const signal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
    const log = (details: {
      outcome: "headers_received" | "http_error" | "fetch_failed";
      headersMs?: number;
      errorBodyMs?: number;
      status?: number;
      code?: string;
      failure?: string;
      errorBodyReadFailed?: boolean;
    }) => console.info(JSON.stringify({
      event: "dispatch_authorization_request",
      timestamp: new Date().toISOString(),
      correlationId,
      clientId,
      clientScope,
      endpoint,
      attempt,
      elapsedMs: Math.round(performance.now() - started),
      ...details,
    }));

    let response: Response;
    try {
      response = await fetch(input, init);
    } catch (error) {
      log({ outcome: "fetch_failed", failure: failureKind(error, signal) ?? "unclassified" });
      throw new TypeError("Supabase authorization request failed.");
    }
    const headersMs = Math.round(performance.now() - started);
    if (response.status < 400) {
      log({ outcome: "headers_received", headersMs, status: response.status });
      return response;
    }

    const bodyStarted = performance.now();
    let body: unknown;
    let errorBodyReadFailed = false;
    let failure: string | undefined;
    try {
      body = await response.json();
    } catch (error) {
      errorBodyReadFailed = true;
      failure = failureKind(error, signal);
    }
    const errorBodyMs = Math.round(performance.now() - bodyStarted);
    const upstreamCode = property(body, "code") ?? property(body, "error_code");
    const code = typeof upstreamCode === "string" && safeCodes.includes(upstreamCode) ? upstreamCode : undefined;
    log({ outcome: "http_error", headersMs, errorBodyMs, status: response.status, code, failure, errorBodyReadFailed });
    const headers = new Headers({ "Content-Type": "application/json" });
    const apiVersion = response.headers.get("x-supabase-api-version");
    if (apiVersion === "2024-01-01") headers.set("x-supabase-api-version", apiVersion);
    const message = "Supabase authorization request failed.";
    return new Response(JSON.stringify({ message, msg: message, code, error_code: code }), {
      status: response.status, headers,
    });
  };
}
