import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import { env } from "../../../env/server.mjs";
import { MongoClient } from "mongodb";
import { User } from "../../../types/user.js";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session }) {
      if( session.user && session.user.name ) {
        const db = await MongoClient.connect(env.MONGODB_URI);
        const user = await db.db().collection<User>("users").findOne({ username: session.user.name });
        if( user ) {
          session.user.userProfile = user.profile;
        }
        await db.close();
      }
      return session;
    },
  },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    })
  ],
};

export default NextAuth(authOptions);
