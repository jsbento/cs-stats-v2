import { router, publicProcedure, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
    createUser: publicProcedure
        .input(z.object({
            username: z.string(),
            profile: z.object({
                steamUsername: z.string(),
            }),
        }).required())
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.collection("users").insertOne({ ...input, createdAt: new Date() });
                return {
                    message: "User created successfully",
                };
            } catch( err ) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create user",
                });
            }
        }),
    deleteUser: protectedProcedure
        .input(z.object({
            username: z.string(),
        }).required())
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await ctx.db.collection("users").deleteOne({ username: input.username });
                console.log(result);
                return {
                    message: "User deleted successfully",
                };
            } catch( err ) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to delete user",
                });
            }
        }),
    getUserProfile: protectedProcedure
        .input(z.object({
            username: z.string(),
        }).required())
        .query(async ({ ctx, input }) => {
            try {
                const profile = await ctx.db.collection("users").findOne({ username: input.username }, { projection: { profile: 1 } });
                if( !profile ) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "User not found",
                    });
                } else {
                    return profile;
                }
            } catch( err ) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to get user profile",
                });
            }
        }),
})