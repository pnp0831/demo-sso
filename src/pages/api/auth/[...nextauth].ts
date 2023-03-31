import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import request, { setToken, defaultHeaders } from "~/helpers/axios";
import Cookies from "cookies";

const nextAuthOptions = (req, res) => {
  return {
    providers: [
      CredentialsProvider({
        id: process.env.NEXTAUTH_SECRET,
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials, req) {
          const { user, accessToken } = await request.post(
            `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/signin`,
            {
              username: credentials?.username,
              password: credentials?.password,
            }
          );

          try {
            setToken(accessToken);
          } catch (e) {
            console.log("e", e);
          }

          return user;
        },
      }),
    ],
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
    events: {
      async signOut({ session, token }) {
        await request.post(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/signout`,
          {},
          {
            headers: defaultHeaders,
          }
        );
        setToken();
      },
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        return true;
      },
      async session({ session, token }) {
        const { user } = await request.get(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/session`,
          {
            headers: defaultHeaders,
          }
        );

        if (user?.id) {
          return { user };
        }

        return null;
      },
      async redirect({ url, baseUrl }) {
        return url;
      },
    },
  };
};

export default (req, res) => {
  console.log("de", defaultHeaders);
  return NextAuth(req, res, nextAuthOptions(req, res));
};
