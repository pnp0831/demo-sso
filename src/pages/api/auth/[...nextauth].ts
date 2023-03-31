// Cài đặt next-auth và sử dụng strategy Google
// npm install next-auth google
// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import WorkOSProvider from "next-auth/providers/workos";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  cookies: {
    domain: ".vercel.app",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async signOut(a) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url;
    },
    async session({ session, token, user }) {
      const a = await fetch(
        `${process.env.NEXTAUTH_URL}/api/auth/session`
      ).then((res) => res.json());

      console.log("A", a);

      // Send properties to the client, like an access_token and user id from a provider.
      // session.accessToken = token.accessToken;
      // session.user.id = token.id;

      return a;
    },
  },
});
