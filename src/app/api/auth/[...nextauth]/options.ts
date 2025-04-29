import { addUserToDatabase, UserDetails } from "@/lib/supabase";
import type { Session } from "next-auth";
import { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/",
    error: "/"
  },
  callbacks: {
    async redirect({ baseUrl }: { baseUrl: string }) {
      return baseUrl;
    },
    async jwt({ token, account, profile }) {
      // If this is a sign-in, add the user to the database
      if (account && profile) {
        if (token.sub && token.email) {
          try {
            const userDetails: UserDetails = {
              id: token.sub,
              email: token.email,
              name: token.name || null,
              image: token.picture || null,
              provider: account.provider || "google",
            };
            
            await addUserToDatabase(userDetails);
          } catch (error) {
            console.error("Error adding user to Supabase:", error);
          }
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    }
  }
};
