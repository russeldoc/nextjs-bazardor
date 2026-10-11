import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.MONGODB_URI;
const mongoClient = mongoUri ? new MongoClient(mongoUri) : undefined;
const mongoDatabase = process.env.MONGODB_DATABASE || "bazardor";

export const auth = betterAuth({
  appName: "বাজার দর",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "development-only-change-this-secret-before-deploying",
  ...(mongoClient
    ? { database: mongodbAdapter(mongoClient.db(mongoDatabase), { client: mongoClient }) }
    : {}),
  emailAndPassword: { enabled: true }, // no email verification / forgot password (per requirements)
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? { github: { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET } }
      : {}),
  },
});
