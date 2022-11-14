import { DefaultSession } from "next-auth";
import { UserProfile } from "./user";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      userProfile?: UserProfile;
    } & DefaultSession["user"];
  }
}
