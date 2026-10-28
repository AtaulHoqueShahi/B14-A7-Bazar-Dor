
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUrl = process.env.MONGODB_URL;
const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!mongoUrl) throw new Error("MONGODB_URL is missing from .env.local");
if (!secret) throw new Error("BETTER_AUTH_SECRET is missing from .env.local");
if (!baseURL) throw new Error("BETTER_AUTH_URL is missing from .env.local");

const client = new MongoClient(mongoUrl);
const db = client.db("assaiment-7");

export const auth = betterAuth({
  baseURL,
  secret,

  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
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

    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
});
