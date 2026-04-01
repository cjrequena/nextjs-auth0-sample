import {cookies} from "next/headers";
import {SignJWT, jwtVerify, decodeJwt} from "jose";
import type {User} from "@auth0/nextjs-auth0/types";

const SESSION_COOKIE = "app_session";
const secret = new TextEncoder().encode(process.env.AUTH0_SECRET!);

export interface AppSession {
    user: User;
    accessToken: string;
    idToken?: string;
    expiresAt: number;
}

export async function createSession(tokens: {
    access_token: string;
    id_token?: string;
    expires_in: number;
}) {
    const claims = decodeJwt(tokens.id_token || tokens.access_token);

    const user: User = {
        sub: claims.sub as string,
        name: claims.name as string | undefined,
        nickname: claims.nickname as string | undefined,
        email: claims.email as string | undefined,
        email_verified: claims.email_verified as boolean | undefined,
        picture: claims.picture as string | undefined,
        ...Object.fromEntries(
            Object.entries(claims).filter(([k]) => k.startsWith("https://"))
        ),
    };

    const session: AppSession = {
        user,
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
        expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in,
    };

    const jwt = await new SignJWT({session: JSON.stringify(session)})
        .setProtectedHeader({alg: "HS256"})
        .setExpirationTime(`${tokens.expires_in}s`)
        .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: tokens.expires_in,
    });

    return session;
}

export async function getAppSession(): Promise<AppSession | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    try {
        const {payload} = await jwtVerify(token, secret);
        return JSON.parse(payload.session as string) as AppSession;
    } catch {
        return null;
    }
}

export async function destroyAppSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}
