import { expect, test } from "@playwright/test";
import { createAuthorizationFetch } from "../../src/lib/dispatch/authorization-diagnostics";

test("authorization fetch traces timing and failures without changing the transport", async () => {
  const originalFetch = globalThis.fetch;
  const originalInfo = console.info;
  const records: Record<string, unknown>[] = [];
  const correlationId = crypto.randomUUID();
  const trace = createAuthorizationFetch(correlationId, "server");
  const origin = "http://127.0.0.1:54321";
  const rpc = origin + "/rest/v1/rpc/tms_can_dispatch";
  const refresh = origin + "/auth/v1/token?grant_type=refresh_token";
  const marker = "synthetic-secret-marker";
  const controller = new AbortController();
  const options = { signal: controller.signal, headers: { Authorization: marker }, method: "POST", body: marker };
  let calls = 0;
  let send: typeof fetch = async () => Response.json(true);
  console.info = (line) => records.push(JSON.parse(line));
  globalThis.fetch = (input, init) => {
    calls++;
    return send(input, init);
  };
  try {
    for (const [code, failure] of [
      ["UND_ERR_CONNECT_TIMEOUT", "connect_timeout"],
      ["UND_ERR_HEADERS_TIMEOUT", "headers_timeout"],
    ]) {
      send = async () => {
        throw Object.assign(new TypeError(marker), { cause: { code } });
      };
      await expect(trace(rpc, options)).rejects.toThrow("Supabase authorization request failed.");
      expect(records.at(-1)).toMatchObject({ endpoint: "company_rpc", outcome: "fetch_failed", failure, correlationId });
      expect(records.at(-1)).not.toHaveProperty("headersMs");
    }

    const cancel = new AbortController();
    send = async (_input, init) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(init.signal?.reason), { once: true });
    });
    const pendingHeaders = trace(rpc, { signal: cancel.signal });
    cancel.abort(new DOMException(marker, "AbortError"));
    await expect(pendingHeaders).rejects.toThrow("Supabase authorization request failed.");
    expect(records.at(-1)).toMatchObject({ failure: "cancelled" });

    const bodyController = new AbortController();
    send = async () => new Response(new ReadableStream({
      start(stream) {
        bodyController.signal.addEventListener("abort", () => stream.error(bodyController.signal.reason), { once: true });
      },
    }), { status: 503 });
    const pendingBody = trace(rpc, { signal: bodyController.signal });
    await Promise.resolve();
    bodyController.abort(new DOMException(marker, "TimeoutError"));
    expect((await pendingBody).status).toBe(503);
    expect(records.at(-1)).toMatchObject({
      outcome: "http_error", failure: "timeout", headersMs: expect.any(Number),
      errorBodyMs: expect.any(Number), errorBodyReadFailed: true, status: 503,
    });

    send = async () => Response.json({ code: "PGRST003", details: marker }, { status: 504 });
    const redacted = await trace(rpc, options);
    expect(await redacted.text()).not.toContain(marker);
    expect(records.at(-1)).toMatchObject({ code: "PGRST003", status: 504 });

    const responses = [Response.json(true), Response.json(true)];
    send = async (_input, init) => {
      expect(init).toBe(options);
      return responses.shift()!;
    };
    const first = responses[0];
    const second = responses[1];
    const otherRequest = createAuthorizationFetch(crypto.randomUUID(), "proxy");
    const [a, b] = await Promise.all([trace(refresh, options), otherRequest(refresh, options)]);
    expect(a).toBe(first);
    expect(b).toBe(second);
    expect(a.bodyUsed).toBe(false);
    expect(b.bodyUsed).toBe(false);
    expect(records.slice(-2)).toEqual(expect.arrayContaining([
      expect.objectContaining({ endpoint: "token_refresh", attempt: 1, clientScope: "server", correlationId }),
      expect.objectContaining({ endpoint: "token_refresh", attempt: 1, clientScope: "proxy",
        correlationId: expect.not.stringMatching(correlationId) }),
    ]));

    send = async () => Response.json(true);
    await trace(refresh, options);
    expect(records.at(-1)).toMatchObject({ attempt: 2, endpoint: "token_refresh" });
    await trace(origin + "/auth/v1/user", options);
    expect(records.at(-1)).toMatchObject({ endpoint: "auth", attempt: 1 });
    await trace(origin + "/auth/v1/.well-known/jwks.json", options);
    expect(records.at(-1)).toMatchObject({ endpoint: "signing_keys", attempt: 1 });
    await trace(origin + "/rest/v1/rpc/tms_save_load", options);
    await trace(origin + "/rest/v1/rpc/tms_save_roster", options);
    expect(records).toHaveLength(10);
    expect(calls).toBe(12);
    expect(JSON.stringify(records)).not.toContain(marker);
    expect(JSON.stringify(records)).not.toContain(origin);
  } finally {
    globalThis.fetch = originalFetch;
    console.info = originalInfo;
  }
});
