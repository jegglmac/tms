import { createServer, type IncomingMessage } from "node:http";
import type { Socket } from "node:net";
import { expect, test } from "@playwright/test";
import { createAuthorizationFetch } from "../../src/lib/dispatch/authorization-diagnostics";

test("opt-in local authorization requests avoid a stale reused Undici socket", async () => {
  const previousSetting = process.env.TMS_LOCAL_SUPABASE_FRESH_CONNECTIONS;
  process.env.TMS_LOCAL_SUPABASE_FRESH_CONNECTIONS = "1";
  const socketIds = new WeakMap<Socket, number>();
  const staleSockets = new WeakSet<Socket>();
  const requests: Array<{ socketId: number; connection: string | undefined; stale: boolean }> = [];
  let nextSocketId = 1;
  let firstSocket: Socket | undefined;
  const gateway = createServer((request: IncomingMessage, response) => {
    const socket = request.socket;
    let socketId = socketIds.get(socket);
    if (!socketId) {
      socketId = nextSocketId++;
      socketIds.set(socket, socketId);
    }
    const stale = staleSockets.has(socket);
    requests.push({ socketId, connection: request.headers.connection, stale });
    request.resume();
    request.on("end", () => {
      if (stale) {
        socket.resetAndDestroy();
        return;
      }
      if (!firstSocket) {
        firstSocket = socket;
        setTimeout(() => staleSockets.add(socket), 60).unref();
      }
      response.writeHead(200, {
        "content-type": "application/json",
        "content-length": "4",
        connection: request.headers.connection === "close" ? "close" : "keep-alive",
      });
      response.end("true");
    });
  });

  await new Promise<void>((resolve, reject) => {
    gateway.once("error", reject);
    gateway.listen(0, "127.0.0.1", resolve);
  });

  try {
    const address = gateway.address();
    if (!address || typeof address === "string") throw new Error("Missing synthetic gateway port");
    const endpoint = `http://127.0.0.1:${address.port}/rest/v1/rpc/tms_can_dispatch`;

    const initial = await fetch(endpoint, { method: "POST", body: "{}" });
    expect(await initial.text()).toBe("true");
    await new Promise((resolve) => setTimeout(resolve, 100));

    let resetCode: unknown;
    try {
      await fetch(endpoint, { method: "POST", body: "{}" });
    } catch (error) {
      resetCode = (error as { cause?: { code?: unknown } }).cause?.code;
    }
    expect(resetCode).toBe("ECONNRESET");
    expect(requests[1]).toMatchObject({ socketId: requests[0].socketId, stale: true });

    const trace = createAuthorizationFetch(crypto.randomUUID(), "server");
    const freshOne = await trace(endpoint, { method: "POST", body: "{}" });
    expect(await freshOne.text()).toBe("true");
    const freshTwo = await trace(endpoint, { method: "POST", body: "{}" });
    expect(await freshTwo.text()).toBe("true");

    const freshRequests = requests.slice(2);
    expect(freshRequests).toHaveLength(2);
    expect(freshRequests.every((entry) => entry.connection === "close" && !entry.stale)).toBe(true);
    expect(new Set(freshRequests.map((entry) => entry.socketId)).size).toBe(2);
  } finally {
    if (previousSetting === undefined) delete process.env.TMS_LOCAL_SUPABASE_FRESH_CONNECTIONS;
    else process.env.TMS_LOCAL_SUPABASE_FRESH_CONNECTIONS = previousSetting;
    gateway.closeAllConnections();
    await new Promise<void>((resolve) => gateway.close(() => resolve()));
  }
});

test("local fresh-connection opt-in ignores non-authorization and non-loopback endpoints", async () => {
  const previousSetting = process.env.TMS_LOCAL_SUPABASE_FRESH_CONNECTIONS;
  process.env.TMS_LOCAL_SUPABASE_FRESH_CONNECTIONS = "1";
  const previousFetch = globalThis.fetch;
  let observedInit: RequestInit | undefined;
  globalThis.fetch = async (_input, init) => {
    observedInit = init;
    return Response.json({ ok: true });
  };
  try {
    const trace = createAuthorizationFetch(crypto.randomUUID(), "server");
    await trace("https://example.supabase.co/rest/v1/rpc/tms_can_dispatch", { method: "POST" });
    expect(observedInit).toEqual({ method: "POST" });
    await trace("http://127.0.0.1:54321/rest/v1/rpc/tms_save_load", { method: "POST" });
    expect(observedInit).toEqual({ method: "POST" });
  } finally {
    globalThis.fetch = previousFetch;
    if (previousSetting === undefined) delete process.env.TMS_LOCAL_SUPABASE_FRESH_CONNECTIONS;
    else process.env.TMS_LOCAL_SUPABASE_FRESH_CONNECTIONS = previousSetting;
  }
});
