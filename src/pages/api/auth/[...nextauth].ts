import { MongoDBAdapter } from "@auth/mongodb-adapter"
import GoogleProvider from "next-auth/providers/google"
import client from "../../../lib/mongodb"
import { JWT } from "next-auth/jwt"
import NextAuth, { Account, Profile, Session } from "next-auth"
import { adminEmails } from "../../../config/credentials"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!, // make sure the credentials is in .env file
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(client),
  callbacks: {
    async signIn({ user }: { user: any }) {
      if (!user.email || !adminEmails.includes(user.email)) {
        console.error(`User not authorized: ${user.email}`);
        return false;
      }
      return true;
    },
    async session({ session, token, user }: {
      session: Session,
      token: JWT,
      user: any
    }) {
      return session;
    }
  }
}

export default NextAuth(authOptions);