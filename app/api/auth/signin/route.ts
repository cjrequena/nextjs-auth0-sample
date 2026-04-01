import { NextResponse } from "next/server";
import { authClient, DB_CONNECTION } from "@/lib/auth0-api";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const response = await authClient.oauth.passwordGrant({
      username: email,
      password,
      realm: DB_CONNECTION,
      audience: process.env.AUTH0_AUDIENCE || undefined,
      scope: "openid profile email offline_access",
    });

    await createSession({
      access_token: response.data.access_token,
      id_token: response.data.id_token,
      expires_in: response.data.expires_in,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string; body?: { error_description?: string; error?: string } };
    const message = err.body?.error_description || err.message || "Authentication failed";
    return NextResponse.json({ error: message }, { status: err.statusCode || 401 });
  }
}
