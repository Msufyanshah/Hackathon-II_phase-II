import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [
    jwt(),
  ],
  secret: process.env.BETTER_AUTH_SECRET || "your-super-secret-key-change-in-production",
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL!,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});
