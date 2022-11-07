// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { usersRouter } from "./users/users";
import { statsRouter } from "./stats/stats";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  users: usersRouter,
  stats: statsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
