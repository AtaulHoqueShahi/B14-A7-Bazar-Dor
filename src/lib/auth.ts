
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
  throw new Error("MONGODB_URL is missing from .env.local");
}

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET is missing from .env.local");
}

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is missing from .env.local");
}

console.log(
  "Google configured:",
  Boolean(googleClientId && googleClientSecret)
);

console.log(
  "GitHub configured:",
  Boolean(githubClientId && githubClientSecret)
);


const client = new MongoClient(mongoUrl);
const db = client.db("bazar-dor");


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
