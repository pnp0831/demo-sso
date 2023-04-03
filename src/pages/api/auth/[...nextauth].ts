import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import request from "~/helpers/axios";
import DeviceDetector from "device-detector-js";
import { parse } from "cookie";

const parseUserAgent = (userAgent) => {
  const deviceDetector = new DeviceDetector();

  const device = deviceDetector.parse(userAgent);

  return device;
};

const authOptions = (req, res) => ({
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
      const deviceId = parseUserAgent(req.headers["user-agent"]).client?.name;
      const bodyUser = {
        name: profile.name,
        email: profile.email,
        id: profile.sub,
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

      return true;
    },
  },
  events: {
    async signOut({ token }) {
      const userId = token.sub;
      const deviceId = parseUserAgent(req.headers["user-agent"]).client?.name;

      const cookieHeader = req.headers.cookie;

      const cookies = cookieHeader ? parse(cookieHeader) : {};

      await request.post(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/signout`,
        {
          userId,
          deviceId,
        }
      );

      res.setHeader("Set-Cookie", [`accessToken=`]);
    },
  },
});

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, authOptions(req, res));
}
