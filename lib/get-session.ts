import { auth0 } from "@/lib/auth0";
import { getAppSession } from "@/lib/session";
import type { User } from "@auth0/nextjs-auth0/types";

export interface UnifiedSession {
  user: User;
  accessToken?: string;
}

export async function getSession(): Promise<UnifiedSession | null> {
  // Check Auth0 SDK session first (social logins)
  const sdkSession = await auth0.getSession();
  if (sdkSession) {
    return { user: sdkSession.user };
  }

  // Fall back to custom session (password grant logins)
  const appSession = await getAppSession();
  if (appSession) {
    return { user: appSession.user, accessToken: appSession.accessToken };
  }

  return null;
}
