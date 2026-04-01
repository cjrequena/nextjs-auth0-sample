import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH0_SECRET!);

export async function middleware(req: NextRequest) {
  // Let the Auth0 SDK handle /auth/* routes (login, callback, signout, profile)
  const res = await auth0.middleware(req);

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    // Check Auth0 SDK session (social logins)
    const sdkSession = await auth0.getSession(req);
    if (sdkSession) return res;

    // Check custom session cookie (password grant logins)
    const appToken = req.cookies.get("app_session")?.value;
    if (appToken) {
      try {
        await jwtVerify(appToken, secret);
        return res;
      } catch {
        // Invalid/expired token — fall through to redirect
      }
    }

    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*"],
};
