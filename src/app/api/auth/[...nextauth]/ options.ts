import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConect } from "@/lib/dbConect";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConect();

        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { password: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("User not found by this username or email");
          }

          if (!user.isVarified) {
            throw new Error("please verify your email before login");
          }

          const validPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!validPassword) {
            throw new Error("Invalid password please try again");
          }

          return user;
        } catch (error) {
          console.error("login user error:", error);
          throw new Error("Database connection error");
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVarifyed = token.isVarifyed;
        session.user.isMassageAllowed = token.isMassageAllowed;
        session.user.username = token.username;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVarifyed = user.isVarified;
        token.isMassageAllowed = user.isMassageAllowed;
        token.username = user.username;
      }

      return token;
    },
  },

  secret:process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
};
