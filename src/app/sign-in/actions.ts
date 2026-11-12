"use server";

import { redirect } from "next/navigation";
import { database } from "@/lib/supabase/server";

export async function signIn(_state: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const client = await database();
  if (!client) return { error: "Sign-in is temporarily unavailable." };
  const email = form.get("email");
  const password = form.get("password");
  if (typeof email !== "string" || typeof password !== "string" ||
    email.length > 254 || password.length > 1024 || !password) {
    return { error: "Enter your email and password." };
  }
  const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
  if (error) return { error: "Sign-in failed. Check your credentials or try again later." };
  redirect("/dispatch");
}

export async function signOut() {
  const client = await database();
  if (client) {
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) throw new Error("Sign-out could not be confirmed. Try again.");
  }
  redirect("/sign-in");
}
