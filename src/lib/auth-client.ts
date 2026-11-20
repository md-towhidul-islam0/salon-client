import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", defaultValue: "Customer", input: true },
        isBlocked: { type: "boolean", defaultValue: false, input: true },
      },
    }),
  ],
});

export const { signIn, signUp, useSession } = authClient;
