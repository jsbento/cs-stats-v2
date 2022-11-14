import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { User } from "../../../../types/user";

export const usersRouter = router({
    deleteUser: protectedProcedure
        .mutation(async ({ ctx }) => {
            try {
                const result = await ctx.db.collection<User>("users").deleteOne({ username: ctx.session.user.name! });
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
        .query(async ({ ctx }) => {
            try {
                const profile = await ctx.db.collection<User>("users").findOne({ username: ctx.session.user.name! }, { projection: { profile: 1 } });
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
    upsertUserProfile: protectedProcedure
        .input(z.object({
            profile: z.object({
                steamUsername: z.string(),
            }),
        }).required())
        .mutation(async ({ ctx, input }) => {
            try {
                const username = ctx.session.user.name!;
                await ctx.db.collection<User>("users").updateOne({ username }, { $set: { username, profile: input.profile } }, { upsert: true });
                return {
                    message: "User profile updated successfully",
                };
            } catch( err ) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update user profile",
                });
            }
        }),
})