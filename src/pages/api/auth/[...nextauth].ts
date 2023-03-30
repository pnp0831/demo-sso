import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: "Credentials",
      id: process.env.NEXTAUTH_SECRET,
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("credentials", credentials);
        const user = {
          ...credentials,
          name: credentials.username,
        };
        // Validate the credentials here
        // and return the user object if they are valid
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("user", user);
      return true;
    },
    async signOut(a) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log({ url, baseUrl });
      return url;
    },
  },
});
