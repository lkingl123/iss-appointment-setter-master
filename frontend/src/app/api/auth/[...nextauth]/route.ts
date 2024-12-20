import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { createUser } from "@/app/api/users"; // Import createUser function

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: 'common',
      authorization: {
        params: {
          scope: "openid profile email offline_access User.Read Calendars.Read Calendars.ReadWrite",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async signIn({ user, account }) {
      try {
        if (!account || !user.email) {
          console.error("Account or user email is missing");
          return false;
        }

        const provider = account.provider === "azure-ad" ? "azure-ad" : "google";

        const userData = {
          email: user.email ?? "",
          provider,
          google_token: provider === "google" ? account.access_token : null,
          outlook_token: provider === "azure-ad" ? account.access_token : null,
        };

        const response = await createUser(userData);
        console.log("User created or already exists:", response);

        return true;
      } catch (error) {
        console.error("Failed to create user:", error);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
