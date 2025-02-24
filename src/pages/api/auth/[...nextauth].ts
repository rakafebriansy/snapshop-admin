import { MongoDBAdapter } from "@auth/mongodb-adapter"
import GoogleProvider from "next-auth/providers/google"
import client from "../../../lib/mongodb"
import { JWT } from "next-auth/jwt"
import NextAuth, { Session } from "next-auth"
import { getServerSession } from 'next-auth/next';
import { adminEmails } from "../../../config/credentials"
import { NextApiRequest, NextApiResponse } from "next"

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

export async function isAdminRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if ((!session?.user?.email || !adminEmails.includes(session.user.email))) {
    res.status(401);
    res.end();
    throw 'Not an admin';
  }
}