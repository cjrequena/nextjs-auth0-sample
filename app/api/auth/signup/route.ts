import { NextResponse } from "next/server";
import { authClient, DB_CONNECTION } from "@/lib/auth0-api";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const response = await authClient.database.signUp({
      email,
      password,
      connection: DB_CONNECTION,
      name: name || undefined,
    });

    return NextResponse.json({
      message: "Account created. Please check your email to verify your account.",
      user: { email: response.data.email, id: response.data.id },
    });
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string; body?: { message?: string; description?: string } };
    const message = err.body?.description || err.body?.message || err.message || "Signup failed";
    return NextResponse.json({ error: message }, { status: err.statusCode || 500 });
  }
}
