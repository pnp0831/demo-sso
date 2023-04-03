import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import GoogleProvider from "next-auth/providers/google";
import type { NextApiRequest, NextApiResponse } from "next";
import request from "~/helpers/axios";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { parseUserAgent } from "~/helpers";

const authOptions = (req, res) => ({
  // Configure one or more authentication providers
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  events: {
    async signOut({ token }) {
      const userId = token.sub;
      const deviceId = parseUserAgent(req.headers["user-agent"]).client?.name;

      const cookieHeader = req.headers.cookie;

      const cookies = cookieHeader ? parse(cookieHeader) : {};

      console.log("signOut cookies", cookies);
      console.log("signOut getCookie", getCookie("accessToken"));

      await request.post(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/signout`,
        {
          userId,
          deviceId,
        }
      );

      deleteCookie("accessToken");

      console.log("signOut after delete getCookie", getCookie("accessToken"));
    },
    async signIn({ user, account, profile }) {
      console.log("signIn getCookie", getCookie("accessToken"));

      const deviceId = parseUserAgent(req.headers["user-agent"]).client?.name;
      const bodyUser = {
        name: user.name,
        email: user.email,
        id: user.id,
        image: user.image,
        userId: user.id,
        accessToken: account.access_token,
        expired: account.expires_at,
        deviceId,
      };

      await request.post(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/signin`,
        bodyUser
      );

      setCookie("accessToken", bodyUser.accessToken);

      console.log("signIn after setCookie", getCookie("accessToken"));
    },
  },
});

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, authOptions(req, res));
}
