export function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const endpoint = new URL(url);
    const local = endpoint.hostname === "127.0.0.1" || endpoint.hostname === "localhost";
    if (endpoint.protocol !== "https:" && !(local && endpoint.protocol === "http:")) return null;
    return {
      url, key,
      cookieOptions: { httpOnly: true, sameSite: "lax" as const, secure: endpoint.protocol === "https:" },
    };
  } catch {
    return null;
  }
}
