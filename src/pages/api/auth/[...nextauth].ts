import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
      return true;
    },
    async signOut(a) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
});
