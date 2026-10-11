import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/** Server-side guard: validates the session with Better Auth, not just the cookie. */
export async function requireSession(nextPath: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/signin?next=${encodeURIComponent(nextPath)}&auth=required`);
  return session;
}