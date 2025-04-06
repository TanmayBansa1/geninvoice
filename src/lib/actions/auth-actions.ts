"use server"

import { signIn, signOut } from "@/server/auth";

export async function googleSignIn() {
  await signIn("google");
}

export async function handleSignout() {
  await signOut({ redirectTo: "/sign-in" })
}
