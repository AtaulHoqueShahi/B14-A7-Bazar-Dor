import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUrl = process.env.MONGODB_URL;
const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!mongoUrl) {
  throw new Error("MONGODB_URL is missing");
}

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET is missing");
}

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is missing");
}

const trustedOrigins = [
  baseURL,
  "https://b14-a7-bazar-dor-mc5w-7qb6g2p9l-ahshahi84-9420.vercel.app",
  "https://bazar-dor.vercel.app",
  "http://localhost:3000",
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []),
]
  .filter(Boolean)
  .map((origin) => new URL(origin).origin);

const client = new MongoClient(mongoUrl);
const db = client.db("bazar-dor");

export const auth = betterAuth({
  baseURL,
  secret,

  trustedOrigins: [...new Set(trustedOrigins)],

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {}),

    ...(githubClientId && githubClientSecret
      ? {
          github: {
            clientId: githubClientId,
            clientSecret: githubClientSecret,
          },
        }
      : {}),
  },
});