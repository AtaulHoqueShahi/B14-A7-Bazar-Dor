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

if (!googleClientId || !googleClientSecret) {
  throw new Error("Google OAuth credentials are missing");
}

if (!githubClientId || !githubClientSecret) {
  throw new Error("GitHub OAuth credentials are missing");
}

const client = new MongoClient(mongoUrl);
const db = client.db("bazar-dor");

export const auth = betterAuth({
  baseURL,
  secret,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },

    github: {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    },
  },
});