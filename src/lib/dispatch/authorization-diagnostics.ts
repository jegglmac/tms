const invalidSessionCodes = [
  "bad_jwt", "refresh_token_already_used", "refresh_token_not_found", "session_expired", "session_not_found",
] as const;
const tokenRejectionCodes = ["PGRST301", "PGRST302", "PGRST303"] as const;
const safeCodes: readonly string[] = [
  ...invalidSessionCodes, ...tokenRejectionCodes,
  "request_timeout", "over_request_rate_limit", "unexpected_failure",
  "PGRST000", "PGRST001", "PGRST002", "PGRST003", "PGRST202", "42501", "57014",
];
type Stage = "proxy_session" | "session" | "company_rpc";

function property(error: unknown, key: "code" | "name" | "status"): unknown {
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
