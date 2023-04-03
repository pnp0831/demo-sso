import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import request from "~/helpers/axios";

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const userId = user.id;

      const bodyUser = {
        name: profile.name,
        email: profile.email,
        id: profile.sub,
        userId,
        accessToken: account.accessToken,
      };

      await request.post(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/signin`,
        bodyUser
      );

      return true;
    },
  },
  events: {
    async session(a) {
      console.log("a", a);
    },
    async signOut({ token }) {
      const userId = token.sub;

      await request.post(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/signout`,
        {
          userId,
        }
      );
    },
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, authOptions);
}
