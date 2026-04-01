import { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";
import { destroyAppSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  // Always clear the custom session cookie
  await destroyAppSession();

  // Check if there's an Auth0 SDK session (social login)
  const sdkSession = await auth0.getSession();
  if (sdkSession) {
    // Redirect through Auth0 SDK signout to clear the SDK session + Auth0 session
    return Response.redirect(new URL("/auth/signout", req.url));
  }

  // No SDK session — just redirect home
  return Response.redirect(new URL("/", req.url));
}
