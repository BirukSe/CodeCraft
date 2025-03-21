import { createAuthClient } from "better-auth/react"
export const {signIn, signOut, signUp, useSession, getSession} = createAuthClient({
    baseURL: "https://code-craft-f8fu.vercel.app" // the base url of your auth server
})
