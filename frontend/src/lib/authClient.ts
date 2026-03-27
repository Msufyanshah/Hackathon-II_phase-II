import { createAuthClient } from "better-auth/next-js"

export const authClient = createAuthClient({
    // This must match your BETTER_AUTH_URL
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" 
})