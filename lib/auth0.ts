import { Auth0Client } from "@auth0/nextjs-auth0/server";

const NAMESPACE = "https://clinichub.com";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: "openid profile email offline_access",
  },
  signInReturnToPath: "/dashboard",
  async beforeSessionSaved(session, idToken) {
    if (idToken) {
      const { decodeJwt } = await import("jose");
      const claims = decodeJwt(idToken);
      session.user[`${NAMESPACE}/roles`] = claims[`${NAMESPACE}/roles`] ?? [];
      session.user[`${NAMESPACE}/permissions`] = claims[`${NAMESPACE}/permissions`] ?? [];
    }
    return session;
  },
});
