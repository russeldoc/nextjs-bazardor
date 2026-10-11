import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const hasSession =
    req.cookies.has("better-auth.session_token") ||
    req.cookies.has("__Secure-better-auth.session_token");

  if (!hasSession) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    url.searchParams.set("auth", "required");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/product/:path*", "/profile/:path*"] };