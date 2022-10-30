// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { usersRouter } from "./users/users";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
