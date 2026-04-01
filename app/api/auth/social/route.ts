import { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET(req: NextRequest) {
  const connection = req.nextUrl.searchParams.get("connection");

  if (!connection) {
    return new Response("Missing connection parameter", { status: 400 });
  }

  return auth0.startInteractiveLogin({
    authorizationParameters: { connection },
    returnTo: "/dashboard",
  });
}
