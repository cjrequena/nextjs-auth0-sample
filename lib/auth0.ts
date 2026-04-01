import { Auth0Client } from "@auth0/nextjs-auth0/server";

const NAMESPACE = "https://nextjs-auth0-sample.com";

console.log("[AUTH0] AUTH0_AUDIENCE:", process.env.AUTH0_AUDIENCE);

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: "openid profile email offline_access",
  },
  signInReturnToPath: "/dashboard",
  async beforeSessionSaved(session, idToken) {
    if (idToken) {
      const claims = typeof idToken === "string"
        ? (await import("jose")).decodeJwt(idToken)
        : idToken;
      session.user[`${NAMESPACE}/roles`] = claims[`${NAMESPACE}/roles`] ?? [];
      session.user[`${NAMESPACE}/permissions`] = claims[`${NAMESPACE}/permissions`] ?? [];
    }
    return session;
  },
});
