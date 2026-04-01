import { AuthenticationClient } from "auth0";

export const authClient = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
});

export const DB_CONNECTION = "Username-Password-Authentication";
