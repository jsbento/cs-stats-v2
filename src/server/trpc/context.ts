// src/server/router/context.ts
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { Session } from "next-auth";
import { getServerAuthSession } from "../common/get-server-auth-session";
import { MongoClient, Db } from "mongodb";

type CreateContextOptions = {
  session: Session | null;
  db: Db;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db: opts.db,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  return await createContextInner({
    session,
    db,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
